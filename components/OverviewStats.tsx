'use client';

import React from 'react';
import { formatCurrency, formatBengaliDate, toBengaliNumber } from '../lib/utils';
import { Transaction } from '../lib/types';
import {
  Wallet,
  CalendarCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

interface OverviewStatsProps {
  totals: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    thisMonthIncome: number;
    thisMonthExpense: number;
    thisMonthBalance: number;
    latestJummah: Transaction | null;
    averageJummah: number;
    totalJummahIncome: number;
  };
  useBanglaDigits: boolean;
  currencySymbol: string;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  totals,
  useBanglaDigits,
  currencySymbol,
}) => {
  return (
    <div className="space-y-3">
      {/* 1. Main Wallet Account Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-700/50 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-gold-400" />
            <span>বর্তমান মোট তহবিল</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/50">
            ক্যাশ ও ব্যাংক
          </span>
        </div>

        {/* Large Net Balance */}
        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
          {formatCurrency(totals.netBalance, useBanglaDigits, currencySymbol)}
        </div>

        {/* Sub-stat Pills inside card */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800/90 text-emerald-300 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-300">মোট জমা</div>
              <div className="text-xs font-bold text-white">
                {formatCurrency(totals.totalIncome, useBanglaDigits, currencySymbol)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-900/60 text-rose-300 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-rose-300">মোট খরচ</div>
              <div className="text-xs font-bold text-white">
                {formatCurrency(totals.totalExpense, useBanglaDigits, currencySymbol)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two Mini Highlight Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Latest Jummah Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>সর্বশেষ জুমা</span>
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {totals.latestJummah
                ? formatCurrency(totals.latestJummah.amount, useBanglaDigits, currencySymbol)
                : `${currencySymbol} ০`}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>
              {totals.latestJummah?.jummahDetails?.estimatedAttendees
                ? `${toBengaliNumber(totals.latestJummah.jummahDetails.estimatedAttendees)} জন`
                : 'গত শুক্রবার'}
            </span>
          </div>
        </div>

        {/* This Month Expense Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>চলতি মাসের ব্যয়</span>
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-rose-600 mt-1">
              {formatCurrency(totals.thisMonthExpense, useBanglaDigits, currencySymbol)}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100 truncate">
            বেতন ও ইউটিলিটি বিল
          </div>
        </div>
      </div>
    </div>
  );
};
