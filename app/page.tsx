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
import {
  subscribeToTransactions,
  subscribeToSettings,
  syncTransactionToCloud,
  deleteTransactionFromCloud,
  syncSettingsToCloud,
} from '../lib/firebase';
import { calculateTotals } from '../lib/utils';
import { Header } from '../components/Header';
import { OverviewStats } from '../components/OverviewStats';
import { JummahTracker } from '../components/JummahTracker';
import { TransactionList } from '../components/TransactionList';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { DonationModal } from '../components/DonationModal';
import { QRCodePoster } from '../components/QRCodePoster';
import { AdminModal } from '../components/AdminModal';
import { AddTransactionModal, PresetPayload } from '../components/AddTransactionModal';
import { QuickJummahModal } from '../components/QuickJummahModal';
import { SettingsModal } from '../components/SettingsModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { AdminQuickActions } from '../components/AdminQuickActions';
import { MobileNavigation, AppPage } from '../components/MobileNavigation';
import { MenuView } from '../components/MenuView';
import {
  HeartHandshake,
  QrCode,
  CalendarCheck,
  FileText,
  PlusCircle,
  Landmark,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
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

  // Load stored data and subscribe to Cloud Firebase on mount
  useEffect(() => {
    setMounted(true);
    setTransactions(getStoredTransactions());
    setSettings(getStoredSettings());

    const savedAdmin = sessionStorage.getItem('mosque_admin_active');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // Subscribe to Firebase real-time sync
    const unsubTx = subscribeToTransactions((cloudTx) => {
      if (cloudTx && cloudTx.length > 0) {
        setTransactions(cloudTx);
        saveStoredTransactions(cloudTx);
      }
    });

    const unsubMeta = subscribeToSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettings(cloudSettings);
        saveStoredSettings(cloudSettings);
      }
    });

    return () => {
      unsubTx();
      unsubMeta();
    };
  }, []);

  // Add or update transaction
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    editId?: string
  ) => {
    let updatedTx: Transaction;
    let updated: Transaction[];

    if (editId) {
      updated = transactions.map((t) => {
        if (t.id === editId) {
          updatedTx = { ...t, ...txData };
          return updatedTx;
        }
        return t;
      });
    } else {
      updatedTx = {
        ...txData,
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      updated = [updatedTx, ...transactions];
    }

    setTransactions(updated);
    saveStoredTransactions(updated);
    if (updatedTx!) {
      syncTransactionToCloud(updatedTx);
    }
    setEditingTransaction(null);
    setPresetData(null);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated);
    deleteTransactionFromCloud(id);
  };

  // Save settings
  const handleSaveSettings = (newSettings: MosqueSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    syncSettingsToCloud(newSettings);
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
      importedData.transactions.forEach((tx) => syncTransactionToCloud(tx));
    }
    if (importedData.settings) {
      setSettings(importedData.settings);
      saveStoredSettings(importedData.settings);
      syncSettingsToCloud(importedData.settings);
    }
  };

  // Reset data to defaults
  const handleResetData = () => {
    const { transactions: defaultTx, settings: defaultSettings } = resetToDefaults();
    setTransactions(defaultTx);
    setSettings(defaultSettings);
    defaultTx.forEach((tx) => syncTransactionToCloud(tx));
    syncSettingsToCloud(defaultSettings);
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
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-emerald-200 selection:text-emerald-900 pb-20 sm:pb-0">
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
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Container - Sized cleanly for Mobile App Experience */}
      <main className="max-w-xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1 space-y-4">
        {/* VIEW 1: HOME DASHBOARD */}
        {currentPage === 'home' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Overview Stats (4 Cards) */}
            <OverviewStats
              totals={totals}
              useBanglaDigits={useBanglaDigits}
              currencySymbol={settings.currencySymbol}
            />

            {/* Quick Action Buttons for Easy Entry */}
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

            {/* Visual Category Breakdown */}
            <CategoryBreakdown
              transactions={transactions}
              useBanglaDigits={useBanglaDigits}
              currencySymbol={settings.currencySymbol}
            />

            {/* Quick Banner: Scan View */}
            <div className="bg-gradient-to-r from-emerald-900 to-mosque-950 text-white rounded-3xl p-5 shadow-md flex items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  মুসল্লিদের জন্য উন্মুক্ত স্ক্যান পেজ
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  শুক্রবার জুমার টাকা ও বর্তমান ফান্ড লাইভ দেখুন
                </p>
              </div>
              <Link
                href="/scan"
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-mosque-950 font-bold text-xs shrink-0 shadow"
              >
                স্ক্যান পেজ
              </Link>
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED JUMMAH PAGE */}
        {currentPage === 'jummah' && (
          <div className="space-y-4 animate-in fade-in">
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
          </div>
        )}

        {/* VIEW 3: DEDICATED LEDGER / TRANSACTIONS PAGE */}
        {currentPage === 'ledger' && (
          <div className="space-y-4 animate-in fade-in">
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
          </div>
        )}

        {/* VIEW 4: DEDICATED ADD ENTRY PAGE */}
        {currentPage === 'add' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
              <h2 className="text-base font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>নতুন হিসাব এন্ট্রি করুন</span>
              </h2>

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
            </div>
          </div>
        )}

        {/* VIEW 5: DEDICATED MENU / SETTINGS PAGE */}
        {currentPage === 'menu' && (
          <div className="space-y-4 animate-in fade-in">
            <MenuView
              settings={settings}
              isAdmin={isAdmin}
              onOpenQR={() => setIsQROpen(true)}
              onOpenDonation={() => setIsDonationOpen(true)}
              onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onAdminLogout={handleAdminLogout}
              useBanglaDigits={useBanglaDigits}
              onToggleDigits={() => setUseBanglaDigits(!useBanglaDigits)}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar - Android App Feel */}
      <MobileNavigation
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isAdmin={isAdmin}
        onOpenAddIncome={() => {
          setEditingTransaction(null);
          setPresetData(null);
          setAddTxInitialType('income');
          setIsAddTxOpen(true);
        }}
      />

      {/* Application Modals */}
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
