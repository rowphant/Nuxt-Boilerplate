export function simpleHash(inputString: string): string {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // In 32bit Integer konvertieren
  }
  return Math.abs(hash).toString(36); // In Basis 36 für Alpha-Numerik (a-z, 0-9)
}

export const useTokenName = () => {
  // Umbenennung zu "useTokenName" als Composable
  const runtimeConfig = useRuntimeConfig();
  const tokenPrefix = simpleHash(runtimeConfig.public.apiBase);
  const tokenName = `authToken_${tokenPrefix}`;
  return tokenName;
};

export default defineNuxtPlugin(() => {
  function simpleHash(inputString: string): string {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // In 32bit Integer konvertieren
    }
    return Math.abs(hash).toString(36); // In Basis 36 für Alpha-Numerik (a-z, 0-9)
  }

  const getTokenNameFromProvide = () => {
    return useTokenName();
  };

  // --- Eine Beispiel-Utility-Funktion (optional, nur zur Demo) ---
  function formatCurrency(amount: number, currency = "EUR"): string {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  // --- Alle Funktionen als Provides exportieren ---
  return {
    provide: {
      simpleHash: simpleHash, // Zugriff als $simpleHash
      formatCurrency: formatCurrency, // Zugriff als $formatCurrency
      getTokenName: getTokenNameFromProvide,
    },
  };
});
