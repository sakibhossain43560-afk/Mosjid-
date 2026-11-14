'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MosqueSettings } from '../lib/types';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Landmark,
} from 'lucide-react';

interface QRCodePosterProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MosqueSettings;
}

export const QRCodePoster: React.FC<QRCodePosterProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [siteUrl, setSiteUrl] = useState(settings.siteUrl);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If setting is default or placeholder, prefer current window origin
      if (!settings.siteUrl || settings.siteUrl.includes('example.com') || settings.siteUrl.includes('localhost')) {
        setSiteUrl(window.location.origin);
      } else {
        setSiteUrl(settings.siteUrl);
      }
    }
  }, [settings.siteUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 50, 50, 500, 500);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${settings.mosqueName}_QRCode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                মসজিদ কিউআর কোড পোস্টার জেনারেটর
              </h3>
              <p className="text-xs text-slate-400">
                প্রিন্ট করে নোটিশ বোর্ডে ও প্রবেশপথে ঝুলিয়ে দিন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>পোস্টার প্রিন্ট (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* URL Configuration bar (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 no-print">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            যে লিঙ্কটিতে কিউআর কোড নিয়ে যাবে (ভার্সেল বা ওয়েবসাইট লিঙ্ক):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://mosjid-ledger.vercel.app"
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mosque-600 bg-white"
            />
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
            </button>
            <button
              onClick={handleDownloadQR}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
              title="শুধু QR কোড ইমেজ ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>QR ছবি</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            💡 টিপস: আপনি যখন গিটহাব দিয়ে ভার্সেলে ডিপ্লয় করবেন, আপনার নতুন সাইট লিঙ্কটি এখানে বসিয়ে প্রিন্ট করুন।
          </p>
        </div>

        {/* Printable Poster Container */}
        <div className="p-4 sm:p-8 flex justify-center bg-slate-100">
          <div
            id="mosque-poster"
            className="poster-container bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl border-4 border-mosque-800 text-center relative overflow-hidden"
          >
            {/* Islamic Corner Accents */}
            <div className="absolute top-2 left-2 text-mosque-700 text-xs">۞</div>
            <div className="absolute top-2 right-2 text-mosque-700 text-xs">۞</div>
            <div className="absolute bottom-2 left-2 text-mosque-700 text-xs">۞</div>
            <div className="absolute bottom-2 right-2 text-mosque-700 text-xs">۞</div>

            {/* Bismillah */}
            <div className="font-serif italic text-mosque-800 text-sm sm:text-base font-medium mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            {/* Mosque Icon & Name */}
            <div className="w-12 h-12 rounded-2xl bg-mosque-100 border border-mosque-300 text-mosque-800 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Landmark className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-mosque-950 tracking-tight">
              {settings.mosqueName}
            </h1>
            {settings.mosqueArabicName && (
              <p className="font-serif text-sm text-gold-700 font-medium">
                {settings.mosqueArabicName}
              </p>
            )}
            <p className="text-xs text-slate-600 mt-0.5">
              {settings.mosqueAddress}
            </p>

            {/* Divider */}
            <div className="my-4 flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-gold-500"></div>
              <div className="text-gold-600 text-xs font-bold">স্বচ্ছ আর্থিক বিবরণী</div>
              <div className="h-0.5 w-12 bg-gold-500"></div>
            </div>

            {/* Title Callout */}
            <div className="bg-mosque-50 border border-mosque-200 rounded-xl py-2 px-3 mb-4">
              <h2 className="text-sm sm:text-base font-bold text-mosque-900">
                মোবাইলে স্ক্যান করে মসজিদের আয়-ব্যয়ের হিসাব দেখুন
              </h2>
              <p className="text-[11px] text-mosque-700 mt-0.5">
                আমানতদারি ও শতভাগ আর্থিক স্বচ্ছতা নিশ্চিতকরণে
              </p>
            </div>

            {/* QR Code Container */}
            <div className="inline-block p-4 rounded-2xl bg-white shadow-md border-2 border-dashed border-mosque-600 mb-4">
              <QRCodeSVG
                ref={qrRef}
                value={
                  (siteUrl || 'https://mosjid-ledger.vercel.app').endsWith('/scan')
                    ? siteUrl || 'https://mosjid-ledger.vercel.app'
                    : `${(siteUrl || 'https://mosjid-ledger.vercel.app').replace(/\/$/, '')}/scan`
                }
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Easy Instructions for Musallis */}
            <div className="bg-slate-50 rounded-xl p-3 text-left text-xs text-slate-700 border border-slate-200 space-y-1 mb-4">
              <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wider mb-1">
                <Smartphone className="w-3.5 h-3.5 text-mosque-700" />
                <span>যেভাবে দেখতে পারবেন:</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold text-mosque-800">১.</span>
                <span>আপনার মোবাইলের ক্যামেরা বা কিউআর কোড স্ক্যানার ওপেন করুন।</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold text-mosque-800">২.</span>
                <span>ওপরের কিউআর কোডটির দিকে ক্যামেরা ধরুন এবং লিঙ্কে চাপ দিন।</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold text-mosque-800">৩.</span>
                <span>মসজিদের বর্তমান তহবিল, জুমার কালেকশন ও সকল আয়-ব্যয় বিস্তারিত দেখুন।</span>
              </div>
            </div>

            {/* Donation Info at the bottom of the poster */}
            {settings.onlineDonation.bkashPersonal && (
              <div className="text-center border-t border-slate-200 pt-3">
                <div className="text-[11px] font-semibold text-slate-500">
                  মসজিদ ফান্ডে দান পাঠাতে:
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                  বিকাশ (Personal): {settings.onlineDonation.bkashPersonal}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 text-[10px] text-slate-400">
              পরিচালনায়: {settings.mosqueName} পরিচালনা কমিটি
            </div>
          </div>
        </div>

        {/* Modal Bottom Close (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mosque-800 hover:bg-mosque-700 text-white text-xs sm:text-sm font-bold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
