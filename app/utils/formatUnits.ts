// utils/formatUnits.ts
export const formatPriceWithUnit = (price: number, uMedida?: string): string => {
  const formattedPrice = price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });

  if (!uMedida || uMedida === 'u') return formattedPrice;

  const unitDisplay: Record<string, string> = {
    'u': 'u',
    'm': 'm',
    'mts': 'm',
    'cm': 'cm',
    'mm': 'mm',
    'kg': 'kg',
    'g': 'g',
    'l': 'L',
    'ml': 'ml',
    'm2': 'm²',
    'caja': 'caja',
    'rollo': 'rollo',
    'jgo': 'jgo',
    'par': 'par',
    'bidon': 'bidón',
  };

  const displayUnit = unitDisplay[uMedida.toLowerCase()] || uMedida;
  
  return `${formattedPrice}/${displayUnit}`;
};