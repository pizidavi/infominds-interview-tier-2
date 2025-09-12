export interface CustomerListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  category?: {
    code: string;
    description: string;
  };
}
