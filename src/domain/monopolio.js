export const calcularMonopolio = (monoDemand, naturalReg) => {
  // Tradicional
  const q_trad = Math.max(0, (monoDemand - 2) / 3);
  const p_trad = monoDemand - q_trad;
  const ctm_trad = q_trad > 0 ? 2 + 0.5 * q_trad + 20 / q_trad : 0;
  const profit_trad = (p_trad - ctm_trad) * q_trad;

  // Natural
  const q_nat_priv = 20;
  const p_nat_priv = 14;
  const ctm_nat_priv = 12;
  const profit_nat_priv = 40;
  
  const q_nat_reg = 40;
  const p_nat_reg = 4;
  const ctm_nat_reg = 8;
  const profit_nat_reg = -160;

  const q_nat = naturalReg === 'privado' ? q_nat_priv : q_nat_reg;
  const p_nat = naturalReg === 'privado' ? p_nat_priv : p_nat_reg;
  const ctm_nat = naturalReg === 'privado' ? ctm_nat_priv : ctm_nat_reg;
  const profit_nat = naturalReg === 'privado' ? profit_nat_priv : profit_nat_reg;

  return {
    tradicional: { q: q_trad, p: p_trad, ctm: ctm_trad, profit: profit_trad },
    natural: { q: q_nat, p: p_nat, ctm: ctm_nat, profit: profit_nat }
  };
};
