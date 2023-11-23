export interface CrochetStitch {
  num_stitches: number;
  key: string;
}

export const singleStitch = {
  num_stitches: 1,
  key: 'sc',
} as const;

export const increaseStitch = {
  num_stitches: 2,
  key: 'inc',
} as const;

type DefinedStitches = typeof singleStitch | typeof increaseStitch;
export type CrochetStitchKey = DefinedStitches['key'];

function isStitchKey(key: unknown): key is CrochetStitchKey {
  return key === 'sc' || key === 'inc';
}

export interface CrochetPattern {
  rows: CrochetStitch[][];
  total_stitches: number;
} 

export function parseCrochetPattern(pattern: string): CrochetPattern {
  const regex = /\[(.*?)\] x(\d+)/;
  const match = pattern.match(regex);

  if (!match) {
    throw new Error('Invalid pattern');
  }

  const stitches = match[1].split(',').map(s => s.trim()) as CrochetStitchKey[];
  const repeats = Number(match[2]);

  const result: CrochetPattern = {
    rows: [],
    total_stitches: 0,
  };

  for (let i = 0; i < repeats; i++) {
    result.rows.push([]);
    for (const stitch of stitches) {
      // Extract possible prefix numbers
      const stitchRegex = /(\d+)?(.*)/;
      const stitchMatch = stitch.match(stitchRegex);
      if (!stitchMatch) {
        throw new Error(`Invalid stitch: ${stitch}`);
      }

      // Store number and stitch
      const stitchCount = stitchMatch[1] ? Number(stitchMatch[1]) : 1;
      const stitchType: unknown = stitchMatch[2];

      // Typeguard to ensure count is a number and stitch is a valid stitch
      if (isNaN(stitchCount)) {
        throw new Error(`Invalid stitch count: ${stitchCount}`);
      } else if (!isStitchKey(stitchType)) {
        throw new Error(`Unknown stitch: ${stitchType}`);
      }

      if (stitchType === 'sc') {
        for (let j = 0; j < stitchCount; j++)
          result.rows[i].push(singleStitch);
      } else if (stitchType === 'inc') {
        for (let j = 0; j < stitchCount; j++)
          result.rows[i].push(increaseStitch);
      } else {
        throw new Error(`Unknown stitch: ${stitch}`);
      }
    }
    result.total_stitches += rowLength(result.rows[i]);
  }

  return result;
}

export function rowLength(row: CrochetStitch[]): number {
  return row.reduce((acc, stitch) => acc + stitch.num_stitches, 0);
}