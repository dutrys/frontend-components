import React, { useState, useCallback } from "react";

const DAYS = ["Pi", "An", "Tr", "Ke", "Pe", "Še", "Se"];
const MONTHS = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegužė",
  "Birželis",
  "Liepa",
  "Rugpjūtis",
  "Rugsėjis",
  "Spalis",
  "Lapkritis",
  "Gruodis",
];

const sameDay = (a: Date | null, b: Date | null): boolean => !!a && !!b && a.toDateString() === b.toDateString();

const getCalendar = (year: number, month: number): (Date | null)[] => {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
};

type Range = { from: Date; to: Date };

type MonthGridProps =
  | {
      year: number;
      month: number;
      mode: "single";
      selected: Date | null;
      hovered: Date | null;
      onSelect: (d: Date) => void;
      onHover: (d: Date) => void;
    }
  | {
      year: number;
      month: number;
      mode: "range";
      selected: Range | null;
      hovered: Date | null;
      onSelect: (d: Date) => void;
      onHover: (d: Date) => void;
    };

const MonthGrid = ({ year, month, mode, selected, hovered, onSelect, onHover }: MonthGridProps) => {
  const cells: (Date | null)[] = getCalendar(year, month);
  const weeks: (Date | null)[][] = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const isFrom = (d: Date | null) => d && mode === "range" && sameDay(d, selected?.from ?? null);
  const isTo = (d: Date | null) => d && mode === "range" && sameDay(d, selected?.to ?? hovered);
  const isSel = (d: Date | null) => d && mode === "single" && sameDay(d, selected);
  const inRange = (d: Date | Range | null) => {
    if (!d || mode !== "range") {
      return false;
    }
    const from = selected?.from,
      to = selected?.to || hovered;

    if (!from || !to) {
      return false;
    }

    const lo = from < to ? from : to;
    const hi = from < to ? to : from;

    return d > lo && d < hi;
  };

  return (
    <div className="min-w-[224px]">
      <div className="text-center text-sm font-medium mb-2">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 pb-1">
            {d}
          </div>
        ))}
        {weeks.flat().map((d, i) => {
          const sel = isSel(d) || isFrom(d) || isTo(d);
          const rng = inRange(d);
          return (
            <div
              key={i}
              onClick={() => d && onSelect(d)}
              onMouseEnter={() => d && onHover(d)}
              className={[
                "h-8 flex items-center justify-center text-sm select-none",
                d ? "cursor-pointer" : "",
                sel
                  ? "bg-blue-600 text-white rounded font-semibold"
                  : rng
                    ? "bg-blue-100 text-gray-800"
                    : d
                      ? "hover:bg-gray-100 rounded text-gray-800"
                      : "",
              ].join(" ")}
            >
              {d ? d.getDate() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};
//
// export default function App() {
//   const [mode, setMode] = useState<"single" | "range">("single");
//   const [months, setMonths] = useState(1);
//   const [single, setSingle] = useState(null);
//   const [range, setRange] = useState({ from: null, to: null });
//   const [hovered, setHovered] = useState<Date | Range | null>(null);
//
//   const today = new Date();
//   const [nav, setNav] = useState({ year: today.getFullYear(), month: today.getMonth() });
//
//   const handleSelect = useCallback(
//     (d) => {
//       if (mode === "single") {
//         setSingle(d);
//         return;
//       }
//       if (!range.from || range.to) {
//         setRange({ from: d, to: null });
//       } else {
//         const lo = d < range.from ? d : range.from;
//         const hi = d < range.from ? range.from : d;
//         setRange({ from: lo, to: hi });
//         setHovered(null);
//       }
//     },
//     [mode, range],
//   );
//
//   const prev = () =>
//     setNav((n) => {
//       const m = n.month === 0 ? 11 : n.month - 1;
//       const y = n.month === 0 ? n.year - 1 : n.year;
//       return { year: y, month: m };
//     });
//   const next = () =>
//     setNav((n) => {
//       const m = n.month === 11 ? 0 : n.month + 1;
//       const y = n.month === 11 ? n.year + 1 : n.year;
//       return { year: y, month: m };
//     });
//
//   const grids = Array.from({ length: months }, (_, i) => {
//     const m = (nav.month + i) % 12;
//     const y = nav.year + Math.floor((nav.month + i) / 12);
//     return { year: y, month: m };
//   });
//
//   const result = mode === "single" ? `Pasirinkta: ${fmt(single)}` : `Nuo: ${fmt(range.from)}  →  Iki: ${fmt(range.to)}`;
//
//   return (
//     <div className="p-5 font-sans text-sm">
//       <div className="flex flex-wrap gap-4 items-center mb-4">
//         {["single", "range"].map((m) => (
//           <label key={m} className="flex items-center gap-1.5 cursor-pointer">
//             <input
//               type="radio"
//               checked={mode === m}
//               onChange={() => {
//                 setMode(m);
//                 setSingle(null);
//                 setRange({ from: null, to: null });
//               }}
//             />
//             {m === "single" ? "Single" : "Range"}
//           </label>
//         ))}
//         <label className="flex items-center gap-1.5">
//           Mėnesiai:
//           <select
//             value={months}
//             onChange={(e) => setMonths(+e.target.value)}
//             className="border border-gray-300 rounded px-1.5 py-0.5 text-sm"
//           >
//             {[1, 2, 3, 4].map((n) => (
//               <option key={n}>{n}</option>
//             ))}
//           </select>
//         </label>
//       </div>
//
//       <div className="flex gap-1 mb-3">
//         <button onClick={prev} className="border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-100 cursor-pointer">
//           ‹
//         </button>
//         <button onClick={next} className="border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-100 cursor-pointer">
//           ›
//         </button>
//       </div>
//
//       <div className="flex flex-wrap gap-5">
//         {grids.map((g, i) => (
//           <MonthGrid
//             key={i}
//             year={g.year}
//             month={g.month}
//             mode={mode}
//             selected={mode === "single" ? single : range}
//             hovered={hovered}
//             onSelect={handleSelect}
//             onHover={setHovered}
//           />
//         ))}
//       </div>
//
//       <div className="mt-3 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded font-mono">{result}</div>
//     </div>
//   );
// }
