import { CustomerListQuery } from '../types/entities';
import { CustomerListQueryResponse } from '../types/responses';

export const getCustomers = async (searchText?: string, options?: RequestInit): Promise<CustomerListQuery[]> => {
  const response = await fetch(
    `/api/customers/list${searchText ? `?searchText=${searchText}` : ''}`,
    options
  );
  if (!response.ok) throw new Error('Failed to fetch customers');

  const data = (await response.json()) as CustomerListQueryResponse[];
  return data.map(item => ({
    id: item.id,
    name: item.name,
    address: item.address,
    email: item.email,
    phone: item.phone,
    iban: item.iban,
    category: item.category
      ? {
          code: item.category.code,
          description: item.category.description,
        }
      : undefined,
  }));
};
