'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../lib/types';
import {
  X,
  PlusCircle,
  Save,
  Calendar,
  Layers,
  FileText,
  User,
  CreditCard,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface PresetPayload {
  type: TransactionType;
  category: string;
  title: string;
  donorOrReceiver?: string;
  suggestedAmount?: number;
  isJummah?: boolean;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>, editId?: string) => void;
  incomeCategories: string[];
  expenseCategories: string[];
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
  presetData?: PresetPayload | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  incomeCategories,
  expenseCategories,
  initialType = 'income',
  editingTransaction,
  presetData,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [category, setCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState<string>('');
  const [donorOrReceiver, setDonorOrReceiver] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [isJummah, setIsJummah] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<string>('');
  const [boxNumber, setBoxNumber] = useState<string>('');
  const [khutbahTopic, setKhutbahTopic] = useState<string>('');
  const [collectedBy, setCollectedBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Quick Amount preset chips
  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000, 20000];

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setTitle(editingTransaction.title);
      setDonorOrReceiver(editingTransaction.donorOrReceiver || '');
      setPaymentMethod(editingTransaction.paymentMethod);
      setReceiptNo(editingTransaction.receiptNo || '');
      setIsJummah(!!editingTransaction.isJummah);
      setAttendees(editingTransaction.jummahDetails?.estimatedAttendees?.toString() || '');
      setBoxNumber(editingTransaction.jummahDetails?.boxNumber || '');
      setKhutbahTopic(editingTransaction.jummahDetails?.khutbahTopic || '');
      setCollectedBy(editingTransaction.jummahDetails?.collectedBy || '');
      setNotes(editingTransaction.notes || '');
      setIsCustomCategory(false);
    } else if (presetData) {
      // Applied from 1-click Preset
      setType(presetData.type);
      setCategory(presetData.category);
      setAmount(presetData.suggestedAmount ? presetData.suggestedAmount.toString() : '');
      setDate(new Date().toISOString().split('T')[0]);
      setTitle(presetData.title);
      setDonorOrReceiver(presetData.donorOrReceiver || '');
      setPaymentMethod('cash');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setReceiptNo(presetData.type === 'income' ? `REC-${randomNum}` : `VOU-${randomNum}`);
      setIsJummah(!!presetData.isJummah);
      setAttendees('');
      setBoxNumber('');
      setKhutbahTopic('');
      setCollectedBy('');
      setNotes('');
      setIsCustomCategory(false);
    } else {
      // New transaction defaults
      setType(initialType);
      const defaultCat = initialType === 'income' ? incomeCategories[0] : expenseCategories[0];
      setCategory(defaultCat || '');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setTitle('');
      setDonorOrReceiver('');
      setPaymentMethod('cash');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setReceiptNo(initialType === 'income' ? `REC-${randomNum}` : `VOU-${randomNum}`);
      setIsJummah(false);
      setAttendees('');
      setBoxNumber('');
      setKhutbahTopic('');
      setCollectedBy('');
      setNotes('');
      setIsCustomCategory(false);
    }
  }, [editingTransaction, presetData, initialType, isOpen, incomeCategories, expenseCategories]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const availableCategories = newType === 'income' ? incomeCategories : expenseCategories;
    setCategory(availableCategories[0] || '');
    setIsCustomCategory(false);
    if (!editingTransaction) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setReceiptNo(newType === 'income' ? `REC-${randomNum}` : `VOU-${randomNum}`);
    }
  };

  const handleQuickAmountClick = (val: number) => {
    const current = parseFloat(amount) || 0;
    // If empty or zero, set it; otherwise add to it
    if (!amount || current === 0) {
      setAmount(val.toString());
    } else {
      setAmount((current + val).toString());
    }
  };

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন!');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      alert('অনুগ্রহ করে খাত নির্বাচন করুন বা লিখুন!');
      return;
    }

    const finalTitle = title.trim() || `${finalCategory} বাবদ`;

    onSave(
      {
        type,
        category: finalCategory,
        amount: finalAmount,
        date,
        title: finalTitle,
        donorOrReceiver: donorOrReceiver.trim() || undefined,
        paymentMethod,
        receiptNo: receiptNo.trim() || undefined,
        isJummah: isJummah || finalCategory.includes('জুমার'),
        jummahDetails:
          isJummah || finalCategory.includes('জুমার')
            ? {
                estimatedAttendees: attendees ? parseInt(attendees, 10) : undefined,
                boxNumber: boxNumber || undefined,
                khutbahTopic: khutbahTopic || undefined,
                collectedBy: collectedBy || undefined,
              }
            : undefined,
        notes: notes.trim() || undefined,
      },
      editingTransaction?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
        {/* Header */}
        <div
          className={`p-5 text-white flex items-center justify-between ${
            type === 'income'
              ? 'bg-gradient-to-r from-emerald-800 to-mosque-800'
              : 'bg-gradient-to-r from-rose-800 to-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              {type === 'income' ? '💰' : '🧾'}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {editingTransaction
                  ? 'লেনদেন সম্পাদনা করুন'
                  : type === 'income'
                  ? '+ নতুন জমা / আয় এন্ট্রি'
                  : '- নতুন খরচ / ব্যয় এন্ট্রি'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                সঠিক পরিমাণ ও খাত লিখে সংরক্ষণ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Type Selector (Income vs Expense) */}
          {!editingTransaction && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + আয় / জমা (Income)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                - ব্যয় / খরচ (Expense)
              </button>
            </div>
          )}

          {/* Amount Box with Quick Numpad Chips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              টাকার পরিমাণ (৳) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-lg font-bold text-slate-400">৳</span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600 bg-white"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="mt-2.5">
              <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-gold-500" />
                <span>দ্রুত যোগ করতে চাপুন:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickAmountClick(q)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    +৳{q.toLocaleString('en-IN')}
                  </button>
                ))}
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount('')}
                    className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold"
                  >
                    মুছুন
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                তারিখ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পেমেন্ট মাধ্যম
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-mosque-600 bg-white"
              >
                <option value="cash">নগদ ক্যাশ (Cash)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="rocket">রকেট (Rocket)</option>
                <option value="bank">ব্যাংক ট্রান্সফার / চেক</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {type === 'income' ? 'আয়ের খাত' : 'ব্যয়ের খাত'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            {!isCustomCategory ? (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setIsCustomCategory(true);
                    setCustomCategory('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-mosque-600 bg-white"
              >
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="CUSTOM">+ অন্য নতুন খাত লিখুন...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="নতুন খাতের নাম লিখুন..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  ড্রপডাউন তালিকা
                </button>
              </div>
            )}
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিবরণ / শিরোনাম
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'income'
                  ? 'যেমন: জুমার নামাজ কালেকশন / নতুন ফ্যান বাবদ দান'
                  : 'যেমন: অক্টোবর মাসের ইমাম সাহেবের সম্মানী / বিদ্যুৎ বিল'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
            />
          </div>

          {/* Donor/Receiver & Receipt No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {type === 'income' ? 'দাতার নাম (ঐচ্ছিক)' : 'গ্রহীতা / ব্যয়কারী'}
              </label>
              <input
                type="text"
                value={donorOrReceiver}
                onChange={(e) => setDonorOrReceiver(e.target.value)}
                placeholder={type === 'income' ? 'সাধারণ মুসল্লি / বেনামী' : 'কর্মচারী / দোকানের নাম'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রশিদ / ভাউচার নং
              </label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="REC-001"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>
          </div>

          {/* Friday Jummah Toggle */}
          {type === 'income' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isJummah}
                  onChange={(e) => setIsJummah(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-amber-950">
                  🕌 এটি কি শুক্রবারের জুমার নামাজ কালেকশন?
                </span>
              </label>

              {isJummah && (
                <div className="mt-3 pt-3 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block font-medium text-amber-900 mb-0.5">
                      উপস্থিতি (আনুমানিক)
                    </label>
                    <input
                      type="number"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      placeholder="450"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-amber-900 mb-0.5">
                      দান বক্সের বিবরণ
                    </label>
                    <input
                      type="text"
                      value={boxNumber}
                      onChange={(e) => setBoxNumber(e.target.value)}
                      placeholder="বক্স ১ ও ২"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-amber-900 mb-0.5">
                      খুতবার বিষয় (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={khutbahTopic}
                      onChange={(e) => setKhutbahTopic(e.target.value)}
                      placeholder="যেমন: তাকওয়া ও আমানতদারি"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মন্তব্য (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="প্রয়োজনীয় কোনো বিশেষ বিবরণ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-95 ${
                type === 'income'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{editingTransaction ? 'হালনাগাদ সংরক্ষণ' : 'সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
