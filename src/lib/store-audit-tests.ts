import type {
  AuditCategory,
  AuditTest,
  CategoryScore,
  Platform,
  TestStatus,
  categoryMeta,
} from "@/types/store-audit";

// Platform detection patterns
const platformPatterns: Record<Platform, RegExp[]> = {
  shopify: [
    /cdn\.shopify\.com/i,
    /Shopify\.theme/i,
    /shopify-section/i,
    /myshopify\.com/i,
  ],
  woocommerce: [
    /woocommerce/i,
    /wc-block/i,
    /wp-content.*woocommerce/i,
    /add-to-cart/i,
  ],
  magento: [
    /Magento_/i,
    /mage-/i,
    /\/static\/version/i,
    /varien/i,
  ],
  prestashop: [
    /prestashop/i,
    /PrestaShop/i,
    /modules\/ps_/i,
  ],
  tiendanube: [
    /tiendanube/i,
    /nuvemshop/i,
    /lojaintegrada/i,
  ],
  vtex: [
    /vtex/i,
    /vteximg/i,
    /vtexassets/i,
  ],
  custom: [],
  unknown: [],
};

// Detect platform from HTML
export function detectPlatform(html: string, headers: Record<string, string>): { platform: Platform; confidence: "high" | "medium" | "low" } {
  const headerStr = JSON.stringify(headers).toLowerCase();
  
  // Check each platform
  for (const [platform, patterns] of Object.entries(platformPatterns)) {
    if (platform === "custom" || platform === "unknown") continue;
    
    let matches = 0;
    for (const pattern of patterns) {
      if (pattern.test(html) || pattern.test(headerStr)) {
        matches++;
      }
    }
    
    if (matches >= 2) {
      return { platform: platform as Platform, confidence: "high" };
    }
    if (matches === 1) {
      return { platform: platform as Platform, confidence: "medium" };
    }
  }
  
  // Check if it's at least an e-commerce site
  const ecommercePatterns = [
    /add.to.cart/i,
    /buy.now/i,
    /checkout/i,
    /shopping.cart/i,
    /precio|price/i,
    /carrito|cart/i,
  ];
  
  const isEcommerce = ecommercePatterns.some(p => p.test(html));
  
  return {
    platform: isEcommerce ? "custom" : "unknown",
    confidence: "low",
  };
}

