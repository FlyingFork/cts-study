import type { Drill } from "@/lib/schema";

/**
 * The nine calculation drills examiners lean on (reference §3 + practice §C).
 * Each follows the worked → faded → independent ladder (learning_guide §3.2):
 *  • `task`   — a fully worked example, then a fresh "Now you try" problem.
 *  • `hints`  — the faded scaffold (revealed one at a time in the UI).
 *  • `solution` — the worked answer to the independent problem (reveal-able).
 *  • `rubric` — the goal + the *signature trap* this drill exists to train out.
 * Formulas render via KaTeX ($…$ / $$…$$). `[VOLATILE]` rates are flagged.
 */
export const managementDrills: Drill[] = [
  {
    id: "management-drill-vat",
    courseId: "management",
    topic: "calc-vat",
    title: "VAT from the final price",
    task: `**Worked example.** A laptop sells for **F = 3,902 lei** (VAT included, rate r = 21% [VOLATILE]). Find the VAT.

$$V = \\frac{F}{1+r}\\times r$$

Base $B = 3{,}902 / 1.21 = 3{,}224.79$ lei; VAT $V = 3{,}224.79 \\times 0.21 = 677.21$ lei.

**Now you try.** A product's final price is **2,178 lei**. What is the VAT value, and what is the base?`,
    hints: [
      "The 21% is charged on the *base*, not the final price. First strip the VAT: B = F / 1.21.",
      "Then VAT = base × 0.21 (equivalently V = F / 1.21 × 0.21).",
    ],
    solution: `$B = 2{,}178 / 1.21 = 1{,}800$ lei; $V = 1{,}800 \\times 0.21 = 378$ lei (or $2{,}178/1.21\\times 0.21 = 378$).

A clean whole-number base (1,800) is the tell-tale that you stripped the VAT correctly.`,
    rubric:
      "Goal: get V = 378 lei by computing VAT on the *base*, not the final price. Signature trap: 2,178 × 0.21 = 457.38 — charging VAT on the VAT-inclusive price.",
  },
  {
    id: "management-drill-salary",
    courseId: "management",
    topic: "calc-salary",
    title: "Net vs complete salary",
    task: `Three salary concepts, from **gross G** [VOLATILE]: **net** = what the employee keeps after CAS 25% + CASS 10% + income tax 10%; **complete** = gross + employer **CAM 2.25%** (total cost to the employer).

**Worked example (complete).** G = 5,770 lei → CAM = 5,770 × 0.0225 = 129.83 → complete = 5,770 + 129.83 ≈ **5,900 lei**.

**Now you try.** (a) Gross 6,200 lei — complete salary? (b) Gross 5,000 lei, personal deduction 0 — net salary?`,
    hints: [
      "Complete salary only adds the employer's CAM (2.25% of gross); it does not touch the employee deductions.",
      "For net: taxable base = gross − CAS (25%) − CASS (10%); income tax = 10% of that base; net = gross − CAS − CASS − tax.",
    ],
    solution: `(a) CAM = 6,200 × 0.0225 = 139.5 → complete = **6,339.5 lei**.

(b) CAS = 1,250; CASS = 500; taxable = 5,000 − 1,250 − 500 = 3,250; tax = 325; net = 5,000 − 1,250 − 500 − 325 = **2,925 lei**.`,
    rubric:
      "Goal: keep net and complete distinct and never drop the 2.25% CAM. Signature trap: reporting the net (~3,439 for a 5,770 gross) when asked for the complete salary, or omitting CAM entirely.",
  },
  {
    id: "management-drill-depreciation",
    courseId: "management",
    topic: "calc-depreciation",
    title: "Straight-line depreciation & the 2,500-RON threshold",
    task: `Straight-line: annual depreciation = entry value / useful life (years); monthly = annual / 12. **Fiscally, only assets with entry value ≥ 2,500 RON are depreciated** [VOLATILE] — below that, the item is a working-inventory expense booked in full in the purchase month.

**Worked example.** A 5,000-RON laptop, useful life 2 years → 5,000 / 2 = **2,500 RON/year** (≈ 208.33 RON/month).

**Now you try.** (a) A capital asset worth **9,000 RON**, useful life **3 years** — annual and monthly depreciation? (b) A **2,100-RON** laptop — how is it treated?`,
    hints: [
      "Check the 2,500-RON threshold first: at or above → depreciate; below → expense it all at once.",
      "Annual = value / years; monthly = annual / 12.",
    ],
    solution: `(a) 9,000 / 3 = **3,000 RON/year**; 3,000 / 12 = **250 RON/month** (≥ 2,500, so it must be depreciated).

(b) 2,100 RON < 2,500 → **working-inventory item**, expensed in full in the purchase month — *not* depreciated.`,
    rubric:
      "Goal: apply the threshold before computing. Signature trap: depreciating a sub-2,500-RON item that should be expensed at once.",
  },
  {
    id: "management-drill-cpm",
    courseId: "management",
    topic: "calc-cpm",
    title: "CPM activity duration",
    task: `The CPM activity duration (OCR-corrected formula — reference §7B):

$$d = \\frac{Q}{N_p \\times N_m \\times p_i}$$

where Q = work volume (hours), $N_p$ = daily production norm, $N_m$ = number of workers, $p_i$ = norm-fulfilment (decimal). Round up to whole days.

**Worked example.** Q = 100 h, $N_p$ = 8, $N_m$ = 3, $p_i$ = 0.69 → d = 100 / (8 × 3 × 0.69) = 100 / 16.56 = 6.04 ≈ **6 days**.

**Now you try.** Q = 240 h, daily norm 8 h, 2 workers, 75% norm fulfilment. Duration?`,
    hints: [
      "Multiply the whole denominator first: Np × Nm × pi.",
      "Then divide Q by that — and don't drop the norm-fulfilment factor (0.75).",
    ],
    solution: `denominator = 8 × 2 × 0.75 = 12; d = 240 / 12 = **20 days**.

(Forgetting the 0.75 gives 240 / 16 = 15 — the classic miss.)`,
    rubric:
      "Goal: divide by Np × Nm × pi, keeping the norm-fulfilment %. Signature trap: dropping pi (→ 15), or multiplying instead of dividing (giant numbers like 1,656).",
  },
  {
    id: "management-drill-pert",
    courseId: "management",
    topic: "calc-pert",
    title: "PERT estimate & standard deviation",
    task: `PERT weights the most-likely estimate four times:

$$t_e = \\frac{O + 4M + P}{6}, \\qquad \\sigma = \\frac{P - O}{6}$$

(O optimistic, M most likely, P pessimistic). Intervals: ±1σ → 68%, ±2σ → 95%, ±3σ → 99.7%.

**Worked example.** O = 4, M = 6, P = 14 → $t_e$ = (4 + 24 + 14)/6 = 42/6 = **7**; σ = (14 − 4)/6 = **1.67**.

**Now you try.** O = 6, M = 10, P = 20. Find $t_e$ and σ.`,
    hints: [
      "te uses 4×M — multiply the most-likely by 4 before adding O and P, then divide by 6.",
      "σ = (P − O)/6 uses only the two extremes.",
    ],
    solution: `$t_e$ = (6 + 4×10 + 20)/6 = (6 + 40 + 20)/6 = 66/6 = **11**; σ = (20 − 6)/6 = 14/6 ≈ **2.33**.

So ≈ 68% chance the activity finishes within 11 ± 2.33 days.`,
    rubric:
      "Goal: apply the ×4 weight on M and divide by 6. Signature trap: a plain average (6+10+20)/3 = 12, forgetting the 4M weighting.",
  },
  {
    id: "management-drill-npv",
    courseId: "management",
    topic: "calc-npv",
    title: "NPV undertake / decline decision",
    task: `Discount each cash-flow before summing:

$$NPV = \\sum_t F_t \\times \\frac{1}{(1 + R_r + R_i)^t}, \\qquad t = 0 \\ldots n$$

$R_r$ = required return, $R_i$ = inflation. **Undertake if NPV > 0.**

**Worked example.** Invest 100,000 at t0; $R_r$ = 10%, $R_i$ = 4% (discount base 1.14). Year flows 20,000 / 50,000 / 50,000 / 25,000 discount to 17,544 + 38,473 + 33,749 + 14,802 = 104,568 → NPV = −100,000 + 104,568 = **+4,568 > 0 → undertake**.

**Now you try.** Invest 10,000 at t0; $R_r$ = 10%, $R_i$ = 0%; cash-flows 6,000 in year 1 and 6,000 in year 2. Undertake?`,
    hints: [
      "With zero inflation the discount factor for year t is 1 / (1.10)^t.",
      "Sum the *discounted* flows, subtract the investment, then decide on the sign.",
    ],
    solution: `y1: 6,000 × (1/1.1) = 6,000 × 0.909 = 5,454; y2: 6,000 × (1/1.21) = 6,000 × 0.826 = 4,959. PV = 10,413; NPV = 10,413 − 10,000 = **+413 > 0 → undertake**.

(Summing undiscounted: 12,000 − 10,000 = 2,000 — wrong; it ignores the time value of money.)`,
    rubric:
      "Goal: discount every flow before summing, then check the sign. Signature trap: summing undiscounted cash-flows.",
  },
  {
    id: "management-drill-utility-electre",
    courseId: "management",
    topic: "calc-utility-electre",
    title: "Global utility & ELECTRE concordance",
    task: `**Global utility** of an alternative = Σ(U × K) (weights K sum to 1); best = highest. **Concordance** C(Ag, Ah) = Σ K over the criteria where **U(Ag) ≥ U(Ah)** (note: ≥, not strictly >).

**Worked example (past Q28).** With K = (0.12, 0.15, 0.30, 0.23, 0.20), V4 = 0.5·0.12 + 0.9·0.15 + 0.7·0.30 + 0.5·0.23 + 1·0.20 = **0.72** (the best). C(V1,V4): V1 ≥ V4 only on C2 (1 ≥ 0.9) and C4 (1 ≥ 0.5) → 0.15 + 0.23 = **0.38**.

**Now you try.** K = (0.5, 0.3, 0.2). Utilities — A1 (1, 0, 0.5), A2 (0.4, 1, 0), A3 (0, 0.6, 1). Find the best alternative by global utility, and C(A1, A2).`,
    hints: [
      "Global utility = sum of (utility × weight) across the three criteria, for each alternative.",
      "For C(A1,A2), add the weights of only the criteria where A1's utility is ≥ A2's (≥ includes ties).",
    ],
    solution: `A1 = 0.5 + 0 + 0.10 = **0.60**; A2 = 0.20 + 0.30 + 0 = 0.50; A3 = 0 + 0.18 + 0.20 = 0.38 → **best = A1**.

C(A1,A2): A1 ≥ A2 on C1 (1 ≥ 0.4 ✓, 0.5) and C3 (0.5 ≥ 0 ✓, 0.2); not on C2 (0 ≥ 1 ✗). Sum = **0.70**.`,
    rubric:
      "Goal: weighted sum for utility; weight-sum over the ≥ criteria for concordance. Signature trap: using strict > instead of ≥ in concordance, or slipping a weight.",
  },
  {
    id: "management-drill-toc",
    courseId: "management",
    topic: "calc-toc",
    title: "Theory of Constraints product mix",
    task: `At a bottleneck, prioritise by **output per bottleneck-minute**, not per-unit margin. For each product: margin = price − variable (material) cost; rank by margin ÷ minutes-on-the-bottleneck.

**Worked example.** Machine B is the bottleneck. Product P: margin 45\\$, 15 min → 45/15 = **3\\$/min**. Product Q: margin 60\\$, 30 min → 60/30 = **2\\$/min**. Prioritise **P** even though Q's per-unit margin is higher.

**Now you try.** Machine M is the bottleneck. Product X: price 80\\$, materials 30\\$, 10 min on M. Product Y: price 120\\$, materials 30\\$, 20 min on M. Which to prioritise?`,
    hints: [
      "Margin = price − materials, for each product.",
      "Divide each margin by its minutes on the bottleneck machine, then compare per-minute.",
    ],
    solution: `X margin = 80 − 30 = 50\\$ over 10 min → **5\\$/min**. Y margin = 120 − 30 = 90\\$ over 20 min → **4.5\\$/min** → prioritise **X**.

Y's bigger per-unit margin (90\\$) is the lure; per scarce bottleneck-minute, X wins.`,
    rubric:
      "Goal: rank by margin per bottleneck-minute. Signature trap: choosing the product with the higher per-unit margin (Y) instead of the higher per-minute output (X).",
  },
  {
    id: "management-drill-sme",
    courseId: "management",
    topic: "calc-sme",
    title: "SME classification (the OR rule)",
    task: `SME bands [VOLATILE] — the employee cap is **mandatory (AND)**; the financial test is **turnover OR assets** (either suffices):

| Category | Employees | Turnover | OR Assets |
|---|---|---|---|
| Medium | < 250 | ≤ €50M | ≤ €43M |
| Small | < 50 | ≤ €10M | ≤ €43M |
| Micro | < 10 | ≤ €2M | ≤ €2M |

**Worked example.** 8 employees, turnover €3M, assets €1.5M → employees < 10 (micro band); financial: turnover €3M > €2M, **but** assets €1.5M ≤ €2M → OR satisfied → **micro**.

**Now you try.** A firm has **45 employees**, turnover **€12M**, total assets **€5M**. What category?`,
    hints: [
      "Place it by employee count first (the employee cap is the mandatory threshold).",
      "Then check turnover OR assets for that band — only one of the two needs to hold.",
    ],
    solution: `45 < 50 → small band. Small financial test: ≤ €10M turnover **OR** ≤ €43M assets. Turnover €12M > €10M, **but** assets €5M ≤ €43M → the OR holds → **small enterprise**.`,
    rubric:
      "Goal: employee cap is AND; turnover/assets is OR (one suffices). Signature trap: requiring turnover AND assets — declaring this firm 'not small' because turnover > €10M.",
  },
];
