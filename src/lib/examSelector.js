const CATEGORY_ORDER = ['Creational', 'Structural', 'Behavioral'];

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function buildTypeQuotas(questions, count) {
  const typeCounts = questions.reduce((counts, question) => {
    counts[question.type] = (counts[question.type] || 0) + 1;
    return counts;
  }, {});

  const quotaRows = Object.entries(typeCounts).map(([type, total]) => {
    const exact = (total / questions.length) * count;
    return {
      type,
      floor: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    };
  });

  const quotas = Object.fromEntries(quotaRows.map((row) => [row.type, row.floor]));
  let remaining = count - quotaRows.reduce((sum, row) => sum + row.floor, 0);

  for (const row of quotaRows.sort((left, right) => right.remainder - left.remainder)) {
    if (remaining <= 0) {
      break;
    }

    quotas[row.type] += 1;
    remaining -= 1;
  }

  return quotas;
}

function getPatternCategoryMap(patternDefinitions) {
  return new Map(
    patternDefinitions.map((pattern) => [pattern.slug, pattern.category]),
  );
}

function getQuestionCategories(question, patternCategoryMap) {
  return [...new Set(
    (question.patterns || [])
      .map((pattern) => patternCategoryMap.get(pattern))
      .filter(Boolean),
  )];
}

function scoreQuestion({
  question,
  typeQuotas,
  typeCounts,
  coveredCategories,
  coveredPatterns,
  patternCounts,
  patternCategoryMap,
}) {
  const typeNeed = (typeQuotas[question.type] || 0) - (typeCounts[question.type] || 0);
  const categories = getQuestionCategories(question, patternCategoryMap);
  const patterns = question.patterns || [];
  let score = Math.random();

  if (typeNeed > 0) {
    score += 80 + typeNeed;
  } else {
    score -= 20 + Math.abs(typeNeed);
  }

  score += categories.filter((category) => !coveredCategories.has(category)).length * 35;
  score += patterns.filter((pattern) => !coveredPatterns.has(pattern)).length * 12;
  score -= patterns.reduce((sum, pattern) => sum + (patternCounts[pattern] || 0), 0) * 4;

  if (patterns.length === 1 && (patternCounts[patterns[0]] || 0) > 0) {
    score -= 6;
  }

  return score;
}

function addQuestion(question, state, patternCategoryMap) {
  state.selected.push(question);
  state.selectedIds.add(question.id);
  state.typeCounts[question.type] = (state.typeCounts[question.type] || 0) + 1;

  for (const pattern of question.patterns || []) {
    state.coveredPatterns.add(pattern);
    state.patternCounts[pattern] = (state.patternCounts[pattern] || 0) + 1;
  }

  for (const category of getQuestionCategories(question, patternCategoryMap)) {
    state.coveredCategories.add(category);
  }
}

function chooseBest(candidates, state, typeQuotas, patternCategoryMap, category = null) {
  return candidates
    .filter((question) => {
      if (state.selectedIds.has(question.id)) {
        return false;
      }

      if (!category) {
        return true;
      }

      return getQuestionCategories(question, patternCategoryMap).includes(category);
    })
    .map((question) => ({
      question,
      score: scoreQuestion({
        question,
        typeQuotas,
        typeCounts: state.typeCounts,
        coveredCategories: state.coveredCategories,
        coveredPatterns: state.coveredPatterns,
        patternCounts: state.patternCounts,
        patternCategoryMap,
      }),
    }))
    .sort((left, right) => right.score - left.score)[0]?.question;
}

export function selectExamQuestions(questions, requestedCount, patternDefinitions = []) {
  const available = Array.isArray(questions) ? questions.filter((question) => question?.id) : [];
  const count = Math.min(Math.max(0, requestedCount), available.length);

  if (count === 0) {
    return [];
  }

  if (count === available.length) {
    return shuffleItems(available);
  }

  const patternCategoryMap = getPatternCategoryMap(patternDefinitions);
  const shuffled = shuffleItems(available);
  const typeQuotas = buildTypeQuotas(available, count);
  const state = {
    selected: [],
    selectedIds: new Set(),
    typeCounts: {},
    coveredCategories: new Set(),
    coveredPatterns: new Set(),
    patternCounts: {},
  };
  const availableCategories = CATEGORY_ORDER.filter((category) => {
    return shuffled.some((question) => getQuestionCategories(question, patternCategoryMap).includes(category));
  });

  if (count >= availableCategories.length) {
    for (const category of availableCategories) {
      const question = chooseBest(shuffled, state, typeQuotas, patternCategoryMap, category);

      if (question) {
        addQuestion(question, state, patternCategoryMap);
      }
    }
  }

  while (state.selected.length < count) {
    const question = chooseBest(shuffled, state, typeQuotas, patternCategoryMap);

    if (!question) {
      break;
    }

    addQuestion(question, state, patternCategoryMap);
  }

  return shuffleItems(state.selected);
}
