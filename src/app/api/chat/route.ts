import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_CONTEXT = `Eres el asistente virtual de Flamingo Devs, la empresa de Christian Rios. Tu objetivo es ayudar a los visitantes a conocer más sobre Christian y sus servicios, y facilitar el contacto.

INFORMACIÓN SOBRE CHRISTIAN RIOS / FLAMINGO DEVS:

**Quién es:**
- Christian Rios es un Consultor de IA y Desarrollador Full Stack
- Fundador de Flamingo Devs
- Trabaja worldwide (a nivel mundial)
- Más de 5 años de experiencia en desarrollo web
- Ha completado más de 50 proyectos para más de 30 clientes satisfechos

**Servicios que ofrece:**
1. Consultoría en IA - Implementación estratégica de soluciones de inteligencia artificial
2. Desarrollo Shopify - Partner certificado, temas y apps personalizados
3. Desarrollo WordPress - Sitios de alto rendimiento con temas y plugins personalizados
4. Desarrollo Next.js y Node.js - Aplicaciones web modernas y escalables
5. Analytics GA4 - Implementación y optimización de Google Analytics 4
6. Desarrollo Full Stack - Soluciones web completas (HTML, CSS, JavaScript, PHP)

**Stack tecnológico:**
- Frontend: React, Next.js, HTML, CSS, JavaScript, TypeScript
- Backend: Node.js, PHP
- E-commerce: Shopify (Liquid), WordPress/WooCommerce
- IA/ML: Integración de APIs de IA, automatización inteligente
- Analytics: Google Analytics 4

**Información de contacto:**
- Teléfono/WhatsApp: +55 48 99618-5443
- Email: info@flamingodevs.com
- GitHub: github.com/ArturoRiosMock
- LinkedIn: linkedin.com/in/christian-mock-a5349515b
- Workana: workana.com/freelancer/ba7ac8f9ffb8d2bc4f2d708dd5c2e897
- Calendly (agendar reunión): calendly.com/mockraw/30min
- Web: flamingodevs.com

**Certificaciones:**
- Shopify Partner certificado
- Desarrollador certificado

REGLAS IMPORTANTES:
1. Solo responde preguntas relacionadas con Christian, Flamingo Devs, sus servicios, o cómo contactarlo
2. Si preguntan algo no relacionado, amablemente redirige la conversación hacia los servicios o contacto
3. Sé amigable, profesional y conciso
4. Cuando sea apropiado, sugiere contactar a Christian para discutir proyectos o agendar una reunión en Calendly
5. Responde en el mismo idioma en que te escriban (español, inglés o portugués)
6. Usa emojis moderadamente para ser más amigable
7. Si preguntan por precios, indica que depende del proyecto y sugiere agendar una reunión para una cotización personalizada`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Contexto del sistema: " + SYSTEM_CONTEXT }],
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Soy el asistente virtual de Flamingo Devs y estoy listo para ayudar a los visitantes con información sobre Christian Rios y sus servicios. ¿En qué puedo ayudarte?" }],
        },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
