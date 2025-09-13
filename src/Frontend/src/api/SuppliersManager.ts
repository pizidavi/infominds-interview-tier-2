import { SupplierListQuery } from '../types/entities';
import { SupplierListQueryResponse } from '../types/responses';

export const getSuppliers = async (options?: RequestInit): Promise<SupplierListQuery[]> => {
  const response = await fetch('/api/suppliers/list', options);
  if (!response.ok) throw new Error('Failed to fetch suppliers');

  const data = (await response.json()) as SupplierListQueryResponse[];
  return data;
};
