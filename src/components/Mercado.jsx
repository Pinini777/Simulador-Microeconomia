import React, { useState, useMemo } from 'react';
import { Scale, BookOpen } from 'lucide-react';
import { calcularMercado } from '../domain/mercado';

const gw = 650; const gh = 450;
const pL = 60; const pB = 50; const pT = 30; const pR = 30;

const drawGrid = (id) => (
  <defs>
    <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E5E5" strokeWidth="1" />
    </pattern>
  </defs>
);

const Mercado = () => {
  const [escMercado, setEscMercado] = useState('libre'); 
  const [showAreas, setShowAreas] = useState(true);
  
  const [dInt, setDInt] = useState(16);
  const [sInt, setSInt] = useState(2);
  const [dSlope, setDSlope] = useState(1);
  const [sSlope, setSSlope] = useState(1);
  const [intervencionVal, setIntervencionVal] = useState(4); 

  // Cálculos de Dominio memorizados
  const calc = useMemo(() => {
    return calcularMercado(dInt, dSlope, sInt, sSlope, escMercado, intervencionVal);
  }, [dInt, dSlope, sInt, sSlope, escMercado, intervencionVal]);

  const { Qe, Pe, Qt, Pc, Pp, taxRevenue, subsidyCost } = calc;

  const maxX = 20, maxY = 20;
  const mapX = (x) => pL + (x / maxX) * (gw - pL - pR);
  const mapY = (y) => gh - pB - (y / maxY) * (gh - pB - pT);

  const dXEnd = dInt / dSlope;
  const sXEnd = (maxY - sInt) / sSlope;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2 flex items-center gap-2">
            <Scale className="w-5 h-5" /> 1. El Mercado
          </h2>
          <div className="flex gap-2 font-mono text-xs uppercase font-bold">
            {['libre', 'impuesto', 'subsidio'].map(t => (
              <button key={t} onClick={() => setEscMercado(t)} className={`flex-1 p-2 border-2 border-[#111] ${escMercado === t ? 'bg-[#111] text-[#FFD700]' : 'hover:bg-gray-100'}`}>
                {t}
              </button>
            ))}
          </div>

          {escMercado !== 'libre' && (
            <div className="pt-3 border-t-2 border-[#111] border-dashed">
              <div className="flex justify-between font-mono text-xs font-bold mb-1">
                <span>Monto de Intervención</span><span className="bg-[#111] text-white px-1">${intervencionVal}</span>
              </div>
              <input type="range" min="1" max="8" step="1" value={intervencionVal} onChange={(e) => setIntervencionVal(Number(e.target.value))} className="w-full accent-[#111]" />
            </div>
          )}
        </div>

        <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#0033CC] p-5 space-y-5">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">2. Elasticidades</h2>
          <p className="font-sans text-xs leading-snug">Controla la "sensibilidad" (pendiente) de los agentes. Analiza quién paga realmente un impuesto (<strong>Incidencia Fiscal</strong>).</p>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1 text-[#0033CC]">
              <span>Demanda (Consumidores)</span>
              <span>{dSlope < 0.5 ? 'Muy Elástica' : dSlope > 1.5 ? 'Inelástica' : 'Unitaria'}</span>
            </div>
            <input type="range" min="0.2" max="3" step="0.1" value={dSlope} onChange={(e) => setDSlope(Number(e.target.value))} className="w-full accent-[#0033CC]" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1 text-[#E60039]">
              <span>Oferta (Productores)</span>
              <span>{sSlope < 0.5 ? 'Muy Elástica' : sSlope > 1.5 ? 'Inelástica' : 'Unitaria'}</span>
            </div>
            <input type="range" min="0.2" max="3" step="0.1" value={sSlope} onChange={(e) => setSSlope(Number(e.target.value))} className="w-full accent-[#E60039]" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-3">
            <input type="checkbox" checked={showAreas} onChange={() => setShowAreas(!showAreas)} className="w-4 h-4 accent-[#111]" />
            <span className="font-bold font-mono text-[10px] uppercase">Mostrar Excedentes y Pérdida Social (PIE)</span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border-4 border-[#111] shadow-[10px_10px_0_0_#111] relative">
          <div className="absolute top-4 left-4 bg-[#111] text-[#F4F1EA] px-3 py-1 font-mono text-xs font-bold border-2 border-white z-10">MERCADO & INCIDENCIA FISCAL</div>
          <svg viewBox={`0 0 ${gw} ${gh}`} className="w-full h-auto">
            {drawGrid('gridM')}
            <rect width="100%" height="100%" fill="url(#gridM)" />
            
            <g className="font-mono text-xs">
              <line x1={pL} y1={pT} x2={pL} y2={gh-pB} stroke="#111" strokeWidth="3" />
              <line x1={pL} y1={gh-pB} x2={gw-pR} y2={gh-pB} stroke="#111" strokeWidth="3" />
              <text x={-(gh/2)} y={pL-35} transform="rotate(-90)" textAnchor="middle" className="font-bold uppercase">Precio ($)</text>
              <text x={(gw+pL)/2} y={gh-15} textAnchor="middle" className="font-bold uppercase">Cantidad (Q)</text>
              {[5,10,15,20].map(v => (<g key={`y-${v}`}>
                  <line x1={pL-4} y1={mapY(v)} x2={pL} y2={mapY(v)} stroke="#111" strokeWidth="2" />
                  <text x={pL-8} y={mapY(v)+4} textAnchor="end">{v}</text>
              </g>))}
              {[5,10,15,20].map(v => (<g key={`x-${v}`}>
                  <line x1={mapX(v)} y1={gh-pB} x2={mapX(v)} y2={gh-pB+4} stroke="#111" strokeWidth="2" />
                  <text x={mapX(v)} y={gh-pB+18} textAnchor="middle">{v}</text>
              </g>))}
            </g>

            {showAreas && (
              <g>
                {escMercado === 'libre' ? (
                  <>
                    <polygon points={`${mapX(0)},${mapY(Pe)} ${mapX(Qe)},${mapY(Pe)} ${mapX(0)},${mapY(dInt)}`} fill="#0033CC" opacity="0.15" />
                    <polygon points={`${mapX(0)},${mapY(Pe)} ${mapX(Qe)},${mapY(Pe)} ${mapX(0)},${mapY(sInt)}`} fill="#E60039" opacity="0.15" />
                  </>
                ) : escMercado === 'impuesto' ? (
                  <>
                    <polygon points={`${mapX(0)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pc)} ${mapX(0)},${mapY(dInt)}`} fill="#0033CC" opacity="0.15" />
                    <polygon points={`${mapX(0)},${mapY(Pp)} ${mapX(Qt)},${mapY(Pp)} ${mapX(0)},${mapY(sInt)}`} fill="#E60039" opacity="0.15" />
                    <rect x={mapX(0)} y={mapY(Pc)} width={mapX(Qt)-mapX(0)} height={mapY(Pp)-mapY(Pc)} fill="#FFD700" opacity="0.5" />
                    <polygon points={`${mapX(Qt)},${mapY(Pc)} ${mapX(Qe)},${mapY(Pe)} ${mapX(Qt)},${mapY(Pp)}`} fill="#111" opacity="0.8" />
                  </>
                ) : (
                  <>
                    <polygon points={`${mapX(0)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pc)} ${mapX(0)},${mapY(dInt)}`} fill="#0033CC" opacity="0.15" />
                    <polygon points={`${mapX(0)},${mapY(Pp)} ${mapX(Qt)},${mapY(Pp)} ${mapX(0)},${mapY(sInt)}`} fill="#E60039" opacity="0.15" />
                    <polygon points={`${mapX(Qe)},${mapY(Pe)} ${mapX(Qt)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pp)}`} fill="#111" opacity="0.8" />
                  </>
                )}
              </g>
            )}

            <line x1={mapX(0)} y1={mapY(dInt)} x2={mapX(dXEnd)} y2={mapY(0)} stroke="#0033CC" strokeWidth="4" />
            <text x={mapX(Math.min(dXEnd, 20)-1)} y={mapY(Math.max(dInt - dSlope*20, 0)) - 10} className="font-bold fill-[#0033CC] text-lg">D</text>

            <line x1={mapX(0)} y1={mapY(sInt)} x2={mapX(sXEnd)} y2={mapY(20)} stroke="#E60039" strokeWidth="4" />
            <text x={mapX(Math.min(sXEnd, 20)-1)} y={mapY(Math.min(sInt + sSlope*20, 20)) + 15} className="font-bold fill-[#E60039] text-lg">O</text>

            <circle cx={mapX(Qe)} cy={mapY(Pe)} r="5" fill={escMercado==='libre' ? "#111" : "#999"} />

            {escMercado !== 'libre' && (
              <g>
                <line x1={mapX(Qt)} y1={mapY(0)} x2={mapX(Qt)} y2={mapY(Math.max(Pc,Pp))} stroke="#111" strokeDasharray="4,4" />
                <line x1={mapX(0)} y1={mapY(Pc)} x2={mapX(Qt)} y2={mapY(Pc)} stroke="#0033CC" strokeDasharray="4,4" strokeWidth="2" />
                <circle cx={mapX(Qt)} cy={mapY(Pc)} r="6" fill="#0033CC" />
                <text x={pL + 5} y={mapY(Pc) - 5} className="font-bold font-mono text-[10px] fill-[#0033CC]">P. Consumidor</text>

                <line x1={mapX(0)} y1={mapY(Pp)} x2={mapX(Qt)} y2={mapY(Pp)} stroke="#E60039" strokeDasharray="4,4" strokeWidth="2" />
                <circle cx={mapX(Qt)} cy={mapY(Pp)} r="6" fill="#E60039" />
                <text x={pL + 5} y={mapY(Pp) + 12} className="font-bold font-mono text-[10px] fill-[#E60039]">P. Productor</text>

                {showAreas && <text x={mapX(Qt + (Qe-Qt)/2)} y={mapY(Pe) + 4} className="font-bold fill-white text-[10px]" style={{textShadow: '1px 1px 0 #000'}}>PIE</text>}
              </g>
            )}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-0 border-4 border-[#111] shadow-[6px_6px_0_0_#111] bg-white">
          <div className="col-span-2 p-4 border-r-4 border-[#111] bg-[#F4F1EA]">
            <h3 className="font-serif font-black text-lg mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Incidencia Fiscal
            </h3>
            <p className="font-sans text-xs leading-relaxed text-[#111]">
                {escMercado === 'impuesto' ? (
                dSlope > sSlope ? 
                "La Demanda es más inelástica (empinada) que la Oferta. Los consumidores no pueden escapar fácilmente del mercado, por lo que absorben la MAYOR PARTE de la carga del impuesto." :
                sSlope > dSlope ? 
                "La Oferta es más inelástica (empinada) que la Demanda. Las fábricas no pueden reconvertirse fácilmente, por lo que los productores absorben la MAYOR PARTE del impuesto." : 
                "La carga del impuesto se reparte equitativamente entre consumidores y productores al tener la misma elasticidad."
                ) : escMercado === 'libre' ? (
                "El mercado se vacía naturalmente. Maximización del excedente total. Modifica las elasticidades y activa un impuesto para ver quién paga el pato."
                ) : (
                "El subsidio reduce el precio para compradores y lo sube para vendedores. Sin embargo, el Costo Fiscal (área) es mayor que el beneficio creado, generando Ineficiencia (PIE)."
                )}
            </p>
          </div>
          <div className="p-4 flex flex-col justify-center items-center text-center">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-500 mb-1">Cantidad Tranzada</span>
              <span className="font-serif text-4xl font-black text-[#111]">{Qt.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mercado;
