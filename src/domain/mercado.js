export const calcularMercado = (dIntBase, dSlope, sIntBase, sSlope, escMercado, intervencionVal, shiftD = 0, shiftS = 0, isDInelastic = false, isSInelastic = false) => {
  const Qe_orig = Math.max(0, (dIntBase - sIntBase) / (dSlope + sSlope));
  const Pe_orig = dIntBase - dSlope * Qe_orig;

  const inLibre = escMercado === 'libre';
  const dInt = dIntBase + dSlope * (inLibre ? shiftD : 0);
  const sInt = sIntBase - sSlope * (inLibre ? shiftS : 0);

  let Qe, Pe, Qt, Pc, Pp;
  let taxRevenue = 0;
  let subsidyCost = 0;
  let warningKey = null;
  let explanationKey = null;

  if (isDInelastic && isSInelastic) {
    Qe = Qe_orig; Pe = Pe_orig; Qt = Qe; Pc = Pe; Pp = Pe;
    if (inLibre && (shiftD !== 0 || shiftS !== 0)) {
      warningKey = 'perfectly_inelastic_with_shock';
      explanationKey = 'perfectly_inelastic_quantity_fixed';
    }
  } else if (isDInelastic) {
    Qe = Qe_orig;
    Pe = dInt - dSlope * Qe;
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
    if (inLibre && shiftD !== 0) { warningKey = 'perfectly_inelastic_with_shock'; explanationKey = 'inelastic_demand_quantity_fixed'; }
  } else if (isSInelastic) {
    Qe = Qe_orig; Pe = sInt + sSlope * Qe; Qt = Qe;
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
    if (inLibre && shiftS !== 0) { warningKey = 'perfectly_inelastic_with_shock'; explanationKey = 'inelastic_supply_quantity_fixed'; }
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

  return { Qe_orig, Pe_orig, Qe, Pe, Qt, Pc, Pp, taxRevenue, subsidyCost, dInt, sInt, warningKey, explanationKey };
};
