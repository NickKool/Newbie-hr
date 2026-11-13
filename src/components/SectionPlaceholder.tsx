import { Sparkles } from "lucide-react";

type SectionPlaceholderProps = {
  section: string;
  description: string;
};

export function SectionPlaceholder({
  section,
  description,
}: SectionPlaceholderProps) {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
      <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Sparkles size={21} strokeWidth={1.8} />
      </span>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
        Рабочая область готова
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {section}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
        <span className="size-1.5 rounded-full bg-slate-400" />
        Здесь будет доступен персональный контроль адаптации: данные о
        сотрудниках, наставниках, контрольных точках и результатах прохождения
        испытательного срока. В текущей версии фокус сделан на аналитике ранней
        текучести и автоматическом выявлении проблем адаптации
      </div>
    </section>
  );
}
