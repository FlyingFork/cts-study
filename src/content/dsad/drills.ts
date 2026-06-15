import type { Drill } from "@/lib/schema";

export const dsadDrills: Drill[] = [
  {
    "id": "dsad-drill-partA-01",
    "courseId": "dsad",
    "topic": "partA",
    "title": "Turnover per inhabitant",
    "task": "Merge Industrie with PopulatieLocalitati on the Siruta index, fill NaNs with column means, then save (to dataOUT/Request_1.csv) the turnover per inhabitant for each activity, per locality.",
    "datasets": [
      "exam/exam1/dataIN/Industrie.csv",
      "exam/exam1/dataIN/PopulatieLocalitati.csv"
    ],
    "starter": "import numpy as np\nimport pandas as pd\nrawInd = pd.read_csv('./dataIN/Industrie.csv', index_col=0)\nrawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)\nlabels = list(rawInd.columns.values[1:])\nmerged = rawInd.merge(rawPop, left_index=True, right_index=True)\nmerged.fillna(____, inplace=True)\nmerged.apply(lambda row: ____ / row['Populatie'], axis=1).to_csv('./dataOUT/Request_1.csv')",
    "solution": "import numpy as np\nimport pandas as pd\nrawInd = pd.read_csv('./dataIN/Industrie.csv', index_col=0)\nrawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)\nlabels = list(rawInd.columns.values[1:])\nmerged = rawInd.merge(rawPop, left_index=True, right_index=True)\nmerged.fillna(np.mean(merged[labels], axis=0), inplace=True)\nmerged.apply(lambda row: row[labels] / row['Populatie'], axis=1).to_csv('./dataOUT/Request_1.csv')",
    "hints": [
      "The numeric columns are in 'labels'; population is in 'Populatie'.",
      "fillna takes np.mean(merged[labels], axis=0).",
      "Inside apply use row[labels] / row['Populatie'] with axis=1."
    ],
    "rubric": "Output has one row per locality and one column per activity, each value = activity turnover / population. NaNs filled before dividing.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-partA-02",
    "courseId": "dsad",
    "topic": "partA",
    "title": "Dominant activity per county",
    "task": "Save the dominant industrial activity (highest total turnover) per county, with its value, to dataOUT/Request_2.csv.",
    "datasets": [
      "exam/exam1/dataIN/Industrie.csv",
      "exam/exam1/dataIN/PopulatieLocalitati.csv"
    ],
    "starter": "c2 = merged[['Judet'] + labels].groupby('Judet').____()\nc2['Cifra'] = c2.max(axis=1)\nc2['Activitate'] = c2.____(axis=1)\nc2[['Activitate', 'Cifra']].to_csv('./dataOUT/Request_2.csv')",
    "solution": "c2 = merged[['Judet'] + labels].groupby('Judet').sum()\nc2['Cifra'] = c2.max(axis=1)\nc2['Activitate'] = c2.idxmax(axis=1)\nc2[['Activitate', 'Cifra']].to_csv('./dataOUT/Request_2.csv')",
    "hints": [
      "Aggregate per county with .sum().",
      "The dominant activity's name comes from idxmax(axis=1); its value from max(axis=1)."
    ],
    "rubric": "One row per county; columns = dominant activity name and its turnover value.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-partA-03",
    "courseId": "dsad",
    "topic": "partA",
    "title": "Population-weighted average per region",
    "task": "After merging to get Regiune and Populatie, save the population-weighted average number of employees per activity, per region, to dataOUT/Requirement5.csv.",
    "datasets": [
      "test/Food Industry 2024/dataIN/IndustriaAlimentara.csv",
      "test/Food Industry 2024/dataIN/PopulatieLocalitati.csv",
      "test/Food Industry 2024/dataIN/Coduri_Judete.csv"
    ],
    "starter": "merged[['Regiune', 'Populatie'] + indLab].groupby('Regiune').apply(\n    lambda df: pd.Series({ind: np.average(df[ind], weights=____) for ind in indLab})\n).to_csv('./dataOUT/Requirement5.csv')",
    "solution": "merged[['Regiune', 'Populatie'] + indLab].groupby('Regiune').apply(\n    lambda df: pd.Series({ind: np.average(df[ind], weights=df['Populatie']) for ind in indLab})\n).to_csv('./dataOUT/Requirement5.csv')",
    "hints": [
      "Group by Regiune.",
      "np.average(values, weights=df['Populatie']) gives the weighted mean.",
      "Return a pd.Series so the dict keys become columns."
    ],
    "rubric": "One row per region; each activity column holds the population-weighted average employee count.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-pca-01",
    "courseId": "dsad",
    "topic": "pca",
    "title": "PCA components + variance line plot",
    "task": "Standardize DataSet_83, run PCA, save the principal components to dataOUT/PrinComp.csv, and draw the variance line plot with the Kaiser cutoff.",
    "datasets": [
      "exam/exam0-2/dataIN/DataSet_83.csv"
    ],
    "starter": "from sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_83.csv', index_col=0)\nx = ____.fit_transform(raw)\npca = PCA()\nC = pca.____(x)\nalpha = pca.____\npd.DataFrame(np.round(C, 2), index=raw.index, columns=['C'+str(i+1) for i in range(C.shape[1])]).to_csv('./dataOUT/PrinComp.csv')\nimport matplotlib.pyplot as plt\nplt.plot(['C'+str(k+1) for k in range(len(alpha))], alpha, 'bo-')\nplt.axhline(1, color='r'); plt.show()",
    "solution": "from sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_83.csv', index_col=0)\nx = StandardScaler().fit_transform(raw)\npca = PCA()\nC = pca.fit_transform(x)\nalpha = pca.explained_variance_\npd.DataFrame(np.round(C, 2), index=raw.index, columns=['C'+str(i+1) for i in range(C.shape[1])]).to_csv('./dataOUT/PrinComp.csv')\nimport matplotlib.pyplot as plt\nplt.plot(['C'+str(k+1) for k in range(len(alpha))], alpha, 'bo-')\nplt.axhline(1, color='r'); plt.show()",
    "hints": [
      "Standardize with StandardScaler().",
      "C = pca.fit_transform(x); alpha = pca.explained_variance_.",
      "Kaiser line is plt.axhline(1, color='r')."
    ],
    "rubric": "PrinComp.csv has components labeled C1.. per country; a line plot of eigenvalues with a red y=1 line is shown.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-hca-01",
    "courseId": "dsad",
    "topic": "hca",
    "title": "Ward clustering + optimal threshold + dendrogram",
    "task": "Standardize the health-state dataset, build a Ward linkage, find the optimal cut threshold (max-gap rule), and draw the dendrogram with the cut line.",
    "datasets": [
      "exam/exam0-1/dataIN/DataSet_34.csv"
    ],
    "starter": "from scipy.cluster.hierarchy import linkage, dendrogram\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)\nx = StandardScaler().fit_transform(raw)\nHC = linkage(x, method='____')\nn = HC.shape[0]\ndiff = HC[1:n, 2] - HC[0:n-1, 2]\nj = np.____(diff)\nt = (HC[j, 2] + HC[j+1, 2]) / 2\nimport matplotlib.pyplot as plt\ndendrogram(HC, labels=raw.index.values, leaf_rotation=45)\nplt.axhline(t, c='r'); plt.show()",
    "solution": "from scipy.cluster.hierarchy import linkage, dendrogram\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)\nx = StandardScaler().fit_transform(raw)\nHC = linkage(x, method='ward')\nn = HC.shape[0]\ndiff = HC[1:n, 2] - HC[0:n-1, 2]\nj = np.argmax(diff)\nt = (HC[j, 2] + HC[j+1, 2]) / 2\nimport matplotlib.pyplot as plt\ndendrogram(HC, labels=raw.index.values, leaf_rotation=45)\nplt.axhline(t, c='r'); plt.show()",
    "hints": [
      "method='ward'.",
      "The threshold uses j = np.argmax of the consecutive distance gaps.",
      "Cut at t = (HC[j,2] + HC[j+1,2]) / 2."
    ],
    "rubric": "A dendrogram is drawn with a red horizontal line at the max-gap threshold; number of clusters = n - j.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-cca-01",
    "courseId": "dsad",
    "topic": "cca",
    "title": "Canonical scores from two variable sets",
    "task": "Split DataSet_34 into production (first 4 cols = X) and consumption (last 4 = Y), standardize each, run CCA, and save canonical scores z and u.",
    "datasets": [
      "exam/exam1/dataIN/DataSet_34.csv"
    ],
    "starter": "from sklearn.cross_decomposition import CCA\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)\nxLab = raw.columns[:4]; yLab = raw.columns[4:]\nx = StandardScaler().fit_transform(raw[xLab])\ny = StandardScaler().fit_transform(raw[yLab])\nm = min(x.shape[1], y.shape[1])\ncca = CCA(n_components=____)\nz, u = cca.____(x, y)\npd.DataFrame(z, index=raw.index).to_csv('./dataOUT/Xscore.csv')\npd.DataFrame(u, index=raw.index).to_csv('./dataOUT/Yscore.csv')",
    "solution": "from sklearn.cross_decomposition import CCA\nfrom sklearn.preprocessing import StandardScaler\nraw = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)\nxLab = raw.columns[:4]; yLab = raw.columns[4:]\nx = StandardScaler().fit_transform(raw[xLab])\ny = StandardScaler().fit_transform(raw[yLab])\nm = min(x.shape[1], y.shape[1])\ncca = CCA(n_components=m)\nz, u = cca.fit_transform(x, y)\npd.DataFrame(z, index=raw.index).to_csv('./dataOUT/Xscore.csv')\npd.DataFrame(u, index=raw.index).to_csv('./dataOUT/Yscore.csv')",
    "hints": [
      "Standardize X and Y separately.",
      "n_components = m = min(p, q).",
      "z, u = cca.fit_transform(x, y)."
    ],
    "rubric": "Xscore.csv and Yscore.csv each have m columns of canonical scores, one row per country.",
    "runnable": true,
    "entryFilename": "main.py"
  },
  {
    "id": "dsad-drill-lda-01",
    "courseId": "dsad",
    "topic": "lda",
    "title": "Train LDA and predict the apply set",
    "task": "Train LDA on ProiectB.csv (target VULNERAB), then predict both the held-out test set and ProiectB_apply.csv; save both prediction files. Do NOT standardize.",
    "datasets": [
      "exam/exam8/dataIN/ProiectB.csv",
      "exam/exam8/dataIN/ProiectB_apply.csv"
    ],
    "starter": "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis\nfrom sklearn.model_selection import train_test_split\nx = pd.read_csv('./dataIN/ProiectB.csv', index_col=0)\nx_apply = pd.read_csv('./dataIN/ProiectB_apply.csv', index_col=0)\ntarget = 'VULNERAB'\npredictors = list(x.columns.values[____])\nx_tr, x_te, y_tr, y_te = train_test_split(x[predictors], x[target], train_size=0.4)\nmodel = LinearDiscriminantAnalysis().fit(x_tr, y_tr)\npd.DataFrame(model.predict(x_te), index=x_te.index).to_csv('./dataOUT/predict_test.csv')\npd.DataFrame(model.predict(x_apply[____]), index=x_apply.index).to_csv('./dataOUT/predict_apply.csv')",
    "solution": "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis\nfrom sklearn.model_selection import train_test_split\nx = pd.read_csv('./dataIN/ProiectB.csv', index_col=0)\nx_apply = pd.read_csv('./dataIN/ProiectB_apply.csv', index_col=0)\ntarget = 'VULNERAB'\npredictors = list(x.columns.values[:-1])\nx_tr, x_te, y_tr, y_te = train_test_split(x[predictors], x[target], train_size=0.4)\nmodel = LinearDiscriminantAnalysis().fit(x_tr, y_tr)\npd.DataFrame(model.predict(x_te), index=x_te.index).to_csv('./dataOUT/predict_test.csv')\npd.DataFrame(model.predict(x_apply[predictors]), index=x_apply.index).to_csv('./dataOUT/predict_apply.csv')",
    "hints": [
      "predictors = columns[:-1] (drop the target).",
      "Don't standardize for LDA.",
      "Predict the apply set on the same predictor columns: x_apply[predictors]."
    ],
    "rubric": "Two CSVs of predicted classes (test and apply), each row labeled by the original index; predictors exclude VULNERAB.",
    "runnable": true,
    "entryFilename": "main.py"
  }
];
