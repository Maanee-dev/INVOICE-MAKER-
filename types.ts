
export enum DocumentType {
  INVOICE = 'INVOICE',
  QUOTATION = 'QUOTATION'
}

export interface LineItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  taxId?: string;
}

export interface AgencyInfo {
  name: string;
  email: string;
  address: string;
  website: string;
  phone: string;
  registration?: string;
}

export interface DocumentData {
  id: string;
  type: DocumentType;
  date: string;
  dueDate: string;
  client: ClientInfo;
  agency: AgencyInfo;
  items: LineItem[];
  notes: string;
  taxRate: number;
  discount: number;
  currency: string;
}
