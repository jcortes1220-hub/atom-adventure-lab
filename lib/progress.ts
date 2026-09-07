export type Progress = { found: string[]; completed: string[]; muted: boolean };
export const emptyProgress: Progress = {
  found: [],
  completed: [],
  muted: false,
};
export const storageKey = 'element-lab:v1';
export function readProgress(
  raw: string | null,
  ids: Set<string>,
  missions: Set<string>,
): Progress {
  try {
    const p = JSON.parse(raw || 'null');
    if (!p || typeof p !== 'object') return emptyProgress;
    return {
      found: Array.isArray(p.found)
        ? ([
            ...new Set(
              p.found.filter(
                (v: unknown) => typeof v === 'string' && ids.has(v),
              ),
            ),
          ] as string[])
        : [],
      completed: Array.isArray(p.completed)
        ? ([
            ...new Set(
              p.completed.filter(
                (v: unknown) => typeof v === 'string' && missions.has(v),
              ),
            ),
          ] as string[])
        : [],
      muted: p.muted === true,
    };
  } catch {
    return emptyProgress;
  }
}
