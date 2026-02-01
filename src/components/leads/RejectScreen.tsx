"use client";

interface RejectScreenProps {
  name: string;
}

export default function RejectScreen({ name }: RejectScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-lg mx-auto animate-fadeIn">
        {/* Icon */}
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Gracias por tu interés, {name}
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Por el momento, nuestro servicio de desarrollo está enfocado en
          tiendas activas o proyectos listos para implementación inmediata.
        </p>

        {/* Back to website */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al sitio web
        </a>

        {/* Contact alternative */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm mb-3">
            ¿Tu situación ha cambiado o tienes un proyecto listo?
          </p>
          <a
            href="mailto:info@flamingodevs.com"
            className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            Escríbeme a info@flamingodevs.com
          </a>
        </div>
      </div>
    </div>
  );
}
