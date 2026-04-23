import React, { useState, useMemo } from 'react';
import { Layers } from 'lucide-react';
import { calcularFPP } from '../domain/fpp';

const gw = 650; const gh = 450;
const pL = 60; const pB = 50; const pT = 30; const pR = 30;

const drawGrid = (id) => (
  <defs>
    <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E5E5" strokeWidth="1" />
    </pattern>
  </defs>
);

const FPP = () => {
  const [techX, setTechX] = useState(100); 
  const [techY, setTechY] = useState(100); 
  const [pointX, setPointX] = useState(50);
  const [pointY, setPointY] = useState(50);

  // Toggles de visualización
  const [showFrontera, setShowFrontera] = useState(true);
  const [showGuias, setShowGuias] = useState(true);

  const { status } = useMemo(() => calcularFPP(techX, techY, pointX, pointY), [techX, techY, pointX, pointY]);

  const fppColor = status === 'inalcanzable' ? '#E60039' : status === 'ineficiente' ? '#0033CC' : '#00A854';

  const maxAxis = 150;
  const mapX = (x) => pL + (x / maxAxis) * (gw - pL - pR);
  const mapY = (y) => gh - pB - (y / maxAxis) * (gh - pB - pT);

  const pathD = useMemo(() => {
    let path = `M ${mapX(0)} ${mapY(techY)} `;
    for (let i = 0; i <= techX; i += 2) {
      path += `L ${mapX(i)} ${mapY(techY * Math.sqrt(1 - Math.pow(i / techX, 2)))} `;
    }
    path += `L ${mapX(techX)} ${mapY(0)}`;
    return path;
  }, [techX, techY]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#F4F1EA] border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">Capacidad Tecnológica</h2>
          <p className="font-sans text-xs">Mueve estos valores para simular <strong>Crecimiento Económico</strong>.</p>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1"><span>Tech Y (Autos)</span><span className="bg-[#111] text-white px-1">{techY}</span></div>
            <input type="range" min="50" max="150" value={techY} onChange={(e) => setTechY(Number(e.target.value))} className="w-full accent-[#111]" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1"><span>Tech X (PCs)</span><span className="bg-[#111] text-white px-1">{techX}</span></div>
            <input type="range" min="50" max="150" value={techX} onChange={(e) => setTechX(Number(e.target.value))} className="w-full accent-[#111]" />
          </div>
        </div>

        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2">Punto de Producción</h2>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1"><span>Producir Autos</span><span>{pointY}</span></div>
            <input type="range" min="0" max="150" value={pointY} onChange={(e) => setPointY(Number(e.target.value))} className="w-full accent-[#0033CC]" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-xs font-bold mb-1"><span>Producir PCs</span><span>{pointX}</span></div>
            <input type="range" min="0" max="150" value={pointX} onChange={(e) => setPointX(Number(e.target.value))} className="w-full accent-[#0033CC]" />
          </div>
        </div>

        {/* Panel 3: Leyenda Visual (Toggles) */}
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5 space-y-4">
          <h2 className="font-serif font-black text-xl border-b-4 border-[#111] pb-2 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Leyenda Visual
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showFrontera} onChange={() => setShowFrontera(!showFrontera)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Mostrar Frontera</strong>
                <span className="text-[10px] text-gray-600">Línea que marca la producción máxima posible con la tecnología actual.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={showGuias} onChange={() => setShowGuias(!showGuias)} className="w-5 h-5 accent-[#111] mt-0.5 border-2 border-[#111]" />
              <div>
                <strong className="uppercase block">Mostrar Guías</strong>
                <span className="text-[10px] text-gray-600">Líneas punteadas para visualizar fácilmente las coordenadas del punto de producción.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="border-4 border-[#111] shadow-[4px_4px_0_0_#111] p-4 text-white" style={{backgroundColor: fppColor}}>
          <div className="font-mono text-xs font-black uppercase mb-1">Diagnóstico de Estado:</div>
          <div className="font-serif text-2xl font-black mb-1 capitalize">{status}</div>
          <div className="font-sans text-xs font-medium">
            {status === 'eficiente' ? "Pleno empleo. Para fabricar más de un bien, debes renunciar al otro (Costo de Oportunidad)." : 
             status === 'ineficiente' ? "Desempleo o recursos ociosos. Puedes producir más de ambos bienes sin sacrificar nada." : 
             "Imposible con la tecnología actual. Necesitas crecimiento económico para llegar aquí."}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-white border-4 border-[#111] shadow-[10px_10px_0_0_#111] p-2 relative">
          <div className="absolute top-4 left-4 bg-[#111] text-[#F4F1EA] px-3 py-1 font-mono text-xs font-bold border-2 border-white z-10">FRONTERA DE POSIBILIDADES</div>
          <svg viewBox={`0 0 ${gw} ${gh}`} className="w-full h-auto bg-[#F4F1EA]">
            {drawGrid('gridF')}
            <rect width="100%" height="100%" fill="url(#gridF)" />
            <g className="font-mono text-xs">
              <line x1={pL} y1={pT} x2={pL} y2={gh-pB} stroke="#111" strokeWidth="3" />
              <line x1={pL} y1={gh-pB} x2={gw-pR} y2={gh-pB} stroke="#111" strokeWidth="3" />
              <text x={-(gh/2)} y={pL-40} transform="rotate(-90)" textAnchor="middle" className="font-bold uppercase">Automóviles (Y)</text>
              <text x={(gw+pL)/2} y={gh-15} textAnchor="middle" className="font-bold uppercase">Computadoras (X)</text>
              {[50,100,150].map(v => (<g key={`y-${v}`}>
                  <line x1={pL-4} y1={mapY(v)} x2={pL} y2={mapY(v)} stroke="#111" strokeWidth="2" />
                  <text x={pL-8} y={mapY(v)+4} textAnchor="end">{v}</text>
              </g>))}
              {[50,100,150].map(v => (<g key={`x-${v}`}>
                  <line x1={mapX(v)} y1={gh-pB} x2={mapX(v)} y2={gh-pB+4} stroke="#111" strokeWidth="2" />
                  <text x={mapX(v)} y={gh-pB+18} textAnchor="middle">{v}</text>
              </g>))}
            </g>
            
            {showFrontera && (
              <g>
                <path d={`${pathD} L ${mapX(0)} ${mapY(0)} Z`} fill="#111" opacity="0.05" />
                <path d={pathD} fill="none" stroke="#111" strokeWidth="4" />
              </g>
            )}

            {showGuias && (
              <g>
                <line x1={mapX(0)} y1={mapY(pointY)} x2={mapX(pointX)} y2={mapY(pointY)} stroke={fppColor} strokeDasharray="4,4" />
                <line x1={mapX(pointX)} y1={mapY(0)} x2={mapX(pointX)} y2={mapY(pointY)} stroke={fppColor} strokeDasharray="4,4" />
              </g>
            )}
            
            <circle cx={mapX(pointX)} cy={mapY(pointY)} r="8" fill={fppColor} stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FPP;
