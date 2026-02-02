import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface LeadData {
  name: string;
  email: string;
  instagram: string;
  stage: string;
  budget: string;
  urgency: string;
  qualified: boolean;
}

const stageLabels: Record<string, string> = {
  "has-store": "Ya tengo tienda/web y necesito mejoras",
  "ready-to-start": "Tengo el negocio y presupuesto, listo para empezar",
  "just-idea": "Solo tengo una idea, estoy investigando",
};

const budgetLabels: Record<string, string> = {
  "less-250": "Menos de $250 USD",
  "250-700": "Entre $250 y $700 USD",
  "more-700": "Más de $700 USD",
};

const urgencyLabels: Record<string, string> = {
  "urgent": "Lo antes posible / Es urgente",
  "few-weeks": "En las próximas semanas",
  "no-rush": "No tengo prisa / Solo mirando",
};

export async function POST(request: NextRequest) {
  console.log("[Leads API] Request received");
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Leads API] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }
  
  console.log("[Leads API] API Key found, length:", apiKey.length);

  const resend = new Resend(apiKey);

  try {
    const body: LeadData = await request.json();
    console.log("[Leads API] Body received:", JSON.stringify({ ...body, email: "***" }));
    
    const { name, email, instagram, stage, budget, urgency, qualified } = body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!stage) missingFields.push("stage");
    if (!budget) missingFields.push("budget");
    if (!urgency) missingFields.push("urgency");
    
    if (missingFields.length > 0) {
      console.error("[Leads API] Missing required fields:", missingFields);
      console.error("[Leads API] Received values:", { name, email: email ? "***" : undefined, stage, budget, urgency });
      return NextResponse.json(
        { error: "Missing required fields", missing: missingFields },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("[Leads API] Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const qualifiedTag = qualified ? "✅ CALIFICADO" : "❌ NO CALIFICADO";
    const qualifiedColor = qualified ? "#22c55e" : "#ef4444";
    const qualifiedBg = qualified ? "#dcfce7" : "#fee2e2";

    console.log("[Leads API] Sending email via Resend...");
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Flamingo Devs <contact@flamingodevs.com>",
      to: ["info@flamingodevs.com"],
      replyTo: email,
      subject: `[${qualifiedTag}] Nuevo lead Venezuela: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🦩 Flamingo Devs</h1>
            <p style="color: #888; margin: 5px 0 0 0;">Nuevo Lead desde Venezuela</p>
          </div>
          
          <div style="background: ${qualifiedBg}; color: ${qualifiedColor}; padding: 15px 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 18px;">
            ${qualifiedTag}
          </div>
          
          <div style="background: #1a1a1a; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">
              📋 Datos del Lead
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; width: 140px;">Nombre:</td>
                <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Instagram/Negocio:</td>
                <td style="padding: 10px 0; color: #ffffff;">${instagram || "No proporcionado"}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #1a1a1a; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">
              🎯 Respuestas del Filtro
            </h2>
            
            <div style="margin-bottom: 15px;">
              <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Etapa del Proyecto</p>
              <p style="color: #ffffff; margin: 0; padding: 10px; background: #252525; border-radius: 6px;">
                ${stageLabels[stage] || stage}
                ${stage === "just-idea" ? ' <span style="color: #ef4444;">⚠️</span>' : ''}
              </p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Presupuesto</p>
              <p style="color: #ffffff; margin: 0; padding: 10px; background: #252525; border-radius: 6px;">
                ${budgetLabels[budget] || budget}
                ${budget === "less-250" ? ' <span style="color: #ef4444;">⚠️</span>' : ''}
              </p>
            </div>
            
            <div>
              <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Urgencia</p>
              <p style="color: #ffffff; margin: 0; padding: 10px; background: #252525; border-radius: 6px;">
                ${urgencyLabels[urgency] || urgency}
                ${urgency === "no-rush" ? ' <span style="color: #ef4444;">⚠️</span>' : ''}
              </p>
            </div>
          </div>
          
          ${qualified ? `
          <div style="background: #166534; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;">
              Este lead está listo para agendar una cita
            </p>
            <p style="color: #86efac; margin: 0; font-size: 14px;">
              Debería aparecer en tu Calendly pronto
            </p>
          </div>
          ` : `
          <div style="background: #7f1d1d; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;">
              Este lead no cumple los criterios actuales
            </p>
            <p style="color: #fca5a5; margin: 0; font-size: 14px;">
              Se le mostró la pantalla de recursos alternativos
            </p>
          </div>
          `}
          
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
            Este email fue enviado automáticamente desde el formulario de leads de flamingodevs.com/leads-venezuela
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Leads API] Resend error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Failed to send email", details: error.message },
        { status: 500 }
      );
    }

    console.log("[Leads API] Email sent successfully! ID:", data?.id);
    
    return NextResponse.json(
      { success: true, message: "Lead registered successfully", emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Leads API] Lead form error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
