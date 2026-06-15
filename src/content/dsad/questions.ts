import type { QuestionBank } from "@/lib/schema";

export const dsadBank: QuestionBank = {
  "id": "dsad-bank",
  "courseId": "dsad",
  "questions": [
    {
      "id": "dsad-q-sel-01",
      "type": "mcq",
      "topic": "selector",
      "difficulty": "easy",
      "prompt": "A subject says: 'standardize the variables and split the dataset into two subsets: production variables (set X) and consumption variables (set Y).' Which method is being asked for?",
      "options": [
        "PCA",
        "CCA",
        "HCA",
        "LDA"
      ],
      "answer": "CCA",
      "explanation": "Two explicitly defined variable sets X and Y is the dead giveaway for canonical correlation analysis. See 08-method-selector.md.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sel-02",
      "type": "mcq",
      "topic": "selector",
      "difficulty": "easy",
      "prompt": "A subject gives a learning file with a VULNERAB class column (A–G) and a separate apply file without it, asking you to predict the class. Which method?",
      "options": [
        "EFA",
        "HCA",
        "LDA",
        "PCA"
      ],
      "answer": "LDA",
      "explanation": "A known label to learn + an apply set to predict = supervised classification = LDA.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sel-03",
      "type": "mcq",
      "topic": "selector",
      "difficulty": "medium",
      "prompt": "A subject asks for 'communalities and specific factors' and to check the KMO before proceeding. Which method?",
      "options": [
        "PCA",
        "EFA",
        "CCA",
        "HCA"
      ],
      "answer": "EFA",
      "explanation": "Specific (unique) factors and the KMO suitability test are EFA-only; PCA has neither. See PCA-vs-EFA in 08-method-selector.md.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sel-04",
      "type": "mcq",
      "topic": "selector",
      "difficulty": "medium",
      "prompt": "A subject asks to classify observations into a 'maximum stability partition' and draw a dendrogram. Which method?",
      "options": [
        "HCA",
        "LDA",
        "PCA",
        "CCA"
      ],
      "answer": "HCA",
      "explanation": "Dendrogram + partition + (usually) Ward linkage = hierarchical cluster analysis. Maximum stability = the max-gap cut rule.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sel-05",
      "type": "mcq",
      "topic": "selector",
      "difficulty": "easy",
      "prompt": "Which method does NOT require standardizing the data first?",
      "options": [
        "PCA",
        "CCA",
        "HCA",
        "LDA"
      ],
      "answer": "LDA",
      "explanation": "LDA is scale-invariant for classification; PCA/CCA/HCA all run on StandardScaler output. Gotcha B2.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-bug-01",
      "type": "spot-the-bug",
      "topic": "plots",
      "difficulty": "medium",
      "prompt": "This dendrogram helper crashes with RecursionError. Why, and how do you fix it?",
      "code": "from scipy.cluster.hierarchy import dendrogram\n\ndef dendrogram(h, labels, threshold):\n    dendrogram(h, labels=labels, leaf_rotation=30)\n    plt.axhline(threshold, c='r')",
      "answer": "The function is named 'dendrogram', shadowing the imported one, so it calls itself forever. Fix: alias the import (from scipy.cluster.hierarchy import dendrogram as scipy_dendrogram) and call scipy_dendrogram inside, or rename the helper.",
      "explanation": "Name shadowing → infinite recursion. Gotcha A1 in 10-gotchas.md.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-bug-02",
      "type": "spot-the-bug",
      "topic": "plots",
      "difficulty": "easy",
      "prompt": "This line raises a TypeError about an unexpected keyword. What is wrong?",
      "code": "plt.figure(figseize=(12, 12))",
      "answer": "Typo: 'figseize' should be 'figsize'. Correct: plt.figure(figsize=(12, 12)).",
      "explanation": "A real typo from learn/plots.py. Gotcha A2.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-bug-03",
      "type": "spot-the-bug",
      "topic": "pca",
      "difficulty": "easy",
      "prompt": "A template starts with the line below before doing PCA. Why won't this work as the input?",
      "code": "x = np.ndarray()",
      "answer": "np.ndarray() is not valid data (it needs a shape and is just a placeholder). x must be your real standardized data: x = StandardScaler().fit_transform(merged[labels]).",
      "explanation": "Placeholder, not real input. Gotcha A3.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-bug-04",
      "type": "spot-the-bug",
      "topic": "pca",
      "difficulty": "medium",
      "prompt": "A student runs PCA directly on raw turnover values (millions) mixed with rates (0–1) and gets one component explaining ~99% of variance. What did they forget?",
      "code": "pca = PCA()\nC = pca.fit_transform(merged[labels])",
      "answer": "They forgot to standardize. PCA is scale-sensitive, so the large-scale variable dominates. Use x = StandardScaler().fit_transform(merged[labels]) first.",
      "explanation": "Standardize before PCA/EFA/CCA/HCA. Gotcha B2.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-bug-05",
      "type": "spot-the-bug",
      "topic": "lda",
      "difficulty": "medium",
      "prompt": "An LDA model trained fine but predicting the apply set raises a feature-count mismatch. The code is below. What is wrong?",
      "code": "predictors = list(x.columns.values[:-1])\nmodel.fit(x[predictors], x['VULNERAB'])\nmodel.predict(x_apply)",
      "answer": "x_apply still has all its columns; predict on the same predictor columns: model.predict(x_apply[predictors]).",
      "explanation": "Train and predict must use the same predictor set. See 06-lda.md common mistakes.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-po-01",
      "type": "predict-output",
      "topic": "partA",
      "difficulty": "easy",
      "prompt": "Given a row with A=10, B=30, C=60 (columns in 'labels'), what does this print?",
      "code": "row = pd.Series({'A': 10, 'B': 30, 'C': 60})\nlabels = ['A', 'B', 'C']\nprint(row[labels].idxmax())",
      "answer": "C",
      "explanation": "idxmax returns the label of the maximum value; 60 is largest → 'C'.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-po-02",
      "type": "predict-output",
      "topic": "partA",
      "difficulty": "medium",
      "prompt": "df has rows [a:10, b:20, c:0] and [a:0, b:0, c:0]. What does df[(df > 0).any(axis=1)] return?",
      "code": "df = pd.DataFrame([[10, 20, 0], [0, 0, 0]], columns=['a','b','c'])\nprint(df[(df > 0).any(axis=1)])",
      "answer": "Only the first row (index 0), because it has at least one positive value; the all-zero row is dropped.",
      "explanation": "(df > 0).any(axis=1) keeps rows with any positive cell. Used to filter active localities.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-po-03",
      "type": "predict-output",
      "topic": "cca",
      "difficulty": "medium",
      "prompt": "If set X has 4 variables and set Y has 6 variables, how many canonical roots does CCA produce?",
      "code": "p, q = 4, 6\nm = min(p, q)\nprint(m)",
      "answer": "4",
      "explanation": "Number of canonical roots = min(#X, #Y) = min(4, 6) = 4. Gotcha B8.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-fb-01",
      "type": "fill-blank",
      "topic": "pca",
      "difficulty": "easy",
      "prompt": "Fill in the blank to standardize the variables before PCA.",
      "code": "x = ____.fit_transform(merged[labels])",
      "answer": "StandardScaler()",
      "explanation": "from sklearn.preprocessing import StandardScaler; standardize first.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-fb-02",
      "type": "fill-blank",
      "topic": "pca",
      "difficulty": "medium",
      "prompt": "Fill in the blank to compute PCA factor loadings (variable–component correlations).",
      "code": "a = pca.components_.T\nRxc = a * np.____(alpha)",
      "answer": "sqrt",
      "explanation": "Loadings = eigenvectors scaled by sqrt of the eigenvalues. See 02-pca.md.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-fb-03",
      "type": "fill-blank",
      "topic": "hca",
      "difficulty": "medium",
      "prompt": "Fill in the blank to build the hierarchy with Ward linkage.",
      "code": "HC = ____(x, method='ward')",
      "answer": "linkage",
      "explanation": "from scipy.cluster.hierarchy import linkage.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-fb-04",
      "type": "fill-blank",
      "topic": "hca",
      "difficulty": "hard",
      "prompt": "Fill in the blank to assign each observation to k clusters from the linkage matrix.",
      "code": "cat = fcluster(HC, k, criterion='____')",
      "answer": "maxclust",
      "explanation": "criterion='maxclust' cuts the tree into exactly k clusters.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-fb-05",
      "type": "fill-blank",
      "topic": "partA",
      "difficulty": "easy",
      "prompt": "Fill in the blank to compute a population-weighted average of column v.",
      "code": "np.average(df['v'], ____=df['Populatie'])",
      "answer": "weights",
      "explanation": "np.average(values, weights=...) gives the weighted mean.",
      "codeLang": "python",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sa-01",
      "type": "short-answer",
      "topic": "hca",
      "difficulty": "hard",
      "prompt": "Explain the max-gap threshold rule for choosing the number of clusters in HCA, and why k = n - j.",
      "answer": "Look at the merge distances in the linkage matrix (column 2). Find the largest jump between two consecutive merges (j = argmax of the differences); a big jump means you fused two clusters that were actually far apart. Cut halfway through that gap. There are n+1 observations and n merges; stopping at merge j (0-based) leaves n - j clusters standing, so k = n - j.",
      "explanation": "This is the 'maximum stability partition' logic. See 05-hca.md.",
      "answerConfidence": "confirmed"
    },
    {
      "id": "dsad-q-sa-02",
      "type": "short-answer",
      "topic": "selector",
      "difficulty": "medium",
      "prompt": "You see a single set of variables and the subject wants 'principal components, the variance line plot, and the correlation circle'. Which method, and what is the first line of code you write for the data?",
      "answer": "PCA. First standardize: x = StandardScaler().fit_transform(merged[labels]).",
      "explanation": "Components + variance + correlation circle = PCA, which is scale-sensitive so standardize first.",
      "answerConfidence": "confirmed"
    }
  ]
};
