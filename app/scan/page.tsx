'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, MosqueSettings } from '../../lib/types';
import {
  getStoredTransactions,
  getStoredSettings,
} from '../../lib/storage';
import {
  subscribeToTransactions,
  subscribeToSettings,
} from '../../lib/firebase';
import {
  formatCurrency,
  formatBengaliDate,
  calculateTotals,
  toBengaliNumber,
} from '../../lib/utils';
import { DonationModal } from '../../components/DonationModal';
import {
  Landmark,
  Wallet,
  CalendarCheck,
  TrendingDown,
  TrendingUp,
  HeartHandshake,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function MusalliScanPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<MosqueSettings>(getStoredSettings());
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'jummah'>('all');
  const [search, setSearch] = useState('');
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  useEffect(() => {
    // Initial local read
    setTransactions(getStoredTransactions());
    setSettings(getStoredSettings());

    // Subscribe to cloud updates if Firebase is configured
    const unsubTx = subscribeToTransactions((cloudTx) => {
      setTransactions(cloudTx);
    });
    const unsubMeta = subscribeToSettings((cloudSettings) => {
      setSettings(cloudSettings);
    });

    return () => {
      unsubTx();
      unsubMeta();
    };
  }, []);

  const totals = calculateTotals(transactions);

  // Filter transactions
  const filtered = transactions.filter((t) => {
    if (activeTab === 'income' && t.type !== 'income') return false;
    if (activeTab === 'expense' && t.type !== 'expense') return false;
    if (activeTab === 'jummah' && !t.isJummah && t.category !== 'জুমার দান বাক্স') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.donorOrReceiver || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6 selection:bg-emerald-200">
      {/* Mobile App View Frame */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] sm:rounded-3xl shadow-xl border border-slate-200/80 flex flex-col overflow-hidden">
        {/* Top Mosque Header */}
        <header className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-mosque-900 text-white p-5 pt-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wider text-emerald-200 uppercase">
                মুসল্লি স্বচ্ছতা পোর্টাল
              </span>
            </div>

            <button
              onClick={() => setIsDonationOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-mosque-950 text-xs font-extrabold shadow active:scale-95 transition-transform"
            >
              <HeartHandshake className="w-4 h-4 text-mosque-950" />
              <span>দান করুন</span>
            </button>
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {settings.mosqueName}
          </h1>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            {settings.mosqueAddress}
          </p>
        </header>

        {/* 3 Main Highlights Requested by User */}
        <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-200">
          {/* 1. Total Net Funds (বর্তমান মোট তহবিল) */}
          <div className="bg-gradient-to-r from-emerald-800 to-mosque-900 text-white rounded-2xl p-4 shadow-md border border-emerald-700/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Wallet className="w-3.5 h-3.5 text-gold-400" />
                <span>বর্তমান মোট তহবিল</span>
              </div>
              <div className="text-2xl font-black text-white">
                {formatCurrency(totals.netBalance, true, settings.currencySymbol)}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-700/50 border border-emerald-500/40 flex items-center justify-center text-emerald-200">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* 2 & 3: Shokrobarer Taka & Total Bay in 2 Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* 2. Shokrobarer Taka (শুক্রবার জুমার কালেকশন) */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>শুক্রবার জুমার টাকা</span>
                </div>
                <div className="text-lg font-black text-amber-950">
                  {totals.latestJummah
                    ? formatCurrency(totals.latestJummah.amount, true, settings.currencySymbol)
                    : `${settings.currencySymbol} ০`}
                </div>
              </div>
              <div className="text-[10px] text-amber-800 mt-2 pt-2 border-t border-amber-200/60 flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-600" />
                <span>
                  {totals.latestJummah?.jummahDetails?.estimatedAttendees
                    ? `${toBengaliNumber(totals.latestJummah.jummahDetails.estimatedAttendees)} জন উপস্থিতি`
                    : 'সর্বশেষ শুক্রবার'}
                </span>
              </div>
            </div>

            {/* 3. Total Bay (চলতি মাসের মোট ব্যয়) */}
            <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>চলতি মাসের মোট ব্যয়</span>
                </div>
                <div className="text-lg font-black text-rose-700">
                  {formatCurrency(totals.thisMonthExpense, true, settings.currencySymbol)}
                </div>
              </div>
              <div className="text-[10px] text-rose-700 mt-2 pt-2 border-t border-rose-200/60 font-medium">
                বেতন, বিল ও মেরামত
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খাত বা বিবরণ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border-none text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-4 py-2 border-b border-slate-200 flex gap-1.5 overflow-x-auto bg-white">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            সব হিসাব
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'income'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            আয় / জমা
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'expense'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800'
            }`}
          >
            ব্যয় / খরচ
          </button>
          <button
            onClick={() => setActiveTab('jummah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'jummah'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900'
            }`}
          >
            জুমার কালেকশন
          </button>
        </div>

        {/* Transaction Records List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50">
          <div className="text-xs font-bold text-slate-600 flex justify-between items-center mb-1">
            <span>লেনদেন বিবরণী</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {toBengaliNumber(filtered.length)} টি রেকর্ড
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              কোনো হিসাব পাওয়া যায়নি।
            </div>
          ) : (
            filtered.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{formatBengaliDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-black ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, true, settings.currencySymbol)}
                    </div>
                    {tx.receiptNo && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        #{tx.receiptNo}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar: Back to Full Portal & Online Donation */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            সম্পূর্ণ পোর্টাল দেখুন
          </Link>

          <button
            onClick={() => setIsDonationOpen(true)}
            className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>দান করুন</span>
          </button>
        </div>
      </div>

      {/* Online Donation Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        settings={settings}
      />
    </div>
  );
}

