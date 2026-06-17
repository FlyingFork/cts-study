import json, sys, re
from collections import Counter

path = sys.argv[1] if len(sys.argv) > 1 else "exam_questions.json"
with open(path, encoding="utf-8") as f:
    data = json.load(f)
qs = data["questions"]

PATTERNS = [
    "Singleton","Simple Factory","Factory Method","Abstract Factory","Prototype","Builder",
    "Adapter","Bridge","Composite","Decorator","Facade","Flyweight","Proxy",
    "Chain of Responsibility","Command","Interpreter","Iterator","Mediator","Memento",
    "Observer","State","Strategy","Template Method","Visitor",
]
# topic keyword -> label
TOPICS = {
    "SRP": ["SRP","Single Responsibility"],
    "OCP": ["OCP","Open-Closed","Open/Closed"],
    "LSP": ["LSP","Liskov"],
    "ISP": ["ISP","Interface Segregation"],
    "DIP": ["DIP","Dependency Inversion"],
    "FIRST": ["FIRST principle"],
    "JUnit4 lifecycle": ["@Before","@After","@BeforeClass","@AfterClass","JUnit 4","JUnit4"],
    "JUnit5": ["@BeforeEach","@AfterEach","@BeforeAll","@AfterAll","@DisplayName","@ParameterizedTest","JUnit 5","JUnit5"],
    "Coverage": ["Statement Coverage","Branch Coverage","Path Coverage","code coverage"],
    "Boundary": ["boundary","Boundary"],
    "Equivalence": ["equivalence partition","Equivalence"],
    "Cyclomatic": ["cyclomatic","McCabe"],
    "Test doubles": ["mock","stub","fake","spy","test double"],
    "Test smells": ["test smell","not clean"],
    "Cardinality": ["cardinality","Cardinality"],
    "Error condition": ["error condition","Error condition","expected="],
    "Assertions": ["assertEquals","assertTrue","assertThrows","assertNull","assertion"],
}

def tag(q):
    blob = " ".join([
        q.get("questionText",""), q.get("explanation",""),
        q.get("codeSnippet") or "", json.dumps(q.get("correctAnswers")),
        json.dumps(q.get("options", q.get("dropZones", q.get("matchingOptions",[])))),
    ])
    found_pat = set()
    # pattern detection: count only when it's an actual answer or strongly referenced
    ans = json.dumps(q.get("correctAnswers"))
    for p in PATTERNS:
        # match pattern name, allow "Template"/"Chain"/"Factory" shorthands
        short = {"Template Method":"Template","Chain of Responsibility":"Chain","Factory Method":"Factory"}
        names = [p] + ([short[p]] if p in short else [])
        if any(re.search(r"\b"+re.escape(n), ans) for n in names):
            found_pat.add(p)
    found_top = set()
    for label, kws in TOPICS.items():
        if any(kw in blob for kw in kws):
            found_top.add(label)
    return found_pat, found_top

pat_count = Counter(); top_count = Counter(); type_count = Counter()
for q in qs:
    type_count[q["type"]] += 1
    fp, ft = tag(q)
    for p in fp: pat_count[p]+=1
    for t in ft: top_count[t]+=1

print(f"TOTAL QUESTIONS: {len(qs)}")
print("\nBY TYPE:")
for t,c in type_count.most_common(): print(f"  {t:20} {c}")
print("\nPATTERN COVERAGE (as correct answer):")
for p in PATTERNS:
    print(f"  {p:28} {pat_count.get(p,0)}")
print("\nTOPIC COVERAGE:")
for t in TOPICS:
    print(f"  {t:20} {top_count.get(t,0)}")