// Extract store name from HTML
export function extractStoreName(html: string, url: string): string | undefined {
  // Try to get from title
  const titleMatch = html.match(/<title[^>]*>([^<|–-]+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  // Try from og:site_name
  const ogMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
  if (ogMatch) {
    return ogMatch[1].trim();
  }
  
  // Fallback to domain
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}

// Helper to create a test result
function createTest(
  id: string,
  name: string,
  description: string,
  passed: boolean | null,
  weight: number = 1,
  details?: string,
  recommendation?: string
): AuditTest {
  let status: TestStatus;
  let score: number;
  
  if (passed === null) {
    status = "info";
    score = 50; // Neutral
  } else if (passed) {
    status = "pass";
    score = 100;
  } else {
    status = "fail";
    score = 0;
  }
  
  return {
    id,
    name,
    description,
    status,
    score,
    weight,
    details,
    recommendation,
  };
}

// ============ TRUST TESTS ============
export function runTrustTests(html: string, url: string, headers: Record<string, string>): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // SSL Certificate
  const isHttps = url.startsWith("https://");
  tests.push(createTest(
    "ssl",
    "Certificado SSL",
    "La tienda usa conexión segura HTTPS",
    isHttps,
    2,
    isHttps ? "Conexión segura detectada" : "No se detectó HTTPS",
    isHttps ? undefined : "Instala un certificado SSL. Es gratis con Let's Encrypt y esencial para la confianza."
  ));
  
  // Privacy Policy
  const hasPrivacyPolicy = /pol[íi]tica.*privacidad|privacy.*policy|privacidade/i.test(html);
  tests.push(createTest(
    "privacy-policy",
    "Política de Privacidad",
    "Enlace visible a política de privacidad",
    hasPrivacyPolicy,
    1,
    hasPrivacyPolicy ? "Política de privacidad encontrada" : "No se encontró enlace a política de privacidad",
    hasPrivacyPolicy ? undefined : "Agrega un enlace visible a tu política de privacidad en el footer."
  ));
  
  // Return Policy
  const hasReturnPolicy = /devoluc|cambios|returns|refund|garant[íi]a/i.test(html);
  tests.push(createTest(
    "return-policy",
    "Política de Devoluciones",
    "Información sobre devoluciones y garantías",
    hasReturnPolicy,
    2,
    hasReturnPolicy ? "Información de devoluciones encontrada" : "No se encontró política de devoluciones",
    hasReturnPolicy ? undefined : "Los clientes necesitan saber que pueden devolver productos. Agrega una política clara."
  ));
  
  // Contact Information
  const hasEmail = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html) || /mailto:/i.test(html);
  const hasPhone = /\+?[\d\s()-]{10,}/.test(html) || /tel:/i.test(html) || /whatsapp/i.test(html);
  const hasAddress = /direcci[óo]n|address|ubicaci[óo]n|calle|av\.|avenida/i.test(html);
  
  tests.push(createTest(
    "contact-info",
    "Información de Contacto",
    "Email, teléfono o dirección visible",
    hasEmail || hasPhone || hasAddress,
    2,
    `Email: ${hasEmail ? "✓" : "✗"}, Teléfono: ${hasPhone ? "✓" : "✗"}, Dirección: ${hasAddress ? "✓" : "✗"}`,
    (hasEmail || hasPhone || hasAddress) ? undefined : "Agrega información de contacto visible. Los clientes confían más cuando pueden contactarte."
  ));
  
  // Reviews/Testimonials
  const hasReviews = /review|reseña|opiniones|testimonios|estrellas|stars|rating|\d+\/5/i.test(html);
  tests.push(createTest(
    "reviews",
    "Reseñas y Testimonios",
    "Opiniones de clientes visibles",
    hasReviews,
    2,
    hasReviews ? "Se detectaron reseñas o testimonios" : "No se encontraron reseñas visibles",
    hasReviews ? undefined : "Las reseñas aumentan la confianza. Agrega testimonios de clientes satisfechos."
  ));
  
  // Trust Badges
  const hasTrustBadges = /pago.*seguro|secure.*payment|ssl|verified|certificado|trustpilot|sitio.*seguro|compra.*segura/i.test(html);
  tests.push(createTest(
    "trust-badges",
    "Sellos de Confianza",
    "Badges de seguridad y pago seguro",
    hasTrustBadges,
    1,
    hasTrustBadges ? "Sellos de confianza detectados" : "No se encontraron sellos de confianza",
    hasTrustBadges ? undefined : "Agrega sellos de 'pago seguro' y certificaciones para aumentar la confianza."
  ));
  
  // Social Media Links
  const hasSocialLinks = /facebook|instagram|twitter|tiktok|youtube|linkedin|pinterest/i.test(html);
  tests.push(createTest(
    "social-links",
    "Redes Sociales",
    "Enlaces a perfiles de redes sociales",
    hasSocialLinks,
    1,
    hasSocialLinks ? "Enlaces a redes sociales encontrados" : "No se encontraron enlaces a redes sociales",
    hasSocialLinks ? undefined : "Agrega enlaces a tus redes sociales. Da legitimidad a tu negocio."
  ));
  
  return tests;
}

