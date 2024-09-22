import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpayClient";

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    const options = {
      amount: amount * 100, // Razorpay requires the amount in paise (1 INR = 100 paise)
      currency: currency,
      receipt: `receipt_${Math.random()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Error creating Razorpay order" }, { status: 500 });
  }
}
