'use client';

import React from 'react';
import { formatCurrency, formatBengaliDate, toBengaliNumber } from '../lib/utils';
import { Transaction } from '../lib/types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Users,
  Award,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Net Balance (বর্তমান মোট তহবিল) */}
      <div className="bg-gradient-to-br from-mosque-800 to-mosque-900 text-white rounded-2xl p-5 shadow-lg border border-mosque-700/80 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-mosque-600/20 rounded-full blur-xl pointer-events-none"></div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-mosque-300">
              বর্তমান তহবিল স্থিতি
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(totals.netBalance, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-mosque-700/60 flex items-center justify-between text-xs text-mosque-200">
          <span className="flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            হাতে ও ব্যাংকে জমা
          </span>
          <span className="text-mosque-300">
            মোট আয়: {formatCurrency(totals.totalIncome, useBanglaDigits, currencySymbol)}
          </span>
        </div>
      </div>

      {/* 2. This Month Income (চলতি মাসের মোট জমা) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              চলতি মাসের জমা (আয়)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
            {formatCurrency(totals.thisMonthIncome, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>দান ও মাসিক চাঁদা বাবদ</span>
          <span className="font-semibold text-emerald-600">
            +জমা
          </span>
        </div>
      </div>

      {/* 3. This Month Expense (চলতি মাসের মোট খরচ) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              চলতি মাসের খরচ (ব্যয়)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
            {formatCurrency(totals.thisMonthExpense, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>বেতন, বিল ও মেরামত</span>
          <span className="font-semibold text-rose-600">
            -খরচ
          </span>
        </div>
      </div>

      {/* 4. Latest Jummah Collection (সর্বশেষ জুমার কালেকশন) */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 rounded-2xl p-5 shadow-sm border border-amber-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              সর্বশেষ জুমার কালেকশন
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-tight">
            {totals.latestJummah
              ? formatCurrency(totals.latestJummah.amount, useBanglaDigits, currencySymbol)
              : `${currencySymbol} 0`}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-800">
          <span>
            {totals.latestJummah
              ? formatBengaliDate(totals.latestJummah.date)
              : 'কোনো এন্ট্রি নেই'}
          </span>
          {totals.latestJummah?.jummahDetails?.estimatedAttendees && (
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3 h-3" />
              {useBanglaDigits
                ? toBengaliNumber(totals.latestJummah.jummahDetails.estimatedAttendees)
                : totals.latestJummah.jummahDetails.estimatedAttendees}{' '}
              জন
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