// ============ CHECKOUT TESTS ============
export function runCheckoutTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Add to Cart Button
  const hasAddToCart = /add.*cart|agregar.*carrito|comprar|buy.*now|añadir|agregar/i.test(html);
  tests.push(createTest(
    "add-to-cart",
    "Botón Agregar al Carrito",
    "Botón de compra visible y claro",
    hasAddToCart,
    2,
    hasAddToCart ? "Botón de compra detectado" : "No se encontró botón de agregar al carrito",
    hasAddToCart ? undefined : "Asegúrate de tener un botón de compra visible y con texto claro."
  ));
  
  // Multiple Payment Methods
  const paymentMethods = {
    card: /visa|mastercard|tarjeta.*cr[eé]dito|credit.*card|d[eé]bito/i.test(html),
    paypal: /paypal/i.test(html),
    stripe: /stripe/i.test(html),
    mercadopago: /mercado.*pago|mercadopago/i.test(html),
    transfer: /transferencia|dep[oó]sito|wire.*transfer/i.test(html),
    cash: /efectivo|contra.*entrega|cash.*delivery/i.test(html),
  };
  const paymentCount = Object.values(paymentMethods).filter(Boolean).length;
  
  tests.push(createTest(
    "payment-methods",
    "Métodos de Pago",
    "Múltiples opciones de pago disponibles",
    paymentCount >= 2,
    2,
    `${paymentCount} método(s) de pago detectado(s)`,
    paymentCount >= 2 ? undefined : "Ofrece múltiples métodos de pago. Cada cliente tiene su preferencia."
  ));
  
  // Cart Icon/Access
  const hasCartIcon = /cart|carrito|cesta|bag|bolsa/i.test(html) && /<(a|button|div)[^>]*cart/i.test(html);
  tests.push(createTest(
    "cart-access",
    "Acceso al Carrito",
    "Icono de carrito visible en la navegación",
    hasCartIcon,
    1,
    hasCartIcon ? "Carrito accesible desde la navegación" : "No se detectó icono de carrito visible",
    hasCartIcon ? undefined : "El icono del carrito debe estar siempre visible en el header."
  ));
  
  // Guest Checkout
  const hasGuestCheckout = /guest|invitado|sin.*registr|without.*account|continuar.*sin/i.test(html);
  tests.push(createTest(
    "guest-checkout",
    "Compra sin Registro",
    "Opción de comprar sin crear cuenta",
    hasGuestCheckout,
    1,
    hasGuestCheckout ? "Checkout como invitado disponible" : "No se detectó opción de compra sin registro",
    hasGuestCheckout ? undefined : "Permite comprar sin crear cuenta. Reduce la fricción del checkout."
  ));
  
  return tests;
}

// ============ SHIPPING TESTS ============
export function runShippingTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Free Shipping
  const hasFreeShipping = /env[íi]o.*gratis|free.*shipping|frete.*gr[áa]tis|sin.*costo.*env[íi]o/i.test(html);
  tests.push(createTest(
    "free-shipping",
    "Envío Gratis",
    "Oferta de envío gratis mencionada",
    hasFreeShipping,
    2,
    hasFreeShipping ? "Envío gratis detectado" : "No se encontró oferta de envío gratis",
    hasFreeShipping ? undefined : "El envío gratis es uno de los mayores motivadores de compra. Considera ofrecerlo."
  ));
  
  // Shipping Calculator
  const hasShippingCalc = /calcul.*env[íi]o|shipping.*calculator|calcular.*frete|cotizar.*env[íi]o|c[óo]digo.*postal|zip.*code/i.test(html);
  tests.push(createTest(
    "shipping-calculator",
    "Calculadora de Envío",
    "Posibilidad de calcular envío antes de checkout",
    hasShippingCalc,
    2,
    hasShippingCalc ? "Calculadora de envío detectada" : "No se encontró calculadora de envío",
    hasShippingCalc ? undefined : "Los costos de envío sorpresa causan abandono. Muestra el costo antes del checkout."
  ));
  
  // Delivery Time
  const hasDeliveryTime = /d[íi]as.*h[áa]biles|tiempo.*entrega|delivery.*time|entrega.*en|llega.*en|\d+.*d[íi]as/i.test(html);
  tests.push(createTest(
    "delivery-time",
    "Tiempo de Entrega",
    "Información de tiempos de entrega visible",
    hasDeliveryTime,
    1,
    hasDeliveryTime ? "Información de tiempos de entrega encontrada" : "No se encontró información de tiempos de entrega",
    hasDeliveryTime ? undefined : "Indica cuánto tarda en llegar el pedido. Reduce la ansiedad del comprador."
  ));
  
  // Shipping Policy
  const hasShippingPolicy = /pol[íi]tica.*env[íi]o|shipping.*policy|informaci[óo]n.*env[íi]o/i.test(html);
  tests.push(createTest(
    "shipping-policy",
    "Política de Envío",
    "Página o sección de política de envíos",
    hasShippingPolicy,
    1,
    hasShippingPolicy ? "Política de envío encontrada" : "No se encontró política de envío detallada",
    hasShippingPolicy ? undefined : "Crea una página con toda la información de envíos, zonas y costos."
  ));
  
  return tests;
}

