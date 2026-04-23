export const calcularMercado = (dInt, dSlope, sInt, sSlope, escMercado, intervencionVal) => {
  const Qe = Math.max(0, (dInt - sInt) / (dSlope + sSlope));
  const Pe = dInt - dSlope * Qe;

  let Qt = Qe;
  let Pc = Pe;
  let Pp = Pe;
  let taxRevenue = 0;
  let subsidyCost = 0;

  if (escMercado === 'impuesto') {
    Qt = Math.max(0, (dInt - sInt - intervencionVal) / (dSlope + sSlope));
    Pc = dInt - dSlope * Qt;
    Pp = sInt + sSlope * Qt;
    taxRevenue = intervencionVal * Qt;
  } else if (escMercado === 'subsidio') {
    Qt = Math.max(0, (dInt - sInt + intervencionVal) / (dSlope + sSlope));
    Pc = dInt - dSlope * Qt;
    Pp = sInt + sSlope * Qt;
    subsidyCost = intervencionVal * Qt;
  }

  return { Qe, Pe, Qt, Pc, Pp, taxRevenue, subsidyCost };
};
