import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DepartmentDepartureDistribution,
  DepartureReasonDistribution,
} from "./metrics";

const colors = [
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
];
const axisStyle = { fontSize: 11, fill: "#94a3b8" };
const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
};

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

type AnalyticsChartsProps = {
  departmentDistribution: DepartmentDepartureDistribution[];
  reasonDistribution: DepartureReasonDistribution[];
};

export function AnalyticsCharts({
  departmentDistribution,
  reasonDistribution,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        title="Сравнение подразделений"
        description="Количество увольнений и ранних увольнений до 90 дней"
      >
        {departmentDistribution.some((item) => item.departures > 0) ? (
          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentDistribution}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#eef2f7" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="departmentName"
                  width={84}
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="departures"
                  name="Все увольнения"
                  fill="#94a3b8"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="earlyDepartures"
                  name="Ранние увольнения"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[310px] items-center justify-center text-sm text-slate-400">
            За выбранный период увольнений нет
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="Причины увольнений"
        description="Распределение увольнений по указанным причинам"
      >
        {reasonDistribution.length > 0 ? (
          <div className="flex h-[310px] items-center justify-center gap-5">
            <div className="h-full min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonDistribution}
                    dataKey="departures"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={3}
                  >
                    {reasonDistribution.map((item, index) => (
                      <Cell
                        key={item.reason}
                        fill={colors[index % colors.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [value, "Увольнений"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-[155px] shrink-0 space-y-3">
              {reasonDistribution.map((item, index) => (
                <li
                  key={item.reason}
                  className="flex items-start gap-2 text-[11px] text-slate-500"
                >
                  <span
                    className="mt-0.5 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="min-w-0 flex-1 leading-4">
                    {item.reason}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.departures}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-[310px] items-center justify-center text-sm text-slate-400">
            За выбранный период увольнений нет
          </div>
        )}
      </ChartCard>
    </div>
  );
}
