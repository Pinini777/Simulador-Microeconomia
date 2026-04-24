export const calcularMonopolio = (monoDemand, naturalReg) => {
  // Tradicional
  const q_trad = Math.max(0, (monoDemand - 2) / 3);
  const p_trad = monoDemand - q_trad;
  const ctm_trad = q_trad > 0 ? 2 + 0.5 * q_trad + 20 / q_trad : 0;
  const profit_trad = (p_trad - ctm_trad) * q_trad;

  // Natural (Demand original: P = 24 - 0.5Q)
  let q_nat, p_nat, ctm_nat, profit_nat;
  let d_int = 24; // Y intercept of Demand
  let d_slope = 0.5;

  if (naturalReg === 'privado') {
    q_nat = 20; p_nat = 14; ctm_nat = 12; profit_nat = 40;
  } else if (naturalReg === 'eficiente') {
    q_nat = 40; p_nat = 4; ctm_nat = 8; profit_nat = -160;
  } else if (naturalReg === 'regulacion_cme') {
    // P = CMe -> 24 - 0.5Q = 4 + 160/Q -> Q ~ 28.94
    q_nat = 28.94; p_nat = 9.53; ctm_nat = 9.53; profit_nat = 0;
  } else if (naturalReg === 'libre_pierde') {
    // Demanda más baja: P = 14 - 0.5Q
    d_int = 14; 
    // IMg = 14 - Q. CMg = 4. 14 - Q = 4 -> Q = 10
    q_nat = 10; p_nat = 9; ctm_nat = 20; profit_nat = -110;
  }

  return {
    tradicional: { q: q_trad, p: p_trad, ctm: ctm_trad, profit: profit_trad },
    natural: { q: q_nat, p: p_nat, ctm: ctm_nat, profit: profit_nat, d_int, d_slope }
  };
};
