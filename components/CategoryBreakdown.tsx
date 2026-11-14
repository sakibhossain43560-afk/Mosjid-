'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatCurrency, toBengaliNumber } from '../lib/utils';
import { PieChart, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  useBanglaDigits: boolean;
  currencySymbol: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  transactions,
  useBanglaDigits,
  currencySymbol,
}) => {
  // Aggregate Income by category
  const incomeByCategory: { [key: string]: number } = {};
  let totalIncome = 0;

  // Aggregate Expense by category
  const expenseByCategory: { [key: string]: number } = {};
  let totalExpense = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
      totalIncome += tx.amount;
    } else {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
      totalExpense += tx.amount;
    }
  });

  const topIncomes = Object.entries(incomeByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Income Breakdown */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              আয়ের খাতভিত্তিক বিশ্লেষণ
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            মোট: {formatCurrency(totalIncome, useBanglaDigits, currencySymbol)}
          </span>
        </div>

        {topIncomes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">কোনো তথ্য নেই</div>
        ) : (
          <div className="space-y-3.5">
            {topIncomes.map(([category, amount]) => {
              const percent = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(amount, useBanglaDigits, currencySymbol)}{' '}
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({useBanglaDigits ? toBengaliNumber(percent) : percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <ArrowUpRight className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              ব্যয়ের খাতভিত্তিক বিশ্লেষণ
            </h3>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
            মোট: {formatCurrency(totalExpense, useBanglaDigits, currencySymbol)}
          </span>
        </div>

        {topExpenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">কোনো তথ্য নেই</div>
        ) : (
          <div className="space-y-3.5">
            {topExpenses.map(([category, amount]) => {
              const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="font-bold text-rose-700">
                      {formatCurrency(amount, useBanglaDigits, currencySymbol)}{' '}
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({useBanglaDigits ? toBengaliNumber(percent) : percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full transition-all"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
