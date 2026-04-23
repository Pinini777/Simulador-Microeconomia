import React, { useState, useMemo } from 'react';
import { calcularCostos } from '../domain/costos';

const gw = 650; const gh = 450;
const pL = 60; const pB = 50; const pT = 30; const pR = 30;

const drawGrid = (id) => (
  <defs>
    <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E5E5" strokeWidth="1" />
    </pattern>
  </defs>
);

const Costos = () => {
  const [firmPrice, setFirmPrice] = useState(8);

  const { firmQ, currentCTM, currentProfit, status, minCVM_Q, minCVM_P, minCTM_Q, minCTM_P } = useMemo(() => calcularCostos(firmPrice), [firmPrice]);

  const firmStatusColor = status === 'cierre' ? '#E60039' : status === 'extraordinario' ? '#00A854' : status === 'nivelacion' ? '#0033CC' : '#FFD700';
  const firmStatusText = status === 'cierre' ? 'CIERRE DE EMPRESA' : status === 'extraordinario' ? 'BENEFICIOS EXTRAORDINARIOS' : status === 'nivelacion' ? 'PUNTO DE NIVELACIÓN' : 'PRODUCCIÓN CON PÉRDIDAS';

  const mapX_cost = (x) => pL + (x / 16) * (gw - pL - pR);
  const mapY_cost = (y) => gh - pB - (y / 18) * (gh - pB - pT);

  const { pathCMg, pathCTM, pathCVM } = useMemo(() => {
    let pCMg = `M ${mapX_cost(0.1)} ${mapY_cost(0.3*(0.1**2) - 3.2*0.1 + 10.4)} `;
    let pCTM = `M ${mapX_cost(2)} ${mapY_cost(0.1*(4) - 1.6*2 + 10.4 + 30/2)} `;
    let pCVM = `M ${mapX_cost(0.1)} ${mapY_cost(0.1*(0.1**2) - 1.6*0.1 + 10.4)} `;

    for (let q = 0.5; q <= 16; q += 0.5) { 
      pCMg += `L ${mapX_cost(q)} ${mapY_cost(0.3*q*q - 3.2*q + 10.4)} `; 
      if (q >= 1.5) pCTM += `L ${mapX_cost(q)} ${mapY_cost(0.1*q*q - 1.6*q + 10.4 + 30/q)} `;
      pCVM += `L ${mapX_cost(q)} ${mapY_cost(0.1*q*q - 1.6*q + 10.4)} `;
    }
    return { pathCMg: pCMg, pathCTM: pCTM, pathCVM: pCVM };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 relative">
          <h2 className="font-serif font-black text-2xl mb-4 border-b-4 border-[#111] pb-2">La Regla de Oro</h2>
          <p className="font-sans text-xs font-medium leading-relaxed mb-4">
            La empresa Competitiva produce donde <strong className="bg-[#FFD700] px-1">P = CMg</strong>. Las curvas de Costos Medios (CTM y CVM) tienen forma de U, y el CMg SIEMPRE las corta en su punto más bajo.
          </p>
          <ul className="space-y-2 font-mono text-[10px] font-bold uppercase">
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#0033CC] border border-[#111]"></div> P. Nivelación: Mínimo CTM ($7.55)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E60039] border border-[#111]"></div> P. Cierre: Mínimo CVM ($4.00)
            </li>
          </ul>
        </div>

        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5">
          <h2 className="font-serif font-black text-xl mb-4">Simulador de Crisis</h2>
          <div className="mb-6">
            <div className="flex justify-between font-mono text-sm font-bold mb-2"><span>Precio Dictado ($)</span><span className="bg-[#111] text-[#FFD700] px-2">{firmPrice.toFixed(1)}</span></div>
            <input type="range" min="2" max="16" step="0.5" value={firmPrice} onChange={(e) => setFirmPrice(Number(e.target.value))} className="w-full h-3 accent-[#E60039] bg-gray-200" />
          </div>

          <div className="p-4 border-4 border-[#111]" style={{backgroundColor: firmStatusColor}}>
            <div className="font-mono text-[10px] font-black uppercase mb-1 text-[#111] bg-white/60 inline-block px-1">Decisión a Corto Plazo</div>
            <div className="font-serif text-xl font-black leading-tight text-[#111] mb-1">{firmStatusText}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="border-2 border-[#111] bg-[#F4F1EA] p-2">
              <div className="font-mono text-[10px] font-bold uppercase">Cant. (Q*)</div>
              <div className="font-serif font-black text-2xl">{firmQ > 0 ? firmQ.toFixed(1) : '0.0'}</div>
            </div>
            <div className="border-2 border-[#111] bg-[#F4F1EA] p-2">
              <div className="font-mono text-[10px] font-bold uppercase">Beneficio</div>
              <div className="font-serif font-black text-2xl" style={{color: firmStatusColor}}>{firmQ > 0 ? currentProfit.toFixed(1) : '-30'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-white border-4 border-[#111] shadow-[10px_10px_0_0_#111] p-2 relative">
          <div className="absolute top-4 left-4 bg-[#111] text-[#F4F1EA] px-3 py-1 font-mono text-xs font-bold border-2 border-white z-10">ESTRUCTURA DE COSTOS Y CIERRE</div>
          <svg viewBox={`0 0 ${gw} ${gh}`} className="w-full h-auto bg-[#F9F6F0]">
            {drawGrid('gridC')}
            <rect width="100%" height="100%" fill="url(#gridC)" />
            <g className="font-mono text-xs select-none">
              <line x1={pL} y1={pT} x2={pL} y2={gh-pB} stroke="#111" strokeWidth="3" />
              <line x1={pL} y1={gh-pB} x2={gw-pR} y2={gh-pB} stroke="#111" strokeWidth="3" />
              {[4,8,12,16].map(v => (<g key={`y-${v}`}>
                  <line x1={pL-6} y1={mapY_cost(v)} x2={pL} y2={mapY_cost(v)} stroke="#111" strokeWidth="2" />
                  <text x={pL-10} y={mapY_cost(v)+4} textAnchor="end">{v}</text>
              </g>))}
              {[4,8,12,16].map(v => (<g key={`x-${v}`}>
                  <line x1={mapX_cost(v)} y1={gh-pB} x2={mapX_cost(v)} y2={gh-pB+6} stroke="#111" strokeWidth="2" />
                  <text x={mapX_cost(v)} y={gh-pB+20} textAnchor="middle">{v}</text>
              </g>))}
            </g>

            {firmQ > 0 && (
              <polygon points={`${mapX_cost(0)},${mapY_cost(firmPrice)} ${mapX_cost(firmQ)},${mapY_cost(firmPrice)} ${mapX_cost(firmQ)},${mapY_cost(currentCTM)} ${mapX_cost(0)},${mapY_cost(currentCTM)}`} fill={firmPrice >= currentCTM ? "#00A854" : "#FFD700"} opacity="0.3" />
            )}

            <path d={pathCVM} fill="none" stroke="#9333EA" strokeWidth="3" strokeDasharray="4,4" />
            <text x={mapX_cost(14)} y={mapY_cost(8.5)} className="fill-purple-800 font-bold font-serif">CVM</text>
            <path d={pathCTM} fill="none" stroke="#0033CC" strokeWidth="3" />
            <text x={mapX_cost(14)} y={mapY_cost(12.5)} className="fill-blue-800 font-bold font-serif">CTM</text>
            <path d={pathCMg} fill="none" stroke="#111" strokeWidth="4" />
            <text x={mapX_cost(11.5)} y={mapY_cost(16)} className="fill-black font-bold font-serif">CMg</text>

            <g opacity={firmPrice < minCTM_P ? "1" : "0.5"}>
              <circle cx={mapX_cost(minCVM_Q)} cy={mapY_cost(minCVM_P)} r="6" fill="#E60039" stroke="#111" strokeWidth="2" />
              <path d={`M ${mapX_cost(minCVM_Q)} ${mapY_cost(minCVM_P)} L ${mapX_cost(minCVM_Q+1.5)} ${mapY_cost(minCVM_P-2)}`} stroke="#E60039" strokeWidth="2" />
              <text x={mapX_cost(minCVM_Q+1.7)} y={mapY_cost(minCVM_P-2.2)} className="font-bold font-mono text-[10px] fill-[#E60039]">P. CIERRE</text>
            </g>
            <g opacity={firmPrice >= minCVM_P ? "1" : "0.5"}>
              <circle cx={mapX_cost(minCTM_Q)} cy={mapY_cost(minCTM_P)} r="6" fill="#0033CC" stroke="#111" strokeWidth="2" />
              <path d={`M ${mapX_cost(minCTM_Q)} ${mapY_cost(minCTM_P)} L ${mapX_cost(minCTM_Q+1.5)} ${mapY_cost(minCTM_P-2)}`} stroke="#0033CC" strokeWidth="2" />
              <text x={mapX_cost(minCTM_Q+1.7)} y={mapY_cost(minCTM_P-2.2)} className="font-bold font-mono text-[10px] fill-[#0033CC]">P. NIVELACIÓN</text>
            </g>

            <line x1={mapX_cost(0)} y1={mapY_cost(firmPrice)} x2={gw-pR} y2={mapY_cost(firmPrice)} stroke="#FFD700" strokeWidth="4" />
            <text x={gw-pR-40} y={mapY_cost(firmPrice)-6} className="fill-[#b8860b] font-bold font-mono">P=IMg</text>

            {firmQ > 0 && (
              <g>
                <line x1={mapX_cost(firmQ)} y1={mapY_cost(0)} x2={mapX_cost(firmQ)} y2={mapY_cost(Math.max(firmPrice, currentCTM))} stroke="#111" strokeDasharray="4,4" />
                <circle cx={mapX_cost(firmQ)} cy={mapY_cost(firmPrice)} r="6" fill="#111" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Costos;