// ============ PERFORMANCE TESTS ============
export function runPerformanceTests(html: string, responseTime: number): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Response Time (basic check)
  const isGoodResponseTime = responseTime < 3000;
  const isAcceptableResponseTime = responseTime < 5000;
  
  tests.push(createTest(
    "response-time",
    "Tiempo de Respuesta",
    "Velocidad de carga inicial del servidor",
    isGoodResponseTime,
    2,
    `Tiempo de respuesta: ${(responseTime / 1000).toFixed(2)}s`,
    isGoodResponseTime ? undefined : "El servidor tarda demasiado. Considera mejorar tu hosting o usar un CDN."
  ));
  
  // Mobile Viewport
  const hasMobileViewport = /<meta[^>]*viewport[^>]*width=device-width/i.test(html);
  tests.push(createTest(
    "mobile-viewport",
    "Diseño Responsive",
    "Configuración para dispositivos móviles",
    hasMobileViewport,
    2,
    hasMobileViewport ? "Viewport móvil configurado" : "No se detectó configuración mobile",
    hasMobileViewport ? undefined : "Tu tienda no está optimizada para móviles. Más del 70% del tráfico es móvil."
  ));
  
  // Image Optimization
  const hasLazyLoading = /loading=["']lazy["']|lazyload/i.test(html);
  const hasWebP = /\.webp/i.test(html);
  
  tests.push(createTest(
    "image-optimization",
    "Optimización de Imágenes",
    "Lazy loading y formatos modernos",
    hasLazyLoading || hasWebP,
    1,
    `Lazy loading: ${hasLazyLoading ? "✓" : "✗"}, WebP: ${hasWebP ? "✓" : "✗"}`,
    (hasLazyLoading || hasWebP) ? undefined : "Usa lazy loading y formato WebP para cargar más rápido."
  ));
  
  // Minified Resources
  const hasMinified = /\.min\.(js|css)/i.test(html);
  tests.push(createTest(
    "minified-resources",
    "Recursos Minificados",
    "CSS y JavaScript optimizados",
    hasMinified,
    1,
    hasMinified ? "Recursos minificados detectados" : "No se detectaron recursos minificados",
    hasMinified ? undefined : "Minifica tu CSS y JavaScript para reducir el tiempo de carga."
  ));
  
  return tests;
}

