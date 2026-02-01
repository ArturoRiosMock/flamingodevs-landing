"use client";

import { LeadForm } from "@/components/leads";

export default function LeadsVenezuelaPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl">🦩</span>
            <span className="text-white font-semibold group-hover:text-pink-400 transition-colors">
              Flamingo Devs
            </span>
          </a>
        </div>
      </header>

      {/* Form Content */}
      <div className="pt-20">
        <LeadForm />
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Calendly widget dark mode fixes */
        .calendly-inline-widget {
          background: #0a0a0a;
        }

        /* Input autofill styles for dark background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}
