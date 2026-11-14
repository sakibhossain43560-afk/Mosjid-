'use client';

import React from 'react';
import {
  CalendarCheck,
  PackageOpen,
  UserCheck,
  Volume2,
  Zap,
  Wrench,
  Users2,
  Sparkles,
  PlusCircle,
  MinusCircle,
  CheckCircle,
} from 'lucide-react';

interface AdminQuickActionsProps {
  onQuickPreset: (preset: {
    type: 'income' | 'expense';
    category: string;
    title: string;
    donorOrReceiver?: string;
    suggestedAmount?: number;
    isJummah?: boolean;
  }) => void;
  onOpenQuickJummah: () => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  onQuickPreset,
  onOpenQuickJummah,
  onOpenAddIncome,
  onOpenAddExpense,
}) => {
  const presets = [
    {
      id: 'jummah',
      title: 'জুমার কালেকশন',
      icon: CalendarCheck,
      iconColor: 'text-amber-600 bg-amber-100',
      bgLight: 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 text-slate-800',
      isJummahDirect: true,
    },
    {
      id: 'daily-box',
      title: 'সাধারণ দান বাক্স',
      icon: PackageOpen,
      iconColor: 'text-emerald-600 bg-emerald-100',
      bgLight: 'bg-white hover:bg-emerald-50/80 border-slate-200 hover:border-emerald-300 text-slate-800',
      preset: {
        type: 'income' as const,
        category: 'দৈনিক সাধারণ দান বাক্স',
        title: 'সাধারণ দান বাক্স খোলার কালেকশন',
        donorOrReceiver: 'সাধারণ মুসল্লিবৃন্দ',
      },
    },
    {
      id: 'member-fee',
      title: 'সদস্য চাঁদা',
      icon: Users2,
      iconColor: 'text-teal-600 bg-teal-100',
      bgLight: 'bg-white hover:bg-teal-50/80 border-slate-200 hover:border-teal-300 text-slate-800',
      preset: {
        type: 'income' as const,
        category: 'স্থায়ী সদস্য মাসিক চাঁদা',
        title: 'মসজিদ স্থায়ী সদস্য মাসিক চাঁদা',
        donorOrReceiver: 'মসজিদ সদস্যবৃন্দ',
        suggestedAmount: 500,
      },
    },
    {
      id: 'imam-salary',
      title: 'ইমামের সম্মানী',
      icon: UserCheck,
      iconColor: 'text-blue-600 bg-blue-100',
      bgLight: 'bg-white hover:bg-blue-50/80 border-slate-200 hover:border-blue-300 text-slate-800',
      preset: {
        type: 'expense' as const,
        category: 'ইমাম সাহেবের মাসিক সম্মানী',
        title: 'ইমাম সাহেবের মাসিক সম্মানী প্রদান',
        donorOrReceiver: 'মাওলানা মুফতি মাহমুদ হাসান',
        suggestedAmount: 18000,
      },
    },
    {
      id: 'muazzin-salary',
      title: 'মুয়াজ্জিনের সম্মানী',
      icon: Volume2,
      iconColor: 'text-indigo-600 bg-indigo-100',
      bgLight: 'bg-white hover:bg-indigo-50/80 border-slate-200 hover:border-indigo-300 text-slate-800',
      preset: {
        type: 'expense' as const,
        category: 'মুয়াজ্জিন সাহেবের মাসিক সম্মানী',
        title: 'মুয়াজ্জিন সাহেবের মাসিক সম্মানী প্রদান',
        donorOrReceiver: 'হাফেজ মো: নুরুল ইসলাম',
        suggestedAmount: 12000,
      },
    },
    {
      id: 'electricity-bill',
      title: 'বিদ্যুৎ বিল',
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-100',
      bgLight: 'bg-white hover:bg-yellow-50/80 border-slate-200 hover:border-yellow-300 text-slate-800',
      preset: {
        type: 'expense' as const,
        category: 'বিদ্যুৎ বিল',
        title: 'মসজিদের বিদ্যুৎ বিল পরিশোধ',
        donorOrReceiver: 'বিদ্যুৎ অফিস',
      },
    },
    {
      id: 'ac-repair',
      title: 'এসি ও ফ্যান মেরামত',
      icon: Wrench,
      iconColor: 'text-cyan-600 bg-cyan-100',
      bgLight: 'bg-white hover:bg-cyan-50/80 border-slate-200 hover:border-cyan-300 text-slate-800',
      preset: {
        type: 'expense' as const,
        category: 'ফ্যান, লাইট ও এসি মেরামত',
        title: 'মসজিদের এসি/ফ্যান সার্ভিসিং ও মেরামত',
        donorOrReceiver: 'টেকনিশিয়ান',
      },
    },
    {
      id: 'cleaning',
      title: 'পরিচ্ছন্নতা সামগ্রী',
      icon: Sparkles,
      iconColor: 'text-rose-600 bg-rose-100',
      bgLight: 'bg-white hover:bg-rose-50/80 border-slate-200 hover:border-rose-300 text-slate-800',
      preset: {
        type: 'expense' as const,
        category: 'মসজিদ পরিষ্কার-পরিচ্ছন্নতা সামগ্রী',
        title: 'পরিষ্কার সামগ্রী ক্রয়',
        donorOrReceiver: 'দোকানদার',
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-current" />
          <span>দ্রুত হিসাব এন্ট্রি বাটন</span>
        </h2>

        {/* Primary Manual Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAddIncome}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ জমা</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>- খরচ</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Buttons Grid - Clean with Icons & Main Titles Only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {presets.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isJummahDirect) {
                  onOpenQuickJummah();
                } else if (item.preset) {
                  onQuickPreset(item.preset);
                }
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-150 active:scale-95 text-left shadow-sm hover:shadow ${item.bgLight}`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconColor}`}
              >
                <IconComp className="w-4 h-4" />
              </div>

              <div className="font-bold text-xs text-slate-800 truncate">
                {item.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
