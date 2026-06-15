let pyodide = null;
let ready = null;
let lastRun = null;
let factorAnalyzerAvailable = false;

const PYODIDE_PACKAGES = [
  "numpy",
  "pandas",
  "scipy",
  "scikit-learn",
  "matplotlib",
  "micropip",
];

function post(type, payload = {}) {
  self.postMessage({ type, ...payload });
}

async function ensureReady() {
  if (ready) return ready;
  ready = (async () => {
    post("progress", { message: "Preparing Python runtime..." });
    importScripts("/pyodide/pyodide.js");
    pyodide = await loadPyodide({ indexURL: "/pyodide/" });
    post("progress", { message: "Loading pandas, scipy, scikit-learn, and matplotlib..." });
    await pyodide.loadPackage(PYODIDE_PACKAGES);
    pyodide.runPython(`
import os
os.chdir('/home/pyodide')
os.makedirs('dataIN', exist_ok=True)
os.makedirs('dataOUT', exist_ok=True)
import matplotlib
matplotlib.use('Agg')
`);
    try {
      await pyodide.runPythonAsync(`
import micropip
await micropip.install('factor_analyzer')
`);
      factorAnalyzerAvailable = true;
    } catch {
      factorAnalyzerAvailable = false;
    }
    post("ready", { factorAnalyzerAvailable });
  })();
  return ready;
}

function resetDir(name) {
  const root = `/home/pyodide/${name}`;
  try {
    for (const file of pyodide.FS.readdir(root)) {
      if (file !== "." && file !== "..") pyodide.FS.unlink(`${root}/${file}`);
    }
  } catch {
    pyodide.FS.mkdirTree(root);
  }
}

function basename(ref) {
  return ref.split("/").pop();
}

function writeInputs(datasets) {
  resetDir("dataIN");
  resetDir("dataOUT");
  for (const item of datasets) {
    pyodide.FS.writeFile(`/home/pyodide/dataIN/${basename(item.ref)}`, new Uint8Array(item.bytes));
  }
}

function preludeFor(datasets) {
  const names = datasets.map((d) => basename(d.ref));
  const has = (name) => names.includes(name);
  let code = `
import os
os.makedirs('./dataIN', exist_ok=True)
os.makedirs('./dataOUT', exist_ok=True)
import numpy as np
import pandas as pd
np.random.seed(0)
`;
  if (has("Industrie.csv") && has("PopulatieLocalitati.csv")) {
    code += `
rawInd = pd.read_csv('./dataIN/Industrie.csv', index_col=0)
rawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)
labels = list(rawInd.columns.values[1:])
merged = rawInd.merge(rawPop, left_index=True, right_index=True)
merged.fillna(np.mean(merged[labels], axis=0), inplace=True)
`;
  }
  if (has("IndustriaAlimentara.csv") && has("Coduri_Judete.csv")) {
    code += `
rawIndustrie = pd.read_csv('./dataIN/IndustriaAlimentara.csv', index_col=0)
rawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)
rawCounties = pd.read_csv('./dataIN/Coduri_Judete.csv', index_col=0)
indLab = list(rawIndustrie.columns.values[1:])
merged = rawIndustrie[(rawIndustrie[rawIndustrie[indLab] > 0]).any(axis=1)] \\
  .merge(right=rawPop, left_index=True, right_index=True) \\
  .merge(right=rawCounties, left_on='Judet', right_index=True) \\
  .drop(['Localitate_y'], axis=1) \\
  .rename(columns={'Localitate_x': 'Localitate'})
`;
  }
  return code;
}

function readOutputs() {
  const root = "/home/pyodide/dataOUT";
  const files = [];
  for (const name of pyodide.FS.readdir(root)) {
    if (name === "." || name === "..") continue;
    const bytes = pyodide.FS.readFile(`${root}/${name}`);
    const text = new TextDecoder().decode(bytes);
    files.push({ name, content: text });
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function capturePlots() {
  const json = pyodide.runPython(`
import base64, io, json
import matplotlib.pyplot as plt
_plots = []
for _num in plt.get_fignums():
    _fig = plt.figure(_num)
    _buf = io.BytesIO()
    _fig.savefig(_buf, format='png', bbox_inches='tight')
    _plots.append(base64.b64encode(_buf.getvalue()).decode('ascii'))
plt.close('all')
json.dumps(_plots)
`);
  return JSON.parse(json);
}

async function execute(code, datasets) {
  writeInputs(datasets);
  pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
  let error = "";
  try {
    await pyodide.runPythonAsync(`${preludeFor(datasets)}\n${code}`);
  } catch (err) {
    error = String(err && err.message ? err.message : err);
  }
  let plots = [];
  try {
    plots = capturePlots();
  } catch (err) {
    error += `\nPlot capture failed: ${String(err && err.message ? err.message : err)}`;
  }
  const stdout = pyodide.runPython("sys.stdout.getvalue()");
  const stderr = pyodide.runPython("sys.stderr.getvalue()");
  return { stdout, stderr: [stderr, error].filter(Boolean).join("\n"), files: readOutputs(), plots };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function almostEqual(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) {
    const diff = Math.abs(Math.abs(na) - Math.abs(nb));
    return diff <= 1e-6 + 1e-3 * Math.max(Math.abs(na), Math.abs(nb));
  }
  return String(a).trim() === String(b).trim();
}

function diffFile(actual, expected) {
  const a = parseCsv(actual.content);
  const e = parseCsv(expected.content);
  if (a.length !== e.length) {
    return `row count ${a.length}, expected ${e.length}`;
  }
  for (let r = 0; r < e.length; r += 1) {
    if (a[r].length !== e[r].length) {
      return `row ${r + 1} has ${a[r].length} cells, expected ${e[r].length}`;
    }
    for (let c = 0; c < e[r].length; c += 1) {
      if (!almostEqual(a[r][c], e[r][c])) {
        return `first mismatch at row ${r + 1}, column ${c + 1}: got "${a[r][c]}", expected "${e[r][c]}"`;
      }
    }
  }
  return null;
}

function compareOutputs(actualFiles, expectedFiles) {
  const actual = new Map(actualFiles.map((f) => [f.name, f]));
  const expected = new Map(expectedFiles.map((f) => [f.name, f]));
  const results = [];
  for (const [name, exp] of expected) {
    const got = actual.get(name);
    if (!got) {
      results.push({ name, pass: false, detail: "missing output file" });
      continue;
    }
    const diff = diffFile(got, exp);
    results.push({ name, pass: !diff, detail: diff ?? "matches expected output" });
  }
  for (const name of actual.keys()) {
    if (!expected.has(name)) {
      results.push({ name, pass: false, detail: "unexpected output file" });
    }
  }
  return results;
}

self.onmessage = async (event) => {
  const message = event.data;
  try {
    await ensureReady();
    if (message.type === "run") {
      lastRun = await execute(message.code, message.datasets);
      post("runResult", lastRun);
    }
    if (message.type === "check") {
      if (!lastRun) lastRun = await execute(message.code, message.datasets);
      const expected = await execute(message.solution, message.datasets);
      post("checkResult", {
        results: compareOutputs(lastRun.files, expected.files),
        rubricFallback: expected.files.length === 0,
      });
    }
  } catch (err) {
    post("error", { message: String(err && err.message ? err.message : err) });
  }
};
