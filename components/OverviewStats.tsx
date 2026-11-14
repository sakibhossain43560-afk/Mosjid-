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
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Coins,
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
    <div className="space-y-4">
      {/* 4 Primary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Total Net Balance (বর্তমান মোট তহবিল) */}
        <div className="bg-gradient-to-br from-emerald-950 via-mosque-900 to-mosque-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-400/50 transition-all">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                বর্তমান তহবিল স্থিতি
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatCurrency(totals.netBalance, useBanglaDigits, currencySymbol)}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-emerald-800/60 flex items-center justify-between text-xs text-mosque-200">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              হাতে ও ব্যাংকে জমা
            </span>
            <span className="text-mosque-300 font-medium">
              মোট জমা: {formatCurrency(totals.totalIncome, useBanglaDigits, currencySymbol)}
            </span>
          </div>
        </div>

        {/* 2. This Month Income (চলতি মাসের মোট জমা) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                চলতি মাসের মোট জমা
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
              {formatCurrency(totals.thisMonthIncome, useBanglaDigits, currencySymbol)}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>দান ও মাসিক চাঁদা বাবদ</span>
            <span className="font-extrabold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
              +জমা
            </span>
          </div>
        </div>

        {/* 3. This Month Expense (চলতি মাসের মোট খরচ) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-lg hover:border-rose-300 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                চলতি মাসের মোট ব্যয়
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 tracking-tight">
              {formatCurrency(totals.thisMonthExpense, useBanglaDigits, currencySymbol)}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>বেতন, বিল ও মেরামত</span>
            <span className="font-extrabold text-rose-600 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
              -খরচ
            </span>
          </div>
        </div>

        {/* 4. Latest Jummah Collection (সর্বশেষ জুমার কালেকশন) */}
        <div className="bg-gradient-to-br from-amber-50 via-amber-100/60 to-gold-50 rounded-3xl p-6 shadow-sm border border-amber-200/90 flex flex-col justify-between hover:shadow-lg hover:border-amber-400 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                সর্বশেষ জুমার কালেকশন
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-amber-950 tracking-tight">
              {totals.latestJummah
                ? formatCurrency(totals.latestJummah.amount, useBanglaDigits, currencySymbol)
                : `${currencySymbol} 0`}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-amber-200/70 flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold">
              {totals.latestJummah
                ? formatBengaliDate(totals.latestJummah.date)
                : 'কোনো এন্ট্রি নেই'}
            </span>
            {totals.latestJummah?.jummahDetails?.estimatedAttendees && (
              <span className="flex items-center gap-1 font-bold bg-amber-200/80 px-2 py-0.5 rounded-full text-[11px]">
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
    </div>
  );
};
