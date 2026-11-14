'use client';

import React, { useState, useMemo } from 'react';
import { Transaction } from '../lib/types';
import {
  formatCurrency,
  formatBengaliDate,
  exportToCSV,
  toBengaliNumber,
} from '../lib/utils';
import {
  Search,
  Download,
  Printer,
  Trash2,
  Edit2,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarCheck,
  Layers,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  useBanglaDigits: boolean;
  currencySymbol: string;
  mosqueName: string;
  isAdmin: boolean;
  onSelectTransaction: (t: Transaction) => void;
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  useBanglaDigits,
  currencySymbol,
  mosqueName,
  isAdmin,
  onSelectTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'jummah'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (activeTab === 'income' && t.type !== 'income') return false;
      if (activeTab === 'expense' && t.type !== 'expense') return false;
      if (activeTab === 'jummah' && (!t.isJummah && t.category !== 'জুমার দান বাক্স')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.donorOrReceiver || '').toLowerCase().includes(q) ||
          (t.receiptNo || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 space-y-3.5">
      {/* Top Header & Export */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
            সকল হিসাবের তালিকা
          </h2>
          <div className="text-[11px] text-slate-500">
            মোট {toBengaliNumber(filtered.length)} টি লেনদেন
          </div>
        </div>

        <button
          onClick={() => exportToCSV(filtered, mosqueName)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          title="এক্সেল ফাইল ডাউনলোড"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>ডাউনলোড</span>
        </button>
      </div>

      {/* Clean Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সব হিসাব
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'income'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          + জমা
        </button>

        <button
          onClick={() => setActiveTab('expense')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'expense'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          - খরচ
        </button>

        <button
          onClick={() => setActiveTab('jummah')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'jummah'
              ? 'bg-gold-600 text-white shadow-sm'
              : 'bg-gold-50 text-gold-800 hover:bg-gold-100'
          }`}
        >
          জুমা
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="খাত বা বিবরণ খুঁজুন..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      {/* Mobile Transaction List Items (Like bKash / Fintech History) */}
      <div className="space-y-2 pt-1">
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
                onClick={() => onSelectTransaction(tx)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
              >
                {/* Left: Icon & Text */}
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
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-700">
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatBengaliDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <div
                      className={`text-sm font-black ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, useBanglaDigits, currencySymbol)}
                    </div>
                    {tx.receiptNo && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        #{tx.receiptNo}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTransaction(tx);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-blue-600"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`আপনি কি "${tx.title}" লেনদেনটি মুছে ফেলতে চান?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
