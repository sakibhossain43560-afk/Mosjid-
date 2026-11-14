'use client';

import React from 'react';
import { Transaction, MosqueSettings } from '../lib/types';
import { formatCurrency, formatBengaliDate, toBengaliNumber } from '../lib/utils';
import { X, Printer, Receipt, CheckCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  settings: MosqueSettings;
  useBanglaDigits: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  settings,
  useBanglaDigits,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col my-auto overflow-hidden">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-sm sm:text-base">
              {isIncome ? 'ডিজিটাল জমার রশিদ' : 'ডিজিটাল খরচের ভাউচার'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="border-2 border-mosque-800 rounded-2xl p-6 relative">
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="font-serif italic text-mosque-800 text-xs sm:text-sm mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-mosque-950">
                {settings.mosqueName}
              </h2>
              {settings.mosqueArabicName && (
                <div className="text-xs text-gold-700 font-serif">
                  {settings.mosqueArabicName}
                </div>
              )}
              <p className="text-xs text-slate-600 mt-0.5">
                {settings.mosqueAddress}
              </p>

              <div className="inline-block mt-3 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase border bg-slate-50 text-slate-800">
                {isIncome ? 'টাকা প্রাপ্তির ডিজিটাল রশিদ' : 'ব্যয়ের অফিসিয়াল ভাউচার'}
              </div>
            </div>

            {/* Voucher Meta Info */}
            <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-100">
              <div>
                <span className="text-slate-500">ভাউচার / রশিদ নং:</span>{' '}
                <span className="font-mono font-bold text-slate-900">
                  {transaction.receiptNo || `#TX-${transaction.id}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">তারিখ:</span>{' '}
                <span className="font-bold text-slate-900">
                  {formatBengaliDate(transaction.date, true)}
                </span>
              </div>
            </div>

            {/* Main Details */}
            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <span className="text-slate-500">
                  {isIncome ? 'দাতার নাম:' : 'গ্রহীতা / পরিশোধিত:'}
                </span>
                <span className="font-bold text-slate-800 text-right">
                  {transaction.donorOrReceiver || (isIncome ? 'সাধারণ মুসল্লিবৃন্দ' : 'মসজিদ তহবিল')}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">হিসাবের খাত:</span>
                <span className="font-semibold text-slate-800">
                  {transaction.category}
                </span>
              </div>

              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <span className="text-slate-500">বিবরণ:</span>
                <span className="font-medium text-slate-800 text-right max-w-[240px]">
                  {transaction.title}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-medium text-slate-700 capitalize">
                  {transaction.paymentMethod === 'cash' && 'নগদ ক্যাশ'}
                  {transaction.paymentMethod === 'bkash' && 'বিকাশ'}
                  {transaction.paymentMethod === 'nagad' && 'নগদ'}
                  {transaction.paymentMethod === 'rocket' && 'রকেট'}
                  {transaction.paymentMethod === 'bank' && 'ব্যাংক ট্রান্সফার'}
                </span>
              </div>

              {transaction.jummahDetails?.khutbahTopic && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">খুতবার বিষয়:</span>
                  <span className="font-medium text-slate-800">
                    {transaction.jummahDetails.khutbahTopic}
                  </span>
                </div>
              )}

              {transaction.notes && (
                <div className="pb-2 border-b border-slate-100 text-xs text-slate-500 italic">
                  মন্তব্য: {transaction.notes}
                </div>
              )}

              {/* Big Amount Box */}
              <div
                className={`mt-4 p-4 rounded-xl flex items-center justify-between border ${
                  isIncome
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">
                  {isIncome ? 'প্রাপ্ত মোট টাকা:' : 'ব্যয়িত মোট টাকা:'}
                </div>
                <div className="text-2xl font-extrabold tracking-tight">
                  {formatCurrency(transaction.amount, useBanglaDigits, settings.currencySymbol)}
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6 border-t border-dashed border-slate-300 grid grid-cols-2 text-center text-xs text-slate-500">
              <div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 font-semibold text-slate-800">
                  আদায়কারী / ক্যাশিয়ার
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {settings.committeeContacts.cashierName || 'মসজিদ কমিটি'}
                </div>
              </div>
              <div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 font-semibold text-slate-800">
                  সভাপতি / মোতাওয়াল্লী
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {settings.committeeContacts.mutawalliName || 'মসজিদ কমিটি'}
                </div>
              </div>
            </div>

            {/* Quran verse */}
            <div className="mt-6 text-center text-[10px] text-slate-400 italic">
              "হে মুমিনগণ! তোমরা যা উপার্জন করেছ তা থেকে উত্তম অংশ ব্যয় করো।" (সূরা আল-বাকারা: ২৬৭)
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mosque-800 hover:bg-mosque-700 text-white text-xs sm:text-sm font-bold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
