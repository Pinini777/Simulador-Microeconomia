import { RotateCcw } from 'lucide-react';

const SimulatorLayout = ({ title, onReset, resetLabel = 'Restablecer', controls, chart, results }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
      <section className="order-1 lg:col-span-2 space-y-6" aria-label="Controles">
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5">
          <div className="flex justify-between items-center border-b-4 border-[#111] pb-2">
            <h2 className="font-serif font-black text-xl flex items-center gap-2">{title}</h2>
            <button
              type="button"
              onClick={onReset}
              className="font-mono text-[9px] uppercase font-bold bg-[#E60039] text-white px-2 py-1 border-2 border-[#111] hover:bg-black transition-colors flex items-center gap-1"
              aria-label={resetLabel}
            >
              <RotateCcw className="w-3 h-3" />
              {resetLabel}
            </button>
          </div>
        </div>
        {controls}
      </section>

      <section className="order-2 lg:col-span-8" aria-label="Gráfico">
        {chart}
      </section>

      <section className="order-3 lg:col-span-2 space-y-6" aria-label="Resultados">
        {results}
      </section>
    </div>
  );
};

export default SimulatorLayout;
