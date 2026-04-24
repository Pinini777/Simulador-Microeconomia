export const calcularMercado = (dIntBase, dSlope, sIntBase, sSlope, escMercado, intervencionVal, shiftD = 0, shiftS = 0, isDInelastic = false, isSInelastic = false) => {
  const Qe_orig = Math.max(0, (dIntBase - sIntBase) / (dSlope + sSlope));
  const Pe_orig = dIntBase - dSlope * Qe_orig;

  const dInt = dIntBase + dSlope * shiftD;
  const sInt = sIntBase - sSlope * shiftS;

  let Qe, Pe, Qt, Pc, Pp;
  let taxRevenue = 0;
  let subsidyCost = 0;

  if (isDInelastic && isSInelastic) {
    Qe = Qe_orig; Pe = Pe_orig; Qt = Qe; Pc = Pe; Pp = Pe;
  } else if (isDInelastic) {
    Qe = Math.max(0, Qe_orig + shiftD);
    Pe = sInt + sSlope * Qe;
    Qt = Qe;
    if (escMercado === 'impuesto') {
      Pp = sInt + sSlope * Qt;
      Pc = Pp + intervencionVal;
      taxRevenue = intervencionVal * Qt;
    } else if (escMercado === 'subsidio') {
      Pp = sInt + sSlope * Qt;
      Pc = Pp - intervencionVal;
      subsidyCost = intervencionVal * Qt;
    } else {
      Pc = Pe; Pp = Pe;
    }
  } else if (isSInelastic) {
    Qe = Math.max(0, Qe_orig + shiftS);
    Pe = dInt - dSlope * Qe;
    Qt = Qe;
    if (escMercado === 'impuesto') {
      Pc = dInt - dSlope * Qt;
      Pp = Pc - intervencionVal;
      taxRevenue = intervencionVal * Qt;
    } else if (escMercado === 'subsidio') {
      Pc = dInt - dSlope * Qt;
      Pp = Pc + intervencionVal;
      subsidyCost = intervencionVal * Qt;
    } else {
      Pc = Pe; Pp = Pe;
    }
  } else {
    Qe = Math.max(0, (dInt - sInt) / (dSlope + sSlope));
    Pe = dInt - dSlope * Qe;
    Qt = Qe; Pc = Pe; Pp = Pe;
    
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
  }

  return { Qe_orig, Pe_orig, Qe, Pe, Qt, Pc, Pp, taxRevenue, subsidyCost, dInt, sInt };
};
