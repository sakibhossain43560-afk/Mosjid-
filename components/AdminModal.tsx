'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
  correctPin: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  correctPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      setError(false);
      setPin('');
      onSuccessLogin();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-mosque-100 text-mosque-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">কমিটি লগইন</h3>
          <p className="text-xs text-slate-500 mt-1">
            নতুন আয়, ব্যয় বা জুমার কালেকশন এন্ট্রি করতে ৪ ডিজিটের পিন (PIN) লিখুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="পিন (ডিফল্ট: 7860)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>ভুল পিন দিয়েছেন! পুনরায় চেষ্টা করুন।</span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center">
            🔒 ডিফল্ট পিন কোড: <span className="font-mono font-bold text-mosque-800">7860</span> (সেটিংস থেকে পরিবর্তনযোগ্য)
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-mosque-800 hover:bg-mosque-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>লগইন করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
};
