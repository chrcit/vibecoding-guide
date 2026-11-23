// The METR numbers for Fig. 7, read from the data layer, plus the fact ids the page cites.
import { benchmarks } from '../../data/benchmarks.ts';
import { links } from '../../data/links.ts';
import { formatDate } from '../../lib/facts.ts';
import type { HorizonInputs } from '../fig/horizon/model';

const { metr } = benchmarks;
type P80Key = keyof typeof metr.p80;

export const horizonInputs: HorizonInputs = {
  p50: Object.values(metr.p50).map((p) => ({ name: p.name, released: p.released, minutes: p.minutes.value, low: p.low, high: p.high })),
  p80: (Object.keys(metr.p80) as P80Key[]).map((id) => ({
    name: metr.p50[id].name,
    released: metr.p50[id].released,
    minutes: metr.p80[id].value,
  })),
  doublingDays: metr.doublingDays.value,
  unreliableAbove: metr.unreliableAbove.value,
};

export const horizonSource = {
  label: `${links.metrHorizons.label}, last updated ${formatDate(metr.lastUpdate.value, true)}`,
  href: links.metrHorizons.url,
};

export const horizonFactIds = [
  'benchmarks.metr.definition',
  'benchmarks.metr.doublingDays',
  'benchmarks.metr.unreliableAbove',
  'benchmarks.metr.lastUpdate',
  ...Object.keys(metr.p50).map((id) => `benchmarks.metr.p50.${id}.minutes`),
  ...Object.keys(metr.p80).map((id) => `benchmarks.metr.p80.${id}`),
];
