import type { TechSignature } from "@/types/tech-detector";

export const techSignatures: TechSignature[] = [
  // ============ CMS ============
  {
    name: "WordPress",
    category: "cms",
    website: "https://wordpress.org",
    description: "Sistema de gestión de contenido más popular del mundo",
    patterns: {
      html: [/wp-content/i, /wp-includes/i, /wp-json/i],
      scripts: [/wp-content/i, /wp-includes/i],
      styles: [/wp-content/i],
      meta: [{ name: "generator", content: /WordPress/i }],
      generator: [/WordPress/i],
    },
  },
  {
    name: "Shopify",
    category: "ecommerce",
    website: "https://shopify.com",
    description: "Plataforma de comercio electrónico líder",
    patterns: {
      html: [/cdn\.shopify\.com/i, /Shopify\.theme/i, /shopify-section/i],
      scripts: [/cdn\.shopify\.com/i],
      headers: [{ name: "x-shopify-stage" }, { name: "x-sorting-hat-shopid" }],
      meta: [{ name: "shopify-checkout-api-token" }],
    },
  },
  {
    name: "Wix",
    category: "cms",
    website: "https://wix.com",
    description: "Constructor de sitios web con editor visual",
    patterns: {
      html: [/wix\.com/i, /wixstatic\.com/i, /_wix_/i],
      scripts: [/wix\.com/i, /parastorage\.com/i],
      meta: [{ name: "generator", content: /Wix/i }],
    },
  },
  {
    name: "Squarespace",
    category: "cms",
    website: "https://squarespace.com",
    description: "Plataforma de creación de sitios web y hosting",
    patterns: {
      html: [/squarespace\.com/i, /sqsp/i],
      scripts: [/squarespace\.com/i, /sqsp/i],
      meta: [{ name: "generator", content: /Squarespace/i }],
    },
  },
  {
    name: "Webflow",
    category: "cms",
    website: "https://webflow.com",
    description: "Constructor de sitios web sin código",
    patterns: {
      html: [/webflow/i, /w-/i],
      scripts: [/webflow/i],
      meta: [{ name: "generator", content: /Webflow/i }],
      styles: [/webflow/i],
    },
  },
  {
    name: "Drupal",
    category: "cms",
    website: "https://drupal.org",
    description: "CMS de código abierto empresarial",
    patterns: {
      html: [/drupal/i, /sites\/default\/files/i],
      scripts: [/drupal\.js/i],
      meta: [{ name: "generator", content: /Drupal/i }],
      headers: [{ name: "x-drupal-cache" }, { name: "x-drupal-dynamic-cache" }],
    },
  },
  {
    name: "Joomla",
    category: "cms",
    website: "https://joomla.org",
    description: "CMS de código abierto",
    patterns: {
      html: [/\/media\/jui\//i, /\/components\/com_/i],
      meta: [{ name: "generator", content: /Joomla/i }],
    },
  },
  {
    name: "Ghost",
    category: "cms",
    website: "https://ghost.org",
    description: "Plataforma de publicación moderna",
    patterns: {
      html: [/ghost-/i],
      meta: [{ name: "generator", content: /Ghost/i }],
      headers: [{ name: "x-ghost-cache-status" }],
    },
  },
  {
    name: "Framer",
    category: "cms",
    website: "https://framer.com",
    description: "Herramienta de diseño y publicación web",
    patterns: {
      html: [/framer/i, /framerusercontent\.com/i],
      scripts: [/framer/i],
    },
  },

  // ============ E-COMMERCE ============
  {
    name: "WooCommerce",
    category: "ecommerce",
    website: "https://woocommerce.com",
    description: "Plugin de comercio electrónico para WordPress",
    patterns: {
      html: [/woocommerce/i, /wc-/i],
      scripts: [/woocommerce/i, /wc-/i],
      styles: [/woocommerce/i],
    },
  },
  {
    name: "Magento",
    category: "ecommerce",
    website: "https://business.adobe.com/products/magento/magento-commerce.html",
    description: "Plataforma de comercio electrónico empresarial",
    patterns: {
      html: [/mage-/i, /Magento/i, /\/static\/version/i],
      scripts: [/mage\/requirejs/i, /Magento_/i],
      headers: [{ name: "x-magento-vary" }],
    },
  },
  {
    name: "PrestaShop",
    category: "ecommerce",
    website: "https://prestashop.com",
    description: "Solución de e-commerce de código abierto",
    patterns: {
      html: [/prestashop/i, /\/modules\//i],
      meta: [{ name: "generator", content: /PrestaShop/i }],
    },
  },
  {
    name: "BigCommerce",
    category: "ecommerce",
    website: "https://bigcommerce.com",
    description: "Plataforma SaaS de comercio electrónico",
    patterns: {
      html: [/bigcommerce/i],
      scripts: [/bigcommerce\.com/i],
      headers: [{ name: "x-bc-" }],
    },
  },

  // ============ FRAMEWORKS JS ============
  {
    name: "React",
    category: "framework",
    website: "https://react.dev",
    description: "Librería para construir interfaces de usuario",
    patterns: {
      html: [/__react/i, /data-reactroot/i, /data-reactid/i, /_react/i],
      scripts: [/react(?:\.min)?\.js/i, /react-dom/i],
    },
  },
  {
    name: "Next.js",
    category: "framework",
    website: "https://nextjs.org",
    description: "Framework de React para producción",
    patterns: {
      html: [/__next/i, /next\/dist/i, /_next\//i],
      scripts: [/_next\/static/i, /next\/dist/i],
      headers: [{ name: "x-nextjs-cache" }, { name: "x-powered-by", value: /Next\.js/i }],
    },
  },
  {
    name: "Vue.js",
    category: "framework",
    website: "https://vuejs.org",
    description: "Framework progresivo para construir interfaces",
    patterns: {
      html: [/v-cloak/i, /data-v-/i, /__vue/i],
      scripts: [/vue(?:\.min)?\.js/i, /vue@/i],
    },
  },
  {
    name: "Nuxt.js",
    category: "framework",
    website: "https://nuxt.com",
    description: "Framework de Vue para producción",
    patterns: {
      html: [/__nuxt/i, /nuxt/i],
      scripts: [/_nuxt\//i],
      headers: [{ name: "x-powered-by", value: /Nuxt/i }],
    },
  },
  {
    name: "Angular",
    category: "framework",
    website: "https://angular.io",
    description: "Framework de aplicaciones web de Google",
    patterns: {
      html: [/ng-version/i, /\[ng/i, /ng-/i, /_ng/i],
      scripts: [/angular(?:\.min)?\.js/i, /@angular\/core/i],
    },
  },
  {
    name: "Svelte",
    category: "framework",
    website: "https://svelte.dev",
    description: "Framework compilador de componentes",
    patterns: {
      html: [/svelte/i, /__svelte/i],
      scripts: [/svelte/i],
    },
  },
  {
    name: "SvelteKit",
    category: "framework",
    website: "https://kit.svelte.dev",
    description: "Framework de aplicaciones Svelte",
    patterns: {
      html: [/__sveltekit/i, /sveltekit/i],
      scripts: [/sveltekit/i],
    },
  },
  {
    name: "Gatsby",
    category: "framework",
    website: "https://gatsbyjs.com",
    description: "Framework de React para sitios estáticos",
    patterns: {
      html: [/gatsby/i, /___gatsby/i],
      scripts: [/gatsby/i],
      meta: [{ name: "generator", content: /Gatsby/i }],
    },
  },
  {
    name: "Remix",
    category: "framework",
    website: "https://remix.run",
    description: "Framework full-stack de React",
    patterns: {
      html: [/__remix/i],
      scripts: [/remix/i],
    },
  },
  {
    name: "Astro",
    category: "framework",
    website: "https://astro.build",
    description: "Framework para sitios web centrados en contenido",
    patterns: {
      html: [/astro/i],
      scripts: [/astro/i],
      meta: [{ name: "generator", content: /Astro/i }],
    },
  },

  // ============ JAVASCRIPT LIBRARIES ============
  {
    name: "jQuery",
    category: "javascript",
    website: "https://jquery.com",
    description: "Librería JavaScript más popular",
    patterns: {
      scripts: [/jquery(?:\.min)?\.js/i, /jquery-[\d\.]+/i],
    },
  },
  {
    name: "GSAP",
    category: "javascript",
    website: "https://greensock.com/gsap",
    description: "Librería de animaciones profesional",
    patterns: {
      scripts: [/gsap/i, /TweenMax/i, /TweenLite/i],
    },
  },
  {
    name: "Three.js",
    category: "javascript",
    website: "https://threejs.org",
    description: "Librería 3D para WebGL",
    patterns: {
      scripts: [/three(?:\.min)?\.js/i],
    },
  },
  {
    name: "Lodash",
    category: "javascript",
    website: "https://lodash.com",
    description: "Utilidades JavaScript modernas",
    patterns: {
      scripts: [/lodash(?:\.min)?\.js/i],
    },
  },
  {
    name: "Moment.js",
    category: "javascript",
    website: "https://momentjs.com",
    description: "Librería para manejo de fechas",
    patterns: {
      scripts: [/moment(?:\.min)?\.js/i],
    },
  },
  {
    name: "Axios",
    category: "javascript",
    website: "https://axios-http.com",
    description: "Cliente HTTP basado en promesas",
    patterns: {
      scripts: [/axios(?:\.min)?\.js/i],
    },
  },
  {
    name: "Alpine.js",
    category: "javascript",
    website: "https://alpinejs.dev",
    description: "Framework JavaScript ligero",
    patterns: {
      html: [/x-data/i, /x-show/i, /x-bind/i],
      scripts: [/alpine/i],
    },
  },
  {
    name: "htmx",
    category: "javascript",
    website: "https://htmx.org",
    description: "AJAX, CSS Transitions, WebSockets en HTML",
    patterns: {
      html: [/hx-get/i, /hx-post/i, /hx-trigger/i],
      scripts: [/htmx/i],
    },
  },

  // ============ CSS FRAMEWORKS ============
  {
    name: "Tailwind CSS",
    category: "css",
    website: "https://tailwindcss.com",
    description: "Framework CSS utility-first",
    patterns: {
      html: [/class="[^"]*(?:flex|grid|p-|m-|text-|bg-|border-)/i],
      styles: [/tailwind/i],
    },
  },
  {
    name: "Bootstrap",
    category: "css",
    website: "https://getbootstrap.com",
    description: "Framework CSS más popular",
    patterns: {
      html: [/class="[^"]*(?:container|row|col-|btn|navbar)/i],
      scripts: [/bootstrap(?:\.min)?\.js/i, /bootstrap\.bundle/i],
      styles: [/bootstrap(?:\.min)?\.css/i],
    },
  },
  {
    name: "Bulma",
    category: "css",
    website: "https://bulma.io",
    description: "Framework CSS moderno basado en Flexbox",
    patterns: {
      html: [/class="[^"]*(?:is-|has-|column|hero)/i],
      styles: [/bulma(?:\.min)?\.css/i],
    },
  },
  {
    name: "Foundation",
    category: "css",
    website: "https://get.foundation",
    description: "Framework CSS responsive avanzado",
    patterns: {
      styles: [/foundation(?:\.min)?\.css/i],
      scripts: [/foundation(?:\.min)?\.js/i],
    },
  },
  {
    name: "Material UI",
    category: "css",
    website: "https://mui.com",
    description: "Componentes React con Material Design",
    patterns: {
      html: [/Mui/i, /MuiButton/i, /MuiTypography/i],
      scripts: [/@mui/i, /material-ui/i],
    },
  },
  {
    name: "Chakra UI",
    category: "css",
    website: "https://chakra-ui.com",
    description: "Componentes React accesibles",
    patterns: {
      html: [/chakra/i, /css-/i],
      scripts: [/chakra/i],
    },
  },

  // ============ ANALYTICS ============
  {
    name: "Google Analytics",
    category: "analytics",
    website: "https://analytics.google.com",
    description: "Servicio de analítica web de Google",
    patterns: {
      html: [/google-analytics\.com/i, /googletagmanager\.com/i, /gtag/i, /UA-\d+-\d+/i, /G-[A-Z0-9]+/i],
      scripts: [/google-analytics\.com/i, /googletagmanager\.com/i, /gtag\.js/i],
    },
  },
  {
    name: "Google Tag Manager",
    category: "analytics",
    website: "https://tagmanager.google.com",
    description: "Sistema de gestión de etiquetas",
    patterns: {
      html: [/googletagmanager\.com\/gtm/i, /GTM-[A-Z0-9]+/i],
      scripts: [/googletagmanager\.com/i],
    },
  },
  {
    name: "Hotjar",
    category: "analytics",
    website: "https://hotjar.com",
    description: "Mapas de calor y grabaciones de sesión",
    patterns: {
      scripts: [/hotjar\.com/i, /static\.hotjar/i],
    },
  },
  {
    name: "Mixpanel",
    category: "analytics",
    website: "https://mixpanel.com",
    description: "Analítica de productos",
    patterns: {
      scripts: [/mixpanel\.com/i, /cdn\.mxpnl/i],
    },
  },
  {
    name: "Amplitude",
    category: "analytics",
    website: "https://amplitude.com",
    description: "Plataforma de analítica de productos",
    patterns: {
      scripts: [/amplitude\.com/i, /cdn\.amplitude/i],
    },
  },
  {
    name: "Plausible",
    category: "analytics",
    website: "https://plausible.io",
    description: "Analítica web ligera y privada",
    patterns: {
      scripts: [/plausible\.io/i],
    },
  },
  {
    name: "Clarity",
    category: "analytics",
    website: "https://clarity.microsoft.com",
    description: "Analítica de comportamiento de Microsoft",
    patterns: {
      scripts: [/clarity\.ms/i],
    },
  },

  // ============ MARKETING ============
  {
    name: "Facebook Pixel",
    category: "marketing",
    website: "https://facebook.com/business",
    description: "Seguimiento de conversiones de Meta",
    patterns: {
      html: [/facebook\.net\/.*fbevents/i, /fbq\(/i],
      scripts: [/connect\.facebook\.net/i, /fbevents\.js/i],
    },
  },
  {
    name: "HubSpot",
    category: "marketing",
    website: "https://hubspot.com",
    description: "Plataforma de marketing automation",
    patterns: {
      scripts: [/hubspot\.com/i, /hs-scripts/i, /hstc/i],
    },
  },
  {
    name: "Mailchimp",
    category: "marketing",
    website: "https://mailchimp.com",
    description: "Plataforma de email marketing",
    patterns: {
      html: [/mailchimp/i, /mc\.us/i, /chimpstatic/i],
      scripts: [/mailchimp/i, /chimpstatic/i],
    },
  },
  {
    name: "Klaviyo",
    category: "marketing",
    website: "https://klaviyo.com",
    description: "Marketing automation para e-commerce",
    patterns: {
      scripts: [/klaviyo\.com/i, /static-klaviyo/i],
    },
  },
  {
    name: "Intercom",
    category: "chat",
    website: "https://intercom.com",
    description: "Plataforma de mensajería para empresas",
    patterns: {
      scripts: [/intercom\.io/i, /widget\.intercom/i],
      html: [/intercom/i],
    },
  },
  {
    name: "Drift",
    category: "chat",
    website: "https://drift.com",
    description: "Plataforma de marketing conversacional",
    patterns: {
      scripts: [/drift\.com/i, /js\.driftt/i],
    },
  },
  {
    name: "Crisp",
    category: "chat",
    website: "https://crisp.chat",
    description: "Software de chat y soporte",
    patterns: {
      scripts: [/crisp\.chat/i, /client\.crisp/i],
    },
  },
  {
    name: "Zendesk",
    category: "chat",
    website: "https://zendesk.com",
    description: "Plataforma de servicio al cliente",
    patterns: {
      scripts: [/zdassets\.com/i, /zendesk/i],
    },
  },
  {
    name: "Tawk.to",
    category: "chat",
    website: "https://tawk.to",
    description: "Chat en vivo gratuito",
    patterns: {
      scripts: [/tawk\.to/i, /embed\.tawk/i],
    },
  },

  // ============ CDN & HOSTING ============
  {
    name: "Cloudflare",
    category: "cdn",
    website: "https://cloudflare.com",
    description: "CDN y seguridad web",
    patterns: {
      headers: [{ name: "cf-ray" }, { name: "cf-cache-status" }, { name: "server", value: /cloudflare/i }],
    },
  },
  {
    name: "Vercel",
    category: "hosting",
    website: "https://vercel.com",
    description: "Plataforma de despliegue para frontend",
    patterns: {
      headers: [{ name: "x-vercel-id" }, { name: "x-vercel-cache" }, { name: "server", value: /Vercel/i }],
    },
  },
  {
    name: "Netlify",
    category: "hosting",
    website: "https://netlify.com",
    description: "Plataforma de desarrollo web",
    patterns: {
      headers: [{ name: "x-nf-request-id" }, { name: "server", value: /Netlify/i }],
    },
  },
  {
    name: "AWS",
    category: "hosting",
    website: "https://aws.amazon.com",
    description: "Amazon Web Services",
    patterns: {
      headers: [{ name: "x-amz-cf-id" }, { name: "x-amzn-requestid" }, { name: "server", value: /AmazonS3/i }],
      html: [/amazonaws\.com/i, /cloudfront\.net/i],
    },
  },
  {
    name: "Google Cloud",
    category: "hosting",
    website: "https://cloud.google.com",
    description: "Google Cloud Platform",
    patterns: {
      headers: [{ name: "x-goog-" }, { name: "server", value: /Google/i }],
      html: [/googleapis\.com/i, /storage\.googleapis/i],
    },
  },
  {
    name: "Fastly",
    category: "cdn",
    website: "https://fastly.com",
    description: "CDN y edge computing",
    patterns: {
      headers: [{ name: "x-served-by", value: /cache/i }, { name: "via", value: /varnish/i }],
    },
  },
  {
    name: "Akamai",
    category: "cdn",
    website: "https://akamai.com",
    description: "CDN empresarial líder",
    patterns: {
      headers: [{ name: "x-akamai-transformed" }, { name: "server", value: /AkamaiGHost/i }],
    },
  },

  // ============ FONTS ============
  {
    name: "Google Fonts",
    category: "fonts",
    website: "https://fonts.google.com",
    description: "Biblioteca de fuentes gratuitas",
    patterns: {
      html: [/fonts\.googleapis\.com/i, /fonts\.gstatic\.com/i],
      styles: [/fonts\.googleapis\.com/i],
    },
  },
  {
    name: "Adobe Fonts",
    category: "fonts",
    website: "https://fonts.adobe.com",
    description: "Fuentes premium de Adobe",
    patterns: {
      html: [/use\.typekit\.net/i, /typekit/i],
      scripts: [/use\.typekit/i],
    },
  },
  {
    name: "Font Awesome",
    category: "fonts",
    website: "https://fontawesome.com",
    description: "Iconos vectoriales y tipografías",
    patterns: {
      html: [/font-awesome/i, /fa-/i, /fontawesome/i],
      styles: [/font-awesome/i, /fontawesome/i],
      scripts: [/fontawesome/i],
    },
  },

  // ============ PAYMENT ============
  {
    name: "Stripe",
    category: "payment",
    website: "https://stripe.com",
    description: "Procesamiento de pagos online",
    patterns: {
      scripts: [/js\.stripe\.com/i, /stripe/i],
      html: [/stripe/i],
    },
  },
  {
    name: "PayPal",
    category: "payment",
    website: "https://paypal.com",
    description: "Pagos en línea globales",
    patterns: {
      scripts: [/paypal\.com/i, /paypalobjects\.com/i],
      html: [/paypal/i],
    },
  },
  {
    name: "Square",
    category: "payment",
    website: "https://squareup.com",
    description: "Soluciones de pago para negocios",
    patterns: {
      scripts: [/squareup\.com/i, /square\.com/i],
    },
  },

  // ============ SECURITY ============
  {
    name: "reCAPTCHA",
    category: "security",
    website: "https://google.com/recaptcha",
    description: "Sistema anti-bot de Google",
    patterns: {
      html: [/recaptcha/i, /g-recaptcha/i],
      scripts: [/google\.com\/recaptcha/i, /recaptcha/i],
    },
  },
  {
    name: "hCaptcha",
    category: "security",
    website: "https://hcaptcha.com",
    description: "Alternativa privada a reCAPTCHA",
    patterns: {
      scripts: [/hcaptcha\.com/i],
      html: [/h-captcha/i],
    },
  },
  {
    name: "Cloudflare Turnstile",
    category: "security",
    website: "https://cloudflare.com/products/turnstile",
    description: "CAPTCHA sin interacción de Cloudflare",
    patterns: {
      scripts: [/challenges\.cloudflare\.com\/turnstile/i],
      html: [/cf-turnstile/i],
    },
  },
];
