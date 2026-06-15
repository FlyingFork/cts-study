import type { Module } from "@/lib/schema";

/**
 * LU1–LU7 converted into 7 modules of lessons (reference §2, English-only).
 * Must-know definitions/lists/formulas are `callout tone:"key"`; the mnemonics
 * from learning_guide §4 are `callout tone:"tip"`.
 *
 * `priority` is set honestly for a 2-day crunch to a 6/10 pass (study target 7):
 *   1 = high-yield lists + the 9 calc skills + most-tested definitions
 *   2 = remaining definitions / classifications
 *   3 = deeper theory / history (skip first if time is short)
 */
export const managementModules: Module[] = [
  // ===== LU1 — Theoretical Foundations ====================================
  {
    id: "management-mod-1",
    title: "LU1 — Theoretical Foundations of Management",
    order: 1,
    lessons: [
      {
        id: "management-les-1-1",
        title: "The five meanings of management & the process",
        summary:
          "What “management” denotes (its five meanings) and what the management process is — the most-tested LU1 definitions.",
        estMinutes: 10,
        topicTags: ["foundations"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "The word **management** stays an English term because its scope can't be fully translated; whatever the definition, it primarily means the **coordination of other people**.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "The five meanings of management",
            md: "**Science** — the study of management processes in organizations *of any kind*, to discover/perfect concepts, methods, techniques.\n\n**Art** — using the manager's personal qualities (intuition, talent, experience).\n\n**Discipline of study** — the body of knowledge transmitted via the educational system.\n\n**Practical activity** — carrying out the management process: allocating & using resources so objectives are met under **effectiveness and efficiency**.\n\n**Decision center** — the individual or group exercising the management functions (e.g. a Board of Directors).",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonic — SAD-PD",
            md: "**S**cience · **A**rt · **D**iscipline · **P**ractical activity · **D**ecision center.",
          },
          {
            kind: "markdown",
            md: "Two categories of work process: **execution processes** (staff turn objectives into products/services) and **management processes** (some staff direct the rest toward objectives).\n\nThe **management process** = all the activities a manager carries out: planning objectives/resources/means, organizing, coordinating, commanding, controlling. It has three traits versus execution — **continuity, cyclicity** (control ends one cycle and starts the next), and **efficiency** — and three phases: **planning** (→ strategic management), **operative** (→ operational management), **postoperative** (assess, compare, correct).",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Exam traps",
            md: "“Management as a **science**” = study of processes in organizations **of any nature** — distractors narrow it to “economic” or “companies” (Q9). Match each meaning to its exact wording (Q6): *decision center* = a group of people, not an activity.",
          },
        ],
      },
      {
        id: "management-les-1-2",
        title: "The four schools of management",
        summary:
          "The classical, human-relations, quantitative and systemic schools — background theory. Lower yield: learn the representatives, skim the rest.",
        estMinutes: 8,
        topicTags: ["foundations"],
        priority: 3,
        blocks: [
          {
            kind: "markdown",
            md: "Schools are grouped by their principles and the functions they emphasize. **None appears 100% in practice today** — we keep the useful ideas from each.",
          },
          {
            kind: "markdown",
            md: "**1. Classical (technical, universalist)** — early 20th c. Reps: **Taylor, Fayol, the Gilbreths, Gantt, Ford**. Founded management as a science; focus on the **organizing** function; universal principles. Limit: treats the human factor as an instrument.\n\n**2. Human relations (behaviorist)** — 1920s–30s. Reps: **Mayo, McGregor, Maslow, Likert, Argyris**. Motivation, group dynamics, employees as resources. Limit: human conduct is unpredictable.\n\n**3. Quantitative** — post-WWII. Reps: **Kaufmann, Deming, Juran**. Math/stat/OR tools for better-substantiated decisions. Limit: over-simplifies to fit the math.\n\n**4. Systemic** — from the 1960s. Reps: **Drucker, Simon, Ansoff, Mintzberg, Porter, Goldratt**. The organization as an integrated system interacting with its environment.",
          },
        ],
      },
      {
        id: "management-les-1-3",
        title: "The five functions, managers & the environment",
        summary:
          "Fayol's five management functions (high-yield), the three manager levels, and the organization's environment.",
        estMinutes: 12,
        topicTags: ["foundations"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "The five management functions (Fayol, in order)",
            md: "**Planning** — set objectives, resources, means (outputs: prognoses, plans, strategies, policies).\n\n**Organizing** — determine the work processes needed and assign them to organizational components (divisions, departments, offices, workplaces).\n\n**Coordinating** — harmonize staff decisions & actions; its support is **communication**.\n\n**Commanding** — drive staff toward objectives; its basis is **motivation**.\n\n**Controlling** — measure results, compare to objectives, find deviations, correct.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonics",
            md: "Functions: **“Plan, Organize, then the 3 C's”** (Coordinate, Command, Control).\n\nControlling has **four stages**: (1) assess results → (2) compare to objectives → (3) determine deviations → (4) corrective measures.",
          },
          {
            kind: "markdown",
            md: "A **manager** is an individual who exercises the management functions based on **formal authority** invested upon them. Three levels: **low** (the only managers who don't subordinate other managers), **middle** (subordinate low, report to top), **top** (set philosophy & ethics, strategic planning, whole-org decisions). Mintzberg's **10 roles** fall in 3 categories: informational, interpersonal, decisional.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Organization, company & environment",
            md: "**Organization** = ≥ 2 people for a common goal. **Company (enterprise)** = ≥ 2 people selling products/services/works **for profit**.\n\n**Environment** — **external**: macro (indirect — technological, socio-cultural, economic, political, legal, natural) + micro (direct — clients, competitors, suppliers, labor market); **internal**: owners, managers, employees, organizational culture.",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "The “teacher as manager” trap (Q31)",
            md: "A manager exercises **all five** functions based on **formal authority**. A teacher who doesn't exercise the full set toward students is therefore not their manager — the definition-aligned answer.",
          },
        ],
      },
    ],
  },

  // ===== LU2 — The Management Decision =====================================
  {
    id: "management-mod-2",
    title: "LU2 — The Management Decision",
    order: 2,
    lessons: [
      {
        id: "management-les-2-1",
        title: "The decision: factors, requirements & classifications",
        summary:
          "The decision definition (verbatim), its two primary factors, the six requirements, the eight classification criteria, and the eight steps.",
        estMinutes: 12,
        topicTags: ["decision"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "The management decision",
            md: "A **rational process of choosing an alternative from a series of possible ones**, this choice **influencing the actions of at least one other person** in the organization, to reach **one or several objectives** under **maximum efficiency**.\n\nIt always involves ≥ 2 people — the **manager** (decides) and an **executant** (implements). Two forms: a **decisional act** (simple) and a **decisional process** (complex).",
          },
          {
            kind: "markdown",
            md: "**Two primary factors:** the **decision-maker** and **the environment** (the org's internal *and* external factors). Watch the trap: “internal environment” alone is not the factor.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Requirements for an efficient decision",
            md: "**Scientifically founded** (use scientific methods, consider economic laws, use data-processing properly, and **eliminate routine, subjectivism, improvisation**) · adopted by **legally empowered** persons · **clear & concise** · **correlated** with previous/future decisions · **opportune** (taken in the optimal timeframe) · **efficient**.\n\nNOT a requirement: “aligned with organizational culture values” (Q8 intruder).",
          },
          {
            kind: "markdown",
            md: "**Eight classification criteria:** time horizon (strategic/tactical/operational) · environment knowledge (certainty/risk/uncertainty) · management level · scope (group/individual) · frequency · anticipation · competence (integral/approved) · number of criteria (uni-/multi-criterial).\n\n**Eight decision steps:** identify the problem → identify criteria → weight criteria → define alternatives → analyze/compare → select the best → implement → assess effectiveness.",
          },
        ],
      },
      {
        id: "management-les-2-2",
        title: "Decision methods by environment",
        summary:
          "Which method fits certainty, risk and uncertainty — global utility & ELECTRE, mathematical expectancy, the five uncertainty rules, and the Theory of Constraints.",
        estMinutes: 12,
        topicTags: ["decision", "calc-utility-electre", "calc-toc"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Method ↔ environment",
            md: "**Certainty (multi-criteria):** **Global Utility** and **ELECTRE** (concordance/discordance, thresholds p & q).\n\n**Risk:** probability theory and the **decision tree** → criterion = **mathematical expectancy** ME = Σ(pⱼ × aᵢⱼ).\n\n**Uncertainty:** five rules — **Pessimistic (Wald), Optimistic, Hurwicz (α), Laplace, Savage (minimax regret)**.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonic — POHLS",
            md: "The five uncertainty rules: **P**essimistic · **O**ptimistic · **H**urwicz · **L**aplace · **S**avage.",
          },
          {
            kind: "markdown",
            md: "**Global utility** of an alternative = Σ(U × K), the weighted average of its per-criterion utilities (weights K sum to 1; best alternative on a criterion = 1, worst = 0). The best alternative has the highest global utility.\n\n**ELECTRE concordance** C(Ag, Ah) = Σ K over the criteria where **U(Ag) ≥ U(Ah)** — note the **≥**, not strictly greater. Ag beats Ah if C ≥ p (acceptability) and discordance ≤ q (max risk).",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Theory of Constraints (Goldratt)",
            md: "Five steps: **identify** the bottleneck → **exploit** it → **subordinate** everything else → **elevate** it → **repeat**. When choosing a product mix, prioritise the product with the highest **output per bottleneck-minute** (margin ÷ minutes), *not* the highest per-unit margin.",
          },
          {
            kind: "markdown",
            md: "These are the exam's calculation favourites — practice them in the **Drills** tab: global utility/ELECTRE and the Theory of Constraints product mix.",
          },
        ],
      },
    ],
  },

  // ===== LU3 — Strategic Management ========================================
  {
    id: "management-mod-3",
    title: "LU3 — The Organization's Strategic Management",
    order: 3,
    lessons: [
      {
        id: "management-les-3-1",
        title: "Strategy & its seven components",
        summary:
          "The strategy definition and its seven components (high-yield, exact list), ending in the competitive advantage.",
        estMinutes: 11,
        topicTags: ["strategy"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "The organization's strategy",
            md: "The totality of actions to set the main **long-run objectives**, the means to achieve them, the **allocation of resources**, the priorities, and the means to adapt to the environment — all to obtain the **competitive advantage** and fulfil the mission.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "The seven components (in order)",
            md: "**Vision** → **Mission** → **Strategic objectives** → **Strategic means of action** → **Resources** → **Deadlines** → **Competitive advantage**.\n\nVision = *where* the org must go. Mission = adds the *source of competitive advantage* (why customers prefer us). Competitive advantage (per **Porter**) is either **lower cost** or **differentiation**.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonic",
            md: "**“Very Many Old Managers Really Dislike Competition”** → Vision, Mission, Objectives, Means, Resources, Deadlines, Competitive advantage.",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Exam trap (Q14)",
            md: "Distractors insert **organizational structure / hierarchical level / hierarchy** into the list, or drop **vision** or **mission**. The list has exactly the seven above — no more, no fewer.",
          },
        ],
      },
      {
        id: "management-les-3-2",
        title: "Analysis tools: SWOT, Porter & KSF",
        summary:
          "Competitive- and internal-environment analysis: SWOT quadrants, Porter's five forces, entry barriers, key success factors and the SAS.",
        estMinutes: 11,
        topicTags: ["strategy"],
        priority: 2,
        blocks: [
          {
            kind: "markdown",
            md: "**Opportunities/threats** are external & largely uncontrollable; **strengths/weaknesses** are internal & controllable (held at a superior/inferior level vs competitors). So an external factor like *“changes in consumer preferences”* is an **opportunity or a threat**, never a strength/weakness.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "SWOT quadrant strategies",
            md: "**SO** (strengths + opportunities) → grow/develop. **WO** → seize opportunities to fix weaknesses. **ST** → build barriers with strengths. **WT** → give up the non-performing segment (exit).\n\n**Always start with the external environment** — a trait is a strength or weakness only relative to environmental requirements.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Porter's five forces & entry barriers",
            md: "**Five forces:** rivalry · threat of new entrants · substitutes · customer bargaining power · supplier bargaining power.\n\n**Six entry barriers:** transfer costs · experience effect · access to distribution networks · production-capacity reserves · capital need · government policy.",
          },
          {
            kind: "markdown",
            md: "**Key Success Factors (KSF)** = the elements based on which an organization engages in competitive struggle (competences/assets giving competitive advantage). A **Strategic Activity Segment (SAS)** = product lines with the same technology, resources, competition, market and KSF. (Don't confuse KSF with *opportunities* or *the environment* — Q22.)",
          },
        ],
      },
    ],
  },

  // ===== LU4 — The Management System =======================================
  {
    id: "management-mod-4",
    title: "LU4 — The Management System",
    order: 4,
    lessons: [
      {
        id: "management-les-4-1",
        title: "Structural organization",
        summary:
          "The management system's subsystems, structural organization, compartments, the job, span of control, relations and the organizational chart.",
        estMinutes: 12,
        topicTags: ["mgmt-system"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "The **management system** = the methods, techniques and procedures through which the management functions are carried out. **Four subsystems:** decision-making · informational · organizational · methodological.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Core structural concepts",
            md: "**Compartment** = several workstations under one management position; **functional** (support core activities — Quality, Financial) vs **operational** (directly achieve the purpose — production).\n\n**Job** = the **primary entity** of structural organization, holding **objectives, tasks, authority, responsibilities**.\n\n**Span of control** = the number of jobs **directly subordinated** to a manager — recommended **5–10**.\n\n**Hierarchical level** = entities at the same distance from the top (tall vs flat structures).",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Organizational relations (3 types)",
            md: "**Authority** (hierarchical / functional / matrix) · **Cooperation** (same level) · **Control** (e.g. Audit vs others). The **organizational chart** is the main document formalizing **structural** organization.",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Watch the neighbours",
            md: "Span of control ↔ hierarchical level ↔ compartment ↔ job are defined by *swapping* each other's wording in distractors (Q15, Q20, Q21). Anchor on “**directly** subordinated” for span.",
          },
        ],
      },
      {
        id: "management-les-4-2",
        title: "Processual organization, SMART & objectives",
        summary:
          "Process-based organization, the procedure document, SMART objectives, and the five-level system of objectives (where strategic objectives = fundamental).",
        estMinutes: 12,
        topicTags: ["mgmt-system"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "**Process-based (processual) organization** = establishing & designing the processes needed for the objectives. Its starting point is the **system of objectives**. The **procedure** is the main document formalizing processual organization (contrast: the **organizational chart** formalizes *structural* organization — Q13).",
          },
          {
            kind: "callout",
            tone: "key",
            title: "The system of objectives (5 levels, top → bottom)",
            md: "**Fundamental** (strategic importance, 2–5 yrs) → **Main 1st-degree** → **Main 2nd-degree** → **Specific** (operational; short periods — days/weeks/months) → **Individual** (per employee).\n\n**Strategic objectives appear here as fundamental objectives** (Q5). A long-term, whole-org goal like “increase net profit by 10% next year” is **fundamental**, not specific (Q30).",
          },
          {
            kind: "callout",
            tone: "key",
            title: "SMART",
            md: "**S**pecific · **M**easurable · **A**chievable · **R**elevant · **T**ime-bound. SMART objectives often become performance indicators (KPIs): **efficiency** = effect/effort; **effectiveness** = achieved/expected.",
          },
        ],
      },
    ],
  },

  // ===== LU5 — Project Management ==========================================
  {
    id: "management-mod-5",
    title: "LU5 — Project Management",
    order: 5,
    lessons: [
      {
        id: "management-les-5-1",
        title: "Projects: definition, characteristics & life cycle",
        summary:
          "The PMI definition, the four characteristics, the five life-cycle stages, the success criteria, and project components.",
        estMinutes: 10,
        topicTags: ["projects"],
        priority: 2,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Project (PMI) & its characteristics",
            md: "A **project** = a **temporary effort** to create a **product, service or unique result**.\n\n**Four characteristics:** well-defined time frame · clearly defined objectives (the key prerequisite) · a sum of allocated resources · uniqueness.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Life cycle & success criteria",
            md: "**Five stages:** Conception → Planning → Execution → Control → Termination.\n\n**Success criteria (triple constraint):** **time · budget · quality**. (On the past exam only *time* appears among the options — Q3.)",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonic",
            md: "Life cycle: **“Can People Execute Cool Tasks?”** → Conception, Planning, Execution, Control, Termination.",
          },
          {
            kind: "markdown",
            md: "Components: an **activity/task** consumes time + resources; a **fictional (dummy) activity** consumes neither but conditions the start of successors; a **phase/event** marks a start/end and consumes nothing. A **program** = related projects managed together; a **portfolio** = projects run at the same time.",
          },
        ],
      },
      {
        id: "management-les-5-2",
        title: "Planning methods: WBS, Gantt, CPM/PERT, NPV",
        summary:
          "Work breakdown structure, Gantt, the network methods CPM & PERT, the critical path, and financial selection with NPV/IRR.",
        estMinutes: 13,
        topicTags: ["projects", "calc-cpm", "calc-pert", "calc-npv"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "WBS & Gantt",
            md: "**WBS** = deliverable-oriented decomposition; items not in it are out of scope. Rules: the **100% rule**, outcomes not actions, the **8/80 rule** (a work package = 8–80 hours), ~3 levels. The lowest-level items are **work packages**.\n\n**Gantt chart** (Henry Gantt) = bars on a time axis — easy to read, weak for many-task projects.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "CPM vs PERT & the critical path",
            md: "**CPM** = **deterministic** single durations (focus on time reserves). **PERT** = **probabilistic** three-estimate durations.\n\nThe **critical path** = the **longest** path = the shortest possible project duration. **Slack = LF − EF = LS − ES**; **slack = 0 ⇒ a critical activity**.",
          },
          {
            kind: "math",
            tex: "d = \\frac{Q}{N_p \\times N_m \\times p_i} \\qquad t_e = \\frac{O + 4M + P}{6} \\qquad \\sigma = \\frac{P - O}{6}",
            display: true,
          },
          {
            kind: "markdown",
            md: "**Project selection** mixes numerical methods (payback, **NPV**, IRR, checklist) and non-numerical ones (*“sacred cow”*, operational/competitive necessity). **Financial rule: undertake if NPV > 0**; IRR is the rate that makes NPV = 0. Practise CPM duration, PERT and NPV in the **Drills** tab.",
          },
        ],
      },
    ],
  },

  // ===== LU6 — Human Resources Management ==================================
  {
    id: "management-mod-6",
    title: "LU6 — Human Resources Management",
    order: 6,
    lessons: [
      {
        id: "management-les-6-1",
        title: "Recruitment, selection & evaluation",
        summary:
          "Recruitment vs selection (a classic distractor pair), the interview as the most common method, and the evaluation sheet's halo-effect flaw.",
        estMinutes: 9,
        topicTags: ["hr"],
        priority: 2,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Recruitment vs selection",
            md: "**Recruitment** = identifying qualified-candidate sources and convincing them to apply for **new or vacant** jobs. **Selection** = choosing the individuals who best meet the job requirements — it comes *after* recruitment. (Pre-selection is neither — Q4.)",
          },
          {
            kind: "markdown",
            md: "Recruitment sources: **internal** (faster, cheaper, better insight, motivating — but favoritism, blocked fresh ideas) vs **external** (more candidates, fresh competitiveness — but costlier). Selection tests: aptitude, knowledge, performance, psychological. **The interview is the most common (and most criticized) selection method** (Q23).",
          },
          {
            kind: "markdown",
            md: "**Evaluation** highlights how objectives/tasks are achieved and sets rewards/development. Most-used tool: the **evaluation sheet** (factor scores → overall score). Its disadvantages include assuming factors are additive and ignoring the **halo effect** (one factor's score biasing another).",
          },
        ],
      },
      {
        id: "management-les-6-2",
        title: "Motivation, teams, conflict & communication",
        summary:
          "The five motivation theories, Tuckman & Belbin, the five conflict-handling styles, and the elements of communication — mostly memorizable lists (see the deck).",
        estMinutes: 11,
        topicTags: ["hr"],
        priority: 3,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Motivation theories",
            md: "**Maslow** — 5 ascending needs (physiological → safety → social → esteem → self-actualization). **Herzberg** — **hygiene** factors (salary, security) prevent dissatisfaction; **motivators** (the work, responsibility, recognition) motivate. **Alderfer** — ERG (Existence, Relatedness, Growth). **McClelland** — nAch / nAff / nPow. **Adams** — equity (compare outcomes/inputs to others).",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Mnemonics",
            md: "Theories: **“My Hamster Always Makes Amends”** (Maslow, Herzberg, Alderfer, McClelland, Adams).\n\nTeam stages (Tuckman): **forming · storming · norming · performing · adjourning**.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Conflict-handling styles & communication",
            md: "**Five styles:** accommodating · avoiding · **collaborating (win-win, most productive)** · competing (win-lose) · compromising (lose-lose). Without time pressure, collaborating is always best.\n\n**Communication elements:** emitter · receiver · message · channel · feedback.",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Common trap",
            md: "Salary and job security are **hygiene** factors, not motivators (Herzberg). ERG has **three** need groups, not five.",
          },
        ],
      },
    ],
  },

  // ===== LU7 — Entrepreneurship ============================================
  {
    id: "management-mod-7",
    title: "LU7 — Management in the Context of Entrepreneurship",
    order: 7,
    lessons: [
      {
        id: "management-les-7-1",
        title: "SMEs, the entrepreneur & registration",
        summary:
          "The SME thresholds (the OR-rule), the entrepreneur, the three registration phases and the Romanian legal forms.",
        estMinutes: 11,
        topicTags: ["entrepreneurship", "calc-sme"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "SME classification (the OR-rule)",
            md: "An **SME** employs **< 250** people with net annual turnover **≤ €50M** **and/or** total assets **≤ €43M**. The employee cap is **mandatory (AND)**; the firm need satisfy **either** the turnover **or** the assets threshold (**OR**).\n\nMicro: < 10 / €2M / €2M · Small: < 50 / €10M / €43M · Medium: < 250 / €50M / €43M. Exceeding thresholds for **two consecutive** years ⇒ loses SME status. `[VOLATILE]`",
          },
          {
            kind: "markdown",
            md: "An **entrepreneur** identifies a business opportunity, assumes responsibility for starting it, obtains the resources, takes the risks and manages them. At the **Trade Registry** you define: legal form, name, associates/shareholders, object of activity (**CAEN** code), social capital, administrator.\n\n**Legal forms:** PFA · II · SRL · SA · SNC · SCS · SCA · Societate Cooperativă. **CAEN** = activities dictionary; **COR** = occupations dictionary; **CUI/CIF** = fiscal ID.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Three registration phases",
            md: "**Pre-registration** (name reservation, articles of incorporation, capital payment) → **Registration** (judge authorization, unique registration code, registration certificate) → **Authorization of operation** (ends with an operating **license** for public catering, or an operating **agreement** for trade & services).",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Signature trap (Q-SME)",
            md: "The financial test is **OR**, not AND. A firm with 45 employees, €12M turnover and €5M assets is still **small** — turnover exceeds €10M, but assets ≤ €43M satisfies the OR.",
          },
        ],
      },
      {
        id: "management-les-7-2",
        title: "Money skills: VAT, salary, depreciation & the plan",
        summary:
          "The four VAT directions, gross/net/complete salary, the depreciation threshold, and the business plan — the entrepreneurship calculations.",
        estMinutes: 13,
        topicTags: ["entrepreneurship", "calc-vat", "calc-salary", "calc-depreciation"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "VAT (standard rate 21% [VOLATILE])",
            md: "VAT is an indirect tax on goods/services value, paid to the State Budget, borne by the final consumer. From the **base B**: VAT = B × r, final = B × (1+r). From the **final price F**: **VAT = F/(1+r) × r**, base = F/(1+r).\n\nFor a **non-VAT** firm, VAT is **not deductible**, *is* a cost, *is not* remitted to the budget, and may be an eligible grant expense (Q17).",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Salary & depreciation [VOLATILE]",
            md: "From **gross G**: deduct CAS 25% + CASS 10%, then income tax 10% on the remainder → **net**. **Complete (employer cost) = gross + CAM 2.25%**.\n\n**Depreciation** (straight-line) = entry value / useful life. Fiscally, only assets with entry value **≥ 2,500 RON** are depreciated; below that → working-inventory item (expensed at once).",
          },
          {
            kind: "callout",
            tone: "warning",
            title: "The two headline traps",
            md: "**VAT:** computing 21% on the *final price* instead of the base. **Salary:** reporting the *net* when asked for the *complete* salary, or forgetting the 2.25% CAM. Drill these in the **Drills** tab.",
          },
          {
            kind: "markdown",
            md: "The **business plan** is an internal tool (lead/control) and an external one (communicate with funders). Funders want to know what the business is, why it's profitable, the capital needed and the expected profitability. Sections: organizational/HR elements; a launch project (Gantt, ≤ ~6 months); a start-up budget + funding sources; financial projections.",
          },
        ],
      },
    ],
  },
];
