export interface DirtyRange {
  readonly offset: number;
  readonly size: number;
}

/** Sorts and merges overlapping or adjacent byte ranges. */
export function mergeDirtyRanges(ranges: readonly DirtyRange[]): DirtyRange[] {
  if (ranges.length <= 1) {
    return ranges.map((range) => ({ offset: range.offset, size: range.size }));
  }
  const sorted = [...ranges].sort((a, b) => a.offset - b.offset);
  const merged: DirtyRange[] = [];
  for (const range of sorted) {
    if (range.size <= 0) continue;
    const last = merged[merged.length - 1];
    if (last && range.offset <= last.offset + last.size) {
      const end = Math.max(last.offset + last.size, range.offset + range.size);
      merged[merged.length - 1] = { offset: last.offset, size: end - last.offset };
    } else {
      merged.push({ offset: range.offset, size: range.size });
    }
  }
  return merged;
}
