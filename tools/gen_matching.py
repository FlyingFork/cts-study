"""dropdown_matching generators. Each question is a bijection (entity -> option),
matching the seed q13 style. Distinct entity subsets keep questions unique."""
import random
from genlib import (matching, PATTERNS, CHARACTERISTIC, SOLID_FULL, SOLID_VIOLATION,
                    JUNIT4, JUNIT5, JUNIT4_TO_5, COVERAGE_DEFS, TEST_DOUBLES,
                    TEST_CONCEPTS, FIRST)


def sample_subsets(keys, group, n, seed):
    rng = random.Random(seed)
    keys = list(keys)
    seen, out, attempts = set(), [], 0
    while len(out) < n and attempts < n * 200:
        attempts += 1
        g = group if isinstance(group, int) else rng.choice(group)
        if g > len(keys):
            continue
        sub = tuple(sorted(rng.sample(keys, g)))
        if sub in seen:
            continue
        seen.add(sub)
        out.append(list(sub))
    return out


def build():
    qs = []

    # 1) pattern -> intent
    intent = {p: PATTERNS[p][1] for p in PATTERNS}
    templates = [
        "Match each design pattern to the intent that best describes it.",
        "Group the following design patterns with their defining intent.",
        "For each design pattern below, select the statement that captures its purpose.",
        "Associate every design pattern with the goal it is meant to achieve.",
    ]
    for i, sub in enumerate(sample_subsets(intent.keys(), [4, 5, 5, 6], 34, 101)):
        m = {k: intent[k] for k in sub}
        qs.append(matching(templates[i % len(templates)], m,
                           "Each pattern's intent is its textbook one-line purpose.",
                           tags=sub))

    # 2) pattern -> defining characteristic (different phrasing)
    char_keys = list(CHARACTERISTIC.keys())
    ctempl = [
        "Match each design pattern to the structural/behavioral trait that identifies it.",
        "Group the following design patterns with their telltale implementation characteristic.",
        "For each pattern, pick the characteristic you would use to recognize it in code.",
    ]
    for i, sub in enumerate(sample_subsets(char_keys, [4, 5, 6], 22, 202)):
        m = {k: CHARACTERISTIC[k] for k in sub}
        qs.append(matching(ctempl[i % len(ctempl)], m,
                           "Each option is the recognizable hallmark of that pattern.",
                           tags=sub))

    # 3) SOLID -> definition
    for i, sub in enumerate([list(SOLID_FULL)] + sample_subsets(SOLID_FULL.keys(), [3, 4], 4, 303)):
        m = {k: SOLID_FULL[k] for k in sub}
        qs.append(matching("Match each SOLID principle to its definition.", m,
                           "Standard SOLID definitions.", tags=["SOLID"]))

    # 4) SOLID -> violation example
    sv_keys = list(SOLID_VIOLATION.keys())
    for i, sub in enumerate([sv_keys] + sample_subsets(sv_keys, [3, 4], 4, 404)):
        m = {k: SOLID_VIOLATION[k] for k in sub}
        qs.append(matching("Match each SOLID principle to a code situation that violates it.", m,
                           "Each scenario is a textbook violation of the matched principle.",
                           tags=["SOLID"]))

    # 5) JUnit4 annotation -> purpose
    for i, sub in enumerate(sample_subsets(JUNIT4.keys(), [4, 5, 6], 12, 505)):
        m = {k: JUNIT4[k] for k in sub}
        qs.append(matching("Match each JUnit 4 annotation to what it does.", m,
                           "JUnit 4 lifecycle/behavior annotations.", tags=["JUnit4 lifecycle"]))

    # 6) JUnit5 annotation -> purpose
    for i, sub in enumerate(sample_subsets(JUNIT5.keys(), [4, 5, 6], 12, 606)):
        m = {k: JUNIT5[k] for k in sub}
        qs.append(matching("Match each JUnit 5 annotation to what it does.", m,
                           "JUnit 5 lifecycle/behavior annotations.", tags=["JUnit5"]))

    # 7) JUnit4 -> JUnit5 equivalent
    j_keys = list(JUNIT4_TO_5.keys())
    for i, sub in enumerate([j_keys] + sample_subsets(j_keys, [3, 4], 4, 707)):
        m = {k: JUNIT4_TO_5[k] for k in sub}
        qs.append(matching("Match each JUnit 4 annotation to its JUnit 5 equivalent.", m,
                           "JUnit 5 renamed the lifecycle annotations.",
                           tags=["JUnit5", "JUnit4 lifecycle"]))

    # 8) coverage type -> definition
    c_keys = list(COVERAGE_DEFS.keys())
    for i, sub in enumerate([c_keys] + sample_subsets(c_keys, [3, 4], 5, 808)):
        m = {k: COVERAGE_DEFS[k] for k in sub}
        qs.append(matching("Match each code-coverage metric to its definition.", m,
                           "Standard coverage metric definitions.", tags=["Coverage"]))

    # 9) test double -> definition
    d_keys = list(TEST_DOUBLES.keys())
    for i, sub in enumerate([d_keys] + sample_subsets(d_keys, [3, 4], 5, 909)):
        m = {k: TEST_DOUBLES[k] for k in sub}
        qs.append(matching("Match each kind of test double to its definition.", m,
                           "The five Meszaros test-double categories.", tags=["Test doubles"]))

    # 10) testing concept -> definition
    t_keys = list(TEST_CONCEPTS.keys())
    for i, sub in enumerate([t_keys] + sample_subsets(t_keys, [3, 4, 5], 7, 1010)):
        m = {k: TEST_CONCEPTS[k] for k in sub}
        qs.append(matching("Match each testing technique to its description.", m,
                           "Core black-box / white-box testing techniques.",
                           tags=["Boundary", "Equivalence", "Cyclomatic", "Cardinality"]))

    # 11) FIRST letter -> meaning
    f_keys = list(FIRST.keys())
    for i, sub in enumerate([f_keys] + sample_subsets(f_keys, [3, 4], 4, 1111)):
        m = {k: FIRST[k] for k in sub}
        qs.append(matching("Match each FIRST unit-testing principle to its meaning.", m,
                           "FIRST = Fast, Independent, Repeatable, Self-validating, Timely.",
                           tags=["FIRST"]))

    return qs


if __name__ == "__main__":
    print(len(build()))
