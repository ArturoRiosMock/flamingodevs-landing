"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import FormStep from "./FormStep";
import SuccessScreen from "./SuccessScreen";
import RejectScreen from "./RejectScreen";

interface Answers {
  name: string;
  email: string;
  instagram: string;
  stage: string;
  budget: string;
  urgency: string;
}

type FormState = "form" | "loading" | "success" | "rejected" | "error";

const stageOptions = [
  {
    id: "has-store",
    label: "Ya tengo una tienda/web y necesito mejoras o consultoría técnica",
    description: "Optimización, nuevas funciones o soporte",
  },
  {
    id: "ready-to-start",
    label: "Tengo el negocio y el presupuesto, listo para empezar de cero",
    description: "Crear tu tienda online desde cero",
  },
  {
    id: "just-idea",
    label: "Solo tengo una idea, estoy investigando precios y viabilidad",
    description: "Aún estás explorando opciones",
    isRisk: true,
  },
];

const budgetOptions = [
  {
    id: "less-250",
    label: "Menos de $250 USD",
    description: "Por debajo de nuestro pack más básico",
    isRisk: true,
  },
  {
    id: "250-700",
    label: "Entre $250 y $700 USD",
    description: "Catálogo Express o E-commerce Pro",
  },
  {
    id: "more-700",
    label: "Más de $700 USD",
    description: "Cualquier pack incluyendo Automatización Total",
  },
];

const urgencyOptions = [
  {
    id: "urgent",
    label: "Lo antes posible / Es urgente",
    description: "Necesito arrancar esta o la próxima semana",
  },
  {
    id: "few-weeks",
    label: "En las próximas semanas",
    description: "Tengo flexibilidad pero quiero avanzar pronto",
  },
  {
    id: "no-rush",
    label: "No tengo prisa / Solo estoy mirando",
    description: "Todavía no tengo fecha definida",
    isRisk: true,
  },
];

const isQualified = (answers: Answers): boolean => {
  // Presupuesto menor a $250 = SIEMPRE descalificado (es lo más importante)
  if (answers.budget === "less-250") return false;

  // Contar respuestas de riesgo (excluyendo presupuesto que ya pasó)
  let riskCount = 0;
  if (answers.stage === "just-idea") riskCount++;
  if (answers.urgency === "no-rush") riskCount++;

  // Solo descalificar si tiene 2+ respuestas de riesgo
  // Con 0-1 respuestas de riesgo, puede reservar
  return riskCount < 2;
};

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>("form");
  const [answers, setAnswers] = useState<Answers>({
    name: "",
    email: "",
    instagram: "",
    stage: "",
    budget: "",
    urgency: "",
  });

  const totalSteps = 6;

  const updateAnswer = (field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    setFormState("loading");

    const qualified = isQualified(answers);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          qualified,
        }),
      });

      const result = await response.json();
      console.log("[LeadForm] API Response:", result);

      if (!response.ok) {
        console.error("[LeadForm] API Error:", result);
        // Still show result to user even if email notification failed
        // The lead can still proceed with their journey
      }

      setFormState(qualified ? "success" : "rejected");
    } catch (error) {
      console.error("[LeadForm] Submit error:", error);
      // Still show result to user - the API call might have failed but we want the UX to continue
      setFormState(qualified ? "success" : "rejected");
    }
  };

  if (formState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Procesando tu información...</p>
        </div>
      </div>
    );
  }

  if (formState === "success") {
    return <SuccessScreen name={answers.name} email={answers.email} />;
  }

  if (formState === "rejected") {
    return <RejectScreen name={answers.name} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <div className="flex-1 flex items-center justify-center">
        {step === 1 && (
          <FormStep
            type="text"
            question="¡Hola! ¿Cómo te llamas?"
            subtitle="Queremos conocerte mejor"
            placeholder="Tu nombre"
            value={answers.name}
            onChange={(v) => updateAnswer("name", v)}
            onNext={nextStep}
            showBack={false}
          />
        )}

        {step === 2 && (
          <FormStep
            type="email"
            question={`Genial, ${answers.name}! ¿Cuál es tu email?`}
            subtitle="Te enviaremos información relevante"
            placeholder="tucorreo@ejemplo.com"
            value={answers.email}
            onChange={(v) => updateAnswer("email", v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <FormStep
            type="text"
            question="¿Cuál es tu cuenta de Instagram o nombre del negocio?"
            subtitle="Así podemos ver tu marca actual"
            placeholder="@tunegocio o nombre"
            value={answers.instagram}
            onChange={(v) => updateAnswer("instagram", v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 4 && (
          <FormStep
            type="options"
            question="¿En qué etapa se encuentra tu proyecto?"
            subtitle="Esto nos ayuda a entender cómo podemos ayudarte"
            options={stageOptions}
            value={answers.stage}
            onChange={(v) => updateAnswer("stage", v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 5 && (
          <FormStep
            type="options"
            question="¿Cuál es el presupuesto reservado para este proyecto?"
            subtitle="Sé honesto, esto nos ayuda a ofrecerte la mejor solución"
            options={budgetOptions}
            value={answers.budget}
            onChange={(v) => updateAnswer("budget", v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 6 && (
          <FormStep
            type="options"
            question="¿Para cuándo necesitas tener esto listo?"
            subtitle="Nos ayuda a priorizar y planificar"
            options={urgencyOptions}
            value={answers.urgency}
            onChange={(v) => updateAnswer("urgency", v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}
