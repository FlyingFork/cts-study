import type { Drill } from "@/lib/schema";

/**
 * The guaranteed exam problem is expected to be either IS-LM or IS-LM-BP.
 * These two drills are intentionally long-form and rubric-graded: students
 * write the full derivation, then self-score against the worked solution.
 */
export const macroeconomicsDrills: Drill[] = [
  {
    id: "macroeconomics-drill-islm-lab",
    courseId: "macroeconomics",
    topic: "is-lm",
    title: "IS-LM full problem: derive, solve, shock-check",
    task: String.raw`Closed economy:

- $c=0.9$, $t=1/3$, $b=1000$, $k=1$, $h=10000$
- $C_0=90$, $T_0=0$, $Tr=0$, $I_0=200$, $G=710$, $M/P=500$

Tasks:

1. Derive analytical IS and LM.
2. Compute numerical IS and LM.
3. Find $y^*$ and $r^*$.
4. Compute $BD$ and $I$.
5. Compute $\Gamma_G$ and $\Gamma_M$.
6. Find the money-supply change needed to eliminate an initial budget deficit of 10.
7. Analyze $\Delta G=-50$.
8. Find the new tax rate that raises GDP by 100.`,
    hints: [
      String.raw`Start with $y=C_0+c(y-T_0-t y+Tr)+I_0-br+G$ and collect output terms on the left.`,
      String.raw`The numerical IS curve should be $y=2500-2500r$; the LM curve should be $y=500+10000r$.`,
      String.raw`Set IS equal to LM. If you get $r=0.16$, report it as 16 percent and compute output from either curve.`,
      String.raw`Use $\Gamma_G=1/(1-c(1-t)+bk/h)$ and $\Gamma_M=\Gamma_G(b/h)$ for policy shocks.`,
      String.raw`For the tax-rate target, the denominator changes: use $\Delta y=\frac{-c(t_1-t_0)y_0}{1-c(1-t_1)+bk/h}$.`,
    ],
    solution: String.raw`IS:

$$
y=\frac{1}{1-0.9(1-1/3)}(90+200+710-1000r)=2500-2500r
$$

LM:

$$
y=500+10000r
$$

Equilibrium:

$$
2500-2500r=500+10000r
$$

$$
r=0.16=16\%,\qquad y=2100
$$

Budget deficit and investment:

$$
BD=G-T=710-\frac{1}{3}(2100)=10
$$

$$
I=200-1000(0.16)=40
$$

Multipliers:

$$
\Gamma_G=\frac{1}{1-0.9(1-1/3)+1000/10000}=2
$$

$$
\Gamma_M=2(1000/10000)=0.2
$$

Money-supply change to eliminate $BD=10$:

$$
\Delta BD=-t\Delta y,\quad -10=-\frac{1}{3}\Delta y
$$

$$
\Delta y=30,\qquad 30=0.2\Delta(M/P)
$$

$$
\Delta(M/P)=150
$$

Fiscal contraction $\Delta G=-50$:

$$
\Delta y=2(-50)=-100,\qquad y=2000
$$

$$
\Delta r=\frac{1}{10000}(-100)=-0.01,\qquad r=15\%
$$

Tax rate needed for $\Delta y=100$:

$$
100=\frac{-0.9(t_1-1/3)(2100)}{1-0.9(1-t_1)+1000/10000}
$$

Solving gives $t_1\approx0.305$, so the tax rate falls from 33.3 percent to about 30.5 percent.`,
    rubric:
      "6-point rubric: 1.0 derives analytical IS and LM with correct denominators; 1.0 computes numerical IS=2500-2500r and LM=500+10000r; 1.0 solves y*=2100 and r*=16%; 1.0 computes BD=10 and I=40; 1.0 computes Gamma_G=2 and Gamma_M=0.2; 1.0 handles all shocks with sign checks, including Delta(M/P)=150, Delta G=-50 -> y=2000/r=15%, and t1 about 0.305.",
  },
  {
    id: "macroeconomics-drill-islmbp-lab",
    courseId: "macroeconomics",
    topic: "is-lm-bp",
    title: "IS-LM-BP full problem: internal and external balance",
    task: String.raw`Open economy with capital flows:

- $c=0.8$, $t=0.3$, $b=410$, $k=0.5$, $h=90$
- $C_0=60$, $T_0=10$, $Tr=0$, $I_0=1500$, $G=1000$, $M/P=900$
- $NX_0=500$, $m=0.3$, $n=-50$

Tasks:

1. Derive numerical IS, LM, and BP.
2. Solve internal equilibrium.
3. Compute $BD$, $C$, $I$, $T$, $NX$, $CF$, and $BP$.
4. Compute $\Gamma_G$ and $\Gamma_M$.
5. Analyze $\Delta G=-10$.
6. Analyze $\Delta(M/P)=10$.
7. Analyze $\Delta t=+0.05$.
8. State which shocks improve or worsen the external balance.`,
    hints: [
      String.raw`Open-economy IS includes $NX_0$ in the numerator and $+m$ in the denominator.`,
      String.raw`The numerical IS should be about $y=4124.3-554.1r$ and the LM curve should be $y=1800+180r$.`,
      String.raw`BP comes from $NX_0-my=nr$: with $n=-50$, $y=500/0.3-(-50/0.3)r$.`,
      String.raw`After solving IS=LM, do not stop. Compute $NX$, $CF$, and $BP=NX-CF$.`,
      String.raw`For the tax-rate change, use $t_1=0.35$ in the denominator and keep the negative sign from $-c\Delta t y_0$.`,
    ],
    solution: String.raw`IS:

$$
y=\frac{60-0.8(10)+1500+1000+500-410r}{1-0.8(1-0.3)+0.3}
$$

$$
y\approx4124.3-554.1r
$$

LM:

$$
y=1800+180r
$$

BP:

$$
y=\frac{500}{0.3}-\frac{-50}{0.3}r
$$

Internal equilibrium:

$$
y^*\approx2370,\qquad r^*\approx0.0317
$$

Main variables:

$$
T=10+0.3(2370)=721
$$

$$
BD=1000-721=279
$$

$$
I=1500-410(0.0317)\approx1487
$$

$$
NX=500-0.3(2370)=-211
$$

$$
CF=-50(0.0317)\approx-1.6
$$

$$
BP=NX-CF\approx-209.4
$$

Multipliers:

$$
\Gamma_G=\frac{1}{1-0.8(1-0.3)+0.3+410(0.5)/90}\approx0.331
$$

$$
\Gamma_M=0.331(410/90)\approx1.509
$$

Government cut $\Delta G=-10$:

$$
\Delta y=-3.31,\qquad \Delta r=\frac{0.5}{90}(-3.31)\approx-0.0184
$$

Money expansion $\Delta(M/P)=10$:

$$
\Delta y=15.09,\qquad \Delta r=\frac{0.5}{90}(15.09)-\frac{10}{90}\approx-0.0273
$$

Tax-rate increase $\Delta t=+0.05$:

$$
\Delta y=\frac{-0.8(0.05)(2370)}{1-0.8(1-0.35)+0.3+410(0.5)/90}\approx-30.4
$$

Higher output worsens $NX$ through imports unless capital flows offset it. Lower output improves $NX$ mechanically. Keep one interest-rate convention consistently when computing $CF$.`,
    rubric:
      "6-point rubric: 1.0 derives open-economy IS, LM, and BP; 1.0 computes numerical curves, including the BP sign from n=-50; 1.0 solves internal equilibrium near y*=2370 and r*=3.17%; 1.0 computes T, BD, I, NX, CF, and BP with the BP deficit sign; 1.0 computes Gamma_G about 0.331 and Gamma_M about 1.509; 1.0 analyzes Delta G, Delta(M/P), and Delta t with sign checks for output, interest rate, and external balance.",
  },
];
