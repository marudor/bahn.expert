import fs from 'fs';
import path from 'path';

const csv = fs.readFileSync(path.resolve(__dirname, 'bayernPlan.csv'), 'utf8');
const stationPlans = new Map<string, string>();
csv.split('\n').forEach((line) => {
  const [evaId, , link] = line.split(';');
  stationPlans.set(evaId, link);
});

export const getBayernLageplan = (evaId: string) => stationPlans.get(evaId);
