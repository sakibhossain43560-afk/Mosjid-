export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';

export interface JummahDetails {
  estimatedAttendees?: number;
  boxNumber?: string;
  khutbahTopic?: string;
  collectedBy?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  title: string;
  donorOrReceiver?: string;
  paymentMethod: PaymentMethod;
  receiptNo?: string;
  isJummah?: boolean;
  jummahDetails?: JummahDetails;
  notes?: string;
  createdAt: string;
}

export interface MosqueSettings {
  mosqueName: string;
  mosqueArabicName?: string;
  mosqueAddress: string;
  establishedYear: string;
  adminPin: string;
  currencySymbol: string;
  siteUrl: string;
  noticeText: string;
  noticeActive: boolean;
  onlineDonation: {
    bkashPersonal: string;
    bkashMerchant: string;
    nagadNumber: string;
    rocketNumber: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankBranch: string;
    bankRouting: string;
  };
  committeeContacts: {
    mutawalliName: string;
    mutawalliPhone: string;
    cashierName: string;
    cashierPhone: string;
    imamName: string;
    imamPhone: string;
  };
  customIncomeCategories: string[];
  customExpenseCategories: string[];
}
