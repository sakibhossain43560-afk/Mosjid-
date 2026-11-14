import { NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS, DEFAULT_SETTINGS } from '../../../lib/initialData';

let globalData = {
  transactions: INITIAL_TRANSACTIONS,
  settings: DEFAULT_SETTINGS,
};

export async function GET() {
  return NextResponse.json(globalData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.transactions) {
      globalData.transactions = body.transactions;
    }
    if (body.settings) {
      globalData.settings = { ...globalData.settings, ...body.settings };
    }
    return NextResponse.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}
