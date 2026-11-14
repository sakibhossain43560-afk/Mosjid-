'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, MosqueSettings, TransactionType } from '../lib/types';
import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredSettings,
  saveStoredSettings,
  resetToDefaults,
} from '../lib/storage';
import { calculateTotals } from '../lib/utils';
import { Header } from '../components/Header';
import { OverviewStats } from '../components/OverviewStats';
import { JummahTracker } from '../components/JummahTracker';
import { TransactionList } from '../components/TransactionList';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { DonationModal } from '../components/DonationModal';
import { QRCodePoster } from '../components/QRCodePoster';
import { AdminModal } from '../components/AdminModal';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { QuickJummahModal } from '../components/QuickJummahModal';
import { SettingsModal } from '../components/SettingsModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { AdminQuickActions } from '../components/AdminQuickActions';
import { AdminBottomDock } from '../components/AdminBottomDock';
import { PresetPayload } from '../components/AddTransactionModal';
import {
  Heart,
  QrCode,
  Shield,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<MosqueSettings>(getStoredSettings());
  const [isAdmin, setIsAdmin] = useState(false);
  const [useBanglaDigits, setUseBanglaDigits] = useState(true);

  // Modals state
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [addTxInitialType, setAddTxInitialType] = useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [presetData, setPresetData] = useState<PresetPayload | null>(null);
  const [isQuickJummahOpen, setIsQuickJummahOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Load stored data on mount
  useEffect(() => {
    setMounted(true);
    const storedTx = getStoredTransactions();
    const storedSettings = getStoredSettings();
    setTransactions(storedTx);
    setSettings(storedSettings);

    // Load admin state from session storage if any
    const savedAdmin = sessionStorage.getItem('mosque_admin_active');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Sync to API in background (if server API is available)
  const syncWithApi = async (updatedTx: Transaction[], updatedSettings: MosqueSettings) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: updatedTx, settings: updatedSettings }),
      });
    } catch (e) {
      // Ignore background sync errors
    }
  };

  // Add or update transaction
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    editId?: string
  ) => {
    let updated: Transaction[];
    if (editId) {
      updated = transactions.map((t) =>
        t.id === editId
          ? { ...t, ...txData }
          : t
      );
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      updated = [newTx, ...transactions];
    }

    setTransactions(updated);
    saveStoredTransactions(updated);
    syncWithApi(updated, settings);
    setEditingTransaction(null);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated);
    syncWithApi(updated, settings);
  };

  // Save settings
  const handleSaveSettings = (newSettings: MosqueSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    syncWithApi(transactions, newSettings);
  };

  // 1-Click Quick Preset handler
  const handleQuickPreset = (preset: PresetPayload) => {
    setEditingTransaction(null);
    setPresetData(preset);
    setAddTxInitialType(preset.type);
    setIsAddTxOpen(true);
  };

  // Import backup data
  const handleImportData = (importedData: {
    settings?: MosqueSettings;
    transactions?: Transaction[];
  }) => {
    if (importedData.transactions) {
      setTransactions(importedData.transactions);
      saveStoredTransactions(importedData.transactions);
    }
    if (importedData.settings) {
      setSettings(importedData.settings);
      saveStoredSettings(importedData.settings);
    }
    syncWithApi(
      importedData.transactions || transactions,
      importedData.settings || settings
    );
  };

  // Reset data to defaults
  const handleResetData = () => {
    const { transactions: defaultTx, settings: defaultSettings } = resetToDefaults();
    setTransactions(defaultTx);
    setSettings(defaultSettings);
    syncWithApi(defaultTx, defaultSettings);
  };

  // Admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('mosque_admin_active', 'true');
  };

  // Admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('mosque_admin_active');
  };

  // Calculate totals
  const totals = calculateTotals(transactions);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-mosque-200 selection:text-mosque-900">
      {/* Top Header & Navigation */}
      <Header
        settings={settings}
        isAdmin={isAdmin}
        useBanglaDigits={useBanglaDigits}
        onToggleDigits={() => setUseBanglaDigits(!useBanglaDigits)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenAddIncome={() => {
          setEditingTransaction(null);
          setAddTxInitialType('income');
          setIsAddTxOpen(true);
        }}
        onOpenAddExpense={() => {
          setEditingTransaction(null);
          setAddTxInitialType('expense');
          setIsAddTxOpen(true);
        }}
        onOpenQuickJummah={() => setIsQuickJummahOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        {/* 1. Primary Overview Stats (4 Cards) */}
        <section aria-label="তহবিল সারাংশ">
          <OverviewStats
            totals={totals}
            useBanglaDigits={useBanglaDigits}
            currencySymbol={settings.currencySymbol}
          />
        </section>

        {/* 1.1 Admin Quick Actions Bar (Shown when Admin/Committee is active) */}
        {isAdmin && (
          <section aria-label="কমিটি কুইক অ্যাকশন">
            <AdminQuickActions
              onQuickPreset={handleQuickPreset}
              onOpenQuickJummah={() => setIsQuickJummahOpen(true)}
              onOpenAddIncome={() => {
                setEditingTransaction(null);
                setPresetData(null);
                setAddTxInitialType('income');
                setIsAddTxOpen(true);
              }}
              onOpenAddExpense={() => {
                setEditingTransaction(null);
                setPresetData(null);
                setAddTxInitialType('expense');
                setIsAddTxOpen(true);
              }}
            />
          </section>
        )}

        {/* 2. Jummah Collection Tracker Section */}
        <section aria-label="জুমার নামাজ কালেকশন">
          <JummahTracker
            jummahTransactions={totals.jummahTransactions}
            averageJummah={totals.averageJummah}
            totalJummahIncome={totals.totalJummahIncome}
            useBanglaDigits={useBanglaDigits}
            currencySymbol={settings.currencySymbol}
            isAdmin={isAdmin}
            onOpenQuickJummah={() => setIsQuickJummahOpen(true)}
            onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
          />
        </section>

        {/* 3. Detailed Transaction Ledger (Table & Filter Tabs) */}
        <section aria-label="সকল হিসাব বিবরণী">
          <TransactionList
            transactions={transactions}
            useBanglaDigits={useBanglaDigits}
            currencySymbol={settings.currencySymbol}
            mosqueName={settings.mosqueName}
            isAdmin={isAdmin}
            onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setAddTxInitialType(tx.type);
              setIsAddTxOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </section>

        {/* 4. Category Visual Breakdown (Incomes & Expenses) */}
        <section aria-label="খাতভিত্তিক বিশ্লেষণ">
          <CategoryBreakdown
            transactions={transactions}
            useBanglaDigits={useBanglaDigits}
            currencySymbol={settings.currencySymbol}
          />
        </section>

        {/* 5. Online Donation Callout Banner for Musallis */}
        <section className="bg-gradient-to-r from-mosque-900 via-mosque-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-mosque-700/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold border border-gold-400/30">
              <HeartHandshake className="w-3.5 h-3.5 text-gold-400" />
              <span>আল্লাহর সন্তুষ্টির জন্য সদকা করুন</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              মসজিদের উন্নয়ন তহবিলে অংশ নিন
            </h3>
            <p className="text-xs sm:text-sm text-mosque-200 max-w-xl">
              বিকাশ, নগদ, রকেট অথবা সরাসরি ব্যাংকে অনুদান পাঠাতে পারবেন। প্রতিটি টাকার হিসাব এখানে উন্মুক্তভাবে সংরক্ষিত থাকে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => setIsDonationOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-mosque-950 font-extrabold text-sm sm:text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-mosque-950" />
              <span>অনলাইন অনুদান নম্বরসমূহ</span>
            </button>

            <button
              onClick={() => setIsQROpen(true)}
              className="px-4 py-3 rounded-2xl bg-mosque-800/80 hover:bg-mosque-700 text-white font-semibold text-sm border border-mosque-600 transition-colors flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-gold-300" />
              <span>কিউআর পোস্টার</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="text-white font-bold text-sm flex items-center justify-center md:justify-start gap-1.5">
              <span>🕌</span>
              <span>{settings.mosqueName}</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1">
              স্বচ্ছ ও আধুনিক ডিজিটাল হিসাব পোর্টাল • সর্বস্বত্ব সংরক্ষিত © {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsQROpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-gold-400" />
              <span>কিউআর কোড পোস্টার</span>
            </button>

            <span className="text-slate-700">•</span>

            <button
              onClick={() => setIsDonationOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>অনলাইন অনুদান</span>
            </button>

            <span className="text-slate-700">•</span>

            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => setIsAdminAuthOpen(true)}
                className="hover:text-white transition-colors"
              >
                কমিটি লগইন
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* All Application Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        settings={settings}
      />

      <QRCodePoster
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        settings={settings}
      />

      <AdminModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccessLogin={handleAdminLoginSuccess}
        correctPin={settings.adminPin}
      />

      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTransaction(null);
          setPresetData(null);
        }}
        onSave={handleSaveTransaction}
        incomeCategories={settings.customIncomeCategories}
        expenseCategories={settings.customExpenseCategories}
        initialType={addTxInitialType}
        editingTransaction={editingTransaction}
        presetData={presetData}
      />

      {/* Mobile Sticky Floating Dock when Admin is active */}
      {isAdmin && (
        <AdminBottomDock
          onOpenAddIncome={() => {
            setEditingTransaction(null);
            setPresetData(null);
            setAddTxInitialType('income');
            setIsAddTxOpen(true);
          }}
          onOpenAddExpense={() => {
            setEditingTransaction(null);
            setPresetData(null);
            setAddTxInitialType('expense');
            setIsAddTxOpen(true);
          }}
          onOpenQuickJummah={() => setIsQuickJummahOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <QuickJummahModal
        isOpen={isQuickJummahOpen}
        onClose={() => setIsQuickJummahOpen(false)}
        onSave={handleSaveTransaction}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        transactions={transactions}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        settings={settings}
        useBanglaDigits={useBanglaDigits}
      />
    </div>
  );
}
