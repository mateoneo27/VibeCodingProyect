import type { DatosPersonales } from '../types';

type NameParts = Partial<Pick<DatosPersonales, 'nombres' | 'apellidoPaterno' | 'apellidoMaterno'>>;

export function buildNombreCompleto(dp?: NameParts | null, fallback = ''): string {
  if (!dp) return fallback;

  const parts = [dp.nombres, dp.apellidoPaterno, dp.apellidoMaterno]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : fallback;
}
