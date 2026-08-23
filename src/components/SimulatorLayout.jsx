import { RotateCcw } from 'lucide-react';

const SimulatorLayout = ({ title, onReset, resetLabel = 'Restablecer', controls, chart, results }) => {
  const hasResults = Boolean(results);
  const gridCols = hasResults
    ? 'md:grid-cols-[minmax(18rem,22rem)_1fr] xl:grid-cols-[minmax(20rem,24rem)_1fr_minmax(20rem,24rem)]'
    : 'md:grid-cols-[minmax(18rem,22rem)_1fr] xl:grid-cols-[minmax(20rem,24rem)_1fr]';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-8 items-start animate-in fade-in duration-500`}>
      <section className="order-1 space-y-6" aria-label="Controles">
        <div className="bg-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-5">
          <div className="flex flex-col gap-4 border-b-4 border-[#111] pb-2">
            <h2 className="font-serif font-black text-xl flex items-center gap-2">{title}</h2>
            <button
              type="button"
              onClick={onReset}
              className="font-mono text-[9px] uppercase font-bold bg-[#E60039] text-white px-2 py-1 border-2 border-[#111] hover:bg-black transition-colors flex items-center gap-1 shrink-0 self-start"
              aria-label={resetLabel}
            >
              <RotateCcw className="w-3 h-3" />
              {resetLabel}
            </button>
          </div>
        </div>
        {controls}
      </section>

      <section className={`order-2 ${hasResults ? 'md:row-span-2 xl:row-span-1' : ''}`} aria-label="Gráfico">
        {chart}
      </section>

      {hasResults && (
        <section className="order-3 space-y-6" aria-label="Resultados">
          {results}
        </section>
      )}
    </div>
  );
};

export default SimulatorLayout;