// ============ PRODUCT PRESENTATION TESTS ============
export function runProductTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Product Images
  const imageMatches = html.match(/<img[^>]+>/gi) || [];
  const productImages = imageMatches.filter(img => 
    /product|producto|item|gallery|zoom/i.test(img)
  ).length;
  
  tests.push(createTest(
    "product-images",
    "Imágenes de Producto",
    "Cantidad de imágenes de productos",
    productImages >= 3,
    2,
    `${productImages} imágenes de producto detectadas`,
    productImages >= 3 ? undefined : "Los productos necesitan múltiples fotos desde diferentes ángulos."
  ));
  
  // Image Zoom
  const hasZoom = /zoom|magnif|ampliar|lupa/i.test(html);
  tests.push(createTest(
    "image-zoom",
    "Zoom de Imagen",
    "Posibilidad de ampliar fotos de producto",
    hasZoom,
    1,
    hasZoom ? "Función de zoom detectada" : "No se detectó función de zoom",
    hasZoom ? undefined : "Agrega zoom a las imágenes. Los clientes quieren ver el detalle."
  ));
  
  // Video Content
  const hasVideo = /<video|youtube|vimeo|embed/i.test(html);
  tests.push(createTest(
    "product-video",
    "Videos de Producto",
    "Contenido de video en productos",
    hasVideo,
    1,
    hasVideo ? "Videos detectados" : "No se encontraron videos de producto",
    hasVideo ? undefined : "Los videos aumentan las conversiones. Considera agregar videos de producto."
  ));
  
  // High Quality Images
  const hasHQImages = /large|grande|1024|1200|high|hd/i.test(html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "");
  tests.push(createTest(
    "image-quality",
    "Calidad de Imágenes",
    "Imágenes en alta resolución",
    hasHQImages,
    1,
    hasHQImages ? "Imágenes de alta calidad detectadas" : "No se pudo verificar la calidad de imágenes",
    hasHQImages ? undefined : "Usa imágenes de alta resolución. Las fotos malas = menos ventas."
  ));
  
  return tests;
}

// ============ DESCRIPTION TESTS ============
export function runDescriptionTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Description Length
  const descriptionMatch = html.match(/(?:description|descripci[óo]n)[^>]*>([^<]{50,})/i);
  const hasLongDescription = descriptionMatch && descriptionMatch[1].length > 200;
  
  tests.push(createTest(
    "description-length",
    "Longitud de Descripción",
    "Descripciones detalladas de productos",
    hasLongDescription === true,
    2,
    hasLongDescription ? "Descripciones detalladas encontradas" : "Descripciones muy cortas o no encontradas",
    hasLongDescription ? undefined : "Las descripciones cortas no venden. Escribe textos que emocionen y convenzan."
  ));
  
  // Bullet Points
  const hasBullets = /<ul[^>]*>[\s\S]*<li/i.test(html) || /<li/i.test(html);
  tests.push(createTest(
    "bullet-points",
    "Listas y Bullets",
    "Uso de listas para destacar características",
    hasBullets,
    1,
    hasBullets ? "Listas/bullets encontrados" : "No se encontraron listas de características",
    hasBullets ? undefined : "Usa bullets para destacar beneficios. Son más fáciles de leer."
  ));
  
  // Technical Specs
  const hasSpecs = /especificaciones|specifications|ficha.*t[eé]cnica|dimensiones|peso|material|talla|size/i.test(html);
  tests.push(createTest(
    "technical-specs",
    "Especificaciones Técnicas",
    "Información técnica del producto",
    hasSpecs,
    1,
    hasSpecs ? "Especificaciones técnicas encontradas" : "No se encontraron especificaciones técnicas",
    hasSpecs ? undefined : "Agrega ficha técnica: dimensiones, materiales, peso. Reduce dudas."
  ));
  
  // Power Words (persuasion)
  const powerWords = /exclusivo|limitado|gratis|garant[íi]a|premium|original|nuevo|oferta|descuento|ahorra/i;
  const hasPowerWords = powerWords.test(html);
  tests.push(createTest(
    "power-words",
    "Palabras de Venta",
    "Uso de palabras persuasivas",
    hasPowerWords,
    1,
    hasPowerWords ? "Palabras de venta detectadas" : "Faltan palabras que impulsen la compra",
    hasPowerWords ? undefined : "Usa palabras como: exclusivo, limitado, gratis, garantía, ahorra."
  ));
  
  return tests;
}

