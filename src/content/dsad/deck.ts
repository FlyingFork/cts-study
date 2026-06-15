import type { Deck } from "@/lib/schema";

export const dsadDeck: Deck = {
  "id": "dsad-deck",
  "courseId": "dsad",
  "cards": [
    {
      "id": "dsad-card-001",
      "front": "Read a CSV using its first column as the row index",
      "back": "pd.read_csv('./dataIN/file.csv', index_col=0)",
      "topic": "partA",
      "tags": [
        "api",
        "io"
      ]
    },
    {
      "id": "dsad-card-002",
      "front": "Join two DataFrames on their shared index",
      "back": "df.merge(other, left_index=True, right_index=True)",
      "topic": "partA",
      "tags": [
        "api",
        "merge"
      ]
    },
    {
      "id": "dsad-card-003",
      "front": "Join where a column matches another frame's index",
      "back": "df.merge(other, left_on='Judet', right_index=True)",
      "topic": "partA",
      "tags": [
        "api",
        "merge"
      ]
    },
    {
      "id": "dsad-card-004",
      "front": "Course-standard way to fill missing numeric values",
      "back": "df.fillna(np.mean(df[labels], axis=0), inplace=True)",
      "topic": "partA",
      "tags": [
        "api",
        "nan"
      ]
    },
    {
      "id": "dsad-card-005",
      "front": "Compute something per row",
      "back": "df.apply(lambda row: ..., axis=1)  (axis=1 = one row at a time)",
      "topic": "partA",
      "tags": [
        "api",
        "apply"
      ]
    },
    {
      "id": "dsad-card-006",
      "front": "Total a numeric set per group",
      "back": "df.groupby('Col').sum()",
      "topic": "partA",
      "tags": [
        "api",
        "groupby"
      ]
    },
    {
      "id": "dsad-card-007",
      "front": "Get the column name of the max in each row (dominant category)",
      "back": "df.idxmax(axis=1)",
      "topic": "partA",
      "tags": [
        "api",
        "idxmax"
      ]
    },
    {
      "id": "dsad-card-008",
      "front": "Get the row label of the max in each column",
      "back": "df.idxmax(axis=0)",
      "topic": "partA",
      "tags": [
        "api",
        "idxmax"
      ]
    },
    {
      "id": "dsad-card-009",
      "front": "Weighted average of values v by weights w",
      "back": "np.average(v, weights=w)",
      "topic": "partA",
      "tags": [
        "api",
        "weighted"
      ]
    },
    {
      "id": "dsad-card-010",
      "front": "Put years on separate columns",
      "back": "df.pivot(columns='Ani', values='Valoare')",
      "topic": "partA",
      "tags": [
        "api",
        "pivot"
      ]
    },
    {
      "id": "dsad-card-011",
      "front": "Sort rows by a column descending",
      "back": "df.sort_values('col', ascending=False)",
      "topic": "partA",
      "tags": [
        "api",
        "sort"
      ]
    },
    {
      "id": "dsad-card-012",
      "front": "Keep rows where any activity column is positive",
      "back": "df[(df[labels] > 0).any(axis=1)]",
      "topic": "partA",
      "tags": [
        "api",
        "filter"
      ]
    },
    {
      "id": "dsad-card-013",
      "front": "Save a result to the output folder",
      "back": "df.to_csv('./dataOUT/Name.csv')",
      "topic": "partA",
      "tags": [
        "api",
        "io"
      ]
    },
    {
      "id": "dsad-card-014",
      "front": "np.std vs pandas .std() difference",
      "back": "np.std = population (÷n); Series.std() = sample (÷n-1). Use .std(ddof=0) to match numpy.",
      "topic": "partA",
      "tags": [
        "trap",
        "ddof"
      ]
    },
    {
      "id": "dsad-card-015",
      "front": "Which method: variables split into set X and set Y?",
      "back": "CCA (canonical correlation)",
      "topic": "selector",
      "tags": [
        "recognise"
      ]
    },
    {
      "id": "dsad-card-016",
      "front": "Which method: a label/class column to predict + an apply file?",
      "back": "LDA (linear discriminant analysis)",
      "topic": "selector",
      "tags": [
        "recognise"
      ]
    },
    {
      "id": "dsad-card-017",
      "front": "Which method: dendrogram / clusters / Ward / partition?",
      "back": "HCA (hierarchical clustering)",
      "topic": "selector",
      "tags": [
        "recognise"
      ]
    },
    {
      "id": "dsad-card-018",
      "front": "Which method: communalities + specific factors + KMO?",
      "back": "EFA (exploratory factor analysis)",
      "topic": "selector",
      "tags": [
        "recognise"
      ]
    },
    {
      "id": "dsad-card-019",
      "front": "Which method: principal components / variance / correlation circle?",
      "back": "PCA",
      "topic": "selector",
      "tags": [
        "recognise"
      ]
    },
    {
      "id": "dsad-card-020",
      "front": "PCA vs EFA: the deciding cue",
      "back": "EFA gives uniqueness (specific factors) and uses a KMO/Bartlett test; PCA does not.",
      "topic": "selector",
      "tags": [
        "pca",
        "efa"
      ]
    },
    {
      "id": "dsad-card-021",
      "front": "HCA vs LDA: supervised or not?",
      "back": "HCA discovers groups (no labels); LDA predicts a known label (supervised).",
      "topic": "selector",
      "tags": [
        "hca",
        "lda"
      ]
    },
    {
      "id": "dsad-card-022",
      "front": "Which methods require standardization?",
      "back": "PCA, EFA, CCA, HCA = yes. LDA = no.",
      "topic": "selector",
      "tags": [
        "trap",
        "standardize"
      ]
    },
    {
      "id": "dsad-card-023",
      "front": "PCA import",
      "back": "from sklearn.decomposition import PCA",
      "topic": "pca",
      "tags": [
        "api",
        "import"
      ]
    },
    {
      "id": "dsad-card-024",
      "front": "PCA: get the principal components",
      "back": "C = pca.fit_transform(x)",
      "topic": "pca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-025",
      "front": "PCA: variance per component (eigenvalues)",
      "back": "alpha = pca.explained_variance_",
      "topic": "pca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-026",
      "front": "PCA: proportion of variance explained",
      "back": "pca.explained_variance_ratio_",
      "topic": "pca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-027",
      "front": "PCA: factor loadings formula",
      "back": "Rxc = pca.components_.T * np.sqrt(alpha)",
      "topic": "pca",
      "tags": [
        "formula"
      ]
    },
    {
      "id": "dsad-card-028",
      "front": "PCA: standardized scores formula",
      "back": "scores = C / np.sqrt(alpha)",
      "topic": "pca",
      "tags": [
        "formula"
      ]
    },
    {
      "id": "dsad-card-029",
      "front": "PCA: communalities formula",
      "back": "np.cumsum(Rxc * Rxc, axis=1)",
      "topic": "pca",
      "tags": [
        "formula"
      ]
    },
    {
      "id": "dsad-card-030",
      "front": "PCA: Kaiser rule for keeping components",
      "back": "keep components with eigenvalue alpha > 1 (the red y=1 line)",
      "topic": "pca",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-031",
      "front": "EFA import",
      "back": "from factor_analyzer import FactorAnalyzer, calculate_kmo",
      "topic": "efa",
      "tags": [
        "api",
        "import"
      ]
    },
    {
      "id": "dsad-card-032",
      "front": "EFA: suitability threshold",
      "back": "overall KMO from calculate_kmo(x)[1] should be > 0.6",
      "topic": "efa",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-033",
      "front": "EFA: communality + uniqueness equals",
      "back": "1 (per variable, on standardized data)",
      "topic": "efa",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-034",
      "front": "EFA: get specific (unique) factors",
      "back": "efa.get_uniquenesses()",
      "topic": "efa",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-035",
      "front": "CCA import",
      "back": "from sklearn.cross_decomposition import CCA",
      "topic": "cca",
      "tags": [
        "api",
        "import"
      ]
    },
    {
      "id": "dsad-card-036",
      "front": "CCA: number of canonical roots",
      "back": "m = min(p, q) = min(#X vars, #Y vars)",
      "topic": "cca",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-037",
      "front": "CCA: get the canonical scores",
      "back": "z, u = cca.fit_transform(x, y)",
      "topic": "cca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-038",
      "front": "CCA: factor loadings for X side",
      "back": "np.corrcoef(x, z, rowvar=False)[:p, p:][:, :m]",
      "topic": "cca",
      "tags": [
        "formula"
      ]
    },
    {
      "id": "dsad-card-039",
      "front": "CCA: must X and Y be standardized together?",
      "back": "No — standardize each set with its own scaler.",
      "topic": "cca",
      "tags": [
        "trap"
      ]
    },
    {
      "id": "dsad-card-040",
      "front": "HCA import",
      "back": "from scipy.cluster.hierarchy import linkage, dendrogram, fcluster",
      "topic": "hca",
      "tags": [
        "api",
        "import"
      ]
    },
    {
      "id": "dsad-card-041",
      "front": "HCA: build the hierarchy with Ward linkage",
      "back": "HC = linkage(x, method='ward')",
      "topic": "hca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-042",
      "front": "HCA: optimal cut rule",
      "back": "cut at the largest gap between consecutive merge distances; k = n - j clusters",
      "topic": "hca",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-043",
      "front": "HCA: assign observations to k clusters",
      "back": "fcluster(HC, k, criterion='maxclust')",
      "topic": "hca",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-044",
      "front": "LDA import",
      "back": "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis",
      "topic": "lda",
      "tags": [
        "api",
        "import"
      ]
    },
    {
      "id": "dsad-card-045",
      "front": "LDA: split learning set into train/test",
      "back": "train_test_split(x[predictors], x[target], train_size=0.4)",
      "topic": "lda",
      "tags": [
        "api"
      ]
    },
    {
      "id": "dsad-card-046",
      "front": "LDA: scores vs predictions",
      "back": "model.transform(x) = discriminant scores; model.predict(x) = class labels",
      "topic": "lda",
      "tags": [
        "concept"
      ]
    },
    {
      "id": "dsad-card-047",
      "front": "Plot: scree/line plot cutoff line",
      "back": "plt.axhline(1, color='r')",
      "topic": "plots",
      "tags": [
        "pca"
      ]
    },
    {
      "id": "dsad-card-048",
      "front": "Plot: draw the unit circle for the correlation circle",
      "back": "plt.plot(np.cos(T), np.sin(T)) for T in arange(0, 2*pi, 0.01)",
      "topic": "plots",
      "tags": [
        "pca"
      ]
    },
    {
      "id": "dsad-card-049",
      "front": "Plot: dendrogram bug to avoid",
      "back": "never name a function 'dendrogram' that calls the scipy 'dendrogram' (infinite recursion); alias the import",
      "topic": "plots",
      "tags": [
        "hca",
        "trap"
      ]
    },
    {
      "id": "dsad-card-050",
      "front": "Romanian: Judet, Populatie, Localitate, Cerinta",
      "back": "county, population, locality, requirement",
      "topic": "glossary",
      "tags": [
        "romanian"
      ]
    },
    {
      "id": "dsad-card-051",
      "front": "Romanian: scoruri, comunalitati, partitie",
      "back": "scores, communalities, partition",
      "topic": "glossary",
      "tags": [
        "romanian"
      ]
    }
  ]
};
