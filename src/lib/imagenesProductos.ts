/**
 * Imágenes profesionales SVG inline para productos de Vecino's Pizzería.
 * Cada SVG es un data URI listo para usar como imagen_url en la BD.
 */

const pizzaBase = (accesorios: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <radialGradient id="crust" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8B4513"/>
      <stop offset="100%" stop-color="#D2691E"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="4" dy="8" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="600" fill="#f5f5f5"/>
  <circle cx="400" cy="300" r="220" fill="url(#crust)" filter="url(#shadow)"/>
  <circle cx="400" cy="300" r="170" fill="#FF6B35" opacity="0.9"/>
  <circle cx="400" cy="300" r="150" fill="#FFA726" opacity="0.85"/>
  ${accesorios}
  <circle cx="400" cy="300" r="140" fill="none" stroke="#BF360C" stroke-width="6"/>
  <text x="400" y="570" font-family="Arial" font-size="24" fill="#D84315" text-anchor="middle" font-weight="bold">Vecino's Pizzería</text>
</svg>`;

export const IMG_MARGARITA = `data:image/svg+xml;base64,${btoa(
  pizzaBase(`
    <circle cx="340" cy="260" r="22" fill="#CF222E"/>
    <circle cx="460" cy="260" r="22" fill="#CF222E"/>
    <circle cx="400" cy="340" r="22" fill="#CF222E"/>
    <circle cx="320" cy="340" r="20" fill="#CF222E"/>
    <circle cx="480" cy="340" r="20" fill="#CF222E"/>
    <circle cx="360" cy="380" r="22" fill="#CF222E"/>
    <circle cx="440" cy="380" r="22" fill="#CF222E"/>
    <circle cx="300" cy="300" r="18" fill="#22C55E"/>
    <circle cx="500" cy="300" r="18" fill="#22C55E"/>
    <circle cx="400" cy="220" r="18" fill="#22C55E"/>
    <circle cx="380" cy="240" r="16" fill="#22C55E"/>
    <circle cx="420" cy="240" r="16" fill="#22C55E"/>
  `)
)}`;

export const IMG_PEPPERONI = `data:image/svg+xml;base64,${btoa(
  pizzaBase(`
    <circle cx="340" cy="260" r="26" fill="#EF4444"/>
    <circle cx="460" cy="260" r="26" fill="#EF4444"/>
    <circle cx="400" cy="340" r="26" fill="#EF4444"/>
    <circle cx="320" cy="340" r="24" fill="#EF4444"/>
    <circle cx="480" cy="340" r="24" fill="#EF4444"/>
    <circle cx="360" cy="380" r="26" fill="#EF4444"/>
    <circle cx="440" cy="380" r="26" fill="#EF4444"/>
    <circle cx="300" cy="300" r="22" fill="#EF4444"/>
    <circle cx="500" cy="300" r="22" fill="#EF4444"/>
    <circle cx="400" cy="220" r="22" fill="#EF4444"/>
    <circle cx="380" cy="240" r="20" fill="#EF4444"/>
    <circle cx="420" cy="240" r="20" fill="#EF4444"/>
    <circle cx="330" cy="330" r="18" fill="#EF4444"/>
    <circle cx="470" cy="330" r="18" fill="#EF4444"/>
  `)
)}`;

export const IMG_HAWAIANA = `data:image/svg+xml;base64,${btoa(
  pizzaBase(`
    <circle cx="340" cy="260" r="22" fill="#EF4444"/>
    <circle cx="460" cy="260" r="22" fill="#EF4444"/>
    <circle cx="400" cy="340" r="22" fill="#EF4444"/>
    <circle cx="320" cy="340" r="20" fill="#EF4444"/>
    <circle cx="480" cy="340" r="20" fill="#EF4444"/>
    <circle cx="360" cy="380" r="22" fill="#EF4444"/>
    <circle cx="440" cy="380" r="22" fill="#EF4444"/>
    <circle cx="300" cy="300" r="18" fill="#EF4444"/>
    <circle cx="500" cy="300" r="18" fill="#EF4444"/>
    <circle cx="400" cy="220" r="18" fill="#EF4444"/>
    <circle cx="340" cy="240" r="16" fill="#FCD34D"/>
    <circle cx="460" cy="240" r="16" fill="#FCD34D"/>
    <circle cx="380" cy="320" r="16" fill="#FCD34D"/>
    <circle cx="420" cy="320" r="16" fill="#FCD34D"/>
    <circle cx="440" cy="280" r="14" fill="#FCD34D"/>
    <circle cx="360" cy="280" r="14" fill="#FCD34D"/>
  `)
)}`;

export const IMG_HELADO = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="4" dy="8" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="600" fill="#f5f5f5"/>
  <ellipse cx="400" cy="450" rx="60" ry="25" fill="#8B4513" filter="url(#shadow)"/>
  <path d="M340 450 L320 320 Q320 250 400 250 Q480 250 480 320 L460 450 Z" fill="#D2B48C" filter="url(#shadow)"/>
  <path d="M330 440 L330 330 Q340 280 400 270 Q460 280 470 330 L470 440 Z" fill="#E6BE8A"/>
  <circle cx="400" cy="210" r="70" fill="#FFE4B5" filter="url(#shadow)"/>
  <circle cx="400" cy="190" r="60" fill="#FFD1DC" opacity="0.9"/>
  <circle cx="400" cy="175" r="50" fill="#FF69B4" opacity="0.95"/>
  <circle cx="370" cy="165" r="12" fill="#FF1493"/>
  <circle cx="430" cy="165" r="12" fill="#FF1493"/>
  <circle cx="400" cy="185" r="12" fill="#FF1493"/>
  <circle cx="390" cy="205" r="10" fill="#FF1493"/>
  <circle cx="410" cy="205" r="10" fill="#FF1493"/>
  <text x="400" y="570" font-family="Arial" font-size="24" fill="#C2185B" text-anchor="middle" font-weight="bold">Vecino's Pizzería</text>
</svg>`;

export const IMG_REFRESCO = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="4" dy="8" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="600" fill="#f5f5f5"/>
  <path d="M300 500 L300 150 Q300 100 350 100 Q400 100 400 150 L400 500 Z" fill="#E0E0E0" filter="url(#shadow)"/>
  <path d="M310 490 L310 160 Q310 110 350 110 Q390 110 390 160 L390 490 Z" fill="#EF4444"/>
  <ellipse cx="350" cy="160" rx="40" ry="15" fill="#B91C1C"/>
  <ellipse cx="350" cy="150" rx="38" ry="12" fill="#EF4444" opacity="0.9"/>
  <path d="M315 155 Q350 130 385 155" fill="none" stroke="#B91C1C" stroke-width="3"/>
  <ellipse cx="350" cy="100" rx="30" ry="12" fill="#B91C1C"/>
  <ellipse cx="350" cy="92" rx="28" ry="10" fill="#EF4444" opacity="0.9"/>
  <circle cx="330" cy="95" r="8" fill="#B91C1C"/>
  <circle cx="370" cy="95" r="8" fill="#B91C1C"/>
  <circle cx="350" cy="105" r="8" fill="#B91C1C"/>
  <rect x="320" y="500" width="60" height="60" fill="#D97706" filter="url(#shadow)"/>
  <rect x="330" y="510" width="40" height="40" fill="#B45309"/>
  <text x="400" y="570" font-family="Arial" font-size="24" fill="#DC2626" text-anchor="middle" font-weight="bold">Vecino's Pizzería</text>
</svg>`;
