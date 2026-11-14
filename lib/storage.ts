import { MosqueSettings, Transaction } from './types';
import { DEFAULT_SETTINGS, INITIAL_TRANSACTIONS } from './initialData';

const TRANSACTIONS_KEY = 'mosque_transactions_v1';
const SETTINGS_KEY = 'mosque_settings_v1';

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    if (!data) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
}

export function getStoredSettings(): MosqueSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: MosqueSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

export function resetToDefaults(): {
  transactions: Transaction[];
  settings: MosqueSettings;
} {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
  return {
    transactions: INITIAL_TRANSACTIONS,
    settings: DEFAULT_SETTINGS,
  };
}

