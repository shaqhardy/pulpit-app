import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:EoXk01e5/sermon', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
