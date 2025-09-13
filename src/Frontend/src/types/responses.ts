export interface CustomerListQueryResponse {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  category: {
    code: string;
    description: string;
  } | null;
}

export interface SupplierListQueryResponse {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}
