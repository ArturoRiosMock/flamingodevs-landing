import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_HPywxXch_GgLr6BWmzfEHq2ffJCvZusf5");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Service names mapping
    const serviceNames: Record<string, string> = {
      shopify: "Desarrollo Shopify",
      ai: "Consultoría en IA",
      wordpress: "Desarrollo WordPress",
      nextjs: "Next.js y Node.js",
      analytics: "Analytics GA4",
      fullstack: "Desarrollo Full Stack",
      other: "Otro",
    };

    // Budget names mapping
    const budgetNames: Record<string, string> = {
      "less-1k": "Menos de $1,000",
      "1k-5k": "$1,000 - $5,000",
      "5k-10k": "$5,000 - $10,000",
      "10k-plus": "Más de $10,000",
      "not-sure": "No estoy seguro",
    };

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Flamingo Devs <onboarding@resend.dev>",
      to: ["info@flamingodevs.com"],
      replyTo: email,
      subject: `Nuevo contacto de ${name} - ${serviceNames[service] || "Sin servicio especificado"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #212121; border-bottom: 2px solid #FF6B6B; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Servicio:</strong> ${serviceNames[service] || "No especificado"}</p>
            <p style="margin: 10px 0;"><strong>Presupuesto:</strong> ${budgetNames[budget] || "No especificado"}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #FF6B6B; margin: 20px 0;">
            <h3 style="color: #212121; margin-top: 0;">Mensaje:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Este mensaje fue enviado desde el formulario de contacto de flamingodevs.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
