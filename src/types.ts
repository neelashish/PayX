// PayX Type Definitions

export type OrganisationType = 
  | 'school' 
  | 'college' 
  | 'coaching' 
  | 'ngo' 
  | 'club' 
  | 'healthcare' 
  | 'business' 
  | 'other';

export type UserRole = 'owner' | 'admin' | 'staff' | 'readonly';

export type PaymentMode = 'demo' | 'test' | 'live';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface Organisation {
  id: string;
  name: string;
  type: OrganisationType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface OrgMembership {
  id: string;
  userId: string;
  organisationId: string;
  role: UserRole;
  createdAt: string;
}

export interface Customer {
  id: string;
  organisationId: string;
  name: string;
  email?: string;
  phone?: string;
  referenceId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCategory {
  id: string;
  organisationId: string;
  name: string;
  description?: string;
  defaultAmount?: number;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  organisationId: string;
  title: string;
  description?: string;
  amount: number;
  minAmount?: number;
  maxAmount?: number;
  isFixedAmount: boolean;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerRef?: string;
  dueDate?: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
}

export interface Transaction {
  id: string;
  organisationId: string;
  paymentRequestId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  providerRef?: string;
  customerName?: string;
  customerEmail?: string;
  customerRef?: string;
  description?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface Receipt {
  id: string;
  organisationId: string;
  transactionId: string;
  receiptNumber: string;
  isDemo: boolean;
  createdAt: string;
}

export interface PaymentProviderConfig {
  organisationId: string;
  mode: PaymentMode;
  provider: 'mock' | 'razorpay' | 'upi';
  credentials?: Record<string, string>;
  enabled: boolean;
}

export interface ImportJob {
  id: string;
  organisationId: string;
  type: 'customers' | 'transactions';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: string[];
  createdAt: string;
}

export interface AppState {
  organisations: Organisation[];
  users: User[];
  memberships: OrgMembership[];
  customers: Customer[];
  feeCategories: FeeCategory[];
  paymentRequests: PaymentRequest[];
  transactions: Transaction[];
  receipts: Receipt[];
  providerConfigs: PaymentProviderConfig[];
  importJobs: ImportJob[];
  currentUserId: string | null;
  currentOrgId: string | null;
}
