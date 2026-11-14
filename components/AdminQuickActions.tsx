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
  TrendingUp,
  Receipt,
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
      subtitle: 'শুক্রবার দান বাক্স ১ ও ২',
      icon: '🕌',
      badge: 'সর্বাধিক ব্যবহৃত',
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80 text-amber-950',
      isJummahDirect: true,
    },
    {
      id: 'daily-box',
      title: 'দৈনিক দান বাক্স',
      subtitle: 'সাধারণ দান বাক্স গণনা',
      icon: '📦',
      gradient: 'from-emerald-600 to-emerald-700',
      bgLight: 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200/80 text-emerald-950',
      preset: {
        type: 'income' as const,
        category: 'দৈনিক সাধারণ দান বাক্স',
        title: 'সাধারণ দান বাক্স খোলার কালেকশন',
        donorOrReceiver: 'সাধারণ মুসল্লিবৃন্দ',
      },
    },
    {
      id: 'member-fee',
      title: 'স্থায়ী সদস্য চাঁদা',
      subtitle: 'মাসিক চাঁদা আদায়',
      icon: '🤝',
      gradient: 'from-teal-600 to-teal-700',
      bgLight: 'bg-teal-50/80 hover:bg-teal-100/90 border-teal-200/80 text-teal-950',
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
      title: 'ইমাম সাহেবের সম্মানী',
      subtitle: 'মাসিক বেতন পরিশোধ',
      icon: '👳',
      gradient: 'from-blue-600 to-blue-700',
      bgLight: 'bg-blue-50/80 hover:bg-blue-100/90 border-blue-200/80 text-blue-950',
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
      subtitle: 'মাসিক বেতন পরিশোধ',
      icon: '📢',
      gradient: 'from-indigo-600 to-indigo-700',
      bgLight: 'bg-indigo-50/80 hover:bg-indigo-100/90 border-indigo-200/80 text-indigo-950',
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
      title: 'বিদ্যুৎ বিল পরিশোধ',
      subtitle: 'ডেসকো / পল্লী বিদ্যুৎ',
      icon: '⚡',
      gradient: 'from-amber-600 to-yellow-600',
      bgLight: 'bg-yellow-50/80 hover:bg-yellow-100/90 border-yellow-200/80 text-yellow-950',
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
      subtitle: 'সার্ভিসিং ও পার্টস ক্রয়',
      icon: '❄️',
      gradient: 'from-cyan-600 to-blue-600',
      bgLight: 'bg-cyan-50/80 hover:bg-cyan-100/90 border-cyan-200/80 text-cyan-950',
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
      subtitle: 'হারপিক, ফিনাইল ও সাবান',
      icon: '🧹',
      gradient: 'from-rose-600 to-rose-700',
      bgLight: 'bg-rose-50/80 hover:bg-rose-100/90 border-rose-200/80 text-rose-950',
      preset: {
        type: 'expense' as const,
        category: 'মসজিদ পরিষ্কার-পরিচ্ছন্নতা সামগ্রী',
        title: 'অজু খানা ও বাথরুমের পরিষ্কার সামগ্রী ক্রয়',
        donorOrReceiver: 'দোকানদার',
      },
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/30 to-slate-50 rounded-3xl p-5 sm:p-7 shadow-sm border border-emerald-200/80 relative overflow-hidden">
      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-400 text-mosque-950 shadow-sm">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
              কমিটি কুইক অ্যাকশন (১-ক্লিক দ্রুত হিসাব এন্ট্রি)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            বারবার টাইপ করার ঝামেলা ছাড়া এক ক্লিকেই নিয়মিত আয় ও ব্যয়ের তথ্য পূরণ করুন
          </p>
        </div>

        {/* Primary Manual Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddIncome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ নতুন জমা</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <MinusCircle className="w-4 h-4" />
            <span>- নতুন খরচ</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        {presets.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.isJummahDirect) {
                onOpenQuickJummah();
              } else if (item.preset) {
                onQuickPreset(item.preset);
              }
            }}
            className={`flex flex-col text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 active:scale-95 group relative shadow-sm hover:shadow-md ${item.bgLight}`}
          >
            {item.badge && (
              <span className="absolute top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-gold-500 text-mosque-950 uppercase tracking-wider">
                {item.badge}
              </span>
            )}

            <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <div className="font-extrabold text-xs sm:text-sm tracking-tight leading-snug">
              {item.title}
            </div>

            <div className="text-[11px] opacity-70 mt-0.5 line-clamp-1">
              {item.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
