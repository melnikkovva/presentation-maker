import { PREVIEW_SCALE, WORKSPACE_SCALE } from '../data/const_for_presantation';

export function getScale(
  isPreview: boolean,
  isPlayer: boolean,
  workspaceScale: number = WORKSPACE_SCALE
): number {
  if (isPlayer) return 1;
  if (isPreview) return PREVIEW_SCALE;
  return workspaceScale;
}

export const toUI = (value: number, scale: number) => value * scale;
export const toLogical = (value: number, scale: number) => value / scale;
