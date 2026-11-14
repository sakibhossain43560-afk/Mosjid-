import { Transaction } from './types';

// Convert English digits to Bengali digits
export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '০';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

// Format currency in Bengali style
export function formatCurrency(
  amount: number,
  useBanglaDigits: boolean = true,
  symbol: string = '৳'
): string {
  const formatted = amount.toLocaleString('en-IN');
  if (useBanglaDigits) {
    return `${symbol} ${toBengaliNumber(formatted)}`;
  }
  return `${symbol} ${formatted}`;
}

// Bengali month names
const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

// Format date to Bengali representation
export function formatBengaliDate(
  dateString: string,
  includeDay: boolean = false
): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = toBengaliNumber(date.getDate());
  const month = BENGALI_MONTHS[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  const dayName = BENGALI_DAYS[date.getDay()];

  if (includeDay) {
    return `${day} ${month} ${year}, ${dayName}`;
  }
  return `${day} ${month} ${year}`;
}

// Check if a date string falls on a Friday
export function isDateFriday(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date.getDay() === 5;
}

// Financial calculation utilities
export function calculateTotals(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Current Month calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const thisMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return (
      tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth
    );
  });

  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = thisMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Jummah Collections
  const jummahTransactions = transactions
    .filter((t) => t.type === 'income' && (t.isJummah || isDateFriday(t.date)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalJummahIncome = jummahTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const latestJummah = jummahTransactions[0] || null;

  const averageJummah =
    jummahTransactions.length > 0
      ? Math.round(totalJummahIncome / jummahTransactions.length)
      : 0;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    thisMonthIncome,
    thisMonthExpense,
    thisMonthBalance: thisMonthIncome - thisMonthExpense,
    jummahTransactions,
    totalJummahIncome,
    latestJummah,
    averageJummah,
  };
}

// Export transactions to CSV
export function exportToCSV(transactions: Transaction[], mosqueName: string) {
  const headers = [
    'আইডি (ID)',
    'তারিখ (Date)',
    'ধরন (Type)',
    'খাত/ক্যাটাগরি (Category)',
    'বিবরণ (Title)',
    'পরিমাণ (Amount)',
    'মাধ্যম (Method)',
    'দাতা/গ্রহীতা (Person)',
    'রশিদ নং (Receipt No)',
    'মন্তব্য (Notes)',
  ];

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}"`,
    `"${t.category}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount,
    `"${t.paymentMethod}"`,
    `"${(t.donorOrReceiver || '').replace(/"/g, '""')}"`,
    `"${t.receiptNo || ''}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [`# ${mosqueName} - হিসাব বিবরণী`, headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `mosque_ledger_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
