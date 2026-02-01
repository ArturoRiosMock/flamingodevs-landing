"use client";

import { useState, useEffect, useRef } from "react";

interface Option {
  id: string;
  label: string;
  description?: string;
  isRisk?: boolean;
}

interface FormStepProps {
  type: "text" | "email" | "options";
  question: string;
  subtitle?: string;
  placeholder?: string;
  options?: Option[];
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
  autoFocus?: boolean;
}

export default function FormStep({
  type,
  question,
  subtitle,
  placeholder,
  options,
  value,
  onChange,
  onNext,
  onBack,
  showBack = true,
  autoFocus = true,
}: FormStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current && (type === "text" || type === "email")) {
      inputRef.current.focus();
    }
  }, [autoFocus, type]);

  useEffect(() => {
    if (type === "text") {
      setIsValid(value.trim().length > 0);
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(value));
    } else if (type === "options") {
      setIsValid(value.length > 0);
    }
  }, [value, type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      e.preventDefault();
      onNext();
    }
  };

  const handleOptionSelect = (optionId: string) => {
    onChange(optionId);
    // Auto-advance after selection with a small delay for feedback
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
          {question}
        </h2>
        {subtitle && (
          <p className="text-gray-400 text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {(type === "text" || type === "email") && (
        <div className="mb-8">
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-b-2 border-gray-700 focus:border-pink-500 text-white text-xl md:text-2xl py-4 outline-none transition-colors placeholder:text-gray-600"
            autoComplete={type === "email" ? "email" : "name"}
          />
        </div>
      )}

      {type === "options" && options && (
        <div className="space-y-3 mb-8">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 group ${
                value === option.id
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  value === option.id
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="flex-1">
                  <p className={`font-medium text-base md:text-lg ${
                    value === option.id ? "text-white" : "text-gray-200"
                  }`}>
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </button>
        )}

        {(type === "text" || type === "email") && (
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isValid
                ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:opacity-90"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {(type === "text" || type === "email") && (
        <p className="text-gray-600 text-sm mt-4">
          Presiona <span className="text-gray-400 font-medium">Enter ↵</span> para continuar
        </p>
      )}
    </div>
  );
}
