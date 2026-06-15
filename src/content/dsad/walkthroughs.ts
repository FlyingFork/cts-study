import type { Walkthrough } from "@/lib/schema";

export const dsadWalkthroughs: Walkthrough[] = [
  {
    "id": "dsad-walkthrough-cca-exam1",
    "title": "CCA — full exam (Part A wrangling + Part B canonical correlation)",
    "method": "CCA",
    "source": "DSAD-master/exam/exam1/main.py",
    "corrected": false,
    "summary": "A complete exam: Part A computes turnover per inhabitant and the dominant industrial activity per county; Part B splits a meat dataset into production (X) and consumption (Y) sets, standardizes each, runs canonical correlation analysis, saves the canonical scores z/u and the factor loadings Rxz/Ryu, and draws the biplot of the first two canonical roots.",
    "blocks": [
      {
        "label": "Setup",
        "lines": [
          {
            "code": "import matplotlib.pyplot as plt",
            "explain": "For the biplot."
          },
          {
            "code": "import numpy as np",
            "explain": "np.mean, np.corrcoef."
          },
          {
            "code": "import pandas as pd",
            "explain": "Tables + CSV I/O."
          },
          {
            "code": "from sklearn.cross_decomposition import CCA",
            "explain": "The canonical correlation estimator (note: cross_decomposition, not decomposition)."
          },
          {
            "code": "from sklearn.preprocessing import StandardScaler",
            "explain": "Standardize X and Y separately before CCA."
          },
          {
            "code": "rawInd = pd.read_csv('./dataIN/Industrie.csv', index_col=0)",
            "explain": "Industry turnover per locality (Part A)."
          },
          {
            "code": "rawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)",
            "explain": "Population + county per locality."
          },
          {
            "code": "labels = list(rawInd.columns.values[1:])",
            "explain": "The industry activity columns (skip Localitate)."
          },
          {
            "code": "merged = rawInd.merge(rawPop, left_index=True, right_index=True)",
            "explain": "Join industry and population by Siruta index."
          },
          {
            "code": "merged.fillna(np.mean(merged[labels], axis=0), inplace=True)",
            "explain": "Replace NaNs with each activity's column mean — the course-standard NaN fix."
          }
        ]
      },
      {
        "label": "Req 1 — turnover per inhabitant",
        "lines": [
          {
            "code": "merged.apply(lambda row: row[labels] / row['Populatie'], axis=1)",
            "explain": "Per locality, divide each activity's turnover by the population."
          },
          {
            "code": "    .to_csv('./dataOUT/Request_1.csv')",
            "explain": "Save turnover-per-inhabitant per activity."
          }
        ]
      },
      {
        "label": "Req 2 — dominant activity per county",
        "lines": [
          {
            "code": "c2 = merged[['Judet'] + labels].groupby('Judet').sum()",
            "explain": "Total turnover per activity per county."
          },
          {
            "code": "c2['Cifra de afaceri'] = c2.max(axis=1)",
            "explain": "The highest turnover value in each county row."
          },
          {
            "code": "c2['Industrie'] = c2.idxmax(axis=1)",
            "explain": "The activity (column name) achieving that max = the dominant industry."
          },
          {
            "code": "c2[['Industrie', 'Cifra de afaceri']].to_csv('./dataOUT/Request_2.csv')",
            "explain": "Save dominant activity + its turnover per county."
          }
        ]
      },
      {
        "label": "Req 3 — split into X/Y and standardize",
        "note": "Part B starts. The 'set X ... set Y' wording is the CCA giveaway.",
        "lines": [
          {
            "code": "rawProd = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)",
            "explain": "Meat production & consumption per country."
          },
          {
            "code": "indexes = rawProd.index",
            "explain": "Country names for labeling outputs."
          },
          {
            "code": "prodLab = rawProd.columns[:4]",
            "explain": "The four PRODUCTION columns → set X."
          },
          {
            "code": "conLab = rawProd.columns[4:]",
            "explain": "The four CONSUMPTION columns → set Y."
          },
          {
            "code": "x = pd.DataFrame(StandardScaler().fit_transform(rawProd[prodLab]), index=indexes, columns=prodLab)",
            "explain": "Standardize set X (its own scaler)."
          },
          {
            "code": "y = pd.DataFrame(StandardScaler().fit_transform(rawProd[conLab]), index=indexes, columns=conLab)",
            "explain": "Standardize set Y separately (gotcha: don't standardize X and Y together)."
          },
          {
            "code": "x.to_csv('./dataOUT/Xstd.csv')",
            "explain": "Save the standardized X set (a required output)."
          },
          {
            "code": "y.to_csv('./dataOUT/Ystd.csv')",
            "explain": "Save the standardized Y set."
          }
        ]
      },
      {
        "label": "Req 4 — canonical scores z and u",
        "lines": [
          {
            "code": "n, p = x.shape",
            "explain": "n observations, p variables in X."
          },
          {
            "code": "q = y.shape[1]",
            "explain": "q variables in Y."
          },
          {
            "code": "m = min(p, q)",
            "explain": "Number of canonical roots = min(#X, #Y) (gotcha B8)."
          },
          {
            "code": "modelCCA = CCA(n_components=m)",
            "explain": "Ask for exactly m canonical components."
          },
          {
            "code": "modelCCA.fit(x, y)",
            "explain": "Learn the canonical axes relating X and Y."
          },
          {
            "code": "z, u = modelCCA.transform(x, y)",
            "explain": "Project: z = X scores, u = Y scores on the canonical axes."
          },
          {
            "code": "ZLab = ['Z' + str(i + 1) for i in range(z.shape[1])]",
            "explain": "Column labels Z1, Z2, ..."
          },
          {
            "code": "ULab = ['U' + str(i + 1) for i in range(u.shape[1])]",
            "explain": "Column labels U1, U2, .."
          },
          {
            "code": "pd.DataFrame(z, index=indexes, columns=ZLab).to_csv('./dataOUT/Xscore.csv')",
            "explain": "Save the X canonical scores."
          },
          {
            "code": "pd.DataFrame(u, index=indexes, columns=ULab).to_csv('./dataOUT/Yscore.csv')",
            "explain": "Save the Y canonical scores."
          }
        ]
      },
      {
        "label": "Req 5 — factor loadings Rxz and Ryu",
        "lines": [
          {
            "code": "Rxz = np.corrcoef(x, z[:, :m], rowvar=False)[:p, p:]",
            "explain": "Correlate the p original X variables with the m X-scores: build the full corr matrix, take the top-right block [:p, p:] (gotcha B7)."
          },
          {
            "code": "Ryu = np.corrcoef(y, u[:, :m], rowvar=False)[:q, q:]",
            "explain": "Same for Y variables vs the Y-scores."
          },
          {
            "code": "pd.DataFrame(Rxz, index=ZLab, columns=prodLab).to_csv('./dataOUT/Rxz.csv')",
            "explain": "Save the X-side loadings."
          },
          {
            "code": "pd.DataFrame(Ryu, index=ULab, columns=conLab).to_csv('./dataOUT/Ryu.csv')",
            "explain": "Save the Y-side loadings."
          }
        ]
      },
      {
        "label": "Req 6 — biplot of canonical roots",
        "lines": [
          {
            "code": "plt.figure(figsize=(7, 7)); plt.title('Biplot (z1, u1) / (z2, u2)')",
            "explain": "New square figure for the biplot."
          },
          {
            "code": "plt.xlabel('x'); plt.ylabel('y')",
            "explain": "Axis labels."
          },
          {
            "code": "plt.scatter(z[:, 0], z[:, 1], c='r', label='X')",
            "explain": "Plot observations by their first two X canonical scores (red)."
          },
          {
            "code": "plt.scatter(u[:, 0], u[:, 1], c='b', label='Y')",
            "explain": "Plot the same observations by their Y canonical scores (blue)."
          },
          {
            "code": "plt.legend(); plt.show()",
            "explain": "Legend + render. Tight red/blue pairs mean X and Y agree on that observation."
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-walkthrough-efa-template",
    "title": "EFA — complete recipe (corrected template)",
    "method": "EFA",
    "source": "DSAD-master/learn/EFA.py",
    "corrected": true,
    "summary": "A complete, runnable Exploratory Factor Analysis recipe built from the terse learn/EFA.py template (no clean worked EFA exam exists in the sources). It standardizes the data, runs the KMO suitability test, fits a factor model, and extracts loadings, eigenvalues, communalities, and specific (unique) factors, then saves them.",
    "blocks": [
      {
        "label": "Setup & input",
        "note": "factor_analyzer is a separate pip package, NOT part of scikit-learn.",
        "lines": [
          {
            "code": "import numpy as np",
            "explain": "Array math + rounding."
          },
          {
            "code": "import pandas as pd",
            "explain": "Tables + CSV I/O."
          },
          {
            "code": "from factor_analyzer import FactorAnalyzer, calculate_kmo",
            "explain": "The EFA estimator and the KMO sampling-adequacy test."
          },
          {
            "code": "from sklearn.preprocessing import StandardScaler",
            "explain": "Standardize variables before factor analysis."
          },
          {
            "code": "x = StandardScaler().fit_transform(merged[labels])",
            "explain": "Real standardized input. CORRECTED: the template's placeholder 'x = np.ndarray()' is invalid (gotcha A3) — x must be your actual data."
          }
        ]
      },
      {
        "label": "Step 1 — KMO suitability test",
        "lines": [
          {
            "code": "kmo_per_variable, kmo_total = calculate_kmo(x)",
            "explain": "Returns per-variable KMO values and the overall KMO. CORRECTED: unpack the tuple instead of keeping kmo[1]."
          },
          {
            "code": "print('KMO total =', kmo_total)",
            "explain": "The overall KMO should be > 0.6 to justify doing factor analysis (gotcha B9)."
          }
        ]
      },
      {
        "label": "Step 2 — fit the factor model",
        "lines": [
          {
            "code": "efa = FactorAnalyzer(n_factors=x.shape[1] - 1, rotation=None)",
            "explain": "A common exam choice: (number of variables − 1) factors. rotation=None keeps the raw solution."
          },
          {
            "code": "scores = efa.fit_transform(x)",
            "explain": "Fit the model and get each observation's factor scores."
          },
          {
            "code": "loadings = efa.loadings_",
            "explain": "Factor loadings: correlation of each variable with each latent factor."
          },
          {
            "code": "eigenvalues = efa.get_eigenvalues()",
            "explain": "Returns a tuple (original eigenvalues, common-factor eigenvalues) — index it as needed (gotcha A4)."
          },
          {
            "code": "communalities = efa.get_communalities()",
            "explain": "Share of each variable's variance explained by the common factors."
          },
          {
            "code": "specific_factors = efa.get_uniquenesses()",
            "explain": "Specific/unique variance per variable = 1 − communality (this split is what EFA adds over PCA)."
          }
        ]
      },
      {
        "label": "Step 3 — save the outputs",
        "lines": [
          {
            "code": "factor_labels = ['F' + str(i + 1) for i in range(loadings.shape[1])]",
            "explain": "Column labels F1, F2, ..."
          },
          {
            "code": "pd.DataFrame(np.round(loadings, 3), index=labels, columns=factor_labels).to_csv('./dataOUT/loadings.csv')",
            "explain": "Save the labeled loadings matrix."
          },
          {
            "code": "pd.DataFrame({'Communality': communalities, 'Specific': specific_factors}, index=labels).to_csv('./dataOUT/communalities.csv')",
            "explain": "Save communalities and uniquenesses side by side (they sum to 1 per variable)."
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-walkthrough-hca-exam0-1",
    "title": "HCA — full exam (Part A wrangling + Part B hierarchical clustering)",
    "method": "HCA",
    "source": "DSAD-master/exam/exam0-1/main.py",
    "corrected": false,
    "summary": "A complete exam: Part A computes the natural increase rate per county and the per-county locality leading each indicator; Part B standardizes a health-state dataset, builds a Ward linkage, finds the optimal cut threshold via the largest gap between consecutive merge distances, and draws the dendrogram with the cut line.",
    "blocks": [
      {
        "label": "Setup",
        "lines": [
          {
            "code": "import matplotlib.pyplot as plt",
            "explain": "For the dendrogram."
          },
          {
            "code": "import numpy as np",
            "explain": "np.mean, np.argmax."
          },
          {
            "code": "import pandas as pd",
            "explain": "Tables + CSV I/O."
          },
          {
            "code": "from scipy.cluster.hierarchy import dendrogram, linkage",
            "explain": "linkage builds the hierarchy; dendrogram draws it (from scipy, not sklearn)."
          },
          {
            "code": "from sklearn.preprocessing import StandardScaler",
            "explain": "Standardize before clustering so distances aren't dominated by large-scale variables."
          },
          {
            "code": "rawNatLoc = pd.read_csv('./dataIN/NatLocMovements.csv', index_col=0)",
            "explain": "Natural-movement data per locality (Part A)."
          },
          {
            "code": "rawPop = pd.read_csv('./dataIN/PopulationLoc.csv', index_col=0)",
            "explain": "Population + county code per locality."
          },
          {
            "code": "labels = list(rawNatLoc.columns.values[1:])",
            "explain": "Numeric movement columns (skip City)."
          },
          {
            "code": "merged = rawNatLoc.merge(rawPop, left_index=True, right_index=True)[['City', 'CountyCode', 'Population'] + labels]",
            "explain": "Join on Siruta and order the kept columns."
          },
          {
            "code": "merged.fillna(np.mean(merged[labels], axis=0), inplace=True)",
            "explain": "Fill NaNs with column means."
          }
        ]
      },
      {
        "label": "Req A1 — natural increase rate per county",
        "lines": [
          {
            "code": "merged.groupby('CountyCode').sum()",
            "explain": "Aggregate births, deaths, population to county level."
          },
          {
            "code": "    .apply(lambda row: (row['LiveBirths'] / (row['Population'] / 1000)) - (row['Deceased'] / (row['Population'] / 1000)), axis=1)",
            "explain": "Natural increase rate = birth rate − death rate, both per 1000 inhabitants."
          },
          {
            "code": "    .to_csv('./dataOUT/Request_1.csv')",
            "explain": "Save the per-county rate."
          }
        ]
      },
      {
        "label": "Req A2 — per-county locality leading each indicator",
        "lines": [
          {
            "code": "merged.set_index(['City', 'CountyCode'])",
            "explain": "Move identifiers into the index."
          },
          {
            "code": "    .apply(lambda row: row[labels] / (row['Population'] / 1000), axis=1)",
            "explain": "Per-1000-inhabitants rate for each indicator, per locality."
          },
          {
            "code": "    .reset_index(1)",
            "explain": "Bring CountyCode back as a column to group on."
          },
          {
            "code": "    .groupby('CountyCode').apply(lambda df: pd.Series({lab: df[lab].idxmax() for lab in labels}))",
            "explain": "Per county, the City with the max rate for each indicator."
          },
          {
            "code": "    .to_csv('./dataOUT/Request_2.csv')",
            "explain": "Save the leading localities."
          }
        ]
      },
      {
        "label": "Req B1 — standardize & build the hierarchy",
        "note": "Part B: words like 'classification / dendrogram / Ward' signal HCA.",
        "lines": [
          {
            "code": "rawHealth = pd.read_csv('./dataIN/DataSet_34.csv', index_col=0)",
            "explain": "The Part-B health-state dataset (one row per country)."
          },
          {
            "code": "x = StandardScaler().fit_transform(rawHealth)",
            "explain": "Standardize the variables."
          },
          {
            "code": "pd.DataFrame(x, columns=rawHealth.columns.values).to_csv('./dataOUT/Xstd.csv')",
            "explain": "Save the standardized data (a required output)."
          },
          {
            "code": "HC = linkage(x, method='ward')",
            "explain": "Build the agglomerative hierarchy with Ward linkage (the method is given in the subject). HC is the merge-history matrix: each row [c1, c2, distance, size]."
          }
        ]
      },
      {
        "label": "Req B2 — optimal cut threshold (max-gap rule)",
        "lines": [
          {
            "code": "n = HC.shape[0]",
            "explain": "Number of merges = (#observations − 1)."
          },
          {
            "code": "dist_1 = HC[1:n, 2]",
            "explain": "Merge distances from the 2nd merge onward."
          },
          {
            "code": "dist_2 = HC[0:n - 1, 2]",
            "explain": "The corresponding previous merge distances."
          },
          {
            "code": "diff = dist_1 - dist_2",
            "explain": "Gaps between consecutive merge distances."
          },
          {
            "code": "j = np.argmax(diff)",
            "explain": "The merge index with the largest jump — fusing two genuinely distant clusters."
          },
          {
            "code": "t = (HC[j, 2] + HC[j + 1, 2]) / 2",
            "explain": "Cut halfway through that biggest gap → the most stable partition. (Number of clusters = n − j; finish with fcluster — see 05-hca.md.)"
          }
        ]
      },
      {
        "label": "Req B3 — dendrogram with the cut line",
        "lines": [
          {
            "code": "plt.figure(figsize=(12, 12)); plt.title('Dendrogram')",
            "explain": "New figure."
          },
          {
            "code": "dendrogram(HC, labels=rawHealth.index.values, leaf_rotation=45)",
            "explain": "Draw the tree, labeling leaves with country names. (Call scipy's dendrogram directly — never shadow it, see gotcha A1.)"
          },
          {
            "code": "plt.axhline(t, c='r')",
            "explain": "Draw the red cut line at the threshold; branches it crosses define the clusters."
          },
          {
            "code": "plt.show()",
            "explain": "Render the dendrogram."
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-walkthrough-lda-exam8",
    "title": "LDA — full exam (Part A wrangling + Part B discriminant analysis)",
    "method": "LDA",
    "source": "DSAD-master/exam/exam8/main.py",
    "corrected": false,
    "summary": "A complete exam: Part A computes turnover per inhabitant and the dominant activity per county; Part B reads a building-vulnerability learning set (target VULNERAB, classes A–G) and an apply set, trains Linear Discriminant Analysis, saves the discriminant scores, plots their distribution with a KDE, and predicts both the test set and the apply set.",
    "blocks": [
      {
        "label": "Setup",
        "lines": [
          {
            "code": "import matplotlib.pyplot as plt",
            "explain": "For the KDE plot."
          },
          {
            "code": "import numpy as np",
            "explain": "np.mean for the NaN fill."
          },
          {
            "code": "import pandas as pd",
            "explain": "Tables + CSV I/O."
          },
          {
            "code": "import seaborn as sb",
            "explain": "For sb.kdeplot (optional; a matplotlib hist works if seaborn is missing)."
          },
          {
            "code": "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis",
            "explain": "The LDA estimator."
          },
          {
            "code": "from sklearn.model_selection import train_test_split",
            "explain": "Split the learning set into train/test."
          },
          {
            "code": "ind = pd.read_csv('./dataIN/Industrie.csv', index_col=0)",
            "explain": "Industry turnover (Part A)."
          },
          {
            "code": "pop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)",
            "explain": "Population + county (Part A)."
          },
          {
            "code": "labels = list(ind.columns[1:].values)",
            "explain": "Industry activity columns for Part A."
          },
          {
            "code": "merged = ind.merge(pop, left_index=True, right_index=True).drop(columns='Localitate_y').rename(columns={'Localitate_x': 'Localitate'})[['Judet', 'Localitate', 'Populatie'] + labels]",
            "explain": "Join, drop the duplicate name column, rename, and order columns."
          },
          {
            "code": "merged.fillna(np.mean(merged[labels], axis=0), inplace=True)",
            "explain": "Fill NaNs with column means."
          }
        ]
      },
      {
        "label": "Req A1 — turnover per inhabitant",
        "lines": [
          {
            "code": "merged[['Localitate', 'Populatie'] + labels].apply(lambda row: row[labels] / row['Populatie'], axis=1)",
            "explain": "Each activity's turnover ÷ population, per locality."
          },
          {
            "code": "    .to_csv('./dataOUT/Cerinta1.csv')",
            "explain": "Save the per-inhabitant turnover."
          }
        ]
      },
      {
        "label": "Req A2 — dominant activity per county",
        "lines": [
          {
            "code": "r2 = merged[['Judet'] + labels].groupby('Judet').sum()",
            "explain": "Total turnover per activity per county."
          },
          {
            "code": "r2['Cifra Afaceri'] = r2.max(axis=1)",
            "explain": "Highest turnover in each county."
          },
          {
            "code": "r2['Activitate'] = r2.idxmax(axis=1)",
            "explain": "The activity achieving that max (dominant industry)."
          },
          {
            "code": "r2[['Cifra Afaceri', 'Activitate']].to_csv('./dataOUT/Cerinta2.csv')",
            "explain": "Save value + dominant activity per county."
          }
        ]
      },
      {
        "label": "Req B1 — train LDA & save discriminant scores",
        "note": "Part B: a target column to predict + an 'apply' file = LDA. Note: LDA does NOT need standardization (gotcha B2).",
        "lines": [
          {
            "code": "x = pd.read_csv('./dataIN/ProiectB.csv', index_col=0)",
            "explain": "The learning set; it includes the VULNERAB label."
          },
          {
            "code": "tinta = 'VULNERAB'",
            "explain": "The target/class column to predict."
          },
          {
            "code": "predictors = list(x.columns.values[:-1])",
            "explain": "Every column except the last (the target). Don't include the target in the predictors (gotcha)."
          },
          {
            "code": "mapping = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7}",
            "explain": "Optional: encode the letter classes as numbers. (LDA also accepts string labels directly, so this step isn't strictly required.)"
          },
          {
            "code": "x[tinta] = x[tinta].map(mapping)",
            "explain": "Apply the encoding to the target column."
          },
          {
            "code": "x_train, x_test, y_train, y_test = train_test_split(x[predictors], x[tinta], train_size=0.4)",
            "explain": "Split into train/test: predictors vs target, 40% for training."
          },
          {
            "code": "model = LinearDiscriminantAnalysis()",
            "explain": "Create the LDA model."
          },
          {
            "code": "model.fit(x_train, y_train)",
            "explain": "Train it on the training predictors and labels."
          },
          {
            "code": "scores = model.transform(x_train)",
            "explain": "Project the training rows onto the discriminant axes (the discriminant scores)."
          },
          {
            "code": "pd.DataFrame(scores).to_csv('./dataOUT/z.csv')",
            "explain": "Save the discriminant scores."
          }
        ]
      },
      {
        "label": "Req B2 — KDE of the discriminant scores",
        "lines": [
          {
            "code": "plt.figure(figsize=(12, 12)); plt.title('Scores')",
            "explain": "New figure."
          },
          {
            "code": "sb.kdeplot(scores, fill=True)",
            "explain": "Kernel-density plot of the scores — shows how the classes separate. (Fallback: plt.hist(scores[:, 0], bins=20).)"
          },
          {
            "code": "plt.show()",
            "explain": "Render the plot."
          }
        ]
      },
      {
        "label": "Req B3 — predict test set and apply set",
        "lines": [
          {
            "code": "x_apply = pd.read_csv('./dataIN/ProiectB_apply.csv', index_col=0)",
            "explain": "The apply set — same predictors, no label; we must predict it."
          },
          {
            "code": "prediction_test = model.predict(x_test)",
            "explain": "Predict the held-out test rows (lets you check accuracy against y_test)."
          },
          {
            "code": "prediction_applied = model.predict(x_apply)",
            "explain": "Predict the apply set. (Use the same predictor columns the model was trained on.)"
          },
          {
            "code": "pd.DataFrame(prediction_test).to_csv('./dataOUT/predict_test.csv')",
            "explain": "Save the test-set predictions."
          },
          {
            "code": "pd.DataFrame(prediction_applied).to_csv('./dataOUT/predict_apply.csv')",
            "explain": "Save the apply-set predictions."
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-walkthrough-parta-food-industry",
    "title": "Part A — Food Industry wrangling (6 requirements)",
    "method": "PandasPartA",
    "source": "DSAD-master/test/Food Industry 2024/main.py",
    "corrected": true,
    "summary": "A pure Part-A example: read three files (food-industry employees, population, county codes), merge them, then answer six aggregation requirements (filter, per-row percentage, county shares, dominant activity, weighted regional average, and location indices). Shows every core pandas pattern you need for Part A.",
    "blocks": [
      {
        "label": "Setup — read & merge the three files",
        "note": "The standard opening: read each file with the entity ID as index, list the numeric columns, then join.",
        "lines": [
          {
            "code": "import numpy as np",
            "explain": "numpy for np.average and array math."
          },
          {
            "code": "import pandas as pd",
            "explain": "pandas for all the table work."
          },
          {
            "code": "rawIndustrie = pd.read_csv('./dataIN/IndustriaAlimentara.csv', index_col=0)",
            "explain": "Food-industry employees per locality; index_col=0 makes the Siruta code the row index."
          },
          {
            "code": "rawPop = pd.read_csv('./dataIN/PopulatieLocalitati.csv', index_col=0)",
            "explain": "Population + county code per locality, indexed by Siruta."
          },
          {
            "code": "rawCounties = pd.read_csv('./dataIN/Coduri_Judete.csv', index_col=0)",
            "explain": "County-code table (IndicativJudet -> NumeJudet, Regiune), indexed by the county code."
          },
          {
            "code": "indLab = list(rawIndustrie.columns.values[1:])",
            "explain": "The numeric activity columns (Carne, Peste, ...). [1:] skips the leading Localitate name column. Computed once, reused everywhere."
          },
          {
            "code": "merged = rawIndustrie[(rawIndustrie[indLab] > 0).any(axis=1)]",
            "explain": "Keep only localities with at least one activity > 0. CORRECTED: the original wrapped an extra indexer here; (df[cols] > 0).any(axis=1) is the clean idiom for 'any column positive in this row'."
          },
          {
            "code": "    .merge(rawPop, left_index=True, right_index=True)",
            "explain": "Join population onto each locality by the shared Siruta index."
          },
          {
            "code": "    .merge(rawCounties, left_on='Judet', right_index=True)",
            "explain": "Join the county table: match this frame's 'Judet' column against the county table's index."
          },
          {
            "code": "    .drop(columns='Localitate_y')",
            "explain": "Both files had a locality-name column, so the merge created Localitate_x / Localitate_y; drop the duplicate."
          },
          {
            "code": "    .rename(columns={'Localitate_x': 'Localitate'})",
            "explain": "Rename the survivor back to a clean 'Localitate'. See gotcha B4 in 10-gotchas.md."
          }
        ]
      },
      {
        "label": "Req 1 — localities with employees > 0",
        "note": "Same columns as the input, filtered to active localities (the filter already happened in setup).",
        "lines": [
          {
            "code": "merged[['Localitate'] + indLab].to_csv('./dataOUT/Requirement1.csv')",
            "explain": "Select the name + activity columns and save. Output to dataOUT is what earns the points."
          }
        ]
      },
      {
        "label": "Req 2 — percentage of employees per activity, per locality",
        "lines": [
          {
            "code": "merged[['Localitate'] + indLab]",
            "explain": "Work on the name + activity columns."
          },
          {
            "code": "    .apply(lambda row: row[indLab] / row[indLab].sum() * 100, axis=1)",
            "explain": "axis=1 → one row at a time. Divide each activity by the row's total and ×100 = each activity's share within the locality."
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement2.csv')",
            "explain": "Save the per-row percentages."
          }
        ]
      },
      {
        "label": "Req 3 — counties ranked by employee share of population",
        "lines": [
          {
            "code": "merged[['NumeJudet', 'Populatie'] + indLab]",
            "explain": "Need county name, population, and the activities."
          },
          {
            "code": "    .groupby('NumeJudet').sum()",
            "explain": "Total employees and population per county."
          },
          {
            "code": "    .apply(lambda row: row[indLab] / row['Populatie'], axis=1)",
            "explain": "Per county, each activity's employees ÷ county population = share of population."
          },
          {
            "code": "    .sum(axis=1)",
            "explain": "Add the per-activity shares to get the total food-industry employee share for the county."
          },
          {
            "code": "    .sort_values(ascending=False)",
            "explain": "Rank counties from highest share to lowest."
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement3.csv')",
            "explain": "Save the ranking."
          }
        ]
      },
      {
        "label": "Req 4 — dominant activity per county",
        "lines": [
          {
            "code": "merged[['Judet'] + indLab].groupby('Judet').sum()",
            "explain": "Total employees per activity, per county code."
          },
          {
            "code": "    .idxmax(axis=1)",
            "explain": "axis=1 → for each county row, the COLUMN NAME of the largest value = the dominant activity. (axis=0 would give the leading county per activity — see gotcha B5.)"
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement4.csv')",
            "explain": "Save county code → dominant activity."
          }
        ]
      },
      {
        "label": "Req 5 — population-weighted average per activity, per region",
        "lines": [
          {
            "code": "merged[['Regiune', 'Populatie'] + indLab].groupby('Regiune')",
            "explain": "Group localities by region (regions span multiple localities)."
          },
          {
            "code": "    .apply(lambda df: pd.Series({ind: np.average(df[ind], weights=df['Populatie']) for ind in indLab}))",
            "explain": "For each region, compute a population-weighted average of every activity. Returning a pd.Series makes the dict keys into output columns."
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement5.csv')",
            "explain": "Save the weighted regional averages."
          }
        ]
      },
      {
        "label": "Req 6 — location indices per county per activity",
        "note": "A location index = (county's share of national employees in activity j) ÷ (county's share of national population). >1 means the county is over-represented in that activity.",
        "lines": [
          {
            "code": "r6 = merged[['NumeJudet', 'Populatie'] + indLab].groupby('NumeJudet').sum()",
            "explain": "County totals for employees and population."
          },
          {
            "code": "sumr6 = r6.sum()",
            "explain": "National totals (sum across all counties) for each column."
          },
          {
            "code": "r6.apply(lambda row: (row[indLab] / sumr6[indLab]) / (row['Populatie'] / sumr6['Populatie']), axis=1)",
            "explain": "Per county: (activity share of national activity) ÷ (population share of national population) = the location index for each activity."
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement6.csv')",
            "explain": "Save the location indices."
          }
        ]
      }
    ]
  },
  {
    "id": "dsad-walkthrough-pca-exam0-2",
    "title": "PCA — full exam (Part A wrangling + Part B PCA)",
    "method": "PCA",
    "source": "DSAD-master/exam/exam0-2/main.py",
    "corrected": true,
    "summary": "A complete exam: Part A computes a mortality rate and a per-county dominant locality; Part B standardizes a business-indicators dataset, saves its covariance matrix, runs PCA, prints/saves the principal components, draws the variance line plot with the Kaiser cutoff, and plots the correlation circle of factor loadings.",
    "blocks": [
      {
        "label": "Setup",
        "lines": [
          {
            "code": "import numpy as np",
            "explain": "Array math and np.sqrt/np.cov."
          },
          {
            "code": "import pandas as pd",
            "explain": "Tables + CSV I/O."
          },
          {
            "code": "import matplotlib.pyplot as plt",
            "explain": "For the two PCA plots."
          },
          {
            "code": "from sklearn.decomposition import PCA",
            "explain": "The PCA estimator."
          },
          {
            "code": "from sklearn.preprocessing import StandardScaler",
            "explain": "PCA is scale-sensitive, so we standardize first (gotcha B2)."
          },
          {
            "code": "rawNat = pd.read_csv('./dataIN/NatLocMovements.csv', index_col=0)",
            "explain": "Natural-movement data per locality (births, deaths, ...), indexed by Siruta."
          },
          {
            "code": "rawPop = pd.read_csv('./dataIN/PopulationLoc.csv', index_col=0)",
            "explain": "Population + county code per locality."
          },
          {
            "code": "labels = list(rawNat.columns.values[1:])",
            "explain": "The numeric movement columns (skip the City name)."
          },
          {
            "code": "merged = rawNat.merge(rawPop, left_index=True, right_index=True)[['City', 'CountyCode', 'Population'] + labels]",
            "explain": "Join on Siruta and keep the columns we need, in order."
          }
        ]
      },
      {
        "label": "Req 1 — infant mortality rate",
        "lines": [
          {
            "code": "merged['MortalityRate'] = merged['DeceasedUnder1Year'] / merged['LiveBirths'] * 100",
            "explain": "Infant mortality = deaths under 1 year per 100 live births."
          },
          {
            "code": "merged[['City', 'MortalityRate']].to_csv('./dataOUT/Requirement_1.csv')",
            "explain": "Save city + its mortality rate."
          }
        ]
      },
      {
        "label": "Req 2 — per-county locality leading each indicator (per 1000 inhabitants)",
        "lines": [
          {
            "code": "merged.set_index(['City', 'CountyCode'])",
            "explain": "Put City and CountyCode into the index so the numeric columns are clean to operate on."
          },
          {
            "code": "    .apply(lambda row: row[labels] / (row['Population'] / 1000), axis=1)",
            "explain": "Convert each indicator to a per-1000-inhabitants rate, row by row."
          },
          {
            "code": "    .reset_index(1)",
            "explain": "Push CountyCode (index level 1) back to a column so we can group by it."
          },
          {
            "code": "    .groupby('CountyCode')",
            "explain": "Group localities by county."
          },
          {
            "code": "    .apply(lambda df: pd.Series({lab: df[lab].idxmax() for lab in labels}))",
            "explain": "For each county, the City (index label) with the highest rate for each indicator. idxmax here returns the row label = the leading city."
          },
          {
            "code": "    .to_csv('./dataOUT/Requirement_2.csv')",
            "explain": "Save the leading locality per indicator per county."
          }
        ]
      },
      {
        "label": "Req 3 — standardize & covariance matrix",
        "note": "Part B starts: a new dataset of business-environment indicators.",
        "lines": [
          {
            "code": "rawData = pd.read_csv('./dataIN/DataSet_83.csv', index_col=0)",
            "explain": "The Part-B numeric dataset (one row per country)."
          },
          {
            "code": "colLab = list(rawData.columns.values)",
            "explain": "All columns are numeric here. (Original reused the name 'labels' — renaming to colLab avoids confusion with Part A's labels.)"
          },
          {
            "code": "rows = list(rawData.index.values)",
            "explain": "Country names, for labeling output rows."
          },
          {
            "code": "x = StandardScaler().fit_transform(rawData)",
            "explain": "Standardize to mean 0 / std 1 — required before PCA."
          },
          {
            "code": "cov = np.cov(x, rowvar=False)",
            "explain": "Covariance matrix of the standardized variables (rowvar=False → columns are variables). On standardized data this is the correlation matrix."
          },
          {
            "code": "pd.DataFrame(np.round(cov, 2), index=colLab, columns=colLab).to_csv('./dataOUT/StdCov.csv')",
            "explain": "Save the labeled covariance matrix, rounded to 2 decimals."
          }
        ]
      },
      {
        "label": "Req 4 — principal components",
        "lines": [
          {
            "code": "pca = PCA()",
            "explain": "Default PCA keeps all components."
          },
          {
            "code": "C = pca.fit_transform(x)",
            "explain": "Fit and project: C holds the principal components (n_obs × n_comp)."
          },
          {
            "code": "pd.DataFrame(np.round(C, 2), index=rows, columns=['C' + str(i + 1) for i in range(C.shape[1])]).to_csv('./dataOUT/PrinComp.csv')",
            "explain": "Save components labeled C1, C2, ... per country."
          }
        ]
      },
      {
        "label": "Req 5 — variance line plot (Kaiser cutoff)",
        "lines": [
          {
            "code": "alpha = pca.explained_variance_",
            "explain": "Variance carried by each component (the eigenvalues)."
          },
          {
            "code": "plt.figure(figsize=(8, 8)); plt.title('Variance explained by the principal components')",
            "explain": "New figure with a title."
          },
          {
            "code": "xidx = ['C' + str(k + 1) for k in range(len(alpha))]",
            "explain": "X-axis labels C1..Cp."
          },
          {
            "code": "plt.plot(xidx, alpha, 'bo-')",
            "explain": "Blue dotted-line plot of the variances."
          },
          {
            "code": "plt.axhline(1, color='r')",
            "explain": "Kaiser rule: keep components above this y=1 line."
          },
          {
            "code": "plt.show()",
            "explain": "Render the scree/line plot."
          }
        ]
      },
      {
        "label": "Req 6 — correlation circle of loadings",
        "lines": [
          {
            "code": "a = pca.components_.T",
            "explain": "Eigenvectors as columns (transpose so variables are rows)."
          },
          {
            "code": "rxc = a * np.sqrt(alpha)",
            "explain": "Factor loadings = correlation between each variable and each component."
          },
          {
            "code": "plt.figure(figsize=(8, 8)); plt.title('Factor loadings')",
            "explain": "New figure."
          },
          {
            "code": "T = np.arange(0, np.pi * 2, 0.01)",
            "explain": "Angles spanning the full circle."
          },
          {
            "code": "plt.plot(np.cos(T), np.sin(T))",
            "explain": "Draw the unit circle (radius 1)."
          },
          {
            "code": "plt.axhline(0, c='g'); plt.axvline(0, c='g')",
            "explain": "Green axes through the origin."
          },
          {
            "code": "plt.scatter(rxc[:, 0], rxc[:, 1])",
            "explain": "Place each variable by its loadings on components 1 and 2; points near the edge are well represented."
          },
          {
            "code": "plt.show()",
            "explain": "Render the correlation circle."
          }
        ]
      }
    ]
  }
];
