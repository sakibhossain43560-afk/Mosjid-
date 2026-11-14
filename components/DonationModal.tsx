'use client';

import React, { useState } from 'react';
import { MosqueSettings } from '../lib/types';
import {
  X,
  Copy,
  Check,
  HeartHandshake,
  CreditCard,
  Smartphone,
  Building2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MosqueSettings;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const { onlineDonation, committeeContacts, mosqueName } = settings;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-mosque-900 via-mosque-800 to-mosque-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>সাদাকা ও অনুদান পোর্টাল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {mosqueName} তহবিলে দান করুন
          </h2>
          <p className="text-xs text-mosque-200 mt-1">
            আল্লাহর ঘরের রক্ষণাবেক্ষণ ও উন্নয়ন কাজে শরিক হোন
          </p>
        </div>

        {/* Quran / Hadith quote */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 text-xs sm:text-sm text-emerald-900 leading-relaxed italic text-center">
          "যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করে, আল্লাহ তার জন্য জান্নাতে একটি ঘর তৈরি করেন।"
          <div className="text-[11px] font-semibold text-emerald-700 mt-1">
            — সহীহ বুখারী ও মুসলিম
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Mobile Banking Options */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট)</span>
            </div>

            <div className="space-y-2.5">
              {/* bKash Personal */}
              {onlineDonation.bkashPersonal && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/70 border border-pink-200/80">
                  <div>
                    <div className="text-xs font-bold text-pink-700">বিকাশ (পার্সোনাল / সেন্ড মানি)</div>
                    <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">
                      {onlineDonation.bkashPersonal}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(onlineDonation.bkashPersonal, 'bkashP')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedKey === 'bkashP' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* bKash Merchant */}
              {onlineDonation.bkashMerchant && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/70 border border-pink-200/80">
                  <div>
                    <div className="text-xs font-bold text-pink-700">বিকাশ (মার্চেন্ট / পেমেন্ট)</div>
                    <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">
                      {onlineDonation.bkashMerchant}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(onlineDonation.bkashMerchant, 'bkashM')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedKey === 'bkashM' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Nagad */}
              {onlineDonation.nagadNumber && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200/80">
                  <div>
                    <div className="text-xs font-bold text-orange-700">নগদ (Nagad Personal)</div>
                    <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">
                      {onlineDonation.nagadNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(onlineDonation.nagadNumber, 'nagad')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedKey === 'nagad' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Rocket */}
              {onlineDonation.rocketNumber && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-200/80">
                  <div>
                    <div className="text-xs font-bold text-purple-700">রকেট (Rocket Personal)</div>
                    <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">
                      {onlineDonation.rocketNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(onlineDonation.rocketNumber, 'rocket')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedKey === 'rocket' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Details */}
          {onlineDonation.bankAccountNumber && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>সরাসরি ব্যাংক অ্যাকাউন্ট বিবরণ</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">ব্যাংকের নাম:</span>
                  <span className="font-bold text-slate-800">{onlineDonation.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">অ্যাকাউন্টের নাম:</span>
                  <span className="font-bold text-slate-800">{onlineDonation.bankAccountName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">হিসাব নম্বর (A/C):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">
                      {onlineDonation.bankAccountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(onlineDonation.bankAccountNumber, 'bankAc')}
                      className="text-emerald-600 hover:text-emerald-700 p-0.5"
                      title="অ্যাকাউন্ট নম্বর কপি করুন"
                    >
                      {copiedKey === 'bankAc' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">শাখা:</span>
                  <span className="font-semibold text-slate-800">{onlineDonation.bankBranch}</span>
                </div>
                {onlineDonation.bankRouting && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">রাউটিং নম্বর:</span>
                    <span className="font-mono font-semibold text-slate-800">{onlineDonation.bankRouting}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Committee Contacts */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>প্রয়োজনে যোগাযোগ করুন (কমিটি)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {committeeContacts.cashierName && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-400">ক্যাশিয়ার:</div>
                  <div className="font-bold text-slate-800">{committeeContacts.cashierName}</div>
                  <a
                    href={`tel:${committeeContacts.cashierPhone}`}
                    className="text-emerald-700 font-mono mt-0.5 block hover:underline"
                  >
                    📞 {committeeContacts.cashierPhone}
                  </a>
                </div>
              )}
              {committeeContacts.mutawalliName && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-400">মোতাওয়াল্লী / সভাপতি:</div>
                  <div className="font-bold text-slate-800">{committeeContacts.mutawalliName}</div>
                  <a
                    href={`tel:${committeeContacts.mutawalliPhone}`}
                    className="text-emerald-700 font-mono mt-0.5 block hover:underline"
                  >
                    📞 {committeeContacts.mutawalliPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
