import { v4 as uuidv4 } from 'uuid';
import type {
  AppState, Organisation, User, OrgMembership, Customer,
  FeeCategory, PaymentRequest, Transaction, Receipt, PaymentProviderConfig, ImportJob
} from './types';

const STORAGE_KEY = 'payx_data';

const defaultState: AppState = {
  organisations: [],
  users: [],
  memberships: [],
  customers: [],
  feeCategories: [],
  paymentRequests: [],
  transactions: [],
  receipts: [],
  providerConfigs: [],
  importJobs: [],
  currentUserId: null,
  currentOrgId: null,
};

// Demo organisation setup
const DEMO_ORG_ID = 'demo-org-northstar';
const DEMO_USER_ID = 'demo-user';

function getDemoState(): AppState {
  const now = new Date().toISOString();
  const demoOrg: Organisation = {
    id: DEMO_ORG_ID,
    name: 'Northstar Learning Centre',
    type: 'coaching',
    email: 'admin@northstar-demo.example',
    phone: '+91 98765 43210',
    address: '42 Knowledge Park, Sector 15',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001',
    country: 'India',
    website: 'https://northstar-demo.example',
    createdAt: now,
    updatedAt: now,
  };

  const demoUser: User = {
    id: DEMO_USER_ID,
    email: 'demo@payx.example',
    name: 'Demo User',
    passwordHash: 'demo',
    createdAt: now,
  };

  const demoMembership: OrgMembership = {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    organisationId: DEMO_ORG_ID,
    role: 'owner',
    createdAt: now,
  };

  const demoCustomers: Customer[] = [
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 00001', referenceId: 'STU-001', createdAt: now, updatedAt: now },
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 00002', referenceId: 'STU-002', createdAt: now, updatedAt: now },
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Rohan Gupta', email: 'rohan@example.com', phone: '+91 98765 00003', referenceId: 'STU-003', createdAt: now, updatedAt: now },
  ];

  const demoFees: FeeCategory[] = [
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Course Registration', description: 'One-time course registration fee', defaultAmount: 500, createdAt: now },
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Tuition Fee', description: 'Monthly tuition fee', defaultAmount: 2000, createdAt: now },
    { id: uuidv4(), organisationId: DEMO_ORG_ID, name: 'Event Registration', description: 'Annual day event registration', defaultAmount: 750, createdAt: now },
  ];

  const demoPaymentRequests: PaymentRequest[] = [
    { id: 'demo-pr-1', organisationId: DEMO_ORG_ID, title: 'Course Registration', description: 'One-time course registration fee for Batch 2026', amount: 500, isFixedAmount: true, customerName: 'Aarav Sharma', customerEmail: 'aarav@example.com', customerRef: 'STU-001', status: 'active', createdAt: now },
    { id: 'demo-pr-2', organisationId: DEMO_ORG_ID, title: 'Tuition Fee', description: 'Monthly tuition fee for January 2026', amount: 2000, isFixedAmount: true, customerName: 'Priya Patel', customerEmail: 'priya@example.com', customerRef: 'STU-002', status: 'active', createdAt: now },
    { id: 'demo-pr-3', organisationId: DEMO_ORG_ID, title: 'Event Registration', description: 'Annual Day 2026 event registration', amount: 750, isFixedAmount: true, customerName: 'Rohan Gupta', customerEmail: 'rohan@example.com', customerRef: 'STU-003', status: 'active', createdAt: now },
  ];

  const demoTransactions: Transaction[] = [
    { id: 'demo-tx-1', organisationId: DEMO_ORG_ID, paymentRequestId: 'demo-pr-1', amount: 500, currency: 'INR', status: 'success', method: 'upi', providerRef: 'DEMO-TXN-001', customerName: 'Aarav Sharma', customerEmail: 'aarav@example.com', customerRef: 'STU-001', description: 'Course Registration', isDemo: true, createdAt: now, updatedAt: now, paidAt: now },
    { id: 'demo-tx-2', organisationId: DEMO_ORG_ID, paymentRequestId: 'demo-pr-2', amount: 2000, currency: 'INR', status: 'success', method: 'upi', providerRef: 'DEMO-TXN-002', customerName: 'Priya Patel', customerEmail: 'priya@example.com', customerRef: 'STU-002', description: 'Tuition Fee', isDemo: true, createdAt: now, updatedAt: now, paidAt: now },
  ];

  const demoReceipts: Receipt[] = [
    { id: uuidv4(), organisationId: DEMO_ORG_ID, transactionId: 'demo-tx-1', receiptNumber: 'NS-2026-0001', isDemo: true, createdAt: now },
    { id: uuidv4(), organisationId: DEMO_ORG_ID, transactionId: 'demo-tx-2', receiptNumber: 'NS-2026-0002', isDemo: true, createdAt: now },
  ];

  const demoProviderConfig: PaymentProviderConfig = {
    organisationId: DEMO_ORG_ID,
    mode: 'demo',
    provider: 'mock',
    enabled: true,
  };

  return {
    ...defaultState,
    organisations: [demoOrg],
    users: [demoUser],
    memberships: [demoMembership],
    customers: demoCustomers,
    feeCategories: demoFees,
    paymentRequests: demoPaymentRequests,
    transactions: demoTransactions,
    receipts: demoReceipts,
    providerConfigs: [demoProviderConfig],
    currentUserId: DEMO_USER_ID,
    currentOrgId: DEMO_ORG_ID,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...defaultState };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function initDemoState(): AppState {
  const state = getDemoState();
  saveState(state);
  return state;
}

export function isDemoMode(state: AppState): boolean {
  return state.currentOrgId === DEMO_ORG_ID;
}

// CRUD Operations
export function createOrganisation(state: AppState, org: Omit<Organisation, 'id' | 'createdAt' | 'updatedAt'>): { state: AppState; org: Organisation } {
  const newOrg: Organisation = {
    ...org,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newState = { ...state, organisations: [...state.organisations, newOrg] };
  saveState(newState);
  return { state: newState, org: newOrg };
}

export function createUser(state: AppState, user: Omit<User, 'id' | 'createdAt'>): { state: AppState; user: User } {
  const newUser: User = {
    ...user,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const newState = { ...state, users: [...state.users, newUser] };
  saveState(newState);
  return { state: newState, user: newUser };
}

export function createMembership(state: AppState, membership: Omit<OrgMembership, 'id' | 'createdAt'>): { state: AppState; membership: OrgMembership } {
  const newMembership: OrgMembership = {
    ...membership,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const newState = { ...state, memberships: [...state.memberships, newMembership] };
  saveState(newState);
  return { state: newState, membership: newMembership };
}

export function createCustomer(state: AppState, customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): { state: AppState; customer: Customer } {
  const newCustomer: Customer = {
    ...customer,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newState = { ...state, customers: [...state.customers, newCustomer] };
  saveState(newState);
  return { state: newState, customer: newCustomer };
}

export function createPaymentRequest(state: AppState, pr: Omit<PaymentRequest, 'id' | 'createdAt'>): { state: AppState; pr: PaymentRequest } {
  const newPR: PaymentRequest = {
    ...pr,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const newState = { ...state, paymentRequests: [...state.paymentRequests, newPR] };
  saveState(newState);
  return { state: newState, pr: newPR };
}

export function createTransaction(state: AppState, tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): { state: AppState; tx: Transaction } {
  const newTx: Transaction = {
    ...tx,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newState = { ...state, transactions: [...state.transactions, newTx] };
  saveState(newState);
  return { state: newState, tx: newTx };
}

export function updateTransaction(state: AppState, txId: string, updates: Partial<Transaction>): AppState {
  const newState = {
    ...state,
    transactions: state.transactions.map(tx =>
      tx.id === txId ? { ...tx, ...updates, updatedAt: new Date().toISOString() } : tx
    ),
  };
  saveState(newState);
  return newState;
}

export function createReceipt(state: AppState, receipt: Omit<Receipt, 'id' | 'createdAt'>): { state: AppState; receipt: Receipt } {
  const newReceipt: Receipt = {
    ...receipt,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const newState = { ...state, receipts: [...state.receipts, newReceipt] };
  saveState(newState);
  return { state: newState, receipt: newReceipt };
}

export function createFeeCategory(state: AppState, fee: Omit<FeeCategory, 'id' | 'createdAt'>): { state: AppState; fee: FeeCategory } {
  const newFee: FeeCategory = {
    ...fee,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const newState = { ...state, feeCategories: [...state.feeCategories, newFee] };
  saveState(newState);
  return { state: newState, fee: newFee };
}

export function updateOrganisation(state: AppState, orgId: string, updates: Partial<Organisation>): AppState {
  const newState = {
    ...state,
    organisations: state.organisations.map(org =>
      org.id === orgId ? { ...org, ...updates, updatedAt: new Date().toISOString() } : org
    ),
  };
  saveState(newState);
  return newState;
}

export function deleteCustomer(state: AppState, customerId: string): AppState {
  const newState = { ...state, customers: state.customers.filter(c => c.id !== customerId) };
  saveState(newState);
  return newState;
}

export function getNextReceiptNumber(state: AppState, orgId: string): string {
  const orgReceipts = state.receipts.filter(r => r.organisationId === orgId);
  const org = state.organisations.find(o => o.id === orgId);
  const prefix = org ? org.name.substring(0, 2).toUpperCase() : 'RC';
  const year = new Date().getFullYear();
  const nextNum = (orgReceipts.length + 1).toString().padStart(4, '0');
  return `${prefix}-${year}-${nextNum}`;
}

export function getOrgTransactions(state: AppState, orgId: string): Transaction[] {
  return state.transactions.filter(t => t.organisationId === orgId);
}

export function getOrgPaymentRequests(state: AppState, orgId: string): PaymentRequest[] {
  return state.paymentRequests.filter(p => p.organisationId === orgId);
}

export function getOrgCustomers(state: AppState, orgId: string): Customer[] {
  return state.customers.filter(c => c.organisationId === orgId);
}

export function getOrgReceipts(state: AppState, orgId: string): Receipt[] {
  return state.receipts.filter(r => r.organisationId === orgId);
}

export function getOrgFeeCategories(state: AppState, orgId: string): FeeCategory[] {
  return state.feeCategories.filter(f => f.organisationId === orgId);
}

export function getUserMembership(state: AppState, userId: string, orgId: string): OrgMembership | undefined {
  return state.memberships.find(m => m.userId === userId && m.organisationId === orgId);
}

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt on server
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hashed_${Math.abs(hash).toString(36)}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
