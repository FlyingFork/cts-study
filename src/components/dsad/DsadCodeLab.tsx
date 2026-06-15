"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Badge, Button, Card } from "@/components/ui";
import { Markdown } from "@/components/lesson/Markdown";
import {
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  PlayIcon,
  ResetIcon,
  StopIcon,
  XCircleIcon,
} from "@/components/icons";
import { useStore } from "@/lib/storage";
import type { Drill } from "@/lib/schema";

interface LabFile {
  name: string;
  content: string;
}

interface RunResult {
  stdout: string;
  stderr: string;
  files: LabFile[];
  plots: string[];
}

export interface DsadLabCheckResult {
  results: { name: string; pass: boolean; detail: string }[];
  rubricFallback?: boolean;
}

interface WorkerDataset {
  ref: string;
  bytes: ArrayBuffer;
}

type Status = "idle" | "loading" | "running" | "ready" | "error";

const RUN_TIMEOUT_MS = 25000;

export function DsadCodeLab({
  drill,
  onCheckResult,
}: {
  drill: Drill;
  onCheckResult?: (result: DsadLabCheckResult) => void;
}) {
  const starter = drill.starter ?? drill.solution;
  const [code, setCode] = useState(starter);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Python is lazy-loaded when the lab starts.");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checkResult, setCheckResult] = useState<DsadLabCheckResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [factorAnalyzerAvailable, setFactorAnalyzerAvailable] = useState<boolean | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { recordQuizResult } = useStore();
  const editorExtensions = useMemo(() => [python()], []);

  const isEfaFallback = drill.topic === "efa" && factorAnalyzerAvailable === false;

  const stopWorker = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    workerRef.current?.terminate();
    workerRef.current = null;
    setStatus("idle");
    setMessage("Run stopped. The next run will start a fresh Python worker.");
  }, []);

  useEffect(() => () => stopWorker(), [stopWorker]);

  const getWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker("/dsad-code-lab-worker.js");
    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.type === "progress") {
        setStatus("loading");
        setMessage(data.message);
      }
      if (data.type === "ready") {
        setStatus("ready");
        setFactorAnalyzerAvailable(data.factorAnalyzerAvailable);
        setMessage("Python ready. Run the current file against the mounted dataIN files.");
      }
      if (data.type === "runResult") {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setStatus("ready");
        setRunResult({
          stdout: data.stdout,
          stderr: data.stderr,
          files: data.files,
          plots: data.plots,
        });
        setCheckResult(null);
        setMessage(data.stderr ? "Run finished with errors." : "Run finished.");
      }
      if (data.type === "checkResult") {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setStatus("ready");
        const next: DsadLabCheckResult = {
          results: data.results,
          rubricFallback: data.rubricFallback,
        };
        setCheckResult(next);
        onCheckResult?.(next);
        const total = Math.max(next.results.length, 1);
        const correct = next.results.filter((r) => r.pass).length;
        recordQuizResult({
          id: `${drill.id}-lab-${Date.now()}`,
          courseId: drill.courseId,
          at: new Date().toISOString(),
          topicFilter: [drill.topic],
          total,
          correct,
          byTopic: { [drill.topic]: { correct, total } },
        });
        setMessage("Check complete.");
      }
      if (data.type === "error") {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setStatus("error");
        setMessage(data.message);
      }
    };
    workerRef.current = worker;
    return worker;
  }, [drill.courseId, drill.id, drill.topic, onCheckResult, recordQuizResult]);

  const loadDatasets = useCallback(async (): Promise<WorkerDataset[]> => {
    const refs = drill.datasets ?? [];
    const loaded = await Promise.all(
      refs.map(async (ref) => {
        const url = `/courses/dsad/data/${ref
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not load ${ref}`);
        return { ref, bytes: await response.arrayBuffer() };
      }),
    );
    return loaded;
  }, [drill.datasets]);

  const postWithTimeout = useCallback(
    async (payload: Record<string, unknown>) => {
      setStatus("running");
      setMessage("Running in Pyodide...");
      const worker = getWorker();
      const datasets = await loadDatasets();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        worker.terminate();
        workerRef.current = null;
        setStatus("error");
        setMessage("Run timed out and was stopped. Check for an infinite loop or very slow operation.");
      }, RUN_TIMEOUT_MS);
      worker.postMessage({ ...payload, datasets }, datasets.map((d) => d.bytes));
    },
    [getWorker, loadDatasets],
  );

  const run = () => postWithTimeout({ type: "run", code });
  const check = () => postWithTimeout({ type: "check", code, solution: drill.solution });

  const hints = drill.hints ?? [];
  const outputFiles = runResult?.files ?? [];
  const plots = runResult?.plots ?? [];

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">DSAD code lab</Badge>
          <Badge tone="neutral">{drill.topic}</Badge>
          {drill.datasets?.map((dataset) => (
            <Badge key={dataset} tone="neutral" className="max-w-full truncate">
              {dataset.split("/").pop()}
            </Badge>
          ))}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">{drill.title}</h1>
          <Markdown>{drill.task}</Markdown>
        </div>
      </header>

      {isEfaFallback && (
        <Card className="border-warning/50 bg-warning/10">
          <p className="text-sm text-warning">
            EFA run mode is unavailable because factor_analyzer could not be installed in Pyodide.
            Use the walkthrough and reveal scaffold for this method.
          </p>
        </Card>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <CodeMirror
              value={code}
              height="520px"
              extensions={editorExtensions}
              basicSetup={{ lineNumbers: true, foldGutter: true }}
              theme="dark"
              onChange={setCode}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={status === "running" || isEfaFallback}>
              <PlayIcon /> Run
            </Button>
            <Button variant="secondary" onClick={stopWorker} disabled={status !== "running" && status !== "loading"}>
              <StopIcon /> Stop
            </Button>
            <Button variant="secondary" onClick={() => setCode(starter)}>
              <ResetIcon /> Reset
            </Button>
            <Button variant="secondary" onClick={check} disabled={status === "running" || isEfaFallback}>
              <CheckIcon /> Check
            </Button>
            {hintsShown < hints.length && (
              <Button variant="ghost" onClick={() => setHintsShown((n) => n + 1)}>
                Show hint {hintsShown + 1}
              </Button>
            )}
            <Button variant="ghost" onClick={() => setShowSolution((v) => !v)}>
              <EyeIcon /> {showSolution ? "Hide solution" : "Reveal solution"}
            </Button>
          </div>

          {hints.slice(0, hintsShown).map((hint, index) => (
            <p key={hint} className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-fg-muted">
              Hint {index + 1}: {hint}
            </p>
          ))}

          {showSolution && (
            <Card className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Solution</p>
              <pre className="max-h-96 overflow-auto rounded-lg bg-bg p-3 font-mono text-xs text-fg">
                {drill.solution}
              </pre>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-fg">Runtime</h2>
              <Badge tone={status === "error" ? "danger" : status === "ready" ? "success" : "neutral"}>
                {status}
              </Badge>
            </div>
            <p className="text-sm text-fg-muted">{message}</p>
            <p className="text-xs text-fg-faint">
              The lab mounts files at <code>./dataIN/</code> and expects outputs in{" "}
              <code>./dataOUT/</code>.
            </p>
          </Card>

          <ConsolePane result={runResult} />

          {checkResult && (
            <Card className="space-y-2">
              <h2 className="text-sm font-semibold text-fg">Check</h2>
              {checkResult.rubricFallback ? (
                <p className="text-sm text-fg-muted">No output CSVs were produced. Self-grade with the rubric.</p>
              ) : (
                checkResult.results.map((result) => (
                  <div key={result.name} className="flex gap-2 text-sm">
                    {result.pass ? (
                      <CheckCircleIcon className="mt-0.5 flex-none text-success" />
                    ) : (
                      <XCircleIcon className="mt-0.5 flex-none text-danger" />
                    )}
                    <div>
                      <p className="font-medium text-fg">{result.name}</p>
                      <p className="text-fg-muted">{result.detail}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="rounded-lg border-l-2 border-l-info bg-info/5 px-3 py-2 text-sm text-fg-muted">
                <span className="font-medium text-info">Rubric: </span>
                {drill.rubric}
              </div>
            </Card>
          )}
        </aside>
      </section>

      {outputFiles.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-fg">dataOUT files</h2>
          {outputFiles.map((file) => (
            <OutputTable key={file.name} file={file} />
          ))}
        </section>
      )}

      {plots.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-fg">Plots</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {plots.map((plot, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={`data:image/png;base64,${plot}`}
                alt={`Plot ${index + 1}`}
                className="rounded-xl border border-border bg-white p-2"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ConsolePane({ result }: { result: RunResult | null }) {
  return (
    <Card className="space-y-2">
      <h2 className="text-sm font-semibold text-fg">Console</h2>
      <pre className="min-h-28 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-3 font-mono text-xs text-fg-muted">
        {result ? result.stdout || "(no stdout)" : "Run code to see stdout and tracebacks."}
      </pre>
      {result?.stderr && (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-danger/30 bg-danger/10 p-3 font-mono text-xs text-danger">
          {result.stderr}
        </pre>
      )}
    </Card>
  );
}

function OutputTable({ file }: { file: LabFile }) {
  const rows = parseCsv(file.content).slice(0, 51);
  return (
    <Card className="space-y-2">
      <h3 className="text-sm font-semibold text-fg">{file.name}</h3>
      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-xs">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri === 0 ? "bg-surface-2 text-fg" : "text-fg-muted"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-b border-border px-2 py-1 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {parseCsv(file.content).length > rows.length && (
        <p className="text-xs text-fg-faint">Showing first 50 data rows.</p>
      )}
    </Card>
  );
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
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
  return rows;
}
