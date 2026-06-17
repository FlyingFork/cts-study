"""Assemble all generated questions, assign sequential ids from q37, write
per-batch files (~48 each) plus a combined generated.json (keeps _tags)."""
import json, os
import gen_matching, gen_dnd, gen_mc, gen_supplement

OUT = os.path.dirname(__file__)
ROOT = os.path.dirname(OUT)

def main():
    sup = gen_supplement.build()
    sup_mc = [q for q in sup if q["type"] == "multiple_choice"]
    sup_dnd = [q for q in sup if q["type"] == "drag_and_drop"]
    mc = gen_mc.build() + sup_mc
    dnd = gen_dnd.build() + sup_dnd
    matching = gen_matching.build()
    print(f"raw: mc={len(mc)} dnd={len(dnd)} matching={len(matching)} (supplement={len(sup)})")

    # Round-robin interleave so batches mix all three formats.
    pools = [mc, dnd, matching]
    interleaved = []
    i = 0
    while any(i < len(p) for p in pools):
        for p in pools:
            if i < len(p):
                interleaved.append(p[i])
        i += 1

    # assign ids from q37
    for n, q in enumerate(interleaved, start=37):
        q["id"] = f"q{n}"
    # put id first for readability
    ordered = []
    for q in interleaved:
        ordered.append({"id": q.pop("id"), **q})

    # write combined
    with open(os.path.join(ROOT, "generated.json"), "w", encoding="utf-8") as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)

    # write per-batch files of 48
    batch_dir = os.path.join(OUT, "batches")
    os.makedirs(batch_dir, exist_ok=True)
    for old in os.listdir(batch_dir):
        os.remove(os.path.join(batch_dir, old))
    size = 48
    for bi in range(0, len(ordered), size):
        chunk = ordered[bi:bi + size]
        bn = bi // size + 1
        with open(os.path.join(batch_dir, f"batch_{bn:02d}.json"), "w", encoding="utf-8") as f:
            json.dump(chunk, f, ensure_ascii=False, indent=2)
    print(f"total generated: {len(ordered)} ids q37..q{36+len(ordered)}; "
          f"{(len(ordered)+size-1)//size} batch files")

if __name__ == "__main__":
    main()
