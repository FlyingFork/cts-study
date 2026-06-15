import type { Module } from "@/lib/schema";

export const dsadModules: Module[] = [
  {
    "id": "dsad-mod-exam-map",
    "title": "Exam map & skeleton",
    "order": 1,
    "lessons": [
      {
        "id": "dsad-les-course-overview",
        "title": "DSAD — Course Overview & Exam Map",
        "summary": "**DSAD** = *Dezvoltare software pentru analiza datelor* (Software Development for Data",
        "estMinutes": 35,
        "topicTags": [
          "partA"
        ],
        "priority": 1,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **DSAD** = *Dezvoltare software pentru analiza datelor* (Software Development for Data\n> Analysis). A master's-level course where the exam is **code-based**: you are given data\n> files and a list of requirements, and you write **Python** that reads the data, computes\n> answers, and saves them to CSV files (plus a few plots).\n\nThis document is the mental model for the whole course. Read it first, then dive into the\nper-topic docs. Everything here is derived from the real past papers in `DSAD-master/`.\n\n---\n\n## 1. What the exam actually looks like\n\nYou sit at a machine with Python + the standard data stack. You get:\n\n- A **subject** (problem statement) — sometimes in English, sometimes in Romanian.\n- An **`dataIN/`** folder with 1–3 CSV files (sometimes an `.xlsx`).\n- An empty **`dataOUT/`** folder where every answer must be saved as a CSV.\n\nYou write **one `main.py`** that solves every requirement in order. Each requirement is worth\npoints (shown on the subject, e.g. *\"(2 points)\"*). Total is 10 points.\n\n**The single most important fact:** the structure almost never changes. Learn the structure\nonce and every exam becomes \"fill in the blanks.\""
          },
          {
            "kind": "code",
            "lang": "text",
            "code": "┌─────────────────────────────────────────────────────────────────────┐\n│  PART A  — pandas data wrangling          ~3 points  (2 requirements) │\n│  PART B  — ONE multivariate method        ~5–6 points (2–3 reqs)      │\n│  PART C  — small extra task (optional)     ~1–2 points                │\n└─────────────────────────────────────────────────────────────────────┘",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "### Part A — data wrangling (always pandas)\nRead CSVs, merge them, clean missing values, then aggregate. Typical asks:\n- turnover/value **per inhabitant** (divide a row by `Populatie`),\n- the **dominant** activity per county (`idxmax`),\n- **weighted averages** by region (`np.average(..., weights=...)`),\n- **sorting**, **filtering**, **pivoting** by year.\n\n→ See **[01-pandas-toolkit.md](01-pandas-toolkit.md)**.\n\n### Part B — one multivariate statistical method\nThe data is **standardized** first (`StandardScaler`), then exactly **one** of these is applied:\n\n| Method | Full name | One-line job | Doc |\n|--------|-----------|--------------|-----|\n| **PCA** | Principal Component Analysis | compress correlated variables into a few components | [02-pca.md](02-pca.md) |\n| **EFA** | Exploratory Factor Analysis | find hidden latent factors behind the variables | [03-efa.md](03-efa.md) |\n| **CCA** | Canonical Correlation Analysis | relate **two sets** of variables to each other | [04-cca.md](04-cca.md) |\n| **HCA** | Hierarchical Cluster Analysis | group observations into a tree of clusters | [05-hca.md](05-hca.md) |\n| **LDA** | Linear Discriminant Analysis | predict a **labeled class** for each observation | [06-lda.md](06-lda.md) |\n\nThe hard part of the exam is **recognising which method is being asked for**. The subject\nrarely says \"do PCA\"; it describes outputs (scores, loadings, dendrogram, prediction…).\n→ The decision guide is **[08-method-selector.md](08-method-selector.md)**.\n\n### Part C — the extra task\nOften a small applied question (e.g. \"read this loadings matrix and find the variable with the\nhighest communality\"). In the original repo solutions these were frequently left as\n`# I don't know`. This pack **solves them** — see the relevant method doc and\n[10-gotchas.md](10-gotchas.md).\n\n---\n\n## 2. The environment & libraries\n\nEvery solution uses this stack. Memorize the imports — typing them fast is free points and\ncalms the nerves."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.preprocessing import StandardScaler",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "Then **one** method-specific import depending on Part B:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from sklearn.decomposition import PCA                       # PCA\nfrom factor_analyzer import FactorAnalyzer, calculate_kmo   # EFA\nfrom sklearn.cross_decomposition import CCA                 # CCA\nfrom scipy.cluster.hierarchy import linkage, dendrogram, fcluster  # HCA\nfrom sklearn.cluster import KMeans                          # HCA (k-means variant)\nfrom sklearn.discriminant_analysis import LinearDiscriminantAnalysis  # LDA\nfrom sklearn.model_selection import train_test_split        # LDA",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "`seaborn` (`import seaborn as sb`) shows up for heatmaps/kde plots but is optional —\neverything can be done in plain `matplotlib`. See [07-plotting.md](07-plotting.md).\n\n---\n\n## 3. The universal skeleton\n\nAlmost every `main.py` starts the same way. This is the \"muscle memory\" template:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# 1. read every input, first column is the index (the entity ID)\nraw1 = pd.read_csv('./dataIN/File1.csv', index_col=0)\nraw2 = pd.read_csv('./dataIN/File2.csv', index_col=0)\n\n# 2. the numeric variable columns we'll analyse (skip name/label columns)\nlabels = list(raw1.columns.values[1:])\n\n# 3. join the files on their shared index, then fill missing numeric cells\nmerged = raw1.merge(raw2, left_index=True, right_index=True)\nmerged.fillna(np.mean(merged[labels], axis=0), inplace=True)\n\n# 4. ... answer each requirement, saving to ./dataOUT/<name>.csv ...",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "Key habits this encodes:\n- **`index_col=0`** — the first column (Siruta code, CountryId, …) is the entity identifier.\n- **`labels`** — a list of the *numeric* columns, computed once and reused everywhere.\n- **`fillna` with the column mean** — the standard NaN treatment in this course.\n- **Always save with `.to_csv('./dataOUT/...')`** — output to file is what earns points.\n\n---\n\n## 4. How to study this (for the learner)\n\nThis is a *doing* exam, not a *reading* exam. Reading these docs is necessary but not\nsufficient — you must type the recipes until they're automatic. The platform should drive you\nthrough the modes described in **[../teaching/pedagogy.md](../teaching/pedagogy.md)**:\n\n1. **Recognise the method** (Part B) — drill the [method selector](08-method-selector.md) cues.\n2. **Type the recipe from memory** — code-along, then from scratch.\n3. **Read code line by line** — the [walkthroughs](../walkthroughs/) explain every line.\n4. **Spot the bug** — the original templates have real bugs ([10-gotchas.md](10-gotchas.md)).\n5. **Sit a timed mock exam** — past papers scored on their real point values ([drills](../content/drills.json)).\n\nA realistic path to a passing grade: **master Part A first** (it's pure pattern and ~3 points),\nthen learn **PCA + HCA** (the two most common Part B methods), then **CCA, LDA, EFA**.\n\n---\n\n## 5. Index of the pack\n\n- **[INDEX.md](../INDEX.md)** — entry point / file map (start here if you're the tutor AI).\n- **knowledge/** — this folder: concepts + recipes.\n- **teaching/pedagogy.md** — how to teach it interactively.\n- **walkthroughs/** — line-by-line code explanations (JSON, machine-readable).\n- **content/** — flashcards, question bank, drills, mock exam (machine-readable)."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-parta-food-industry"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-parta",
    "title": "Part A - pandas toolkit",
    "order": 2,
    "lessons": [
      {
        "id": "dsad-les-pandas-toolkit",
        "title": "Part A — The pandas Wrangling Toolkit",
        "summary": "Part A is ~3 guaranteed points and it is **pure pattern**. There is no statistics here — just",
        "estMinutes": 55,
        "topicTags": [
          "partA"
        ],
        "priority": 1,
        "blocks": [
          {
            "kind": "markdown",
            "md": "Part A is ~3 guaranteed points and it is **pure pattern**. There is no statistics here — just\nreading files, joining them, and aggregating. Master these ~10 patterns and you can solve any\nPart A you'll be handed. Every snippet below is distilled from the real worked solutions in\n`DSAD-master/`.\n\n> **Intuition:** Part A is always the same pipeline — **read → merge → clean → group →\n> compute → save**. The requirements just change *which* column you divide, group, or sort by.\n\n---\n\n## 0. Read & set up (the first 4 lines of every solution)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\n\nraw1 = pd.read_csv('./dataIN/Industrie.csv', index_col=0)            # index = Siruta code\nraw2 = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)\nlabels = list(raw1.columns.values[1:])   # numeric columns (skip the name column)",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "- `index_col=0` makes the first column the **row index** (the entity ID). This is what lets\n  two files `merge` on the same entities.\n- `labels` = the list of numeric variable columns. We compute it **once** and reuse it. Use\n  `[1:]` to skip a leading name column (e.g. `Localitate`); use `[:]` if there isn't one.\n- Excel files: `pd.read_excel('./dataIN/RomaniaCodes.xlsx', sheet_name=[0, 1], index_col=0)`\n  returns a **dict** of DataFrames keyed by sheet index.\n\n---\n\n## 1. Merge (join) two or three files\n\nThe files share an index (the entity), so we glue their columns together."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged = raw1.merge(raw2, left_index=True, right_index=True)",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "Common variations seen in the exams:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# join on a column in one frame vs the index of another (e.g. county code -> county table)\nmerged = ind.merge(counties, left_on='Judet', right_index=True)\n\n# after a merge, two files may both have a 'Localitate' column -> pandas renames to _x / _y\nmerged = raw1.merge(raw2, left_index=True, right_index=True) \\\n    .drop(columns='Localitate_y') \\\n    .rename(columns={'Localitate_x': 'Localitate'})\n\n# select & order the columns you want to keep\nmerged = merged[['Judet', 'Localitate', 'Populatie'] + labels]\n\n# chain three merges (locality -> population -> county codes -> region codes)\nmerged = overnights \\\n    .merge(pop,      left_index=True, right_index=True) \\\n    .merge(counties, left_on='County', right_index=True) \\\n    .merge(regions,  left_on='Regiune', right_index=True)",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "> **Gotcha:** a merge keeps only rows whose keys match in *both* frames (inner join by\n> default). If counts look wrong, that's usually why. See [10-gotchas.md](10-gotchas.md).\n\n---\n\n## 2. Clean missing values (the course-standard NaN fix)\n\nReplace NaNs with the **mean of each column**:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged.fillna(np.mean(merged[labels], axis=0), inplace=True)",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "`np.mean(merged[labels], axis=0)` is a Series of per-column means; `fillna` aligns it by column\nname. Only the numeric `labels` columns are filled — never try to average a name column.\n\n---\n\n## 3. Row-wise computation with `apply(..., axis=1)`\n\nThe workhorse of Part A. `axis=1` means \"give me one **row** at a time as `row`.\""
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# turnover / value PER INHABITANT for each activity, per locality\nmerged.apply(lambda row: row[labels] / row['Populatie'], axis=1) \\\n      .to_csv('./dataOUT/Request_1.csv')\n\n# percentage of each activity within its row (share of the row total)\nmerged[['Localitate'] + labels] \\\n    .apply(lambda row: row[labels] / row[labels].sum() * 100, axis=1) \\\n    .to_csv('./dataOUT/Request_2.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "`row[labels]` selects just the numeric cells of that row, so you divide a vector by a scalar.\n\n---\n\n## 4. Group & aggregate with `groupby`\n\n\"Per county / per region / per continent\" → `groupby`."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# total turnover per county\nc2 = merged[['Judet'] + labels].groupby('Judet').sum()\n\n# mean per continent\nmerged[['Continent'] + labels].groupby('Continent').mean()",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "Group then apply a custom per-group computation with a lambda returning a `pd.Series`:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# coefficient of variation (std/mean * 100) per indicator, per continent\nmerged[['Continent'] + labels] \\\n    .groupby('Continent') \\\n    .apply(lambda df: pd.Series({col: np.round(np.std(df[col]) / np.mean(df[col]) * 100, 2)\n                                 for col in labels})) \\\n    .to_csv('./dataOUT/Cerinta2.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "> **`np.std` vs `df.std()` trap:** `np.std` uses the **population** formula (divide by *n*);\n> pandas `.std()` uses the **sample** formula (divide by *n−1*). To make pandas match numpy,\n> use `df.std(ddof=0)`. The exam example datasets expect the population formula. See\n> [10-gotchas.md](10-gotchas.md).\n\n---\n\n## 5. The \"dominant category\" pattern — `idxmax` / `idxmin`\n\nA recurring favourite: *\"which activity has the highest value?\"*"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# dominant activity per county (returns the COLUMN NAME of the max in each row)\nmerged[['Judet'] + labels].groupby('Judet').sum().idxmax(axis=1) \\\n    .to_csv('./dataOUT/Request_4.csv')\n\n# dominant activity AND its value, side by side\nc2 = merged[['Judet'] + labels].groupby('Judet').sum()\nc2['Activitate'] = c2.idxmax(axis=1)      # name of the dominant column\nc2['Cifra'] = c2.max(axis=1)              # the value itself\nc2[['Activitate', 'Cifra']].to_csv('./dataOUT/Request_2.csv')\n\n# which COUNTRY (index) leads each indicator? -> idxmax over rows (axis=0)\nmerged.set_index('Country')[labels].idxmax(axis=0)",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "- `idxmax(axis=1)` → the **column label** of the max **within each row**.\n- `idxmax(axis=0)` → the **row label** of the max **within each column**.\n\n---\n\n## 6. Weighted average\n\n\"Average … weighted by population\" → `np.average(values, weights=...)`."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged[['Regiune', 'Populatie'] + labels] \\\n    .groupby('Regiune') \\\n    .apply(lambda df: pd.Series({col: np.average(df[col], weights=df['Populatie'])\n                                 for col in labels})) \\\n    .to_csv('./dataOUT/Requirement5.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 7. Filter & sort"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# keep rows below the column average, then sort descending\navg = np.average(merged['RS'])\nmerged[merged['RS'] < avg][['Country', 'RS']] \\\n    .sort_values('RS', ascending=False) \\\n    .to_csv('./dataOUT/Cerinta1.csv')\n\n# keep rows where ANY activity column is > 0\nmerged[(merged[labels] > 0).any(axis=1)]",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 8. Pivot (years onto columns)\n\n\"One column per year\" → `pivot`."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged[['Ani', 'Valoare']] \\\n    .pivot(columns='Ani', values='Valoare') \\\n    .fillna(0) \\\n    .to_csv('./dataOUT/YearOvernights.csv')\n\n# pivot after aggregating to county level\nmerged[['Ani', 'Valoare', 'NumeJudet']] \\\n    .groupby(['NumeJudet', 'Ani']).sum() \\\n    .reset_index(1) \\\n    .pivot(columns='Ani', values='Valoare') \\\n    .to_csv('./dataOUT/CountyOvernights.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 9. Index gymnastics — `set_index` / `reset_index`\n\nYou move columns in and out of the index to control what `groupby`/`apply` sees and what ends\nup as the CSV's first column(s)."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged.set_index(['City', 'CountyCode'])     # make a 2-level index\ndf.reset_index(1)                            # push index level 1 back to a column\nmerged.set_index('Country', append=True)     # add 'Country' as an extra index level",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "A complete real example — *per-county, the locality leading each indicator*:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged \\\n    .set_index(['City', 'CountyCode']) \\\n    .apply(lambda row: row[labels] / (row['Population'] / 1000), axis=1) \\\n    .reset_index(1) \\\n    .groupby('CountyCode') \\\n    .apply(lambda df: pd.Series({col: df[col].idxmax() for col in labels})) \\\n    .to_csv('./dataOUT/Request_2.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 10. Save — always to `dataOUT/`"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "result.to_csv('./dataOUT/Requirement1.csv')\n# round before saving when the subject shows few decimals:\npd.DataFrame(np.round(scores, 2), index=idx, columns=cols).to_csv('./dataOUT/scoruri.csv')",
            "caption": "DSAD exam skeleton"
          },
          {
            "kind": "markdown",
            "md": "If the result is a numpy array (from sklearn), wrap it in a `DataFrame` with proper `index=`\nand `columns=` so the CSV is labeled — graders look for readable output.\n\n---\n\n## Cheat-sheet recap\n\n| You're asked to… | Use |\n|---|---|\n| join files | `df.merge(other, left_index=True, right_index=True)` |\n| fix NaNs | `df.fillna(np.mean(df[labels], axis=0), inplace=True)` |\n| compute per row | `df.apply(lambda row: ..., axis=1)` |\n| per group | `df.groupby('Col').sum()/.mean()` |\n| dominant column | `df.idxmax(axis=1)` |\n| weighted mean | `np.average(x, weights=w)` |\n| filter | `df[df['c'] < value]` |\n| sort | `df.sort_values('c', ascending=False)` |\n| years to columns | `df.pivot(columns='Ani', values='Valoare')` |\n| save | `df.to_csv('./dataOUT/X.csv')` |"
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-parta-food-industry"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-pca",
    "title": "PCA",
    "order": 3,
    "lessons": [
      {
        "id": "dsad-les-pca",
        "title": "PCA — Principal Component Analysis",
        "summary": "**Mnemonic:** *PCA rotates the camera so you see the most spread.* It replaces many",
        "estMinutes": 45,
        "topicTags": [
          "pca"
        ],
        "priority": 1,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **Mnemonic:** *PCA rotates the camera so you see the most spread.* It replaces many\n> correlated variables with a few new, uncorrelated axes (the **principal components**) that\n> capture as much variance as possible.\n\n**Library:** `from sklearn.decomposition import PCA`\n\n---\n\n## When the subject is asking for PCA\n\nTrigger phrases (see [08-method-selector.md](08-method-selector.md)):\n- \"principal components\" / \"componente principale\"\n- \"variance explained\" / \"scree / line plot of variances\"\n- \"scores\" (`scoruri`), \"factor loadings\" / \"correlation circle\" (`cercul corelațiilor`)\n- One single set of numeric variables to **reduce/summarize** (no second set, no labels to predict).\n\n---\n\n## What each output means (intuition)\n\n| Output | Code | Meaning |\n|---|---|---|\n| **Principal components** `C` | `pca.fit_transform(x)` | the data re-expressed on the new axes (n_obs × n_comp) |\n| **Variance** `alpha` | `pca.explained_variance_` | how much variance each component carries (eigenvalues) |\n| **% variance** | `pca.explained_variance_ratio_` | same, as a fraction of the total |\n| **Loadings** `Rxc` | `a * sqrt(alpha)` | correlation between each original variable and each component |\n| **Scores** | `C / sqrt(alpha)` | standardized components (mean 0, var 1) — used for plotting observations |\n| **Quality of representation** | `C² / sum(C², axis=1)` | how well each observation is shown on each axis (cos²) |\n| **Contributions** | `C² / (n · alpha)` | how much each observation contributes to each component |\n| **Communalities** | `cumsum(Rxc², axis=1)` | cumulative variance of a variable explained by the first k components |\n\n**Kaiser rule:** keep components whose `alpha > 1` (they explain more than one original\nstandardized variable). That red line at `y=1` on the scree/line plot is the cutoff.\n\n---\n\n## The canonical recipe (corrected & complete)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\n\n# --- input: numeric variables, STANDARDIZED ---\nx = StandardScaler().fit_transform(merged[labels])   # ndarray, mean 0 / std 1\n\npca = PCA()\nC = pca.fit_transform(x)                  # principal components (scores, unscaled)\nalpha = pca.explained_variance_           # variance per component (eigenvalues)\npve = pca.explained_variance_ratio_       # proportion of variance explained\na = pca.components_.T                      # eigenvectors as columns (loadings basis)\n\nRxc = a * np.sqrt(alpha)                   # factor loadings (var–component correlations)\nscores = C / np.sqrt(alpha)                # standardized scores (for the scatter plot)\nC2 = C * C\nquality = (C2.T / np.sum(C2, axis=1)).T    # cos² — quality of representation\ncontributions = C2 / (x.shape[0] * alpha)  # contribution of each obs to each component\ncommunalities = np.cumsum(Rxc * Rxc, axis=1)"
          },
          {
            "kind": "markdown",
            "md": "> **Why standardize first?** PCA is scale-sensitive. Without standardization a variable\n> measured in millions dominates one measured in units. The course *always* standardizes.\n\n### Saving the usual outputs"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "comp_labels = ['C' + str(i + 1) for i in range(C.shape[1])]\n\npd.DataFrame(np.round(C, 2), index=merged.index, columns=comp_labels) \\\n    .to_csv('./dataOUT/PrinComp.csv')\n\npd.DataFrame(np.round(scores, 2), index=merged.index, columns=comp_labels) \\\n    .to_csv('./dataOUT/scoruri.csv')\n\npd.DataFrame(np.round(Rxc, 2), index=labels, columns=comp_labels) \\\n    .to_csv('./dataOUT/Rxc.csv')\n\n# variance summary table (a frequent requirement)\npd.DataFrame({\n    'Variance':        alpha,\n    'Cumulative var':  np.cumsum(alpha),\n    'Pct explained':   pve,\n    'Cumulative pct':  np.cumsum(pve),\n}, index=comp_labels).to_csv('./dataOUT/Varianta.csv')"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## The PCA plots"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# 1) Scree / line plot of variances with the Kaiser y=1 cutoff\nplt.figure(figsize=(10, 8)); plt.title('Variance explained by the components')\nplt.plot(comp_labels, alpha, 'bo-'); plt.axhline(1, color='r'); plt.show()\n\n# 2) Scores scatter (observations on the first two components)\nplt.figure(figsize=(10, 8)); plt.title('Scores')\nplt.scatter(scores[:, 0], scores[:, 1]); plt.show()\n\n# 3) Correlation circle (variables in the loadings plane)\nplt.figure(figsize=(8, 8)); plt.title('Correlation circle')\nT = np.arange(0, np.pi * 2, 0.01)\nplt.plot(np.cos(T), np.sin(T))                       # the unit circle\nplt.axhline(0, c='g'); plt.axvline(0, c='g')\nplt.scatter(Rxc[:, 0], Rxc[:, 1]); plt.show()"
          },
          {
            "kind": "markdown",
            "md": "Full details and a corrected `correlogram`/heatmap for communalities are in\n[07-plotting.md](07-plotting.md).\n\n---\n\n## Exam variations seen in the past papers\n\n- **exam0-2:** variance–covariance matrix of standardized data (`np.cov(x, rowvar=False)`),\n  then components, then a line plot, then the **correlation circle** of loadings.\n- **exam2 / exam6:** standardize → components → **scores** (`C/√alpha`) → scatter of scores.\n- **exam4:** the full **variance table** (variance, cumulative, % explained, cumulative %)\n  then the line plot, then a **correlogram (heatmap) of communalities**.\n- **Part C (exam2):** read a ready-made loadings matrix `g20.csv` and find the variable with\n  the **largest total communality**:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "  loadings = pd.read_csv('./dataIN/g20.csv', index_col=0)\n  communalities = np.cumsum(loadings * loadings, axis=1)\n  print(communalities.sum(axis=1).idxmax())   # variable best explained overall"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Common mistakes (→ [10-gotchas.md](10-gotchas.md))\n\n- Forgetting to standardize → garbage components.\n- `pca.components_` vs `pca.components_.T` — loadings need the **transpose** (variables in rows).\n- Confusing **components** `C` (raw) with **scores** `C/√alpha` (standardized) — both are asked\n  for under different names; read the requirement carefully.\n- `x = np.ndarray()` in the original `learn/PCA.py` is **not** valid input — `x` must be your\n  real standardized data array."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-pca-exam0-2"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-efa",
    "title": "EFA",
    "order": 7,
    "lessons": [
      {
        "id": "dsad-les-efa",
        "title": "EFA — Exploratory Factor Analysis",
        "summary": "**Mnemonic:** *EFA looks for the puppeteers behind the variables.* It assumes a few hidden",
        "estMinutes": 45,
        "topicTags": [
          "efa"
        ],
        "priority": 2,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **Mnemonic:** *EFA looks for the puppeteers behind the variables.* It assumes a few hidden\n> **latent factors** cause the patterns you see in the observed variables, and tries to\n> recover them. PCA *summarizes* variance; EFA *explains* shared variance via latent factors.\n\n**Library:** `from factor_analyzer import FactorAnalyzer, calculate_kmo`\n\n> ⚠️ `factor_analyzer` is a separate pip package (`pip install factor-analyzer`). It is **not**\n> part of scikit-learn. If it's missing in the exam environment, that's the giveaway EFA isn't\n> expected — but know the API in case it is installed.\n\n---\n\n## When the subject is asking for EFA\n\n- \"factorial analysis\" / \"latent factors\" / \"common factors\" (`factori comuni`)\n- \"factor loadings\" together with \"**communalities** and **specific/unique factors**\"\n- mention of a **KMO** test or **Bartlett**'s sphericity test (the sampling-adequacy checks)\n- \"specific factors\" (`factori specifici`) = the uniqueness part PCA never gives you.\n\nPCA vs EFA on the exam: if it only wants components/variance → PCA. If it wants\n**communalities + specific factors** and a **suitability test (KMO)** → EFA.\n\n---\n\n## What each output means\n\n| Output | Code | Meaning |\n|---|---|---|\n| **KMO** | `calculate_kmo(x)` | sampling adequacy; the overall value `kmo[1]` should be **> 0.6** to justify EFA |\n| **Scores** | `efa.fit_transform(x)` | each observation's value on each latent factor |\n| **Loadings** | `efa.loadings_` | correlation of each variable with each factor |\n| **Eigenvalues** | `efa.get_eigenvalues()` | variance associated with each potential factor |\n| **Communalities** | `efa.get_communalities()` | share of a variable's variance explained by the common factors |\n| **Specific (unique) factors** | `efa.get_uniquenesses()` | the leftover variance unique to each variable (1 − communality) |\n\n> **Communality + uniqueness = 1** for each variable (on standardized data). That's the whole\n> idea: common variance vs. variable-specific variance.\n\n---\n\n## The canonical recipe"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nfrom factor_analyzer import FactorAnalyzer, calculate_kmo\nfrom sklearn.preprocessing import StandardScaler\n\nx = StandardScaler().fit_transform(merged[labels])    # standardized variables\n\n# 1) is the data even suitable for factor analysis?\nkmo_per_var, kmo_total = calculate_kmo(x)\nprint('KMO total =', kmo_total)          # want > 0.6\n\n# 2) fit. A common exam choice is (number of variables − 1) factors.\nefa = FactorAnalyzer(n_factors=x.shape[1] - 1, rotation=None)\nscores          = efa.fit_transform(x)\nloadings        = efa.loadings_\neigenvalues     = efa.get_eigenvalues()       # returns (original, common-factor) eigenvalues\ncommunalities   = efa.get_communalities()\nspecific_factors = efa.get_uniquenesses()"
          },
          {
            "kind": "markdown",
            "md": "### Saving outputs"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "factor_labels = ['F' + str(i + 1) for i in range(loadings.shape[1])]\n\npd.DataFrame(np.round(loadings, 3), index=labels, columns=factor_labels) \\\n    .to_csv('./dataOUT/loadings.csv')\n\npd.DataFrame({'Communality': communalities, 'Specific': specific_factors}, index=labels) \\\n    .to_csv('./dataOUT/communalities.csv')"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Plots"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "# correlogram of the loadings — which variables load on which factor\nimport seaborn as sb   # or use the matplotlib heatmap in 07-plotting.md\nimport matplotlib.pyplot as plt\nplt.figure(figsize=(10, 8)); plt.title('Factor loadings')\nsb.heatmap(pd.DataFrame(loadings, index=labels, columns=factor_labels),\n           vmin=-1, vmax=1, annot=True, cmap='bwr'); plt.show()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Reading a ready-made loadings matrix (a Part C pattern)\n\nSome Part C tasks hand you a loadings matrix and ask a question about it — no fitting required.\nCommunalities are just cumulative squared loadings across factors:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "loadings = pd.read_csv('./dataIN/loadings.csv', index_col=0)\ncommunalities = np.cumsum(loadings * loadings, axis=1)   # cumulative across factors\nprint(communalities.iloc[:, -1].idxmax())   # variable best explained by the factors"
          },
          {
            "kind": "markdown",
            "md": "This is the same trick used for the PCA Part C in `exam2` — see [02-pca.md](02-pca.md).\n\n---\n\n## Common mistakes (→ [10-gotchas.md](10-gotchas.md))\n\n- Skipping the **KMO** check when the subject explicitly asks for it.\n- `get_eigenvalues()` returns a **tuple** of two arrays — index it.\n- Treating EFA loadings like PCA components: EFA explicitly separates **common** vs\n  **specific** variance; that split is usually the point of the question.\n- Forgetting `factor_analyzer` is not in sklearn (wrong import)."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-efa-template"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-cca",
    "title": "CCA",
    "order": 5,
    "lessons": [
      {
        "id": "dsad-les-cca",
        "title": "CCA — Canonical Correlation Analysis",
        "summary": "**Mnemonic:** *CCA is matchmaking between two groups of variables.* Given set **X** and set",
        "estMinutes": 45,
        "topicTags": [
          "cca"
        ],
        "priority": 2,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **Mnemonic:** *CCA is matchmaking between two groups of variables.* Given set **X** and set\n> **Y**, it finds the linear combination of X and the linear combination of Y that are as\n> correlated as possible — then the next-best uncorrelated pair, and so on.\n\n**Library:** `from sklearn.cross_decomposition import CCA`\n\n---\n\n## When the subject is asking for CCA (the dead giveaway)\n\nThe subject tells you to **split the variables into two sets, X and Y**. Examples:\n- production variables vs consumption variables,\n- one block of indicators vs another block.\n\nIf you see *\"set X … set Y\"* or *\"two subsets of variables\"*, it's CCA. This is the easiest\nmethod to recognise.\n\n---\n\n## What each output means\n\n| Output | Code | Meaning |\n|---|---|---|\n| **Canonical scores** `z`, `u` | `cca.transform(x, y)` | X and Y projected onto their canonical axes |\n| **Canonical correlations** `r` | `corrcoef(z[:,i], u[:,i])` | how strongly the i-th X-combo and Y-combo agree (one per root) |\n| **Loadings** `Rxz` | `corrcoef(x, z)` block | correlation of each X variable with the canonical X-scores |\n| **Loadings** `Ryu` | `corrcoef(y, u)` block | correlation of each Y variable with the canonical Y-scores |\n| **m** (number of roots) | `min(p, q)` | you get `min(#X vars, #Y vars)` canonical pairs |\n\n---\n\n## The canonical recipe (corrected & complete)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nfrom sklearn.cross_decomposition import CCA\nfrom sklearn.preprocessing import StandardScaler\n\n# 1) split the variables into the two sets the subject defines, and standardize each\nxLab = list(rawData.columns[:4])     # e.g. the 4 production variables\nyLab = list(rawData.columns[4:])     # e.g. the 4 consumption variables\nx = StandardScaler().fit_transform(rawData[xLab])\ny = StandardScaler().fit_transform(rawData[yLab])\n\np, q = x.shape[1], y.shape[1]\nm = min(p, q)                        # number of canonical roots\n\ncca = CCA(n_components=m)\nz, u = cca.fit_transform(x, y)       # canonical scores for X and for Y\n\n# 2) factor loadings: correlate the ORIGINAL variables with the canonical scores\nRxz = np.corrcoef(x, z, rowvar=False)[:p, p:][:, :m]   # X vars vs z\nRyu = np.corrcoef(y, u, rowvar=False)[:q, q:][:, :m]   # Y vars vs u\n\n# 3) canonical correlations (one per root)\nr = [np.corrcoef(z[:, i], u[:, i])[0, 1] for i in range(m)]"
          },
          {
            "kind": "markdown",
            "md": "> **The `corrcoef` block trick:** `np.corrcoef(x, z, rowvar=False)` builds the full\n> correlation matrix of *all* columns of `x` stacked with *all* columns of `z`. The\n> **top-right block** `[:p, p:]` is exactly the cross-correlations between X variables and the\n> canonical scores. Slice `[:, :m]` to keep only the `m` real roots.\n\n### Saving outputs"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "zLab = ['Z' + str(i + 1) for i in range(z.shape[1])]\nuLab = ['U' + str(i + 1) for i in range(u.shape[1])]\nidx  = rawData.index\n\npd.DataFrame(StandardScaler().fit_transform(rawData[xLab]), index=idx, columns=xLab) \\\n    .to_csv('./dataOUT/Xstd.csv')          # the standardized sets are often required outputs\npd.DataFrame(z, index=idx, columns=zLab).to_csv('./dataOUT/Xscore.csv')\npd.DataFrame(u, index=idx, columns=uLab).to_csv('./dataOUT/Yscore.csv')\npd.DataFrame(Rxz, index=xLab, columns=zLab[:m]).to_csv('./dataOUT/Rxz.csv')\npd.DataFrame(Ryu, index=yLab, columns=uLab[:m]).to_csv('./dataOUT/Ryu.csv')\npd.DataFrame(r,  columns=['r']).to_csv('./dataOUT/r.csv')"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## The CCA plot — biplot of the canonical roots\n\nPlot observations in the space of the first two roots of X (z) and of Y (u):"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import matplotlib.pyplot as plt\nplt.figure(figsize=(7, 7)); plt.title('Biplot (z1,z2) and (u1,u2)')\nplt.xlabel('axis 1'); plt.ylabel('axis 2')\nplt.scatter(z[:, 0], z[:, 1], c='r', label='X')\nplt.scatter(u[:, 0], u[:, 1], c='b', label='Y')\nplt.legend(); plt.show()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Exam variations seen in the past papers\n\n- **exam1:** the classic — meat **production** vs **consumption**; standardize, save `Xstd`/`Ystd`,\n  canonical scores `z`/`u`, loadings `Rxz`/`Ryu`, biplot. (Full line-by-line walkthrough:\n  `walkthroughs/cca-exam1.json`.)\n- **exam9:** split one emissions dataset into two halves; canonical scores + canonical\n  correlations `r`.\n\n---\n\n## Common mistakes (→ [10-gotchas.md](10-gotchas.md))\n\n- Standardizing X and Y **together** instead of separately (each set gets its own scaler).\n- Forgetting `n_components=m` where `m = min(p, q)` — asking for more roots than exist errors.\n- Mis-slicing the `corrcoef` block (off-by-`p` on the column offset). The block is `[:p, p:]`.\n- Mixing up `z`/`Rxz` (X side) with `u`/`Ryu` (Y side) when saving."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-cca-exam1"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-hca",
    "title": "HCA",
    "order": 4,
    "lessons": [
      {
        "id": "dsad-les-hca",
        "title": "HCA — Hierarchical Cluster Analysis",
        "summary": "**Mnemonic:** *HCA merges the nearest until a family tree forms.* Start with every",
        "estMinutes": 45,
        "topicTags": [
          "hca"
        ],
        "priority": 1,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **Mnemonic:** *HCA merges the nearest until a family tree forms.* Start with every\n> observation as its own cluster, repeatedly fuse the two closest, and record the whole\n> history as a **dendrogram**. Cut the tree at the right height to get your clusters.\n\n**Library:** `from scipy.cluster.hierarchy import linkage, dendrogram, fcluster`\n(plus `from sklearn.cluster import KMeans` for the k-means variant)\n\n---\n\n## When the subject is asking for HCA\n\n- \"classification\" / \"clustering\" of observations (`clasificare`, `partiție`)\n- \"dendrogram\" (`dendrogramă`)\n- \"the method is **Ward**\" (or single/complete/average linkage)\n- \"optimal partition\" / \"maximum stability partition\"\n- \"K-means\" with a given number of clusters → the k-means variant below.\n\n---\n\n## What each output means\n\n| Output | Code | Meaning |\n|---|---|---|\n| **Linkage matrix** `HC` | `linkage(x, method='ward')` | the merge history: each row = `[c1, c2, distance, size]` |\n| **Threshold** `t` | max-gap rule (below) | the dendrogram cut height giving the most stable partition |\n| **Labels** | `fcluster(HC, k, 'maxclust')` | the cluster id assigned to each observation |\n| **k** | `n − j` | number of clusters in the optimal partition |\n\nThe **linkage matrix** has `n = (#observations − 1)` rows (one per merge). Column 2 is the\ndistance at which each merge happened — the key to finding the cut.\n\n---\n\n## The canonical recipe (corrected & complete)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom scipy.cluster.hierarchy import linkage, dendrogram, fcluster\nfrom sklearn.preprocessing import StandardScaler\n\nx = StandardScaler().fit_transform(merged[labels])     # standardized observations\n\n# 1) build the hierarchy (method is given in the requirement, usually 'ward')\nHC = linkage(x, method='ward')\n\n# 2) find the optimal cut: the biggest jump between consecutive merge distances\ndef threshold(h):\n    n = h.shape[0]                 # number of merges\n    dist_1 = h[1:n, 2]             # distances shifted up by one\n    dist_2 = h[0:n - 1, 2]        # the previous distances\n    diff = dist_1 - dist_2        # gaps between consecutive merges\n    j = np.argmax(diff)           # the merge with the largest gap\n    t = (h[j, 2] + h[j + 1, 2]) / 2   # cut halfway through that gap\n    return t, j, n\n\nt, j, n = threshold(HC)\nk = n - j                          # number of clusters above the cut\n\n# 3) assign each observation to a cluster\ncat = fcluster(HC, k, criterion='maxclust')\nclusters = ['C' + str(c) for c in cat]\nmerged['Cluster'] = clusters\nmerged[['Cluster']].to_csv('./dataOUT/partition.csv')"
          },
          {
            "kind": "markdown",
            "md": "> **Why the max-gap rule?** A big jump in merge distance means you fused two clusters that were\n> actually far apart — i.e. you went \"one merge too far.\" Cutting in that gap gives the\n> **most stable** partition. `k = n − j` because there are `n+1` observations and the optimal\n> merge index `j` (0-based) leaves `n − j` clusters standing.\n\nIf the subject just **gives** you the number of clusters, skip the threshold and call\n`fcluster(HC, k, criterion='maxclust')` directly with that `k`.\n\n---\n\n## The dendrogram (the signature HCA plot)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "plt.figure(figsize=(12, 8)); plt.title('Dendrogram')\ndendrogram(HC, labels=merged.index.values, leaf_rotation=45)\nplt.axhline(t, c='r')          # draw the cut line at the threshold\nplt.show()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## The K-means variant\n\nSome subjects ask for **K-means** with a fixed number of clusters, often plotted over the\nfirst two principal components:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from sklearn.cluster import KMeans\nfrom sklearn.decomposition import PCA\n\nC = PCA().fit_transform(x)                       # components for a 2-D scatter\nkm = KMeans(n_clusters=5, n_init=10)             # n_clusters given in the requirement\nkm_labels = km.fit_predict(C)\n\nplt.figure(figsize=(8, 6)); plt.title('K-means over PCA')\nplt.scatter(C[:, 0], C[:, 1], c=km_labels, cmap='viridis'); plt.show()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Exam variations seen in the past papers\n\n- **exam0-1 / exam3 / exam7:** Ward linkage → threshold via max-gap → dendrogram with the red\n  cut line → save the partition. (Walkthrough: `walkthroughs/hca-exam0-1.json`.)\n- **exam5:** Ward linkage with a **given** `k=5` (`fcluster(HC, 5, 'maxclust')`), **plus** a\n  K-means-over-PCA scatter.\n\n---\n\n## Common mistakes (→ [10-gotchas.md](10-gotchas.md))\n\n- Not standardizing first — distances are then dominated by large-scale variables.\n- In `learn/plots.py` the helper `def dendrogram(...)` **shadows** the imported `dendrogram`\n  and calls itself → infinite recursion. Use the scipy import directly (as above).\n- Off-by-one in the threshold rule: it's `h[1:n,2] − h[0:n-1,2]`, and `k = n − j`.\n- Passing raw distances to `fcluster` with the wrong `criterion` — use `'maxclust'` with a\n  cluster **count** `k`."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-hca-exam0-1"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-lda",
    "title": "LDA",
    "order": 6,
    "lessons": [
      {
        "id": "dsad-les-lda",
        "title": "LDA — Linear Discriminant Analysis",
        "summary": "**Mnemonic:** *LDA draws the line that best separates labeled groups.* Unlike the others,",
        "estMinutes": 45,
        "topicTags": [
          "lda"
        ],
        "priority": 2,
        "blocks": [
          {
            "kind": "markdown",
            "md": "> **Mnemonic:** *LDA draws the line that best separates labeled groups.* Unlike the others,\n> LDA is **supervised**: the data already has a class label, and LDA learns to predict it for\n> new observations while also producing discriminant scores.\n\n**Library:** `from sklearn.discriminant_analysis import LinearDiscriminantAnalysis`\n(plus `from sklearn.model_selection import train_test_split`)\n\n---\n\n## When the subject is asking for LDA (the dead giveaway)\n\n- there is a **target/class column** to predict (e.g. `VULNERAB` with classes A–G)\n- the words \"predict\", \"discriminant\", \"training/testing set\", \"apply set\"\n- you're given **two** files: a *learning/training* set (with the label) and an *apply* set\n  (without the label) to predict.\n\nIf observations carry a **known category** and you must **classify new ones** → LDA. (Contrast\nwith HCA, which *discovers* groups with no labels.)\n\n---\n\n## What each output means\n\n| Output | Code | Meaning |\n|---|---|---|\n| **Trained model** | `lda.fit(x_train, y_train)` | learns the boundaries between classes |\n| **Discriminant scores** `z` | `lda.transform(x)` | observations projected onto the discriminant axes |\n| **Prediction (test)** | `lda.predict(x_test)` | predicted class for the held-out test rows |\n| **Prediction (apply)** | `lda.predict(x_apply)` | predicted class for the brand-new apply set |\n\nThe number of discriminant axes is `min(#classes − 1, #variables)`.\n\n---\n\n## The canonical recipe (complete)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.discriminant_analysis import LinearDiscriminantAnalysis\nfrom sklearn.model_selection import train_test_split\n\n# --- LDA does NOT require standardization ---\ndata = pd.read_csv('./dataIN/ProiectB.csv', index_col=0)         # learning set (has the label)\napply_set = pd.read_csv('./dataIN/ProiectB_apply.csv', index_col=0)  # apply set (no label)\n\ntarget    = 'VULNERAB'                                   # the class column (given)\npredictors = list(data.columns.values[:-1])             # everything except the target\n\n# if the label is letters (A..G) and you need numeric codes, map them:\n# data[target] = data[target].map({'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7})\n\n# 1) split the learning set into train/test\nx_train, x_test, y_train, y_test = train_test_split(\n    data[predictors], data[target], train_size=0.4)\n\n# 2) train\nlda = LinearDiscriminantAnalysis()\nlda.fit(x_train, y_train)\n\n# 3) discriminant scores + predictions\nscores            = lda.transform(x_train)              # scores on the discriminant axes\nprediction_test   = lda.predict(x_test)                 # predict the held-out test set\nprediction_apply  = lda.predict(apply_set[predictors])  # predict the apply set"
          },
          {
            "kind": "markdown",
            "md": "> **No standardization:** LDA is scale-invariant for classification, so unlike PCA/CCA/HCA you\n> feed it the raw numeric predictors. The original `learn/LDA.py` notes this explicitly.\n\n### Saving outputs"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "pd.DataFrame(scores).to_csv('./dataOUT/z.csv')\npd.DataFrame(prediction_test,  index=x_test.index,    columns=['Predicted']) \\\n    .to_csv('./dataOUT/predict_test.csv')\npd.DataFrame(prediction_apply, index=apply_set.index, columns=['Predicted']) \\\n    .to_csv('./dataOUT/predict_apply.csv')"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## The LDA plot — distribution of discriminant scores"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import seaborn as sb           # or a matplotlib hist if seaborn is missing\nplt.figure(figsize=(10, 8)); plt.title('Discriminant scores')\nsb.kdeplot(scores, fill=True); plt.show()"
          },
          {
            "kind": "markdown",
            "md": "A KDE (kernel density) plot shows how well the classes separate along the first discriminant\naxis. A matplotlib fallback: `plt.hist(scores[:, 0], bins=20)`.\n\n---\n\n## Exam variations seen in the past papers\n\n- **exam8:** building-vulnerability classification. Part A is the usual industry/population\n  wrangling; Part B reads `ProiectB.csv` (label `VULNERAB`, classes A–G) + `ProiectB_apply.csv`,\n  computes discriminant **scores**, draws a **kde** of scores, then **predicts** both the test\n  set and the apply set. (Walkthrough: `walkthroughs/lda-exam8.json`.)\n\n---\n\n## Common mistakes (→ [10-gotchas.md](10-gotchas.md))\n\n- Standardizing the data first — unnecessary for LDA and not what the course expects.\n- Including the **target column** in `predictors` — use `columns[:-1]` (or drop the target).\n- Predicting on the apply set with the **wrong columns** — select `apply_set[predictors]` so\n  the column set matches what the model was trained on.\n- `transform` (gives scores) vs `predict` (gives class labels) — they answer different\n  requirements; don't swap them."
          },
          {
            "kind": "divider"
          },
          {
            "kind": "walkthroughRef",
            "walkthroughId": "dsad-walkthrough-lda-exam8"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-plotting",
    "title": "Plotting",
    "order": 8,
    "lessons": [
      {
        "id": "dsad-les-plotting",
        "title": "Plotting — Every Graph You'll Be Asked to Draw",
        "summary": "Plots are worth real points (the biplot in exam1 is **3 points** by itself). Each plot is a",
        "estMinutes": 45,
        "topicTags": [
          "plots"
        ],
        "priority": 2,
        "blocks": [
          {
            "kind": "markdown",
            "md": "Plots are worth real points (the biplot in exam1 is **3 points** by itself). Each plot is a\nshort, memorizable recipe. The original `learn/plots.py` has **bugs** (a recursive\n`dendrogram`, a `figseize` typo, a shadowed `kdeplot`); the corrected versions are below.\n\nGeneral shape of every plot:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import matplotlib.pyplot as plt\nplt.figure(figsize=(w, h))   # open a canvas\nplt.title('...')             # title (graders look for it)\n# ... draw ...\nplt.show()                   # render"
          },
          {
            "kind": "markdown",
            "md": "Save instead of show with `plt.savefig('./dataOUT/plot.png')` if a file is required.\n\n---\n\n## 1. Scree / line plot of variances (PCA)\n\nShows each component's variance with the **Kaiser cutoff** at `y = 1`."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "def line_plot(alpha):\n    plt.figure(figsize=(11, 8)); plt.title('Variance explained by the components')\n    xlabels = ['C' + str(k + 1) for k in range(len(alpha))]\n    plt.plot(xlabels, alpha, 'bo-')      # blue dots + line\n    plt.axhline(1, color='r')            # keep components above this line"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 2. Correlation circle (PCA loadings)\n\nVariables plotted in the plane of the first two components, inside the unit circle."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "def correlation_circle(loadings):       # loadings = Rxc (variables × components)\n    plt.figure(figsize=(8, 8)); plt.title('Correlation circle')\n    T = np.arange(0, np.pi * 2, 0.01)\n    plt.plot(np.cos(T), np.sin(T))      # the unit circle\n    plt.axhline(0, c='g'); plt.axvline(0, c='g')\n    plt.scatter(loadings[:, 0], loadings[:, 1])"
          },
          {
            "kind": "markdown",
            "md": "Variables near the circle's edge are well represented; variables close together are positively\ncorrelated; opposite sides → negatively correlated.\n\n---\n\n## 3. Correlogram / heatmap (correlations or communalities)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import seaborn as sb\ndef correlogram(df):                    # df: a DataFrame of correlations or communalities\n    plt.figure(figsize=(15, 11)); plt.title('Correlogram')\n    sb.heatmap(df, vmin=-1, vmax=1, cmap='bwr', annot=True)"
          },
          {
            "kind": "markdown",
            "md": "**Pure-matplotlib fallback** (if seaborn isn't installed):"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "def correlogram_mpl(df):\n    plt.figure(figsize=(12, 10)); plt.title('Correlogram')\n    plt.imshow(df.values, vmin=-1, vmax=1, cmap='bwr')\n    plt.xticks(range(df.shape[1]), df.columns, rotation=90)\n    plt.yticks(range(df.shape[0]), df.index)\n    plt.colorbar()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 4. Scores scatter (PCA / general)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "def scores_scatter(scores):\n    plt.figure(figsize=(10, 8)); plt.title('Scores')\n    plt.scatter(scores[:, 0], scores[:, 1])"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 5. Dendrogram (HCA)  ← corrected (original recursed)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from scipy.cluster.hierarchy import dendrogram as scipy_dendrogram\n\ndef plot_dendrogram(HC, labels, threshold):\n    plt.figure(figsize=(15, 8)); plt.title('Clusters')\n    scipy_dendrogram(HC, labels=labels, leaf_rotation=30)   # use the scipy function\n    plt.axhline(threshold, c='r')                           # the cut line"
          },
          {
            "kind": "markdown",
            "md": "> **Bug fixed:** the original defined `def dendrogram(...)` that then called `dendrogram(...)`\n> — calling itself forever. Always alias or call the scipy import.\n\n---\n\n## 6. Biplot (CCA)\n\nObservations in the space of the first two canonical roots of each set."
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "def biplot(z, u):\n    plt.figure(figsize=(7, 7)); plt.title('Biplot CCA')\n    plt.xlabel('axis 1'); plt.ylabel('axis 2')\n    plt.scatter(z[:, 0], z[:, 1], c='r', label='X')\n    plt.scatter(u[:, 0], u[:, 1], c='b', label='Y')\n    plt.legend()"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## 7. KDE plot (LDA scores)  ← corrected (original had `figseize` typo + shadowed import)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "import seaborn as sb\n\ndef kde_scores(scores):\n    plt.figure(figsize=(12, 8)); plt.title('Discriminant scores')   # was 'figseize'\n    sb.kdeplot(scores, fill=True)"
          },
          {
            "kind": "markdown",
            "md": "Matplotlib fallback: `plt.hist(scores[:, 0], bins=20)`.\n\n---\n\n## Which plot goes with which method\n\n| Method | Typical plot(s) |\n|---|---|\n| PCA | scree/line plot, correlation circle, scores scatter, communalities heatmap |\n| EFA | loadings heatmap (correlogram) |\n| CCA | biplot of canonical roots |\n| HCA | dendrogram with cut line; (K-means → colored PCA scatter) |\n| LDA | kde of discriminant scores |"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-selector",
    "title": "Method selector",
    "order": 9,
    "lessons": [
      {
        "id": "dsad-les-method-selector",
        "title": "Method Selector — \"Which Part B Method Is This?\"",
        "summary": "This is the **hardest skill** in the exam and the one worth drilling most. The subject almost",
        "estMinutes": 45,
        "topicTags": [
          "selector"
        ],
        "priority": 1,
        "blocks": [
          {
            "kind": "markdown",
            "md": "This is the **hardest skill** in the exam and the one worth drilling most. The subject almost\nnever names the method. It describes the **inputs** and the **outputs**, and you infer the\nmethod. Use the flowchart, then confirm with the keyword table.\n\n---\n\n## The 30-second decision flowchart"
          },
          {
            "kind": "code",
            "lang": "text",
            "code": "Is there a column with class LABELS to predict, and an \"apply\" file without them?\n│\n├─ YES ─────────────────────────────────────────────► LDA   (supervised classification)\n│\n└─ NO\n   │\n   Are the variables split into TWO sets (X and Y)?\n   │\n   ├─ YES ──────────────────────────────────────────► CCA   (relate two sets)\n   │\n   └─ NO  (one set of variables)\n      │\n      Does it ask to GROUP the observations / draw a dendrogram / make a partition?\n      │\n      ├─ YES ───────────────────────────────────────► HCA   (or K-means)\n      │\n      └─ NO  (it wants to summarize the variables)\n         │\n         Does it ask for COMMUNALITIES + SPECIFIC factors, or a KMO/Bartlett test?\n         │\n         ├─ YES ────────────────────────────────────► EFA   (latent factors)\n         │\n         └─ NO  (components / variance / scores / loadings) ► PCA"
          },
          {
            "kind": "markdown",
            "md": "---\n\n## Keyword cues (English ↔ Romanian)\n\n| If the subject says… | …it's | Why |\n|---|---|---|\n| \"predict\", \"class\", \"training/apply set\", \"discriminant\" / `discriminantă` | **LDA** | a known label is being learned & predicted |\n| \"set X … set Y\", \"two subsets of variables\", \"production vs consumption\" | **CCA** | two variable blocks to relate |\n| \"dendrogram\", \"clusters\", \"partition\", \"Ward/linkage\", \"maximum stability\" / `partiție`, `clasificare` | **HCA** | grouping observations into a tree |\n| \"K-means\", \"n clusters given\" | **HCA (K-means)** | flat clustering with fixed k |\n| \"common factors\", \"communalities\", \"specific/unique factors\", \"KMO\", \"Bartlett\" / `factori comuni` | **EFA** | latent-factor model with uniqueness |\n| \"principal components\", \"variance explained\", \"scores\", \"correlation circle\", \"scree/line plot\" / `componente principale`, `scoruri` | **PCA** | summarize one set into components |\n\n---\n\n## PCA vs EFA — the most common confusion\n\nThey look similar (both produce loadings) but:\n\n| | PCA | EFA |\n|---|---|---|\n| Goal | **summarize** variance | **explain** shared variance via latent factors |\n| Gives uniqueness? | no | **yes** (`get_uniquenesses`) |\n| Suitability test? | no | **KMO / Bartlett** |\n| Library | `sklearn.decomposition.PCA` | `factor_analyzer.FactorAnalyzer` |\n\n→ If \"communalities **and** specific factors\" or \"KMO\" appears, choose **EFA**. Otherwise PCA.\n\n---\n\n## HCA vs LDA — supervised or not?\n\n- **HCA** *discovers* groups — there is **no** label in the data.\n- **LDA** *reproduces* groups — there **is** a label, and an apply set to predict.\n\nIf you see a target column (like `VULNERAB`) → LDA. If you must invent the groups → HCA.\n\n---\n\n## Sanity checklist once you've decided\n\n1. Did I **standardize**? (PCA, EFA, CCA, HCA → yes; LDA → no.)\n2. Did I import the **right** method class? (see [00-course-overview.md](00-course-overview.md) §2)\n3. Does each requirement's **output file** get written to `dataOUT/`?\n4. Did I produce the **plot** if one is requested?"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-glossary",
    "title": "Glossary",
    "order": 11,
    "lessons": [
      {
        "id": "dsad-les-glossary",
        "title": "Glossary — Romanian Terms & Dataset Dictionary",
        "summary": "Explanations in this pack are in English, but the **exam subjects and CSV column names are",
        "estMinutes": 45,
        "topicTags": [
          "glossary"
        ],
        "priority": 3,
        "blocks": [
          {
            "kind": "markdown",
            "md": "Explanations in this pack are in English, but the **exam subjects and CSV column names are\noften Romanian**. This is your decoder ring. None of these change the code — but you can't\nselect `merged['Judet']` if you don't know `Judet` means county.\n\n---\n\n## 1. Subject / requirement words\n\n| Romanian | English |\n|---|---|\n| Cerință / Cerinte | Requirement / task |\n| Subiect | Subject (the exam problem) |\n| Să se salveze | Save (to a file) |\n| Să se calculeze | Calculate |\n| Să se afișeze | Display / print |\n| fișier | file |\n| punct(e) | point(s) (the score for a task) |\n| Exemplu | Example (sample output shown on the subject) |\n| coloană / linie | column / row |\n| medie | mean / average |\n| medie ponderată | weighted average |\n| abatere standard | standard deviation |\n| varianță | variance |\n| crescător / descrescător | ascending / descending |\n| dominant(ă) | dominant (the max) |\n\n---\n\n## 2. Geography & administrative units (Romania)\n\n| Romanian | English | Notes |\n|---|---|---|\n| Siruta | SIRUTA code | unique locality ID — the usual `index_col=0` |\n| Localitate | Locality / town | often the name column to skip |\n| Județ / Judet | County | `IndicativJudet` = county code (e.g. `ab`), `NumeJudet` = county name |\n| Regiune | Region | groups counties |\n| MacroRegiune | Macro-region | groups regions |\n| Populație / Populatie | Population | the usual weighting/denominator column |\n| Țară / Tari | Country / countries | |\n| Continent | Continent | |\n\n---\n\n## 3. Statistics / method vocabulary\n\n| Romanian | English |\n|---|---|\n| componente principale | principal components (PCA) |\n| scoruri | scores |\n| varianța explicată | explained variance |\n| cercul corelațiilor | correlation circle |\n| corelogramă | correlogram (heatmap) |\n| comunalități | communalities |\n| factori comuni / specifici | common / specific factors (EFA) |\n| analiză factorială | factor analysis |\n| analiza de corelație canonică | canonical correlation analysis (CCA) |\n| rădăcini canonice | canonical roots |\n| clasificare / partiție | classification / partition (HCA) |\n| dendrogramă | dendrogram |\n| analiză discriminantă | discriminant analysis (LDA) |\n| set de învățare / testare / aplicare | learning / testing / apply set |\n| variabilă țintă | target variable |\n\n---\n\n## 4. Real dataset column dictionaries\n\nThese are the actual headers from `DSAD-master/.../dataIN/`. Use them to choose columns\nquickly and to build drills.\n\n**Industrie.csv** — turnover by industrial activity per locality\n`Siruta, Localitate, Alimentara, Textila, Lemnului, ChimicaFarmaceutica, Metalurgica,\nConstructiiMasini, CalculatoareElectronica, Mobila, Energetica`\n(Food, Textile, Wood, Chemical-Pharma, Metallurgy, Machinery, Computers-Electronics,\nFurniture, Energy)\n\n**PopulatieLocalitati.csv** — `Siruta, Localitate, Judet, Populatie`\n\n**IndustriaAlimentara.csv** — food-industry employees per locality\n`Siruta, Localitate, Carne, Peste, LegumeFructe, Uleiuri, Lactate, Morarit, Panificatie`\n(Meat, Fish, Vegetables-Fruit, Oils, Dairy, Milling, Bakery)\n\n**Coduri_Judete.csv** — `IndicativJudet, NumeJudet, Regiune`\n**Coduri_Regiuni.csv** — `Regiune, MacroRegiune`\n\n**NatLocMovements.csv** — natural population movement per locality\n`Siruta, City, Marriages, Deceased, DeceasedUnder1Year, Divorces, StillBirths, LiveBirths`\n**PopulationLoc.csv** — `Siruta, Population, CountyCode`\n\n**DataSet_34.csv** — meat production & consumption (CCA), 27 countries\n`tari, prodPorc, prodVite, prodOaieSiCapra, prodPasareDeCurte, consPorc, consVita,\nconsumOaieSiCapra, consPasareDeCurte`\n(pork/beef/sheep-goat/poultry **production**, then the four **consumption** columns)\n\n**DataSet_83.csv** — business-environment indicators (PCA)\n`Country, Start-up procedures, Tax payments, Time required, Time to pay taxes, Tax rate,\nRevenue, Foreign Investment, High-tech exports`\n\n**GlobalIndicatorsPerCapita_2021.csv** — economic indicators per capita (PCA)\n`CountryId, Country, GNI, ChangesInv, Exports, Imports, FinalConsExp, GrossCF,\nHouseholdConsExp, AgrHuntForFish, Construction, Manufacturing, MiningManUt, TradeT,\nTransportComm, Other`\n**CountryContinents.csv** — `CountryID, Country, Continent`\n**g20.csv** — a ready-made loadings matrix: `index, c1, c2, c3, c4, c5` (used in a Part C)\n\n**Rata.csv** — rates per country: `Three_Letter_Country_Code, Country_Name, FR, IM, LE, LEF,\nLKM, MMR, RS`\n**CoduriTariExtins.csv** — `Country_Letter_code, Country, Continent`\n**alcohol.csv** — alcohol consumption by year: `Country, Code, 2000, 2005, 2010, 2015, 2018`\n\n**ProiectB.csv** — building vulnerability, **LDA learning set**\n`Id, Year, Floors, Hist, Type, Mason, Struct, Apart, DayP, NightP, Employ, Visit, VULNERAB`\n**ProiectB_apply.csv** — same columns **minus** `VULNERAB` (the apply set to predict)\n(`VULNERAB` classes are letters **A–G**.)"
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-mod-gotchas",
    "title": "Gotchas",
    "order": 10,
    "lessons": [
      {
        "id": "dsad-les-gotchas",
        "title": "Gotchas — Bugs in the Templates & Exam Traps",
        "summary": "Two kinds of trap live here: (1) **real bugs** in the original `DSAD-master/learn/` templates",
        "estMinutes": 45,
        "topicTags": [
          "plots"
        ],
        "priority": 2,
        "blocks": [
          {
            "kind": "markdown",
            "md": "Two kinds of trap live here: (1) **real bugs** in the original `DSAD-master/learn/` templates\nthat will break your code if you copy them blindly, and (2) **conceptual traps** that cost\npoints. These are gold for \"spot-the-bug\" practice — see\n[../teaching/pedagogy.md](../teaching/pedagogy.md) and `content/question-bank.json`.\n\n---\n\n## A. Real bugs in `learn/` templates\n\n### A1. `plots.py` — `dendrogram` shadows its own import (infinite recursion)"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from scipy.cluster.hierarchy import dendrogram      # the real function\ndef dendrogram(h, labels, threshold):               # ⚠️ redefines the name!\n    dendrogram(h, labels=labels, leaf_rotation=30)  # ⚠️ now calls ITSELF → RecursionError"
          },
          {
            "kind": "markdown",
            "md": "**Fix:** alias the import or call scipy directly:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from scipy.cluster.hierarchy import dendrogram as scipy_dendrogram\ndef plot_dendrogram(h, labels, threshold):\n    scipy_dendrogram(h, labels=labels, leaf_rotation=30)\n    plt.axhline(threshold, c='r')"
          },
          {
            "kind": "markdown",
            "md": "### A2. `plots.py` — `kdeplot` shadows its import **and** has a typo"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "from seaborn import kdeplot\ndef kdeplot(scores):\n    plt.figure(figseize=(12, 12))   # ⚠️ 'figseize' is not a valid kwarg → TypeError\n    kdeplot(scores, fill=True)      # ⚠️ also recurses"
          },
          {
            "kind": "markdown",
            "md": "**Fix:** `plt.figure(figsize=(12, 8))` and call `sb.kdeplot(...)` (aliased import).\n\n### A3. `PCA.py` — invalid placeholder input"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "x = np.ndarray()      # ⚠️ TypeError: ndarray() needs a shape; this is just a placeholder"
          },
          {
            "kind": "markdown",
            "md": "**Fix:** `x` must be your **real standardized data**:\n`x = StandardScaler().fit_transform(merged[labels])`. The same `x = np.ndarray()` placeholder\nappears in `EFA.py`, `CCA.py`, `HCA.py` — replace it everywhere.\n\n### A4. `EFA.py` — `get_eigenvalues()` returns a tuple\n`eigenvalues = efa.get_eigenvalues()` gives **two** arrays `(original, common)`. Index it\n(`eigenvalues[0]`) when you need one.\n\n---\n\n## B. Conceptual traps that cost points\n\n### B1. Population vs sample standard deviation (`ddof`)\n- `np.std(x)` → **population** formula (÷ n).\n- `pandas.Series.std()` → **sample** formula (÷ n−1).\n- To make pandas match numpy: `series.std(ddof=0)`.\nThe exam example datasets expect the **population** formula (see `exam2`'s coefficient-of-\nvariation requirement). Using the wrong one gives subtly wrong numbers.\n\n### B2. Standardize — but not for LDA\nPCA, EFA, CCA, HCA all run on `StandardScaler().fit_transform(...)`. **LDA does not** —\nfeed it the raw predictors. Standardizing before LDA is a common reflex mistake.\n\n### B3. `merge` is an inner join by default\nRows whose key is missing in either file are **dropped**. If your output has fewer rows than\nexpected, check the join. Use `how='left'` if you must keep all left-side rows.\n\n### B4. `_x` / `_y` suffixes after a merge\nWhen both files have a column of the same name (e.g. `Localitate`), pandas appends `_x`/`_y`.\nDrop one and rename the other:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "merged = a.merge(b, left_index=True, right_index=True) \\\n    .drop(columns='Localitate_y').rename(columns={'Localitate_x': 'Localitate'})"
          },
          {
            "kind": "markdown",
            "md": "### B5. `idxmax` axis confusion\n- `idxmax(axis=1)` → the **column name** of the row-max (e.g. dominant activity).\n- `idxmax(axis=0)` → the **row label** of the column-max (e.g. leading country).\n\n### B6. PCA components vs scores\n`C = pca.fit_transform(x)` are the **components**; `C/√alpha` are the **standardized scores**.\nSubjects ask for each under different names — read carefully.\n\n### B7. CCA `corrcoef` block slicing\n`np.corrcoef(x, z, rowvar=False)[:p, p:]` — the offset is `p` (the number of X columns), and\nkeep only `m = min(p,q)` roots with a trailing `[:, :m]`.\n\n### B8. CCA `n_components`\n`CCA(n_components=m)` with `m = min(p, q)`. Asking for more components than `min(p,q)` errors.\n\n### B9. EFA suitability test threshold\n`calculate_kmo(x)[1]` (overall KMO) should be **> 0.6** to justify factor analysis. Mention it\nif the subject asks whether the data is suitable.\n\n### B10. Always write to `dataOUT/`\nComputing the right answer earns **zero** points if it isn't saved. Every requirement ends in\n`.to_csv('./dataOUT/<name>.csv')` (or `plt.savefig(...)` for plots). Match the **exact**\nfilename the subject specifies.\n\n### B11. Round when the subject shows few decimals\nIf the example output shows 2 decimals, `np.round(result, 2)` before saving so your file\nmatches the expected format.\n\n---\n\n## C. The Part C tasks that were left unsolved\n\nSeveral original solutions ended Part C with `# I don't know`. The recurring Part C is reading\na **ready-made loadings matrix** and computing communalities — solved here:"
          },
          {
            "kind": "code",
            "lang": "python",
            "code": "loadings = pd.read_csv('./dataIN/g20.csv', index_col=0)\ncommunalities = np.cumsum(loadings * loadings, axis=1)   # cumulative squared loadings\nprint(communalities.iloc[:, -1].idxmax())   # variable best explained by the factors"
          },
          {
            "kind": "markdown",
            "md": "See [02-pca.md](02-pca.md) §\"Exam variations\" and [03-efa.md](03-efa.md) §\"Reading a\nready-made loadings matrix\"."
          }
        ]
      }
    ]
  }
];
