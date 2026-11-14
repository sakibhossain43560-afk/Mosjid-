'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatCurrency, toBengaliNumber } from '../lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

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
    .slice(0, 4);

  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-3">
      {/* Top Incomes Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">
              আয়ের প্রধান খাতসমূহ
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-700">
            {formatCurrency(totalIncome, useBanglaDigits, currencySymbol)}
          </span>
        </div>

        <div className="space-y-2.5">
          {topIncomes.map(([category, amount]) => {
            const percent = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
            return (
              <div key={category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 truncate max-w-[180px]">{category}</span>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(amount, useBanglaDigits, currencySymbol)}{' '}
                    <span className="text-slate-400 font-normal">({toBengaliNumber(percent)}%)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.max(percent, 4)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Expenses Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">
              ব্যয়ের প্রধান খাতসমূহ
            </h3>
          </div>
          <span className="text-[11px] font-bold text-rose-700">
            {formatCurrency(totalExpense, useBanglaDigits, currencySymbol)}
          </span>
        </div>

        <div className="space-y-2.5">
          {topExpenses.map(([category, amount]) => {
            const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
            return (
              <div key={category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 truncate max-w-[180px]">{category}</span>
                  <span className="font-bold text-rose-700">
                    {formatCurrency(amount, useBanglaDigits, currencySymbol)}{' '}
                    <span className="text-slate-400 font-normal">({toBengaliNumber(percent)}%)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{ width: `${Math.max(percent, 4)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
