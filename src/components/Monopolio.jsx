import React, { useState, useMemo } from 'react';
import { Layers } from 'lucide-react';
import { calcularMonopolio } from '../domain/monopolio';

const gw = 650; const gh = 450;
const pL = 60; const pB = 50; const pT = 30; const pR = 30;

const drawGrid = (id) => (
  <defs>
    <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E5E5" strokeWidth="1" />
    </pattern>
  </defs>
);

const Monopolio = () => {
  const [monoType, setMonoType] = useState('tradicional');
  const [monoDemand, setMonoDemand] = useState(20);
  const [naturalReg, setNaturalReg] = useState('privado');

  // Toggles de visualización
  const [showDemanda, setShowDemanda] = useState(true);
  const [showCostos, setShowCostos] = useState(true);
  const [showArea, setShowArea] = useState(true);

  const calc = useMemo(() => calcularMonopolio(monoDemand, naturalReg), [monoDemand, naturalReg]);

  const { tradicional, natural } = calc;
  const q_trad = tradicional.q, p_trad = tradicional.p, ctm_trad = tradicional.ctm, profit_trad = tradicional.profit;
  const { q: q_nat, p: p_nat, ctm: ctm_nat, profit: profit_nat, d_int, d_slope } = natural;

  const mapX_mono = (x) => pL + (x / 24) * (gw - pL - pR);
  const mapY_mono = (y) => gh - pB - (y / 24) * (gh - pB - pT);
  const mapX_nat = (x) => pL + (x / 50) * (gw - pL - pR);
  const mapY_nat = (y) => gh - pB - (y / 26) * (gh - pB - pT);

  const pathCTMeTrad = useMemo(() => {
    let p = `M ${mapX_mono(1)} ${mapY_mono(2 + 0.5 + 20/1)} `;
    for (let i = 2; i <= 22; i++) {
      p += `L ${mapX_mono(i)} ${mapY_mono(2 + 0.5*i + 20/i)} `;
    }
    return p;
  }, []);

  const pathCTMeNat = useMemo(() => {
    let p = `M ${mapX_nat(2)} ${mapY_nat(4 + 160/2)} `;
    for (let i = 3; i <= 50; i++) {
      p += `L ${mapX_nat(i)} ${mapY_nat(4 + 160/i)} `;
    }
    return p;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="flex border-4 border-[#111] shadow-[6px_6px_0_0_#111] font-mono text-sm font-bold bg-white">
          <button onClick={() => setMonoType('tradicional')} className={`flex-1 p-3 uppercase ${monoType === 'tradicional' ? 'bg-[#111] text-[#FFD700]' : 'hover:bg-gray-100'}`}>Tradicional</button>
          <button onClick={() => setMonoType('natural')} className={`flex-1 p-3 uppercase border-l-4 border-[#111] ${monoType === 'natural' ? 'bg-[#0033CC] text-white' : 'hover:bg-gray-100'}`}>Natural</button>
        </div>

        {monoType === 'tradicional' ? (
          <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
            <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">Maximización M. Tradicional</h2>
            <p className="font-sans text-xs">El monopolista restringe la producción donde <strong className="bg-[#111] text-white px-1">IMg = CMg</strong>. ¡Pero cuidado! Si la demanda es débil, puede tener pérdidas.</p>
            <div className="pt-4">
              <div className="flex justify-between font-mono text-xs font-bold mb-1"><span>Demanda Máx</span><span className="bg-[#111] text-white px-1">{monoDemand}</span></div>
              <input type="range" min="10" max="24" step="1" value={monoDemand} onChange={(e) => setMonoDemand(Number(e.target.value))} className="w-full accent-[#0033CC]" />
            </div>
            <div className="p-4 border-4 border-[#111] bg-white text-center mt-4">
              <div className="font-mono text-xs font-bold uppercase mb-1">Resultado</div>
              <div className={`font-serif text-2xl font-black ${profit_trad < 0 ? 'text-[#E60039]' : 'text-[#00A854]'}`}>${profit_trad.toFixed(1)}</div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#0033CC] p-5 space-y-4">
            <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">Monopolio Natural</h2>
            <p className="font-sans text-xs">Costos Fijos inmensos → CTM siempre cae. ¿Cómo lo regula el Estado?</p>
            <div className="space-y-2 mt-4">
              <button onClick={() => setNaturalReg('privado')} className={`w-full p-3 border-4 border-[#111] font-bold font-mono text-[10px] uppercase flex justify-between ${naturalReg === 'privado' ? 'bg-[#00A854] text-[#111]' : 'bg-white hover:bg-gray-100'}`}>
                <span>1. Monopolista Libre</span><span>(Gana)</span>
              </button>
              <button onClick={() => setNaturalReg('libre_pierde')} className={`w-full p-3 border-4 border-[#111] font-bold font-mono text-[10px] uppercase flex justify-between ${naturalReg === 'libre_pierde' ? 'bg-[#FFD700] text-[#111]' : 'bg-white hover:bg-gray-100'}`}>
                <span>2. Monopolista Libre</span><span>(Pierde)</span>
              </button>
              <button onClick={() => setNaturalReg('regulacion_cme')} className={`w-full p-3 border-4 border-[#111] font-bold font-mono text-[10px] uppercase flex justify-between ${naturalReg === 'regulacion_cme' ? 'bg-[#0033CC] text-white' : 'bg-white hover:bg-gray-100'}`}>
                <span>3. Regulación P=CMe</span><span>(Neutro)</span>
              </button>
              <button onClick={() => setNaturalReg('eficiente')} className={`w-full p-3 border-4 border-[#111] font-bold font-mono text-[10px] uppercase flex justify-between ${naturalReg === 'eficiente' ? 'bg-[#E60039] text-white' : 'bg-white hover:bg-gray-100'}`}>
                <span>4. Regulación P=CMg</span><span>(Pierde)</span>
              </button>
            </div>
            {naturalReg === 'eficiente' && (
              <div className="p-2 bg-black text-white font-mono text-[10px] font-bold border-l-4 border-[#E60039]">
                ¡P=CMg fuerza al precio por debajo del CTM! Requiere subsidios estatales para no quebrar.
              </div>
            )}
            {naturalReg === 'libre_pierde' && (
              <div className="p-2 bg-black text-white font-mono text-[10px] font-bold border-l-4 border-[#FFD700]">
                La demanda no alcanza a cubrir los costos medios ni siquiera maximizando beneficios.
              </div>
            )}
            {naturalReg === 'regulacion_cme' && (
              <div className="p-2 bg-black text-white font-mono text-[10px] font-bold border-l-4 border-[#0033CC]">
                Regulación P=CMe: no hay beneficios extra, pero la empresa no requiere subsidios para operar.
              </div>
            )}
          </div>
        )}

        {/* Panel 3: Leyenda Visual (Toggles) */}
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Leyenda Visual
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showDemanda} onChange={() => setShowDemanda(!showDemanda)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Demanda (D) e IMg</strong>
                <span className="text-[10px] text-gray-600">Demanda del mercado (azul) y el Ingreso Marginal (punteada) que cae más rápido.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showCostos} onChange={() => setShowCostos(!showCostos)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Estructura de Costos</strong>
                <span className="text-[10px] text-gray-600">Costo Marginal (negro) y Costo Total Medio (violeta).</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showArea} onChange={() => setShowArea(!showArea)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Área de Resultados</strong>
                <span className="text-[10px] text-gray-600">Beneficios extraordinarios (verde) o Pérdidas (rojo) del monopolio.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-white border-4 border-[#111] shadow-[10px_10px_0_0_#111] p-2 relative">
          <div className="absolute top-4 left-4 bg-[#111] text-[#F4F1EA] px-3 py-1 font-mono text-xs font-bold border-2 border-white z-10">
            {monoType === 'tradicional' ? 'EQUILIBRIO, GANANCIAS Y PÉRDIDAS' : 'EL DILEMA DE LA REGULACIÓN'}
          </div>

          {monoType === 'tradicional' ? (
            <svg viewBox={`0 0 ${gw} ${gh}`} className="w-full h-auto bg-white">
              {drawGrid('gridT')}
              <rect width="100%" height="100%" fill="url(#gridT)" />
              <g className="font-mono text-xs select-none">
                <line x1={pL} y1={pT} x2={pL} y2={gh-pB} stroke="#111" strokeWidth="3" />
                <line x1={pL} y1={gh-pB} x2={gw-pR} y2={gh-pB} stroke="#111" strokeWidth="3" />
                {[6,12,18,24].map(v => (<g key={`y-${v}`}>
                  <line x1={pL-6} y1={mapY_mono(v)} x2={pL} y2={mapY_mono(v)} stroke="#111" />
                  <text x={pL-10} y={mapY_mono(v)+4} textAnchor="end">{v}</text>
                </g>))}
                {[6,12,18,24].map(v => (<g key={`x-${v}`}>
                  <line x1={mapX_mono(v)} y1={gh-pB} x2={mapX_mono(v)} y2={gh-pB+6} stroke="#111" />
                  <text x={mapX_mono(v)} y={gh-pB+20} textAnchor="middle">{v}</text>
                </g>))}
              </g>

              {q_trad > 0 && showArea && (
                <g>
                  <polygon points={`${mapX_mono(0)},${mapY_mono(p_trad)} ${mapX_mono(q_trad)},${mapY_mono(p_trad)} ${mapX_mono(q_trad)},${mapY_mono(ctm_trad)} ${mapX_mono(0)},${mapY_mono(ctm_trad)}`} fill={profit_trad < 0 ? "#E60039" : "#00A854"} opacity="0.3" />
                  <text x={mapX_mono(q_trad / 2)} y={(mapY_mono(p_trad) + mapY_mono(ctm_trad)) / 2 + 5} textAnchor="middle" className={`font-bold text-[12px] uppercase ${profit_trad < 0 ? 'fill-[#E60039]' : 'fill-[#00A854]'}`} style={{filter: 'brightness(0.6)'}}>
                    {profit_trad < 0 ? 'PÉRDIDA' : 'GANANCIA'}
                  </text>
                </g>
              )}

              {showDemanda && (
                <g>
                  <line x1={mapX_mono(0)} y1={mapY_mono(monoDemand)} x2={mapX_mono(monoDemand)} y2={mapY_mono(0)} stroke="#0033CC" strokeWidth="4" />
                  <line x1={mapX_mono(0)} y1={mapY_mono(monoDemand)} x2={mapX_mono(monoDemand/2)} y2={mapY_mono(0)} stroke="#0033CC" strokeWidth="4" strokeDasharray="6,4" />
                  <text x={mapX_mono(monoDemand-2)} y={mapY_mono(3)} className="fill-blue-800 font-bold font-serif text-lg">D</text>
                  <text x={mapX_mono(monoDemand/2 - 1)} y={mapY_mono(1)} className="fill-blue-800 font-bold font-serif">IMg</text>
                </g>
              )}

              {showCostos && (
                <g>
                  <path d={`M ${mapX_mono(0)} ${mapY_mono(2)} L ${mapX_mono(22)} ${mapY_mono(24)}`} fill="none" stroke="#111" strokeWidth="4" />
                  <path d={pathCTMeTrad} fill="none" stroke="#9333EA" strokeWidth="3" />
                  <text x={mapX_mono(20)} y={mapY_mono(23)} className="fill-black font-bold font-serif text-lg">CMg</text>
                  <text x={mapX_mono(18)} y={mapY_mono(14)} className="fill-purple-800 font-bold font-serif text-lg">CTM</text>
                </g>
              )}

              {q_trad > 0 && (
                <g>
                  <line x1={mapX_mono(q_trad)} y1={mapY_mono(0)} x2={mapX_mono(q_trad)} y2={mapY_mono(Math.max(p_trad, ctm_trad))} stroke="#111" strokeDasharray="4,4" />
                  <line x1={mapX_mono(0)} y1={mapY_mono(p_trad)} x2={mapX_mono(q_trad)} y2={mapY_mono(p_trad)} stroke="#111" strokeDasharray="4,4" />
                  <circle cx={mapX_mono(q_trad)} cy={mapY_mono(p_trad)} r="6" fill="#111" />
                  <circle cx={mapX_mono(q_trad)} cy={mapY_mono(2 + q_trad)} r="5" fill="#E60039" />
                </g>
              )}
            </svg>
          ) : (
            <svg viewBox={`0 0 ${gw} ${gh}`} className="w-full h-auto bg-white">
              {drawGrid('gridN')}
              <rect width="100%" height="100%" fill="url(#gridN)" />
              <g className="font-mono text-xs select-none">
                <line x1={pL} y1={pT} x2={pL} y2={gh-pB} stroke="#111" strokeWidth="3" />
                <line x1={pL} y1={gh-pB} x2={gw-pR} y2={gh-pB} stroke="#111" strokeWidth="3" />
                {[4,8,12,16,20,24].map(v => (<g key={`y-${v}`}>
                  <line x1={pL-6} y1={mapY_nat(v)} x2={pL} y2={mapY_nat(v)} stroke="#111" />
                  <text x={pL-10} y={mapY_nat(v)+4} textAnchor="end">{v}</text>
                </g>))}
                {[10,20,30,40,50].map(v => (<g key={`x-${v}`}>
                  <line x1={mapX_nat(v)} y1={gh-pB} x2={mapX_nat(v)} y2={gh-pB+6} stroke="#111" />
                  <text x={mapX_nat(v)} y={gh-pB+20} textAnchor="middle">{v}</text>
                </g>))}
              </g>

              {showArea && profit_nat !== 0 && (
                <g>
                  <polygon points={`${mapX_nat(0)},${mapY_nat(p_nat)} ${mapX_nat(q_nat)},${mapY_nat(p_nat)} ${mapX_nat(q_nat)},${mapY_nat(ctm_nat)} ${mapX_nat(0)},${mapY_nat(ctm_nat)}`} fill={profit_nat > 0 ? "#00A854" : "#E60039"} opacity="0.4" />
                  <text x={mapX_nat(q_nat / 2)} y={(mapY_nat(p_nat) + mapY_nat(ctm_nat)) / 2 + 5} textAnchor="middle" className={`font-bold text-[12px] uppercase ${profit_nat < 0 ? 'fill-[#E60039]' : 'fill-[#00A854]'}`} style={{filter: 'brightness(0.6)'}}>
                    {profit_nat < 0 ? 'PÉRDIDA' : 'GANANCIA'}
                  </text>
                </g>
              )}

              {showDemanda && (
                <g>
                  <line x1={mapX_nat(0)} y1={mapY_nat(d_int)} x2={mapX_nat(d_int/d_slope)} y2={mapY_nat(0)} stroke="#0033CC" strokeWidth="4" />
                  <line x1={mapX_nat(0)} y1={mapY_nat(d_int)} x2={mapX_nat(d_int/(d_slope*2))} y2={mapY_nat(0)} stroke="#0033CC" strokeWidth="4" strokeDasharray="6,4" />
                  <text x={mapX_nat((d_int/d_slope)-3)} y={mapY_nat(2)} className="fill-blue-800 font-bold font-serif text-lg">D</text>
                  <text x={mapX_nat((d_int/(d_slope*2))-1)} y={mapY_nat(2)} className="fill-blue-800 font-bold font-serif text-lg">IMg</text>
                </g>
              )}

              {showCostos && (
                <g>
                  <line x1={mapX_nat(0)} y1={mapY_nat(4)} x2={mapX_nat(50)} y2={mapY_nat(4)} stroke="#111" strokeWidth="4" />
                  <path d={pathCTMeNat} fill="none" stroke="#9333EA" strokeWidth="3" />
                  <text x={mapX_nat(42)} y={mapY_nat(3.5)} className="fill-black font-bold font-serif text-lg">CMg</text>
                  <text x={mapX_nat(38)} y={mapY_nat(9)} className="fill-purple-800 font-bold font-serif text-lg">CTMe</text>
                </g>
              )}

              <line x1={mapX_nat(q_nat)} y1={mapY_nat(0)} x2={mapX_nat(q_nat)} y2={mapY_nat(Math.max(p_nat, ctm_nat))} stroke="#111" strokeDasharray="4,4" />
              <line x1={mapX_nat(0)} y1={mapY_nat(p_nat)} x2={mapX_nat(q_nat)} y2={mapY_nat(p_nat)} stroke="#111" strokeDasharray="4,4" />
              <circle cx={mapX_nat(q_nat)} cy={mapY_nat(p_nat)} r="7" fill={naturalReg==='privado' ? "#111" : "#E60039"} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monopolio;
