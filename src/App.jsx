import React, { useState } from 'react';
import Mercado from './components/Mercado';
import FPP from './components/FPP';
import Costos from './components/Costos';
import Monopolio from './components/Monopolio';

const App = () => {
  const [activeTab, setActiveTab] = useState('mercado');

  return (
    <div className="min-h-screen bg-[#E5E0D8] p-4 md:p-8 font-sans text-[#111] selection:bg-[#FF3366] selection:text-white pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER NEO-BRUTALISTA */}
        <header className="bg-[#F4F1EA] border-4 border-[#111] shadow-[8px_8px_0_0_#111] p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-4 opacity-5 font-serif text-[120px] font-black italic pointer-events-none leading-none">ECON</div>
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <div className="inline-block bg-[#111] text-[#FFD700] px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase mb-4 border-2 border-[#111]">
                EcoUtn 1.0
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-none">
                Microeconomía <span className="text-[#FF3366] underline decoration-8 decoration-[#111] underline-offset-4">Interactiva</span>
              </h1>
            </div>

            {/* NAVEGACIÓN TABS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full border-4 border-[#111] bg-white">
              {[
                { id: 'mercado', label: '1. Mercado e Incidencia' },
                { id: 'fpp', label: '2. Frontera P.P.' },
                { id: 'costos', label: '3. Teoría Empresa' },
                { id: 'monopolio', label: '4. Monopolios' }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`px-3 py-4 font-bold font-mono text-[10px] md:text-xs uppercase transition-all border-r-4 border-[#111] last:border-r-0 ${activeTab === tab.id ? 'bg-[#111] text-[#FFD700]' : 'bg-transparent text-[#111] hover:bg-[#E5E0D8]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main>
          {activeTab === 'mercado' && <Mercado />}
          {activeTab === 'fpp' && <FPP />}
          {activeTab === 'costos' && <Costos />}
          {activeTab === 'monopolio' && <Monopolio />}
        </main>
        
        <footer className="text-center py-6 font-mono text-xs font-bold uppercase tracking-widest opacity-60">
          Laburado duramente por Pino
        </footer>
      </div>
    </div>
  );
};

export default App;
