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

export const decreaseStitch = {
  num_stitches: 1,
  key: 'dec',
} as const;

type DefinedStitches = typeof singleStitch | typeof increaseStitch | typeof decreaseStitch;
export type CrochetStitchKey = DefinedStitches['key'];

function isStitchKey(key: unknown): key is CrochetStitchKey {
  return key === 'sc' || key === 'inc' || key === 'dec';
}

export interface CrochetPattern {
  rows: CrochetStitch[][];
  total_stitches: number;
}


function parseStitch(stitch: string): CrochetStitch[] {
  const stitchRegex = /(\d+)? ?(.*)/;
  const stitchMatch = stitch.match(stitchRegex);
  if (!stitchMatch) {
    throw new Error(`Invalid stitch: ${stitch}`);
  }

  const stitchCount = stitchMatch[1] ? Number(stitchMatch[1]) : 1;
  const stitchType: unknown = stitchMatch[2];

  if (isNaN(stitchCount)) {
    throw new Error(`Invalid stitch count: ${stitchCount} for stitch ${stitch}: ${stitchMatch}`);
  } else if (!isStitchKey(stitchType)) {
    throw new Error(`Unknown stitch: ${stitchType} for stitch \`${stitch}\`: ${stitchMatch}`);
  }

  let stitchObj: DefinedStitches;
  if (stitchType === 'sc') {
    stitchObj = singleStitch;
  } else if (stitchType === 'inc') {
    stitchObj = increaseStitch;
  } else if (stitchType === 'dec') {
    stitchObj = decreaseStitch;
  } else {
    throw new Error(`Unknown stitch: ${stitch}`);
  }

  return Array(stitchCount).fill(stitchObj);
}

export function parseCrochetPattern(pattern: string): CrochetPattern {
  const regex = /(\[(.*?)\] ?x ?(\d+))|(\d+ (.*))/;
  const match = pattern.match(regex);

  if (!match) {
    throw new Error('Invalid pattern');
  }

  const result: CrochetPattern = {
    rows: [],
    total_stitches: 0,
  };

  if (match[1]) {
    const stitches = match[2].split(',').map(s => s.trim());
    const repeats = Number(match[3]);

    for (let i = 0; i < repeats; i++) {
      const row: CrochetStitch[] = [];
      for (const stitch of stitches) {
        row.push(...parseStitch(stitch));
      }
      result.rows.push(row);
      result.total_stitches += rowLength(row);
    }
  } else {
    const row = parseStitch(match[4]);
    result.rows.push(row);
    result.total_stitches += rowLength(row);
  }

  return result;
}

export function rowLength(row: CrochetStitch[]): number {
  return row.reduce((acc, stitch) => acc + stitch.num_stitches, 0);
}