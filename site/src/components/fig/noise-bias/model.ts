// Fig. 14, noise and bias. The same task (count the duplicates in the contact tidy) run several
// times, on two target boards. On the left the runs disagree at random (noise); on the right they
// agree closely and share one wrong assumption (bias). The centre of each board is the right answer.
// Positions are world units on the board's top, centre (0, 0). Fixed lists, no randomness, so the
// build and the page always agree.

export type Plane = [number, number];

/** Noise: wide scatter round the centre. Their mean over all ten is exactly the centre. */
const NOISE_RAW: Plane[] = [
  [-22, 18], [28, -10], [6, 30], [-30, -14], [18, 22], [-8, -32], [34, 8], [-16, 6], [2, -20], [-12, -8],
];
export const NOISE: Plane[] = NOISE_RAW.map(([x, y]) => [x * 1.3, y * 1.3]);

/** Where the shared assumption puts every biased run. */
export const BIAS_AT: Plane = [30, -8];
const SPREAD: Plane[] = ([[2, 1], [-3, 2], [1, -3], [4, 3], [-2, -2], [0, 4], [-4, -1], [3, -4], [-1, 3], [0, -3]]).map(([x, y]) => [x * 2, y * 2] as Plane);
/** Bias: a tight cluster off the centre. */
export const BIAS: Plane[] = SPREAD.map(([x, y]) => [BIAS_AT[0] + x, BIAS_AT[1] + y]);

export interface Step {
  /** Runs shown on each board. */
  runs: number;
  /** True once a real check has found the shared assumption and it is fixed. */
  fixed: boolean;
  says: string;
}

export const STEPS: Step[] = [
  {
    runs: 1,
    fixed: false,
    says: 'One run on each board. Both answers miss the centre, the right count of duplicates. From a single run you cannot tell which kind of error you are looking at.',
  },
  {
    runs: 3,
    fixed: false,
    says: 'Three runs. On the left the answers disagree with each other: that is noise. On the right they agree closely, which looks reassuring and says nothing about whether they are right.',
  },
  {
    runs: 10,
    fixed: false,
    says: 'Ten runs. On the left the pins still scatter, but their average, the ring, has moved close to the centre: repetition averages noise away. On the right the ring sits with the cluster, off the centre. Every run makes the same mistake, so more runs only make you surer of a wrong answer.',
  },
  {
    runs: 10,
    fixed: true,
    says: 'A different judge. A test with a known answer shows that every run counts “Jo Smith” and “Jo Smith ” with a trailing space as two people. Fix that assumption and the whole cluster moves onto the centre. Running it again could never have found it.',
  },
];

export const mean = (pts: Plane[]): Plane =>
  pts.length ? [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length] : [0, 0];

/** Average of the pins shown at a step, per board, in board coordinates. */
export function averages(step: Step): { noise: Plane; bias: Plane } {
  const b = mean(BIAS.slice(0, step.runs));
  return { noise: mean(NOISE.slice(0, step.runs)), bias: step.fixed ? [b[0] - BIAS_AT[0], b[1] - BIAS_AT[1]] : b };
}
