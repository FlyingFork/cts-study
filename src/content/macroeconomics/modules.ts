import type { Module } from "@/lib/schema";

const img = (name: string) => `/courses/macroeconomics/${name}`;

/**
 * Macroeconomics modules converted from materials/macroeconomics/is-lm-bp-course.
 * The course is problem-first: priority 1 lessons feed the guaranteed IS-LM or
 * IS-LM-BP exam problem; priority 2/3 material is useful but shed first.
 */
export const macroeconomicsModules: Module[] = [
  {
    id: "macroeconomics-mod-foundations",
    title: "Foundations",
    order: 1,
    lessons: [
      {
        id: "macroeconomics-les-foundations",
        title: "Income, demand, taxes, and deficits",
        summary:
          "The accounting identities behind every later IS-LM and IS-LM-BP exercise: output, disposable income, taxes, consumption, and the budget deficit.",
        estMinutes: 35,
        topicTags: ["gdp"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "IS-LM and IS-LM-BP are equilibrium models. Before solving them, keep four sectors straight: households consume and supply labor; firms invest and produce; government spends, taxes, and transfers; the foreign sector enters through net exports.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Core accounting identities",
            md: String.raw`Closed economy: $y=C+I+G$. Open economy: $y=C+I+G+NX$.

Consumption is $C=C_0+c y^D$, disposable income is $y^D=y-T+Tr$, and taxes are $T=T_0+t y$.`,
          },
          {
            kind: "math",
            tex: String.raw`y^D=y-(T_0+t y)+Tr=(1-t)y-T_0+Tr`,
            display: true,
          },
          {
            kind: "callout",
            tone: "key",
            title: "Budget deficit",
            md: String.raw`Use $BD=G-T+Tr+Sv$. In these problems subsidies are usually zero, so $BD=G-T+Tr$.

If $BD>0$, the government runs a deficit. If $BD<0$, it runs a surplus.`,
          },
          {
            kind: "tryIt",
            prompt:
              "Given y=2000, T0=100, t=0.2, Tr=50, C0=80, and c=0.75, compute T, disposable income, and C.",
            answerMd: String.raw`$T=100+0.2(2000)=500$. $y^D=2000-500+50=1550$. $C=80+0.75(1550)=1242.5$.`,
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Common mistake",
            md: String.raw`Do not confuse $T_0$ with total taxes. Total taxes are $T=T_0+t y$, so tax revenue changes when output changes even if $T_0$ is fixed.`,
          },
        ],
      },
    ],
  },
  {
    id: "macroeconomics-mod-multipliers",
    title: "Multipliers",
    order: 2,
    lessons: [
      {
        id: "macroeconomics-les-multipliers",
        title: "Reduced forms before IS-LM",
        summary:
          "Derive the closed-economy multiplier and use it to analyze government spending, investment, transfers, autonomous taxes, and tax-rate shocks.",
        estMinutes: 50,
        topicTags: ["multipliers"],
        priority: 2,
        blocks: [
          {
            kind: "markdown",
            md: "A multiplier answers: if an exogenous variable changes by one unit, how much does endogenous output change? In this lesson investment is still exogenous; later it becomes interest-sensitive.",
          },
          {
            kind: "math",
            tex: String.raw`y=C_0+c(y-T_0-t y+Tr)+I+G`,
            display: true,
          },
          {
            kind: "math",
            tex: String.raw`y=\frac{1}{1-c(1-t)}(C_0-cT_0+cTr+I+G)`,
            display: true,
          },
          {
            kind: "callout",
            tone: "key",
            title: "Closed-economy spending multiplier",
            md: String.raw`$\alpha_G=\frac{1}{1-c(1-t)}$. Then:

$\Delta y=\alpha_G\Delta G=\alpha_G\Delta I=\alpha_G\Delta C_0$; autonomous taxes use $\Delta y=-c\alpha_G\Delta T_0$; transfers use $\Delta y=c\alpha_G\Delta Tr$.`,
          },
          {
            kind: "math",
            tex: String.raw`\Delta y=\frac{-c\Delta t\cdot y_0}{1-c(1-t_1)}`,
            display: true,
          },
          {
            kind: "tryIt",
            prompt:
              "Use c=0.8, t=0.25, and Delta G=-40. Compute alpha_G, Delta y, and Delta BD.",
            answerMd: String.raw`$\alpha_G=1/(1-0.8(1-0.25))=2.5$. $\Delta y=2.5(-40)=-100$. $\Delta BD=\Delta G-t\Delta y=-40-0.25(-100)=-15$, so the deficit falls by 15.`,
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Deficit effects",
            md: String.raw`When $G$ changes, $BD$ changes directly through $G$ and indirectly through tax revenue. When $I$ changes, $BD$ changes only indirectly through tax revenue.`,
          },
        ],
      },
    ],
  },
  {
    id: "macroeconomics-mod-islm",
    title: "IS-LM core and policy",
    order: 3,
    lessons: [
      {
        id: "macroeconomics-les-islm-core",
        title: "The IS-LM core model",
        summary:
          "Derive IS from goods-market equilibrium, LM from money-market equilibrium, then solve for internal equilibrium.",
        estMinutes: 60,
        topicTags: ["is-lm"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "The IS-LM model combines the goods market and the money market. Internal balance occurs where both markets are in equilibrium at the same output and interest rate.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "IS curve",
            md: String.raw`Investment is interest-sensitive: $I=I_0-b r$. Substituting consumption, taxes, transfers, investment, and government spending gives:`,
          },
          {
            kind: "math",
            tex: String.raw`y=\frac{1}{1-c(1-t)}(C_0-cT_0+cTr+I_0+G-b r)`,
            display: true,
          },
          {
            kind: "callout",
            tone: "key",
            title: "LM curve",
            md: String.raw`Money-market equilibrium is $\frac{M}{P}=k y-h r$, so:`,
          },
          {
            kind: "math",
            tex: String.raw`y=\frac{1}{k}\frac{M}{P}+\frac{h}{k}r`,
            display: true,
          },
          {
            kind: "math",
            tex: String.raw`y^*=\frac{C_0-cT_0+cTr+I_0+G+\frac{b}{h}\frac{M}{P}}{1-c(1-t)+\frac{bk}{h}},\qquad r^*=\frac{k}{h}y^*-\frac{1}{h}\frac{M}{P}`,
            display: true,
          },
          {
            kind: "image",
            src: img("islm-equilibrium-example-1.png"),
            alt: "IS-LM equilibrium graph",
            caption: "Closed-economy IS-LM equilibrium: downward IS, upward LM, intersection at y* and r*.",
          },
          {
            kind: "tryIt",
            prompt:
              "In the mini example with y*=1800 and r*=0.09, C0=100, T0=500, t=0, I0=200, b=1000, G=550. Compute T, disposable income, C, and I.",
            answerMd: String.raw`$T=500$, $y^D=1800-500=1300$, $C=100+0.8(1300)=1140$, and $I=200-1000(0.09)=110$. Check: $1140+110+550=1800$.`,
          },
        ],
      },
      {
        id: "macroeconomics-les-islm-policy",
        title: "IS-LM policy shocks",
        summary:
          "Use IS-LM multipliers and graph shifts to analyze fiscal, monetary, investment, transfer, and tax-rate shocks.",
        estMinutes: 55,
        topicTags: ["is-lm-policy", "policy-shocks", "curve-shifts"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "IS-LM multipliers",
            md: String.raw`$\Gamma_G=\frac{1}{1-c(1-t)+\frac{bk}{h}}$ and $\Gamma_M=\Gamma_G\cdot\frac{b}{h}$.

Use $\Gamma_G$, not the pre-IS-LM $\alpha_G$, once money-market feedback is present.`,
          },
          {
            kind: "math",
            tex: String.raw`\Delta y=\Gamma_G\Delta G,\qquad \Delta r=\frac{k}{h}\Delta y`,
            display: true,
          },
          {
            kind: "markdown",
            md: "Fiscal expansion shifts IS right: output rises and the interest rate rises. Higher money demand crowds out part of investment.",
          },
          {
            kind: "math",
            tex: String.raw`\Delta y=\Gamma_M\Delta\frac{M}{P},\qquad \Delta r=\frac{k}{h}\Delta y-\frac{1}{h}\Delta\frac{M}{P}`,
            display: true,
          },
          {
            kind: "markdown",
            md: "Monetary expansion shifts LM right/down: output rises and the interest rate usually falls.",
          },
          {
            kind: "image",
            src: img("islm-investment-shock.png"),
            alt: "IS-LM investment shock graph",
            caption: "A negative investment shock shifts IS left, lowering output and the interest rate.",
          },
          {
            kind: "image",
            src: img("islm-monetary-offset.png"),
            alt: "IS-LM monetary offset graph",
            caption: "A monetary expansion can offset a negative demand shock by shifting LM right.",
          },
          {
            kind: "tryIt",
            prompt:
              "For each shock, identify the shifting curve and the likely interest-rate direction: G rises; T0 rises; M/P falls; I0 falls.",
            answerMd: "G rises: IS right, r rises. T0 rises: IS left, r falls. M/P falls: LM left/up, r rises. I0 falls: IS left, r falls.",
          },
        ],
      },
    ],
  },
  {
    id: "macroeconomics-mod-open-economy",
    title: "Open economy and BP",
    order: 4,
    lessons: [
      {
        id: "macroeconomics-les-open-economy-bp",
        title: "Net exports, capital flows, and the BP curve",
        summary:
          "Add the foreign sector, derive the BP curve, and distinguish internal equilibrium from external balance.",
        estMinutes: 55,
        topicTags: ["open-economy", "bp-curve"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Net exports and capital flows",
            md: String.raw`Net exports are $NX=NX_0-m y$: higher domestic income raises imports, so $NX$ falls.

Capital flows are written $CF=n r$. In this course $CF$ is net capital outflow; a negative value means net capital inflow.`,
          },
          {
            kind: "math",
            tex: String.raw`BP=NX-CF,\qquad BP=0 \Longleftrightarrow NX=CF`,
            display: true,
          },
          {
            kind: "math",
            tex: String.raw`NX_0-m y=n r \Longrightarrow y=\frac{NX_0}{m}-\frac{n}{m}r`,
            display: true,
          },
          {
            kind: "callout",
            tone: "key",
            title: "Capital mobility cases",
            md: String.raw`Zero capital mobility: $n=0$, so $y=\frac{NX_0}{m}$ and BP is vertical.

Imperfect mobility: $n\neq0$, so BP slopes according to $-\frac{n}{m}$.

Perfect mobility: $r=r_f$, so BP is horizontal at the world interest rate.`,
          },
          {
            kind: "tryIt",
            prompt:
              "Given NX0=500, m=0.25, and CF=0, derive the BP curve and the output level consistent with external balance.",
            answerMd: String.raw`$500-0.25y=0$, so $y=500/0.25=2000$. With zero capital flow, external balance requires output 2000.`,
          },
        ],
      },
      {
        id: "macroeconomics-les-islmbp-core",
        title: "The IS-LM-BP core model",
        summary:
          "Derive open-economy IS, LM, and BP; solve internal equilibrium; then compute the external balance.",
        estMinutes: 70,
        topicTags: ["is-lm-bp", "bp-curve"],
        priority: 1,
        blocks: [
          {
            kind: "math",
            tex: String.raw`y=\frac{1}{1-c(1-t)+m}(C_0-cT_0+cTr+I_0+G+NX_0-b r)`,
            display: true,
          },
          {
            kind: "math",
            tex: String.raw`y^*=\frac{C_0-cT_0+cTr+I_0+G+NX_0+\frac{b}{h}\frac{M}{P}}{1-c(1-t)+m+\frac{bk}{h}},\qquad r^*=\frac{k}{h}y^*-\frac{1}{h}\frac{M}{P}`,
            display: true,
          },
          {
            kind: "math",
            tex: String.raw`NX^*=NX_0-m y^*,\qquad CF^*=n r^*,\qquad BP^*=NX^*-CF^*`,
            display: true,
          },
          {
            kind: "callout",
            tone: "key",
            title: "Open-economy multipliers",
            md: String.raw`$\Gamma_G=\frac{1}{1-c(1-t)+m+\frac{bk}{h}}$ and $\Gamma_M=\Gamma_G\cdot\frac{b}{h}$.

The import term $m$ lowers the multiplier because part of extra demand leaks into imports.`,
          },
          {
            kind: "image",
            src: img("islmbp-zero-mobility-equilibrium.png"),
            alt: "IS-LM-BP zero capital mobility equilibrium",
            caption: "With n=0, the BP curve is vertical at the output level where NX=0.",
          },
          {
            kind: "image",
            src: img("islmbp-capital-flow-equilibrium.png"),
            alt: "IS-LM-BP capital flow equilibrium",
            caption: "With capital flows, BP can slope and internal equilibrium may differ from external balance.",
          },
          {
            kind: "tryIt",
            prompt:
              "Using the zero-mobility example with y*=3380, r*=0.0704, T0=100, t=0.3, I0=420, b=250, NX0=530, m=0.1, G=900, compute T, I, NX, and BD.",
            answerMd: String.raw`$T=100+0.3(3380)=1114$. $I=420-250(0.0704)=402.4$. $NX=530-0.1(3380)=192$. $BD=900-1114=-214$, a surplus of 214.`,
          },
          {
            kind: "callout",
            tone: "warning",
            title: "Do not stop at IS=LM",
            md: String.raw`In IS-LM-BP, $IS=LM$ gives internal equilibrium only. You must still compute $BP=NX-CF$ to decide whether the external account is balanced.`,
          },
        ],
      },
    ],
  },
  {
    id: "macroeconomics-mod-capstone",
    title: "Capstone",
    order: 5,
    lessons: [
      {
        id: "macroeconomics-les-capstone",
        title: "Capstone review and final mastery set",
        summary:
          "A cumulative open-economy problem that rehearses the exact exam flow: derive curves, solve equilibrium, compute variables, apply shocks, and sign-check.",
        estMinutes: 90,
        topicTags: ["is-lm-bp", "policy-shocks", "curve-shifts"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Formula recall target",
            md: "From memory, write the closed-economy reduced form, closed-economy IS, LM, IS-LM y*, open-economy IS, BP, IS-LM-BP y*, and the open-economy fiscal and monetary multipliers.",
          },
          {
            kind: "markdown",
            md: String.raw`Capstone economy: $C_0=215$, $T_0=220$, $Tr=120$, $G=540$, $I_0=270$, $M/P=400$, $NX_0=350$, $c=0.75$, $t=0.12$, $b=200$, $k=0.25$, $h=400$, $m=0.16$, $n=0$.`,
          },
          {
            kind: "tryIt",
            prompt:
              "Derive numerical IS, LM, and BP; find y* and r*; compute C, I, T, NX, and BD.",
            answerMd: String.raw`IS: $y=2600-400r$. LM: $y=1600+1600r$. BP: $y=350/0.16=2187.5$. Internal equilibrium: $r=0.5$, $y=2400$. $T=508$, $I=170$, $NX=-34$, $C=1724$, and $BD=152$.`,
          },
          {
            kind: "tryIt",
            prompt:
              "From the capstone base, analyze Delta T0=20, the Delta G required to reduce BD by 10, Delta t=-0.02, and a mixed Delta Tr=50 plus Delta(M/P)=50.",
            answerMd: String.raw`$\Gamma_G=1.6$, $\Gamma_M=0.8$. $\Delta T_0=20$ gives $\Delta y=-24$ and $\Delta r=-0.015$. To reduce $BD$ by 10: $\Delta G=-10/(1-0.12(1.6))\approx-12.38$. $\Delta t=-0.02$ gives $\Delta y\approx59.0$ and $\Delta r\approx0.0369$. The mixed policy gives $\Delta y=1.6(0.75)(50)+0.8(50)=100$ and $\Delta r=0.25/400(100)-50/400=-0.0625$.`,
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Final sign check",
            md: "For every calculation, add one sentence: does the sign make economic sense? Output-increasing policies lower NX when m>0, so they usually worsen the external balance if capital flows do not offset it.",
          },
        ],
      },
    ],
  },
];
