'use client';

import React, { useState } from 'react';
import { Transaction } from '../lib/types';
import {
  X,
  CalendarCheck,
  Save,
  Users,
  Coins,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface QuickJummahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const QuickJummahModal: React.FC<QuickJummahModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [box1, setBox1] = useState<string>('');
  const [box2, setBox2] = useState<string>('');
  const [box3, setBox3] = useState<string>('');
  const [directTotal, setDirectTotal] = useState<string>('');
  const [useSeparateBoxes, setUseSeparateBoxes] = useState<boolean>(true);
  const [attendees, setAttendees] = useState<string>('450');
  const [khutbahTopic, setKhutbahTopic] = useState<string>('');
  const [collectedBy, setCollectedBy] = useState<string>('কমিটি ও ক্যাশিয়ার');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  // Calculate total
  const b1 = parseFloat(box1) || 0;
  const b2 = parseFloat(box2) || 0;
  const b3 = parseFloat(box3) || 0;
  const calculatedTotal = useSeparateBoxes ? b1 + b2 + b3 : parseFloat(directTotal) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedTotal <= 0) {
      alert('অনুগ্রহ করে সঠিক কালেকশন পরিমাণ লিখুন!');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const boxSummary = useSeparateBoxes
      ? `বক্স ১: ৳${b1}${b2 ? `, বক্স ২: ৳${b2}` : ''}${b3 ? `, বক্স ৩: ৳${b3}` : ''}`
      : 'সকল বক্স মিলিয়ে';

    onSave({
      type: 'income',
      category: 'জুমার দান বাক্স',
      amount: calculatedTotal,
      date,
      title: `জুমার নামাজ দান বাক্স কালেকশন (${boxSummary})`,
      donorOrReceiver: 'সাধারণ মুসল্লিবৃন্দ',
      paymentMethod: 'cash',
      receiptNo: `JUM-${randomNum}`,
      isJummah: true,
      jummahDetails: {
        estimatedAttendees: attendees ? parseInt(attendees, 10) : undefined,
        boxNumber: boxSummary,
        khutbahTopic: khutbahTopic.trim() || undefined,
        collectedBy: collectedBy.trim() || undefined,
      },
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-mosque-900 via-mosque-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-400/30">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                শুক্রবার জুমার কালেকশন এন্ট্রি
              </h3>
              <p className="text-xs text-mosque-200">
                দ্রুত বক্স কালেকশন গণনা ও রেকর্ড করুন
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              জুমার তারিখ <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
            />
          </div>

          {/* Toggle separate boxes vs single total */}
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-bold text-slate-700">বক্স কালেকশন লেখার নিয়ম:</span>
            <button
              type="button"
              onClick={() => setUseSeparateBoxes(!useSeparateBoxes)}
              className="text-mosque-700 font-semibold hover:underline"
            >
              {useSeparateBoxes ? 'একক মোট টাকা লিখুন' : 'আলাদা আলাদা বক্স লিখুন'}
            </button>
          </div>

          {useSeparateBoxes ? (
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  দান বাক্স ১ (৳)
                </label>
                <input
                  type="number"
                  value={box1}
                  onChange={(e) => setBox1(e.target.value)}
                  placeholder="যেমন: 8500"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  দান বাক্স ২ (৳)
                </label>
                <input
                  type="number"
                  value={box2}
                  onChange={(e) => setBox2(e.target.value)}
                  placeholder="যেমন: 7200"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  দান বাক্স ৩ বা মহিলাদের বক্স (৳ ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  value={box3}
                  onChange={(e) => setBox3(e.target.value)}
                  placeholder="যেমন: 3500"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোট কালেকশন পরিমাণ (৳)
              </label>
              <input
                type="number"
                value={directTotal}
                onChange={(e) => setDirectTotal(e.target.value)}
                placeholder="যেমন: 18500"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-lg font-extrabold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>
          )}

          {/* Realtime Total preview */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">জুমার মোট কালেকশন:</span>
            <span className="text-lg font-extrabold text-emerald-700">
              ৳ {calculatedTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Attendees & Khutbah topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                উপস্থিত মুসল্লি (আনুমানিক)
              </label>
              <input
                type="number"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="450"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                টাকা গণনা করেছেন
              </label>
              <input
                type="text"
                value={collectedBy}
                onChange={(e) => setCollectedBy(e.target.value)}
                placeholder="ক্যাশিয়ার ও কমিটি"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              খুতবার মূল বিষয় (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={khutbahTopic}
              onChange={(e) => setKhutbahTopic(e.target.value)}
              placeholder="যেমন: তাকওয়া, হালাল উপার্জন ও আমানতদারি"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মন্তব্য (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: আলহামদুলিল্লাহ উপস্থিতি অনেক বেশি ছিল"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-mosque-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gold-600 hover:bg-gold-500 text-mosque-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>জুমার কালেকশন সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
