const FIXED_COST = 30;

export const cvm = (q) => 0.1 * q * q - 1.6 * q + 10.4;
export const ctm = (q) => cvm(q) + FIXED_COST / q;
export const cmg = (q) => 0.3 * q * q - 3.2 * q + 10.4;

function bisect(f, low, high) {
  let a = low, b = high;
  for (let i = 0; i < 60; i++) {
    const m = (a + b) / 2;
    if (f(a) * f(m) <= 0) b = m; else a = m;
  }
  return (a + b) / 2;
}

const minCVM = { q: 8, p: cvm(8) };
const minCTM = { q: bisect((q) => cmg(q) - ctm(q), 8.1, 50), p: 0 };
minCTM.p = ctm(minCTM.q);

export const calcularCostos = (firmPrice) => {
  let firmQ = 0;
  const discriminant = 3.2 * 3.2 - 4 * 0.3 * (10.4 - firmPrice);

  if (discriminant >= 0 && firmPrice >= minCVM.p) {
    firmQ = (3.2 + Math.sqrt(discriminant)) / 0.6;
  }

  const currentCTM = firmQ > 0 ? ctm(firmQ) : 0;
  const currentProfit = firmQ > 0 ? (firmPrice - currentCTM) * firmQ : -FIXED_COST;

  let status;
  if (firmQ === 0) {
    status = 'cierre';
  } else if (Math.abs(firmPrice - minCTM.p) <= 0.01) {
    status = 'nivelacion';
  } else if (firmPrice > minCTM.p) {
    status = 'extraordinario';
  } else {
    status = 'perdidas';
  }

  return { firmQ, currentCTM, currentProfit, status, fixedCost: FIXED_COST, minCVM_Q: minCVM.q, minCVM_P: minCVM.p, minCTM_Q: minCTM.q, minCTM_P: minCTM.p };
};
