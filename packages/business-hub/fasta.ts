import { request } from './request';
import type { FastaResponse } from 'business-hub/types/Fasta';

export async function fasta(stadaId: string): Promise<FastaResponse> {
  const r = await request.get<FastaResponse>('/fasta/v2/stations/' + stadaId);

  return r.data;
}
