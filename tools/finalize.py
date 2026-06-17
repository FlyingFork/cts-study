"""Merge seed + generated into exam_questions_full.json (sorted by numeric id,
_tags stripped) and print the final coverage report."""
import json, os, re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(__file__))
SEED = os.path.join(ROOT, "exam_questions.json")
GEN = os.path.join(ROOT, "generated.json")
OUT = os.path.join(ROOT, "exam_questions_full.json")

PATTERNS = ["Singleton", "Simple Factory", "Factory Method", "Abstract Factory",
            "Prototype", "Builder", "Adapter", "Bridge", "Composite", "Decorator",
            "Facade", "Flyweight", "Proxy", "Chain of Responsibility", "Command",
            "Interpreter", "Iterator", "Mediator", "Memento", "Observer", "State",
            "Strategy", "Template Method", "Visitor"]
TOPICS = {
    "SRP": ["SRP", "Single Responsibility"], "OCP": ["OCP", "Open/Closed", "Open-Closed"],
    "LSP": ["LSP", "Liskov"], "ISP": ["ISP", "Interface Segregation"],
    "DIP": ["DIP", "Dependency Inversion"], "SOLID(any)": ["SOLID"],
    "FIRST": ["FIRST"], "JUnit4 lifecycle": ["JUnit4 lifecycle", "JUnit 4", "@BeforeClass", "@Before"],
    "JUnit5": ["JUnit5", "JUnit 5", "@BeforeEach", "@BeforeAll"],
    "Coverage": ["Coverage", "coverage"], "Boundary": ["Boundary", "boundary"],
    "Equivalence": ["Equivalence", "equivalence"], "Cyclomatic": ["Cyclomatic", "cyclomatic"],
    "Test doubles": ["Test doubles", "mock", "stub", "spy", "fake"],
    "Test smells": ["Test smells", "test smell"], "Cardinality": ["Cardinality", "cardinality"],
    "Error condition": ["Error condition", "error condition"],
    "Assertions": ["Assertions", "assertEquals", "assertThrows"],
}

def seed_tags(q):
    """Keyword-tag the seed questions (which carry no _tags)."""
    blob = " ".join([q.get("questionText", ""), q.get("explanation", ""),
                     json.dumps(q.get("correctAnswers"))])
    ans = json.dumps(q.get("correctAnswers"))
    tags = []
    short = {"Template Method": "Template", "Chain of Responsibility": "Chain",
             "Factory Method": "Factory"}
    for p in PATTERNS:
        names = [p] + ([short[p]] if p in short else [])
        if any(re.search(r"\b" + re.escape(n), ans) for n in names):
            tags.append(p)
    for label, kws in TOPICS.items():
        if any(kw in blob for kw in kws):
            tags.append(label)
    return tags

def main():
    seed = json.load(open(SEED, encoding="utf-8"))
    gen = json.load(open(GEN, encoding="utf-8"))

    # coverage accounting
    pat = Counter(); top = Counter(); types = Counter()
    all_for_report = []
    for q in seed["questions"]:
        all_for_report.append((q, seed_tags(q)))
    for q in gen:
        all_for_report.append((q, q.get("_tags", [])))

    for q, tags in all_for_report:
        types[q["type"]] += 1
        for t in tags:
            if t in PATTERNS:
                pat[t] += 1
            # topic tags may be raw labels (e.g. "Boundary","SOLID","DIP")
        # topics: re-derive from tag labels + per-topic keyword on tag list
        tagblob = " ".join(tags)
        for label, kws in TOPICS.items():
            if label in tags or any(kw in tagblob for kw in kws):
                top[label] += 1

    # build merged, strip _tags, sort by numeric id
    merged = list(seed["questions"])
    for q in gen:
        merged.append({k: v for k, v in q.items() if k != "_tags"})
    merged.sort(key=lambda q: int(q["id"][1:]))
    out = {"schema": seed["schema"], "questions": merged}
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # report
    print("=" * 56)
    print(f"FINAL DATASET: exam_questions_full.json")
    print(f"TOTAL QUESTIONS: {len(merged)}  (seed 36 + generated {len(gen)})")
    print("=" * 56)
    print("\nBY TYPE:")
    for t, c in types.most_common():
        print(f"  {t:20} {c:4}  ({100*c//len(merged)}%)")
    print("\nPATTERN COVERAGE (questions touching each pattern):")
    for p in PATTERNS:
        bar = "#" * pat.get(p, 0)
        print(f"  {p:26} {pat.get(p,0):4}  {bar}")
    print("\nTOPIC COVERAGE:")
    for t in TOPICS:
        print(f"  {t:20} {top.get(t,0):4}")
    weakest_pat = [p for p in PATTERNS if pat.get(p, 0) < 10]
    if weakest_pat:
        print("\nPatterns under 10:", ", ".join(f"{p}({pat.get(p,0)})" for p in weakest_pat))

if __name__ == "__main__":
    main()
