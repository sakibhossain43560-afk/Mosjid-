'use client';

import React, { useState, useRef } from 'react';
import { MosqueSettings, Transaction } from '../lib/types';
import {
  X,
  Settings as SettingsIcon,
  Save,
  Building,
  CreditCard,
  Phone,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Bell,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MosqueSettings;
  onSaveSettings: (settings: MosqueSettings) => void;
  transactions: Transaction[];
  onImportData: (importedData: { settings?: MosqueSettings; transactions?: Transaction[] }) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  transactions,
  onImportData,
  onResetData,
}) => {
  const [form, setForm] = useState<MosqueSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'donation' | 'contacts' | 'notice' | 'backup'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    onClose();
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: form,
      transactions,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `mosque_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions || parsed.settings) {
          if (confirm('আপনি কি এই ব্যাকআপ ফাইলটি রিস্টোর করতে চান? পূর্বের ডেটা প্রতিস্থাপিত হতে পারে।')) {
            onImportData(parsed);
            if (parsed.settings) setForm(parsed.settings);
            alert('ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!');
            onClose();
          }
        } else {
          alert('অবৈধ ব্যাকআপ ফাইল!');
        }
      } catch (err) {
        alert('ফাইল পড়তে ত্রুটি হয়েছে!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-mosque-900 to-mosque-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-5 h-5 text-gold-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                মসজিদের তথ্য ও সিস্টেম সেটিংস
              </h3>
              <p className="text-xs text-mosque-200">
                মসজিদ পরিচিতি, অনলাইন দান নম্বর, পিন কোড ও ব্যাকআপ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 overflow-x-auto text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'general'
                ? 'border-mosque-800 text-mosque-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🕌 সাধারণ তথ্য
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('donation')}
            className={`py-2 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'donation'
                ? 'border-mosque-800 text-mosque-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💳 অনুদান হিসাব (বিকাশ/ব্যাংক)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'contacts'
                ? 'border-mosque-800 text-mosque-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📞 কমিটি যোগাযোগ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notice')}
            className={`py-2 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'notice'
                ? 'border-mosque-800 text-mosque-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📢 নোটিশ বোর্ড
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`py-2 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-mosque-800 text-mosque-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💾 ব্যাকআপ ও ডেটা
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মসজিদের নাম (বাংলা) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.mosqueName}
                  onChange={(e) => setForm({ ...form, mosqueName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-mosque-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মসজিদের আরবি নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={form.mosqueArabicName || ''}
                  onChange={(e) => setForm({ ...form, mosqueArabicName: e.target.value })}
                  placeholder="جامع بيت الأمان"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-mosque-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মসজিদের ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={form.mosqueAddress}
                    onChange={(e) => setForm({ ...form, mosqueAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    স্থাপিত সাল (ইংরেজি বা বাংলা)
                  </label>
                  <input
                    type="text"
                    value={form.establishedYear}
                    onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
                    placeholder="১৯৯৫"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাডমিন পিন কোড (Admin PIN)
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={form.adminPin}
                    onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold text-mosque-800 focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    কমিটি লগইন করতে এই পিন ব্যবহার করবেন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ভার্সেল বা ওয়েবসাইট ইউআরএল (QR কোডের জন্য)
                  </label>
                  <input
                    type="url"
                    value={form.siteUrl}
                    onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
                    placeholder="https://mosjid-ledger.vercel.app"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    যে লিঙ্কে কিউআর কোড স্ক্যান করলে সাইট ওপেন হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DONATION */}
          {activeTab === 'donation' && (
            <div className="space-y-3.5">
              <div className="text-xs font-semibold text-slate-600 pb-1 border-b border-slate-100">
                মুসল্লিরা দান পাঠাতে এই অ্যাকাউন্টগুলো দেখতে পারবেন:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিকাশ (Personal)
                  </label>
                  <input
                    type="text"
                    value={form.onlineDonation.bkashPersonal}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        onlineDonation: { ...form.onlineDonation, bkashPersonal: e.target.value },
                      })
                    }
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিকাশ (Merchant)
                  </label>
                  <input
                    type="text"
                    value={form.onlineDonation.bkashMerchant}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        onlineDonation: { ...form.onlineDonation, bkashMerchant: e.target.value },
                      })
                    }
                    placeholder="018xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    নগদ (Nagad)
                  </label>
                  <input
                    type="text"
                    value={form.onlineDonation.nagadNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        onlineDonation: { ...form.onlineDonation, nagadNumber: e.target.value },
                      })
                    }
                    placeholder="019xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রকেট (Rocket)
                  </label>
                  <input
                    type="text"
                    value={form.onlineDonation.rocketNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        onlineDonation: { ...form.onlineDonation, rocketNumber: e.target.value },
                      })
                    }
                    placeholder="017xxxxxxxx-x"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 mb-2">ব্যাংক হিসাব বিবরণ:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">ব্যাংকের নাম</label>
                    <input
                      type="text"
                      value={form.onlineDonation.bankName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          onlineDonation: { ...form.onlineDonation, bankName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">অ্যাকাউন্টের নাম</label>
                    <input
                      type="text"
                      value={form.onlineDonation.bankAccountName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          onlineDonation: { ...form.onlineDonation, bankAccountName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">হিসাব নম্বর (A/C)</label>
                    <input
                      type="text"
                      value={form.onlineDonation.bankAccountNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          onlineDonation: { ...form.onlineDonation, bankAccountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">শাখা ও রাউটিং</label>
                    <input
                      type="text"
                      value={form.onlineDonation.bankBranch}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          onlineDonation: { ...form.onlineDonation, bankBranch: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-600 pb-1 border-b border-slate-100">
                মুসল্লিরা কোনো তথ্যের জন্য কমিটির যাদের সাথে যোগাযোগ করবেন:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাশিয়ার সাহেবের নাম
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.cashierName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, cashierName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাশিয়ারের ফোন নম্বর
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.cashierPhone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, cashierPhone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সভাপতি / মোতাওয়াল্লীর নাম
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.mutawalliName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, mutawalliName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সভাপতি / মোতাওয়াল্লীর ফোন
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.mutawalliPhone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, mutawalliPhone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    খতিব / ইমাম সাহেবের নাম
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.imamName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, imamName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমাম সাহেবের ফোন
                  </label>
                  <input
                    type="text"
                    value={form.committeeContacts.imamPhone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        committeeContacts: { ...form.committeeContacts, imamPhone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTICE */}
          {activeTab === 'notice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    নোটিশ ব্যানার প্রদর্শন করুন
                  </div>
                  <div className="text-[11px] text-slate-500">
                    সাইটের শীর্ষে মুসল্লিদের জন্য জরুরি নোটিশ দেখাবে
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.noticeActive}
                  onChange={(e) => setForm({ ...form, noticeActive: e.target.checked })}
                  className="w-5 h-5 rounded text-mosque-700 focus:ring-mosque-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নোটিশের বিবরণ / ঘোষণা
                </label>
                <textarea
                  rows={4}
                  value={form.noticeText}
                  onChange={(e) => setForm({ ...form, noticeText: e.target.value })}
                  placeholder="যেমন: আগামী শুক্রবার মসজিদ ৩য় তলার জন্য বিশেষ কালেকশন হবে..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mosque-600"
                />
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & DATA */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>ডেটা ব্যাকআপ ডাউনলোড (JSON)</span>
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  মসজিদের সকল লেনদেন ও সেটিংস আপনার কম্পিউটারে ব্যাকআপ হিসেবে সংরক্ষণ করে রাখুন।
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow"
                >
                  📥 ব্যাকআপ ফাইল ডাউনলোড করুন
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  পূর্বে ডাউনলোড করা JSON ব্যাকআপ ফাইল আপলোড করে হিসাব রিস্টোর করুন।
                </p>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow"
                >
                  📤 ব্যাকআপ ফাইল আপলোড করুন
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <h4 className="text-sm font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>ডিফল্ট নমুনা ডেটায় রিসেট করুন</span>
                </h4>
                <p className="text-xs text-rose-600 mb-3">
                  সতর্কতা: এটি বর্তমান ডেটা মুছে প্রাথমিক ডেমো ডেটায় নিয়ে যাবে।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি নিশ্চিত যে সকল হিসাব রিসেট করে প্রাথমিক ডেমো ডেটায় ফিরতে চান?')) {
                      onResetData();
                      alert('সফলভাবে রিসেট করা হয়েছে!');
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  ⚠️ রিসেট করুন
                </button>
              </div>
            </div>
          )}

          {/* Submit & Close Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              বন্ধ করুন
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-mosque-800 hover:bg-mosque-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
