import type { Course, ExamSim, PathSpec } from "@/lib/schema";
import { dsadModules } from "./modules";
import { dsadDeck } from "./deck";
import { dsadBank } from "./questions";
import { dsadDrills } from "./drills";
import { dsadWalkthroughs } from "./walkthroughs";

export { dsadModules, dsadDeck, dsadBank, dsadDrills, dsadWalkthroughs };

export const dsadExamSim: ExamSim = {
  "id": "dsad-examsim-mock-1",
  "courseId": "dsad",
  "title": "Timed mock exam — CCA paper (exam1)",
  "timeLimitMin": 120,
  "passScore": 6,
  "totalPoints": 10,
  "problemDrillIds": [
    "dsad-drill-partA-01",
    "dsad-drill-partA-02",
    "dsad-drill-partA-03",
    "dsad-drill-pca-01",
    "dsad-drill-hca-01",
    "dsad-drill-cca-01",
    "dsad-drill-lda-01"
  ],
  "problemPoints": 9,
  "questionIds": [
    "dsad-q-sel-01",
    "dsad-q-sel-02",
    "dsad-q-sel-03",
    "dsad-q-sel-04",
    "dsad-q-sel-05",
    "dsad-q-po-01",
    "dsad-q-po-02",
    "dsad-q-fb-05",
    "dsad-q-sa-02"
  ],
  "sampleSize": 2,
  "pointsPerQuestion": 0.5,
  "grantedPoints": 1,
  "feedback": "delayed"
};

export const dsadPath: PathSpec = {
  "courseId": "dsad",
  "dailyBudgetMin": 110,
  "tasks": [
    {
      "id": "dsad-task-overview",
      "kind": "lesson",
      "ref": "dsad-les-course-overview",
      "topic": "partA",
      "estMinutes": 35,
      "priority": 1
    },
    {
      "id": "dsad-task-parta",
      "kind": "lesson",
      "ref": "dsad-les-pandas-toolkit",
      "topic": "partA",
      "estMinutes": 55,
      "priority": 1
    },
    {
      "id": "dsad-task-drill-parta-01",
      "kind": "drill",
      "ref": "dsad-drill-partA-01",
      "topic": "partA",
      "estMinutes": 35,
      "priority": 1
    },
    {
      "id": "dsad-task-drill-parta-02",
      "kind": "drill",
      "ref": "dsad-drill-partA-02",
      "topic": "partA",
      "estMinutes": 35,
      "priority": 1
    },
    {
      "id": "dsad-task-drill-parta-03",
      "kind": "drill",
      "ref": "dsad-drill-partA-03",
      "topic": "partA",
      "estMinutes": 45,
      "priority": 1
    },
    {
      "id": "dsad-task-pca",
      "kind": "lesson",
      "ref": "dsad-les-pca",
      "topic": "pca",
      "estMinutes": 45,
      "priority": 1
    },
    {
      "id": "dsad-task-drill-pca",
      "kind": "drill",
      "ref": "dsad-drill-pca-01",
      "topic": "pca",
      "estMinutes": 45,
      "priority": 1
    },
    {
      "id": "dsad-task-hca",
      "kind": "lesson",
      "ref": "dsad-les-hca",
      "topic": "hca",
      "estMinutes": 45,
      "priority": 1
    },
    {
      "id": "dsad-task-drill-hca",
      "kind": "drill",
      "ref": "dsad-drill-hca-01",
      "topic": "hca",
      "estMinutes": 45,
      "priority": 1
    },
    {
      "id": "dsad-task-selector",
      "kind": "lesson",
      "ref": "dsad-les-method-selector",
      "topic": "selector",
      "estMinutes": 35,
      "priority": 1
    },
    {
      "id": "dsad-task-selector-review",
      "kind": "quiz",
      "ref": "dsad-bank",
      "topic": "selector",
      "estMinutes": 25,
      "priority": 1
    },
    {
      "id": "dsad-task-cca",
      "kind": "lesson",
      "ref": "dsad-les-cca",
      "topic": "cca",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-drill-cca",
      "kind": "drill",
      "ref": "dsad-drill-cca-01",
      "topic": "cca",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-lda",
      "kind": "lesson",
      "ref": "dsad-les-lda",
      "topic": "lda",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-drill-lda",
      "kind": "drill",
      "ref": "dsad-drill-lda-01",
      "topic": "lda",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-efa",
      "kind": "lesson",
      "ref": "dsad-les-efa",
      "topic": "efa",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-plotting",
      "kind": "lesson",
      "ref": "dsad-les-plotting",
      "topic": "plots",
      "estMinutes": 45,
      "priority": 2
    },
    {
      "id": "dsad-task-gotchas",
      "kind": "lesson",
      "ref": "dsad-les-gotchas",
      "topic": "plots",
      "estMinutes": 45,
      "priority": 3
    },
    {
      "id": "dsad-task-flashcards",
      "kind": "flashcards",
      "ref": "dsad-deck",
      "estMinutes": 30,
      "priority": 1
    },
    {
      "id": "dsad-task-mock",
      "kind": "exam-sim",
      "ref": "dsad-examsim-mock-1",
      "estMinutes": 120,
      "priority": 1
    }
  ],
  "mustFinishBeforeExam": [
    "dsad-task-overview",
    "dsad-task-parta",
    "dsad-task-drill-parta-01",
    "dsad-task-drill-parta-02",
    "dsad-task-pca",
    "dsad-task-drill-pca",
    "dsad-task-hca",
    "dsad-task-drill-hca",
    "dsad-task-selector",
    "dsad-task-mock"
  ]
};

export const dsadCourse: Course = {
  ...{
  "id": "dsad",
  "title": "Software Development for Data Analysis",
  "subtitle": "Python, pandas, and multivariate methods on real exam CSVs",
  "accentToken": "--course-dsad",
  "examDate": "2026-06-22",
  "passLine": 6,
  "studyTarget": 7,
  "examFormat": "Code-based exam: pandas Part A plus one multivariate method, CSV outputs and plots, 120 min",
  "topicTags": [
    "partA",
    "pca",
    "efa",
    "cca",
    "hca",
    "lda",
    "plots",
    "selector",
    "glossary"
  ],
  "deckId": "dsad-deck",
  "questionBankId": "dsad-bank"
},
  modules: dsadModules,
  examSim: dsadExamSim,
  drills: dsadDrills,
  walkthroughs: dsadWalkthroughs,
  path: dsadPath,
};