// ============ SEARCH TESTS ============
export function runSearchTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Search Box
  const hasSearch = /<input[^>]*type=["']search["']|search|buscar|busqueda/i.test(html);
  tests.push(createTest(
    "search-box",
    "Buscador Interno",
    "Campo de búsqueda visible",
    hasSearch,
    2,
    hasSearch ? "Buscador encontrado" : "No se encontró buscador interno",
    hasSearch ? undefined : "El buscador es esencial. Los clientes que buscan tienen alta intención de compra."
  ));
  
  // Autocomplete
  const hasAutocomplete = /autocomplete|suggest|autocomplet/i.test(html);
  tests.push(createTest(
    "search-autocomplete",
    "Autocompletado",
    "Sugerencias mientras escribes",
    hasAutocomplete,
    1,
    hasAutocomplete ? "Autocompletado detectado" : "No se detectó autocompletado",
    hasAutocomplete ? undefined : "Agrega autocompletado al buscador. Ayuda a encontrar productos más rápido."
  ));
  
  // Filters
  const hasFilters = /filter|filtro|ordenar|sort|categoria|category|precio|price/i.test(html);
  tests.push(createTest(
    "search-filters",
    "Filtros de Búsqueda",
    "Opciones para filtrar resultados",
    hasFilters,
    1,
    hasFilters ? "Filtros detectados" : "No se encontraron filtros de búsqueda",
    hasFilters ? undefined : "Agrega filtros por precio, categoría, etc. Facilita encontrar productos."
  ));
  
  return tests;
}

// ============ URGENCY TESTS ============
export function runUrgencyTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Stock Indicators
  const hasStock = /stock|disponible|quedan|unidades|agotado|sold.*out|últimas/i.test(html);
  tests.push(createTest(
    "stock-indicator",
    "Indicador de Stock",
    "Muestra disponibilidad del producto",
    hasStock,
    2,
    hasStock ? "Indicador de stock encontrado" : "No se muestra disponibilidad de stock",
    hasStock ? undefined : "Muestra 'Quedan X unidades'. Crea urgencia y reduce abandonos."
  ));
  
  // Discounts/Offers
  const hasDiscounts = /descuento|oferta|sale|%\s*off|antes|ahora|rebaja|promoción/i.test(html);
  tests.push(createTest(
    "discounts",
    "Ofertas y Descuentos",
    "Promociones visibles",
    hasDiscounts,
    1,
    hasDiscounts ? "Ofertas/descuentos detectados" : "No se encontraron ofertas visibles",
    hasDiscounts ? undefined : "Las ofertas motivan la compra. Muestra el precio tachado + nuevo precio."
  ));
  
  // Countdown Timer
  const hasTimer = /countdown|timer|hora|minuto|termina|expira|queda.*tiempo/i.test(html);
  tests.push(createTest(
    "countdown-timer",
    "Temporizador de Oferta",
    "Contador de tiempo para ofertas",
    hasTimer,
    1,
    hasTimer ? "Temporizador detectado" : "No se encontró temporizador de ofertas",
    hasTimer ? undefined : "Los temporizadores crean urgencia. Usa con moderación para ofertas reales."
  ));
  
  // Recently Viewed/Purchased
  const hasRecentActivity = /recientemente|recently|otros.*compraron|people.*bought|visitantes/i.test(html);
  tests.push(createTest(
    "social-proof-urgency",
    "Prueba Social de Urgencia",
    "'X personas viendo este producto'",
    hasRecentActivity,
    1,
    hasRecentActivity ? "Indicadores de actividad encontrados" : "No se encontró prueba social de urgencia",
    hasRecentActivity ? undefined : "Muestra actividad reciente: 'X personas viendo esto' o 'Comprado X veces hoy'."
  ));
  
  return tests;
}

