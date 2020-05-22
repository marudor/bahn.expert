import { axios } from 'business-hub';
import { FastaResponse } from 'business-hub/types/Fasta';

export async function fasta(stadaId: string): Promise<FastaResponse> {
  const r = (await axios.get('/fasta/v2/stations/' + stadaId)).data;

  return r;
}
