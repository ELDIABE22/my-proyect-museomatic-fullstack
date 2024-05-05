import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { user } = await getServerSession(authOptions);

        const data = await req.json();

        console.log(data);
        return NextResponse.json('Comprado');
    } catch (error) {
        return NextResponse.json({ message: "Error al crear el metodo de pago: " + error.message });
    }
}