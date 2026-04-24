import React, { useState, useMemo } from 'react';
import { Scale, BookOpen, Layers } from 'lucide-react';
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
  
  // Toggles de visualización
  const [showCurves, setShowCurves] = useState(true);
  const [showEquilibrium, setShowEquilibrium] = useState(true);
  const [showAreas, setShowAreas] = useState(true);
  
  const [dInt, setDInt] = useState(16);
  const [sInt, setSInt] = useState(2);
  const [dSlope, setDSlope] = useState(1);
  const [sSlope, setSSlope] = useState(1);
  const [intervencionVal, setIntervencionVal] = useState(4); 

  // Nuevos estados
  const [shiftD, setShiftD] = useState(0);
  const [shiftS, setShiftS] = useState(0);
  const [isDInelastic, setIsDInelastic] = useState(false);
  const [isSInelastic, setIsSInelastic] = useState(false);

  const calc = useMemo(() => {
    return calcularMercado(dInt, dSlope, sInt, sSlope, escMercado, intervencionVal, shiftD, shiftS, isDInelastic, isSInelastic);
  }, [dInt, dSlope, sInt, sSlope, escMercado, intervencionVal, shiftD, shiftS, isDInelastic, isSInelastic]);

  const { Qe_orig, Pe_orig, Qe, Pe, Qt, Pc, Pp, taxRevenue, subsidyCost, dInt: newDInt, sInt: newSInt } = calc;

  const maxX = 20, maxY = 20;
  const mapX = (x) => pL + (x / maxX) * (gw - pL - pR);
  const mapY = (y) => gh - pB - (y / maxY) * (gh - pB - pT);

  const dXEnd = newDInt / dSlope;
  const sXEnd = (maxY - newSInt) / sSlope;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        {/* Panel 1: Controles Principales */}
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

          {escMercado === 'libre' && (
            <div className="pt-3 border-t-2 border-[#111] border-dashed space-y-3">
              <div className="font-mono text-[10px] font-bold uppercase">Desplazamientos (Shocks)</div>
              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <span className="text-[#0033CC]">Shock Demanda</span><span className="bg-[#111] text-white px-1">{shiftD > 0 ? `+${shiftD}` : shiftD}</span>
                </div>
                <input type="range" min="-8" max="8" step="1" value={shiftD} onChange={(e) => setShiftD(Number(e.target.value))} className="w-full accent-[#0033CC]" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <span className="text-[#E60039]">Shock Oferta</span><span className="bg-[#111] text-white px-1">{shiftS > 0 ? `+${shiftS}` : shiftS}</span>
                </div>
                <input type="range" min="-8" max="8" step="1" value={shiftS} onChange={(e) => setShiftS(Number(e.target.value))} className="w-full accent-[#E60039]" />
              </div>
            </div>
          )}

          {escMercado !== 'libre' && (
            <div className="pt-3 border-t-2 border-[#111] border-dashed">
              <div className="flex justify-between font-mono text-xs font-bold mb-1">
                <span>Monto de Intervención</span><span className="bg-[#111] text-white px-1">${intervencionVal}</span>
              </div>
              <input type="range" min="1" max="8" step="1" value={intervencionVal} onChange={(e) => setIntervencionVal(Number(e.target.value))} className="w-full accent-[#111]" />
            </div>
          )}
        </div>

        {/* Panel 2: Elasticidades */}
        <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#0033CC] p-5 space-y-5">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">2. Elasticidades</h2>
          <p className="font-sans text-xs leading-snug">Controla la "sensibilidad" de los agentes o hacelos completamente inelásticos.</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-[#0033CC]">Demanda</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={isDInelastic} onChange={() => setIsDInelastic(!isDInelastic)} className="w-3 h-3 accent-[#0033CC] border-2 border-[#111]" />
                  <span className="font-mono text-[9px] uppercase font-bold">Vertical (Inelástica)</span>
                </label>
              </div>
              <input type="range" min="0.2" max="3" step="0.1" value={dSlope} onChange={(e) => setDSlope(Number(e.target.value))} disabled={isDInelastic} className={`w-full ${isDInelastic ? 'opacity-30' : 'accent-[#0033CC]'}`} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-[#E60039]">Oferta</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={isSInelastic} onChange={() => setIsSInelastic(!isSInelastic)} className="w-3 h-3 accent-[#E60039] border-2 border-[#111]" />
                  <span className="font-mono text-[9px] uppercase font-bold">Vertical (Inelástica)</span>
                </label>
              </div>
              <input type="range" min="0.2" max="3" step="0.1" value={sSlope} onChange={(e) => setSSlope(Number(e.target.value))} disabled={isSInelastic} className={`w-full ${isSInelastic ? 'opacity-30' : 'accent-[#E60039]'}`} />
            </div>
          </div>
        </div>

        {/* Panel 3: Leyenda Visual (Toggles) */}
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Leyenda Visual
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showCurves} onChange={() => setShowCurves(!showCurves)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Mostrar Curvas (D y O)</strong>
                <span className="text-[10px] text-gray-600">Líneas de Oferta (rojo) y Demanda (azul) que representan las intenciones de compra y venta.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showEquilibrium} onChange={() => setShowEquilibrium(!showEquilibrium)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Punto de Equilibrio</strong>
                <span className="text-[10px] text-gray-600">Intersección donde Oferta = Demanda (mercado vaciado).</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showAreas} onChange={() => setShowAreas(!showAreas)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Excedentes y PIE</strong>
                <span className="text-[10px] text-gray-600">Muestra las áreas de beneficio social y la Pérdida Irrecuperable de Eficiencia.</span>
              </div>
            </label>
          </div>
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

            {escMercado === 'libre' && (shiftD !== 0 || shiftS !== 0) && showCurves && (
              <g>
                {isDInelastic ? (
                  <line x1={mapX(Qe_orig)} y1={mapY(20)} x2={mapX(Qe_orig)} y2={mapY(0)} stroke="#999" strokeWidth="3" strokeDasharray="6,4" />
                ) : (
                  <line x1={mapX(0)} y1={mapY(dInt)} x2={mapX(dInt / dSlope)} y2={mapY(0)} stroke="#999" strokeWidth="3" strokeDasharray="6,4" />
                )}
                
                {isSInelastic ? (
                  <line x1={mapX(Qe_orig)} y1={mapY(20)} x2={mapX(Qe_orig)} y2={mapY(0)} stroke="#999" strokeWidth="3" strokeDasharray="6,4" />
                ) : (
                  <line x1={mapX(0)} y1={mapY(sInt)} x2={mapX((20 - sInt) / sSlope)} y2={mapY(20)} stroke="#999" strokeWidth="3" strokeDasharray="6,4" />
                )}
                <circle cx={mapX(Qe_orig)} cy={mapY(Pe_orig)} r="5" fill="#999" />
              </g>
            )}

            {showAreas && (
              <g>
                {escMercado === 'libre' ? (
                  <>
                    {!isDInelastic && <polygon points={`${mapX(0)},${mapY(Pe)} ${mapX(Qe)},${mapY(Pe)} ${mapX(0)},${mapY(newDInt)}`} fill="#0033CC" opacity="0.15" />}
                    {!isSInelastic && <polygon points={`${mapX(0)},${mapY(Pe)} ${mapX(Qe)},${mapY(Pe)} ${mapX(0)},${mapY(newSInt)}`} fill="#E60039" opacity="0.15" />}
                  </>
                ) : escMercado === 'impuesto' ? (
                  <>
                    {!isDInelastic && <polygon points={`${mapX(0)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pc)} ${mapX(0)},${mapY(newDInt)}`} fill="#0033CC" opacity="0.15" />}
                    {!isSInelastic && <polygon points={`${mapX(0)},${mapY(Pp)} ${mapX(Qt)},${mapY(Pp)} ${mapX(0)},${mapY(newSInt)}`} fill="#E60039" opacity="0.15" />}
                    <rect x={mapX(0)} y={mapY(Pc)} width={mapX(Qt)-mapX(0)} height={mapY(Pp)-mapY(Pc)} fill="#FFD700" opacity="0.5" />
                    <text x={mapX(Qt/2)} y={(mapY(Pc) + mapY(Pp))/2 + 4} textAnchor="middle" className="font-bold fill-[#b8860b] text-[10px] uppercase">Recaudación</text>
                    <polygon points={`${mapX(Qt)},${mapY(Pc)} ${mapX(Qe)},${mapY(Pe)} ${mapX(Qt)},${mapY(Pp)}`} fill="#111" opacity="0.8" />
                  </>
                ) : (
                  <>
                    {!isDInelastic && <polygon points={`${mapX(0)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pc)} ${mapX(0)},${mapY(newDInt)}`} fill="#0033CC" opacity="0.15" />}
                    {!isSInelastic && <polygon points={`${mapX(0)},${mapY(Pp)} ${mapX(Qt)},${mapY(Pp)} ${mapX(0)},${mapY(newSInt)}`} fill="#E60039" opacity="0.15" />}
                    <rect x={mapX(0)} y={mapY(Pp)} width={mapX(Qt)-mapX(0)} height={mapY(Pc)-mapY(Pp)} fill="#FFD700" opacity="0.5" />
                    <text x={mapX(Qt/2)} y={(mapY(Pp) + mapY(Pc))/2 + 4} textAnchor="middle" className="font-bold fill-[#b8860b] text-[10px] uppercase">Gasto Estatal</text>
                    <polygon points={`${mapX(Qe)},${mapY(Pe)} ${mapX(Qt)},${mapY(Pc)} ${mapX(Qt)},${mapY(Pp)}`} fill="#111" opacity="0.8" />
                  </>
                )}
              </g>
            )}

            {showCurves && (
              <g>
                {isDInelastic ? (
                  <>
                    <line x1={mapX(Qe_orig + shiftD)} y1={mapY(20)} x2={mapX(Qe_orig + shiftD)} y2={mapY(0)} stroke="#0033CC" strokeWidth="4" />
                    <text x={mapX(Qe_orig + shiftD)+5} y={mapY(18)} className="font-bold fill-[#0033CC] text-lg">D</text>
                  </>
                ) : (
                  <>
                    <line x1={mapX(0)} y1={mapY(newDInt)} x2={mapX(dXEnd)} y2={mapY(0)} stroke="#0033CC" strokeWidth="4" />
                    <text x={mapX(Math.min(dXEnd, 20)-1)} y={mapY(Math.max(newDInt - dSlope*20, 0)) - 10} className="font-bold fill-[#0033CC] text-lg">D</text>
                  </>
                )}

                {isSInelastic ? (
                  <>
                    <line x1={mapX(Qe_orig + shiftS)} y1={mapY(20)} x2={mapX(Qe_orig + shiftS)} y2={mapY(0)} stroke="#E60039" strokeWidth="4" />
                    <text x={mapX(Qe_orig + shiftS)+5} y={mapY(18)} className="font-bold fill-[#E60039] text-lg">O</text>
                  </>
                ) : (
                  <>
                    <line x1={mapX(0)} y1={mapY(newSInt)} x2={mapX(sXEnd)} y2={mapY(20)} stroke="#E60039" strokeWidth="4" />
                    <text x={mapX(Math.min(sXEnd, 20)-1)} y={mapY(Math.min(newSInt + sSlope*20, 20)) + 15} className="font-bold fill-[#E60039] text-lg">O</text>
                  </>
                )}
              </g>
            )}

            {showEquilibrium && (
              <g>
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
              </g>
            )}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-0 border-4 border-[#111] shadow-[6px_6px_0_0_#111] bg-white">
          <div className="col-span-2 p-4 border-r-4 border-[#111] bg-[#F4F1EA]">
            <h3 className="font-serif font-black text-lg mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Estática Comparativa e Incidencia
            </h3>
            <p className="font-sans text-xs leading-relaxed text-[#111]">
                {escMercado === 'impuesto' ? (
                  isDInelastic ? "Demanda Vertical: El consumidor no tiene escapatoria y absorbe el 100% del impuesto." :
                  isSInelastic ? "Oferta Vertical: Las fábricas asumen todo el costo del impuesto al no poder reducir su producción." :
                  dSlope > sSlope ? "La Demanda es más inelástica que la Oferta. Los consumidores absorben la MAYOR PARTE del impuesto." :
                  sSlope > dSlope ? "La Oferta es más inelástica que la Demanda. Los productores absorben la MAYOR PARTE del impuesto." : 
                  "La carga del impuesto se reparte equitativamente al tener la misma elasticidad."
                ) : escMercado === 'subsidio' ? (
                  "El subsidio reduce el precio para compradores y lo sube para vendedores. Sin embargo, el Gasto Estatal es mayor que el beneficio creado, generando Ineficiencia (PIE)."
                ) : (
                  (shiftD > 0 && shiftS > 0) ? "Ambas curvas aumentan (a la derecha). La Cantidad CRECE con seguridad. El Precio es INCIERTO (depende de qué curva se desplazó más)." :
                  (shiftD < 0 && shiftS < 0) ? "Ambas curvas caen (a la izquierda). La Cantidad CAE con seguridad. El Precio es INCIERTO." :
                  (shiftD > 0 && shiftS < 0) ? "Aumenta la Demanda y cae la Oferta. El Precio SUBE con seguridad. La Cantidad es INCIERTA." :
                  (shiftD < 0 && shiftS > 0) ? "Cae la Demanda y aumenta la Oferta. El Precio CAE con seguridad. La Cantidad es INCIERTA." :
                  (shiftD > 0) ? "Sube la Demanda (ej: mayor ingreso). Esto empuja la Cantidad y el Precio hacia ARRIBA (nuevo equilibrio)." :
                  (shiftD < 0) ? "Cae la Demanda (ej: pasa de moda). Esto empuja la Cantidad y el Precio hacia ABAJO." :
                  (shiftS > 0) ? "Sube la Oferta (ej: mejor tecnología). La Cantidad crece, pero como hay abundancia, el Precio CAE." :
                  (shiftS < 0) ? "Cae la Oferta (ej: sequía). Hay escasez, por lo que la Cantidad cae y el Precio SUBE." :
                  "El mercado se vacía naturalmente. Jugá con los Desplazamientos o la Elasticidad para ver la reacción de Q y P."
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
