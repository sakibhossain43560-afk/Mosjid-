'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatCurrency, formatBengaliDate, toBengaliNumber } from '../lib/utils';
import {
  CalendarCheck,
  PlusCircle,
  Users,
  TrendingUp,
  Award,
} from 'lucide-react';

interface JummahTrackerProps {
  jummahTransactions: Transaction[];
  averageJummah: number;
  totalJummahIncome: number;
  useBanglaDigits: boolean;
  currencySymbol: string;
  isAdmin: boolean;
  onOpenQuickJummah: () => void;
  onSelectTransaction: (t: Transaction) => void;
}

export const JummahTracker: React.FC<JummahTrackerProps> = ({
  jummahTransactions,
  averageJummah,
  totalJummahIncome,
  useBanglaDigits,
  currencySymbol,
  isAdmin,
  onOpenQuickJummah,
  onSelectTransaction,
}) => {
  const maxAmount =
    jummahTransactions.length > 0
      ? Math.max(...jummahTransactions.map((t) => t.amount))
      : 1;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-400/30 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              জুমার নামাজ কালেকশন
            </h2>
            <div className="text-[11px] text-emerald-200">
              সাপ্তাহিক দান বাক্স ও উপস্থিতি
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenQuickJummah}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-mosque-950 font-bold text-xs shadow active:scale-95 transition-transform"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন জুমা</span>
          </button>
        )}
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] text-slate-500">মোট জুমা</div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
            {toBengaliNumber(jummahTransactions.length)} টি
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-[10px] text-emerald-800">মোট কালেকশন</div>
          <div className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5">
            {formatCurrency(totalJummahIncome, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="text-[10px] text-amber-800">গড়ে প্রতি জুমায়</div>
          <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5">
            {formatCurrency(averageJummah, useBanglaDigits, currencySymbol)}
          </div>
        </div>
      </div>

      {/* Friday Collections List Items */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-bold text-slate-700 mb-1">
          বিগত শুক্রবারসমূহের তালিকা
        </div>

        {jummahTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            এখনও কোনো জুমার কালেকশন নেই।
          </div>
        ) : (
          jummahTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    {formatBengaliDate(tx.date, true)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{tx.jummahDetails?.boxNumber || 'দান বাক্স'}</span>
                    {tx.jummahDetails?.estimatedAttendees && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Users className="w-3 h-3 text-slate-400" />
                          {toBengaliNumber(tx.jummahDetails.estimatedAttendees)} জন
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-700">
                  {formatCurrency(tx.amount, useBanglaDigits, currencySymbol)}
                </div>
                {tx.receiptNo && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    #{tx.receiptNo}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
