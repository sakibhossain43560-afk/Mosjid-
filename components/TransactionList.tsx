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
  Filter,
  Download,
  Printer,
  Trash2,
  Edit2,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth'>('all');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'amountDesc'>('dateDesc');

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions
      .filter((t) => {
        // Tab filter
        if (activeTab === 'income' && t.type !== 'income') return false;
        if (activeTab === 'expense' && t.type !== 'expense') return false;
        if (activeTab === 'jummah' && (!t.isJummah && t.category !== 'জুমার দান বাক্স')) return false;

        // Category filter
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

        // Date filter
        if (dateFilter !== 'all') {
          const tDate = new Date(t.date);
          if (dateFilter === 'thisMonth') {
            if (tDate.getFullYear() !== currentYear || tDate.getMonth() !== currentMonth) return false;
          } else if (dateFilter === 'lastMonth') {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            if (tDate.getFullYear() !== lastMonthYear || tDate.getMonth() !== lastMonth) return false;
          }
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchCat = t.category.toLowerCase().includes(q);
          const matchPerson = (t.donorOrReceiver || '').toLowerCase().includes(q);
          const matchReceipt = (t.receiptNo || '').toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchPerson && !matchReceipt && !matchNotes) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dateDesc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'dateAsc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amountDesc') return b.amount - a.amount;
        return 0;
      });
  }, [transactions, activeTab, selectedCategory, dateFilter, searchQuery, sortBy]);

  // Calculated totals of current view
  const currentViewIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const currentViewExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Top Header & Tabs */}
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              আয় ও ব্যয়ের স্বচ্ছ হিসাব বিবরণী
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              সকল লেনদেনের তারিখ, ক্যাটাগরি, পরিমাণ ও ভাউচার বিবরণ
            </p>
          </div>

          {/* Action buttons (CSV Download & Print) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredTransactions, mosqueName)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              title="এক্সেল / সিএসভি ফাইল ডাউনলোড করুন"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>ডাউনলোড (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              title="এই তালিকাটি প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-mosque-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব হিসাব ({useBanglaDigits ? toBengaliNumber(transactions.length) : transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('income')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            + আয় / জমা
          </button>

          <button
            onClick={() => setActiveTab('expense')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'expense'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            - ব্যয় / খরচ
          </button>

          <button
            onClick={() => setActiveTab('jummah')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'jummah'
                ? 'bg-gold-600 text-white shadow-sm'
                : 'bg-gold-50 text-gold-800 hover:bg-gold-100'
            }`}
          >
            🕌 জুমার কালেকশন
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খাত, বিবরণ, দাতা খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600 text-slate-700"
            >
              <option value="all">সকল খাত (সব ক্যাটাগরি)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600 text-slate-700"
            >
              <option value="all">সব সময় (সকল তারিখ)</option>
              <option value="thisMonth">চলতি মাস</option>
              <option value="lastMonth">বিগত মাস</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600 text-slate-700"
            >
              <option value="dateDesc">তারিখ (নতুন আগে)</option>
              <option value="dateAsc">তারিখ (পুরানো আগে)</option>
              <option value="amountDesc">টাকার পরিমাণ (বড় আগে)</option>
            </select>
          </div>
        </div>

        {/* Dynamic sub-summary of filtered items */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            প্রদর্শিত হিসাব: <strong className="text-slate-700">{useBanglaDigits ? toBengaliNumber(filteredTransactions.length) : filteredTransactions.length}</strong> টি লেনদেন
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">
              মোট জমা: {formatCurrency(currentViewIncome, useBanglaDigits, currencySymbol)}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-700 font-semibold">
              মোট খরচ: {formatCurrency(currentViewExpense, useBanglaDigits, currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Records */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium">কোনো হিসাব পাওয়া যায়নি।</p>
          <p className="text-xs text-slate-400 mt-1">
            অনুগ্রহ করে ফিল্টার পরিবর্তন করুন বা নতুন এন্ট্রি যুক্ত করুন।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">ধরন ও খাত</th>
                <th className="py-3 px-4">বিবরণ ও দাতা/গ্রহীতা</th>
                <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
                <th className="py-3 px-4 text-right">টাকার পরিমাণ</th>
                <th className="py-3 px-4 text-center">রশিদ / ভাউচার</th>
                {isAdmin && <th className="py-3 px-4 text-center">অ্যাকশন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {formatBengaliDate(tx.date)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {tx.isJummah ? '🕌 শুক্রবার' : ''}
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isIncome ? (
                            <>
                              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                              আয়
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-rose-600" />
                              ব্যয়
                            </>
                          )}
                        </span>
                      </div>
                      <span className="font-medium text-slate-700 text-xs">
                        {tx.category}
                      </span>
                    </td>

                    {/* Title & Donor/Receiver */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-mosque-800 transition-colors">
                        {tx.title}
                      </div>
                      {tx.donorOrReceiver && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {isIncome ? 'দাতা: ' : 'গ্রহীতা/ব্যয়কারী: '}
                          <span className="font-medium text-slate-700">
                            {tx.donorOrReceiver}
                          </span>
                        </div>
                      )}
                      {tx.notes && (
                        <div className="text-[11px] text-slate-400 italic line-clamp-1">
                          মন্তব্য: {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {tx.paymentMethod === 'cash' && 'নগদ ক্যাশ'}
                        {tx.paymentMethod === 'bkash' && 'বিকাশ'}
                        {tx.paymentMethod === 'nagad' && 'নগদ (Nagad)'}
                        {tx.paymentMethod === 'rocket' && 'রকেট'}
                        {tx.paymentMethod === 'bank' && 'ব্যাংক'}
                      </span>
                      {tx.receiptNo && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          #{tx.receiptNo}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`text-base font-extrabold ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, useBanglaDigits, currencySymbol)}
                      </span>
                    </td>

                    {/* Receipt preview trigger */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-colors"
                        title="রশিদ দেখুন ও প্রিন্ট করুন"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>রশিদ</span>
                      </button>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTransaction(tx);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`আপনি কি "${tx.title}" লেনদেনটি মুছে ফেলতে চান?`)) {
                                onDeleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
