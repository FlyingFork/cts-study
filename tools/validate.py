"""Validate a questions file or a batch array against the seed schema rules.

Usage:
  python tools/validate.py <file.json> [<file2.json> ...]

Accepts either a full dataset object ({"schema":..., "questions":[...]}) or a
bare array of question objects. When multiple files are passed, they are all
loaded together and cross-checked for duplicate ids / duplicate questionText.
"""
import json, sys, re

def load(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        return data["questions"]
    return data

def norm_text(t):
    t = t.lower()
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def validate(questions):
    errors = []
    ids = {}
    texts = {}
    for i, q in enumerate(questions):
        qid = q.get("id", f"<index {i}>")
        def err(msg): errors.append(f"[{qid}] {msg}")

        # id
        if "id" not in q:
            err("missing id")
        elif not re.fullmatch(r"q\d+", q["id"]):
            err(f"id not in qN form: {q['id']}")
        else:
            if q["id"] in ids:
                err(f"duplicate id (also at {ids[q['id']]})")
            ids[q["id"]] = qid

        qtype = q.get("type")
        if qtype not in ("multiple_choice", "drag_and_drop", "dropdown_matching"):
            err(f"bad/missing type: {qtype}")

        for k in ("questionText", "explanation"):
            if not q.get(k):
                err(f"missing/empty {k}")
        if qtype == "multiple_choice" and "codeSnippet" not in q:
            err("multiple_choice missing codeSnippet key (may be null)")

        # duplicate text (include type-specific body so distinct snippets/entities don't false-positive)
        qt = q.get("questionText", "")
        body = (q.get("codeSnippet") or "") + " " + (q.get("snippetWithDropZones") or "") \
            + " " + " ".join(sorted(q.get("matchingEntities", []))) \
            + " " + " ".join(sorted(q.get("matchingOptions", [])))
        nt = norm_text(qt + " " + body)
        if nt in texts:
            err(f"duplicate/near-duplicate questionText (also at {texts[nt]})")
        texts[nt] = qid

        ca = q.get("correctAnswers")
        if qtype == "multiple_choice":
            opts = q.get("options")
            if not isinstance(opts, list) or not opts:
                err("multiple_choice missing options list")
                opts = []
            if len(opts) != len(set(opts)):
                err("duplicate strings in options")
            if not isinstance(ca, list):
                err("multiple_choice correctAnswers must be a list")
                ca = []
            ims = q.get("isMultiSelect")
            if ims not in (True, False):
                err("isMultiSelect must be boolean")
            if ims is False and len(ca) != 1:
                err(f"isMultiSelect false but {len(ca)} correctAnswers")
            if ims is True and len(ca) < 2:
                err(f"isMultiSelect true but only {len(ca)} correctAnswers")
            for a in ca:
                if a not in opts:
                    err(f"correctAnswer not in options (char-exact): {a!r}")
            if len(ca) != len(set(ca)):
                err("duplicate entries in correctAnswers")

        elif qtype == "drag_and_drop":
            snip = q.get("snippetWithDropZones", "")
            dz = q.get("dropZones")
            if not snip:
                err("missing snippetWithDropZones")
            if not isinstance(dz, dict) or not dz:
                err("missing dropZones object")
                dz = {}
            if not isinstance(ca, dict):
                err("drag_and_drop correctAnswers must be object")
                ca = {}
            zones_in_snip = set(re.findall(r"\[\[(ZONE_\d+)\]\]", snip))
            if zones_in_snip != set(dz.keys()):
                err(f"zone mismatch: snippet {sorted(zones_in_snip)} vs dropZones {sorted(dz.keys())}")
            if set(ca.keys()) != set(dz.keys()):
                err(f"correctAnswers keys {sorted(ca.keys())} != dropZones keys {sorted(dz.keys())}")
            for z, choices in dz.items():
                if not isinstance(choices, list) or len(choices) < 2:
                    err(f"{z}: need >=2 choices (distractors)")
                if len(choices) != len(set(choices)):
                    err(f"{z}: duplicate choices")
                if z in ca and ca[z] not in choices:
                    err(f"{z}: correctAnswer {ca[z]!r} not in dropZones choices")

        elif qtype == "dropdown_matching":
            ents = q.get("matchingEntities")
            mopts = q.get("matchingOptions")
            if not isinstance(ents, list) or len(ents) < 2:
                err("matchingEntities needs >=2")
                ents = []
            if not isinstance(mopts, list) or len(mopts) < 2:
                err("matchingOptions needs >=2")
                mopts = []
            if len(set(ents)) != len(ents):
                err("duplicate matchingEntities")
            if len(set(mopts)) != len(mopts):
                err("duplicate matchingOptions")
            if not isinstance(ca, dict):
                err("dropdown_matching correctAnswers must be object")
                ca = {}
            if set(ca.keys()) != set(ents):
                err(f"correctAnswers keys != matchingEntities")
            for e, v in ca.items():
                if v not in mopts:
                    err(f"match for {e!r} -> {v!r} not in matchingOptions")
    return errors, ids

def main():
    paths = sys.argv[1:]
    if not paths:
        print("usage: validate.py <file.json> ..."); sys.exit(2)
    allq = []
    for p in paths:
        allq.extend(load(p))
    errors, ids = validate(allq)
    print(f"Loaded {len(allq)} questions from {len(paths)} file(s); {len(ids)} unique ids.")
    if errors:
        print(f"\n*** {len(errors)} VALIDATION ERRORS ***")
        for e in errors[:200]:
            print("  " + e)
        sys.exit(1)
    print("VALIDATION PASSED — clean.")

if __name__ == "__main__":
    main()
