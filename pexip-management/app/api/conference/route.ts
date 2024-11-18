import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bỏ qua kiểm tra SSL (chỉ dùng cho development)

export async function GET() {
  const username = "admin";
  const password = "Pexip@123";
  const authToken = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const response = await fetch('https://10.9.30.10/api/api/admin/status/v1/node/', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching API:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to fetch data', error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to fetch data', error: 'Unknown error' },
        { status: 500 }
      );
    }
  }
}
