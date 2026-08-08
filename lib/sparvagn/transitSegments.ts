import {transitNetwork} from './transit';

export interface PreparedSegment {
  p1: [number, number];
  p2: [number, number];
  color: string;
  name: string;
  offset: number;
}

const OFFSET_GAP = 5;

export const preparedTransitSegments: PreparedSegment[] = (() => {
  interface LocalSegmentData {
    p1: [number, number];
    p2: [number, number];
    lines: { id: string; name: string; color: string }[];
  }

  const segmentMap = new Map<string, LocalSegmentData>();

  transitNetwork.lines.forEach((line) => {
    for (let i = 0; i < line.stops.length - 1; i++) {
      const s1 = line.stops[i];
      const s2 = line.stops[i + 1];
      const key = [s1.name, s2.name].sort().join("::");

      if (!segmentMap.has(key)) {
        segmentMap.set(key, {
          p1: [s1.lat, s1.lng],
          p2: [s2.lat, s2.lng],
          lines: [],
        });
      }

      const segData = segmentMap.get(key)!;
      if (!segData.lines.some((l) => l.id === line.id)) {
        segData.lines.push({ id: line.id, name: line.name, color: line.color });
      }
    }
  });

  const prepared: PreparedSegment[] = [];

  segmentMap.forEach((seg) => {
    const lineCount = seg.lines.length;
    seg.lines.forEach((line, idx) => {
      const localOffset = (idx - (lineCount - 1) / 2) * OFFSET_GAP;
      prepared.push({
        p1: seg.p1,
        p2: seg.p2,
        color: line.color,
        name: line.name,
        offset: localOffset,
      });
    });
  });

  return prepared;
})();