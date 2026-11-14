'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatCurrency, formatBengaliDate, toBengaliNumber } from '../lib/utils';
import {
  CalendarDays,
  PlusCircle,
  Users,
  CheckCircle,
  TrendingUp,
  Bookmark,
  Receipt,
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
  // Find highest jummah amount for scale
  const maxAmount =
    jummahTransactions.length > 0
      ? Math.max(...jummahTransactions.map((t) => t.amount))
      : 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-mosque-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-400/30">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              জুমার নামাজ কালেকশন ট্র্যাকার
            </h2>
          </div>
          <p className="text-mosque-200 text-xs sm:text-sm mt-1">
            প্রতি শুক্রবারের দান বাক্স কালেকশন ও উপস্থিতির সাপ্তাহিক পরিসংখ্যান
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenQuickJummah}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-mosque-950 font-bold text-sm shadow-md transition-transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন জুমার এন্ট্রি</span>
          </button>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50 border-b border-slate-200 text-center">
        <div className="p-4">
          <div className="text-xs text-slate-500 font-medium">রেকর্ডকৃত শুক্রবার</div>
          <div className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
            {useBanglaDigits ? toBengaliNumber(jummahTransactions.length) : jummahTransactions.length} টি
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-500 font-medium">জুমার মোট কালেকশন</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-700 mt-1">
            {formatCurrency(totalJummahIncome, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-500 font-medium">গড়ে প্রতি জুমায়</div>
          <div className="text-lg sm:text-xl font-bold text-gold-700 mt-1">
            {formatCurrency(averageJummah, useBanglaDigits, currencySymbol)}
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-500 font-medium">সর্বোচ্চ এক জুমায়</div>
          <div className="text-lg sm:text-xl font-bold text-blue-700 mt-1">
            {formatCurrency(maxAmount, useBanglaDigits, currencySymbol)}
          </div>
        </div>
      </div>

      {/* Visual Chart of Friday Collections */}
      {jummahTransactions.length > 0 && (
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>সাপ্তাহিক কালেকশনের তুলনামূলক চার্ট</span>
            </h3>
            <span className="text-xs text-slate-400">সর্বশেষ {useBanglaDigits ? toBengaliNumber(jummahTransactions.length) : jummahTransactions.length} টি জুমার রেকর্ড</span>
          </div>

          <div className="space-y-3">
            {jummahTransactions.slice(0, 6).map((tx) => {
              const percentage = Math.round((tx.amount / maxAmount) * 100);
              const isLatest = tx.id === jummahTransactions[0]?.id;

              return (
                <div key={tx.id} className="group">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatBengaliDate(tx.date, true)}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          সর্বশেষ
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-emerald-700">
                      {formatCurrency(tx.amount, useBanglaDigits, currencySymbol)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLatest
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          : 'bg-gradient-to-r from-mosque-600 to-mosque-500'
                      }`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    ></div>
                  </div>

                  {tx.jummahDetails?.khutbahTopic && (
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-gold-500" />
                      <span>খুতবার বিষয়: {tx.jummahDetails.khutbahTopic}</span>
                      {tx.jummahDetails.estimatedAttendees && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>
                            উপস্থিতি প্রায়{' '}
                            {useBanglaDigits
                              ? toBengaliNumber(tx.jummahDetails.estimatedAttendees)
                              : tx.jummahDetails.estimatedAttendees}{' '}
                            জন
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Friday Table Records */}
      <div className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3">
          জুমার কালেকশনের বিস্তারিত ইতিহাস
        </h3>

        {jummahTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            এখনও কোনো জুমার কালেকশন রেকর্ড করা হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">কালেকশন বিবরণ</th>
                  <th className="py-2.5 px-3">বক্স / সংগ্রহকারী</th>
                  <th className="py-2.5 px-3">উপস্থিতি</th>
                  <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-center">রশিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jummahTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {formatBengaliDate(tx.date)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{tx.title}</div>
                      {tx.jummahDetails?.khutbahTopic && (
                        <div className="text-[11px] text-slate-500">
                          {tx.jummahDetails.khutbahTopic}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <div>{tx.jummahDetails?.boxNumber || 'সাধারণ বক্স'}</div>
                      {tx.jummahDetails?.collectedBy && (
                        <div className="text-[11px] text-slate-400">
                          {tx.jummahDetails.collectedBy}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {tx.jummahDetails?.estimatedAttendees ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                          <Users className="w-3 h-3 text-slate-400" />
                          {useBanglaDigits
                            ? toBengaliNumber(tx.jummahDetails.estimatedAttendees)
                            : tx.jummahDetails.estimatedAttendees}{' '}
                          জন
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(tx.amount, useBanglaDigits, currencySymbol)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                        title="রশিদ দেখুন"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
