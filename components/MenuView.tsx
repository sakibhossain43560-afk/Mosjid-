'use client';

import React from 'react';
import { MosqueSettings } from '../lib/types';
import {
  QrCode,
  HeartHandshake,
  ShieldCheck,
  Lock,
  LogOut,
  Settings,
  ExternalLink,
  PhoneCall,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react';
import Link from 'next/link';

interface MenuViewProps {
  settings: MosqueSettings;
  isAdmin: boolean;
  onOpenQR: () => void;
  onOpenDonation: () => void;
  onOpenAdminAuth: () => void;
  onOpenSettings: () => void;
  onAdminLogout: () => void;
  useBanglaDigits: boolean;
  onToggleDigits: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  settings,
  isAdmin,
  onOpenQR,
  onOpenDonation,
  onOpenAdminAuth,
  onOpenSettings,
  onAdminLogout,
  useBanglaDigits,
  onToggleDigits,
}) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <h2 className="text-base font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-700" />
          <span>সেটিংস ও গুরুত্বপূর্ণ অপশন</span>
        </h2>

        <div className="space-y-2.5">
          {/* 1. QR Code Poster */}
          <button
            onClick={onOpenQR}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900">
                কিউআর কোড পোস্টার তৈরি ও প্রিন্ট
              </div>
            </div>
            <span className="text-xs text-slate-400">খুলুন</span>
          </button>

          {/* 2. Online Donation Info */}
          <button
            onClick={onOpenDonation}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900">
                অনলাইন দান হিসাব (বিকাশ / ব্যাংক)
              </div>
            </div>
            <span className="text-xs text-slate-400">খুলুন</span>
          </button>

          {/* 3. Musalli Scan View Direct Link */}
          <Link
            href="/scan"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900">
                মুসল্লি কিউআর স্ক্যান পেজ ভিউ
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </Link>

          {/* 4. Numeral Toggle */}
          <button
            onClick={onToggleDigits}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                ১২৩
              </div>
              <div className="font-bold text-sm text-slate-900">
                সংখ্যা ফরম্যাট পরিবর্তন
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 px-2.5 py-1 rounded-lg bg-slate-200">
              {useBanglaDigits ? 'বাংলা (১২৩)' : 'English (123)'}
            </span>
          </button>

          {/* 5. Committee Login / Settings */}
          {isAdmin ? (
            <>
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    মসজিদের তথ্য ও ব্যাকআপ সেটিংস
                  </div>
                </div>
                <span className="text-xs text-slate-400">পরিবর্তন</span>
              </button>

              <button
                onClick={onAdminLogout}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-rose-800">
                    কমিটি মোড থেকে লগআউট
                  </div>
                </div>
                <span className="text-xs text-rose-600 font-bold">লগআউট</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-mosque-50 hover:bg-mosque-100 border border-mosque-200 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mosque-700 text-white flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-mosque-950">
                  কমিটি অ্যাডমিন লগইন (পিন দিয়ে)
                </div>
              </div>
              <span className="text-xs font-bold text-mosque-800">লগইন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
