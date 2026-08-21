const point = (q, dInt, dSlope, cmeBase, cmeFixed) => {
  const p = dInt - dSlope * q;
  const ctm = cmeBase + cmeFixed / q;
  return { q, p, ctm, profit: (p - ctm) * q };
};

export const calcularRegulacionNatural = (dInt, dSlope, cmeBase, cmeFixed) => {
  // dSlope*Q^2 - (dInt - cmeBase)*Q + cmeFixed = 0
  const a = dSlope, b = -(dInt - cmeBase), c = cmeFixed;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0 || a === 0) return { status: 'no_solution', selected: null, alternative: null, intersections: [] };

  const sqrtD = Math.sqrt(discriminant);
  const roots = [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)]
    .filter((q) => q > 0)
    .sort((x, y) => x - y);

  if (roots.length < 2) return { status: 'no_solution', selected: null, alternative: null, intersections: [] };

  const intersections = roots.map((q) => point(q, dInt, dSlope, cmeBase, cmeFixed));
  return { status: 'dual_intersection', selected: intersections[1], alternative: intersections[0], intersections };
};

export const calcularMonopolio = (monoDemand, naturalReg) => {
  // Tradicional
  const q_trad = Math.max(0, (monoDemand - 2) / 3);
  const p_trad = monoDemand - q_trad;
  const ctm_trad = q_trad > 0 ? 2 + 0.5 * q_trad + 20 / q_trad : 0;
  const profit_trad = (p_trad - ctm_trad) * q_trad;

  // Natural
  let d_int = 24, d_slope = 0.5;
  let q_nat, p_nat, ctm_nat, profit_nat;
  let regulation = { status: 'single', selected: null, alternative: null, intersections: [] };

  if (naturalReg === 'privado') {
    q_nat = 20; p_nat = 14; ctm_nat = 12; profit_nat = 40;
  } else if (naturalReg === 'eficiente') {
    q_nat = 40; p_nat = 4; ctm_nat = 8; profit_nat = -160;
  } else if (naturalReg === 'regulacion_cme') {
    regulation = calcularRegulacionNatural(24, 0.5, 4, 160);
    ({ q: q_nat, p: p_nat, ctm: ctm_nat, profit: profit_nat } = regulation.selected);
  } else if (naturalReg === 'libre_pierde') {
    d_int = 14;
    q_nat = 10; p_nat = 9; ctm_nat = 20; profit_nat = -110;
  }

  const naturalPoint = { q: q_nat, p: p_nat, ctm: ctm_nat, profit: profit_nat, d_int, d_slope };
  if (!regulation.selected) {
    regulation.selected = naturalPoint;
    regulation.intersections = [naturalPoint];
  }

  return { tradicional: { q: q_trad, p: p_trad, ctm: ctm_trad, profit: profit_trad }, natural: naturalPoint, regulation };
};