// ============ UPSELLING TESTS ============
export function runUpsellingTests(html: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Related Products
  const hasRelated = /relacionados|related|similar|te.*puede.*interesar|también.*gustar|recomendados/i.test(html);
  tests.push(createTest(
    "related-products",
    "Productos Relacionados",
    "Sugerencias de productos similares",
    hasRelated,
    2,
    hasRelated ? "Productos relacionados detectados" : "No se encontraron productos relacionados",
    hasRelated ? undefined : "Muestra 'También te puede interesar'. Aumenta el ticket promedio."
  ));
  
  // Bundles/Packs
  const hasBundles = /bundle|pack|combo|kit|set|junto|compra.*más/i.test(html);
  tests.push(createTest(
    "bundles",
    "Bundles y Packs",
    "Ofertas de productos combinados",
    hasBundles,
    1,
    hasBundles ? "Bundles/packs encontrados" : "No se detectaron bundles o packs",
    hasBundles ? undefined : "Ofrece packs o combos con descuento. Aumenta el valor del pedido."
  ));
  
  // Frequently Bought Together
  const hasFrequentlyBought = /frecuentemente|juntos|together|combina.*con|completa.*look/i.test(html);
  tests.push(createTest(
    "frequently-bought",
    "Comprados Juntos",
    "'Frecuentemente comprados juntos'",
    hasFrequentlyBought,
    1,
    hasFrequentlyBought ? "Sección 'comprados juntos' detectada" : "No se encontró sección de comprados juntos",
    hasFrequentlyBought ? undefined : "Agrega 'Frecuentemente comprados juntos' como Amazon. Gran impulsor de ventas."
  ));
  
  // Quantity Discounts
  const hasQuantityDiscount = /compra.*más|buy.*more|descuento.*cantidad|mayor|wholesale|por\s*mayor/i.test(html);
  tests.push(createTest(
    "quantity-discount",
    "Descuento por Cantidad",
    "Incentivo para comprar más unidades",
    hasQuantityDiscount,
    1,
    hasQuantityDiscount ? "Descuentos por cantidad detectados" : "No se encontraron descuentos por cantidad",
    hasQuantityDiscount ? undefined : "Ofrece descuento al comprar más: 'Lleva 3, paga 2'."
  ));
  
  return tests;
}

// ============ SEO TESTS ============
export function runSEOTests(html: string, url: string): AuditTest[] {
  const tests: AuditTest[] = [];
  
  // Meta Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const hasGoodTitle = titleMatch && titleMatch[1].length >= 30 && titleMatch[1].length <= 70;
  tests.push(createTest(
    "meta-title",
    "Meta Título",
    "Título optimizado para SEO",
    hasGoodTitle === true,
    2,
    titleMatch ? `Título: "${titleMatch[1].substring(0, 50)}..." (${titleMatch[1].length} chars)` : "No se encontró título",
    hasGoodTitle ? undefined : "El título debe tener 30-70 caracteres e incluir palabras clave."
  ));
  
  // Meta Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const hasGoodDesc = descMatch && descMatch[1].length >= 120 && descMatch[1].length <= 160;
  tests.push(createTest(
    "meta-description",
    "Meta Descripción",
    "Descripción optimizada para buscadores",
    hasGoodDesc === true,
    2,
    descMatch ? `Descripción: "${descMatch[1].substring(0, 50)}..." (${descMatch[1].length} chars)` : "No se encontró meta descripción",
    hasGoodDesc ? undefined : "La descripción debe tener 120-160 caracteres y ser persuasiva."
  ));
  
  // Friendly URLs
  const hasFriendlyUrl = !/\?.*=|\.php\?|\.asp\?|[&?]id=/i.test(url);
  tests.push(createTest(
    "friendly-urls",
    "URLs Amigables",
    "URLs legibles sin parámetros extraños",
    hasFriendlyUrl,
    1,
    hasFriendlyUrl ? "URL amigable detectada" : "URL con parámetros complejos",
    hasFriendlyUrl ? undefined : "Usa URLs limpias como /producto/zapatos-rojos en vez de ?id=123."
  ));
  
  // Product Schema
  const hasProductSchema = /application\/ld\+json|schema\.org.*Product|itemtype.*Product/i.test(html);
  tests.push(createTest(
    "product-schema",
    "Schema de Producto",
    "Datos estructurados para Google",
    hasProductSchema,
    1,
    hasProductSchema ? "Schema de producto detectado" : "No se encontró schema de producto",
    hasProductSchema ? undefined : "Agrega Schema.org de producto. Mejora tu aparición en Google Shopping."
  ));
  
  // Open Graph
  const hasOG = /<meta[^>]*property=["']og:/i.test(html);
  tests.push(createTest(
    "open-graph",
    "Open Graph",
    "Optimizado para compartir en redes",
    hasOG,
    1,
    hasOG ? "Open Graph tags encontrados" : "No se encontraron tags Open Graph",
    hasOG ? undefined : "Agrega tags Open Graph. Cuando compartan tu producto en redes se verá mejor."
  ));
  
  return tests;
}

// Calculate category score from tests
export function calculateCategoryScore(tests: AuditTest[]): number {
  if (tests.length === 0) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const test of tests) {
    totalWeight += test.weight;
    weightedSum += test.score * test.weight;
  }
  
  return Math.round(weightedSum / totalWeight);
}

