export const calcularCostos = (firmPrice) => {
  const minCVM_Q = 8;
  const minCVM_P = 4.0;
  const minCTM_Q = 9.25;
  const minCTM_P = 7.55;

  let firmQ = 0;
  const discriminant = 3.2 * 3.2 - 4 * 0.3 * (10.4 - firmPrice);
  
  if (discriminant >= 0 && firmPrice >= minCVM_P) {
    firmQ = (3.2 + Math.sqrt(discriminant)) / 0.6;
  }
  
  const currentCTM = firmQ > 0 ? (0.1 * Math.pow(firmQ, 2) - 1.6 * firmQ + 10.4 + 30 / firmQ) : 0;
  const currentProfit = (firmPrice - currentCTM) * firmQ;

  let status = '';
  if (firmQ === 0) {
    status = 'cierre';
  } else if (firmPrice >= minCTM_P + 0.1) {
    status = 'extraordinario';
  } else if (Math.abs(firmPrice - minCTM_P) < 0.2) {
    status = 'nivelacion';
  } else {
    status = 'perdidas';
  }

  return { firmQ, currentCTM, currentProfit, status, minCVM_Q, minCVM_P, minCTM_Q, minCTM_P };
};
