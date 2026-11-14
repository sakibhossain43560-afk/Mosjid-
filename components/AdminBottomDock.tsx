'use client';

import React from 'react';
import {
  PlusCircle,
  MinusCircle,
  CalendarCheck,
  Settings,
  Sparkles,
} from 'lucide-react';

interface AdminBottomDockProps {
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenQuickJummah: () => void;
  onOpenSettings: () => void;
}

export const AdminBottomDock: React.FC<AdminBottomDockProps> = ({
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenQuickJummah,
  onOpenSettings,
}) => {
  return (
    <aside
      aria-label="কমিটি মোবাইল কুইক ডক"
      className="fixed bottom-3 inset-x-3 sm:hidden z-40 animate-in slide-in-from-bottom duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white rounded-2xl p-2 shadow-2xl shadow-emerald-950/40 flex items-center justify-around gap-1.5">
        {/* + Income */}
        <button
          onClick={onOpenAddIncome}
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl bg-emerald-600 active:bg-emerald-500 text-white transition-transform active:scale-95 shadow"
        >
          <PlusCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">+ আয়</span>
        </button>

        {/* - Expense */}
        <button
          onClick={onOpenAddExpense}
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl bg-rose-600 active:bg-rose-500 text-white transition-transform active:scale-95 shadow"
        >
          <MinusCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">- ব্যয়</span>
        </button>

        {/* Friday Jummah */}
        <button
          onClick={onOpenQuickJummah}
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl bg-gradient-to-t from-gold-600 to-gold-500 active:scale-95 text-mosque-950 font-bold transition-transform shadow"
        >
          <CalendarCheck className="w-4 h-4 mb-0.5 text-mosque-950" />
          <span className="text-[10px] font-extrabold">🕌 জুমা</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-semibold">সেটিংস</span>
        </button>
      </div>
    </aside>
  );
};