// Run all tests and build result
export function runAllTests(
  html: string,
  url: string,
  headers: Record<string, string>,
  responseTime: number
): { categories: CategoryScore[]; platform: Platform; platformConfidence: "high" | "medium" | "low" } {
  const { platform, confidence: platformConfidence } = detectPlatform(html, headers);
  
  const categoryTests: Record<AuditCategory, AuditTest[]> = {
    trust: runTrustTests(html, url, headers),
    checkout: runCheckoutTests(html),
    shipping: runShippingTests(html),
    performance: runPerformanceTests(html, responseTime),
    products: runProductTests(html),
    descriptions: runDescriptionTests(html),
    search: runSearchTests(html),
    urgency: runUrgencyTests(html),
    upselling: runUpsellingTests(html),
    seo: runSEOTests(html, url),
  };
  
  const categoryMetaData: Record<AuditCategory, { name: string; description: string; icon: string }> = {
    trust: { name: "Confianza y Seguridad", description: "Elementos que generan confianza en los visitantes", icon: "shield" },
    checkout: { name: "Checkout y Conversión", description: "Facilidad para completar una compra", icon: "cart" },
    shipping: { name: "Envío y Costos", description: "Transparencia en costos y tiempos de envío", icon: "truck" },
    performance: { name: "Velocidad y Rendimiento", description: "Tiempo de carga y experiencia móvil", icon: "speed" },
    products: { name: "Presentación de Productos", description: "Calidad de imágenes y presentación visual", icon: "image" },
    descriptions: { name: "Descripciones de Producto", description: "Textos persuasivos que venden", icon: "text" },
    search: { name: "Buscador Interno", description: "Facilidad para encontrar productos", icon: "search" },
    urgency: { name: "Urgencia y Escasez", description: "Elementos que motivan la compra inmediata", icon: "clock" },
    upselling: { name: "Upselling y Cross-selling", description: "Estrategias para aumentar el ticket promedio", icon: "trending" },
    seo: { name: "SEO de Producto", description: "Optimización para buscadores", icon: "globe" },
  };
  
  const categories: CategoryScore[] = Object.entries(categoryTests).map(([cat, tests]) => {
    const category = cat as AuditCategory;
    const meta = categoryMetaData[category];
    return {
      category,
      name: meta.name,
      description: meta.description,
      icon: meta.icon,
      score: calculateCategoryScore(tests),
      tests,
    };
  });
  
  return { categories, platform, platformConfidence };
}
