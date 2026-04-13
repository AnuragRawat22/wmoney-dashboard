import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
interface TrendRaw {
  month: string;
  category: string;
  total: number;
}
type ChartDataPoint = { month: string } & Record<string, number>;
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FF5A5F",
  Housing: "#3D5A80",
  Transportation: "#02C39A",
  Shopping: "#F7B801",
  Entertainment: "#F18701",
  Health: "#E01A4F",
  Study: "#9D4EDD",
  Misc: "#8D99AE",
};
const DEFAULT_COLORS = [
  "#fb8500",
  "#219ebc",
  "#8ecae6",
  "#ffb703",
  "#e63946",
  "#2a9d8f",
];
export const BigDataChart: React.FC = React.memo(() => {
  const [rawData, setRawData] = useState<TrendRaw[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cleaningPos, setCleaningPos] = useState<boolean>(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/analytics/trends`,
      );
      if (!response.ok) throw new Error("Network error");
      const data: any[] = await response.json();

      setRawData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const chartData = useMemo(() => {
    if (!rawData.length) return [];
    const cats = Array.from(new Set(rawData.map((d) => d.category)));
    setCategories(cats);
    const grouped = rawData.reduce(
      (acc, curr: any) => {
        if (!acc[curr.month]) {
          acc[curr.month] = { month: curr.month };
        }
        acc[curr.month][curr.category] = Number(
          (curr.total || curr.amount || 0).toFixed(2),
        );
        return acc;
      },
      {} as Record<string, any>,
    );
    return Object.values(grouped).sort((a: any, b: any) =>
      a.month.localeCompare(b.month),
    );
  }, [rawData]);
  const runNlpCleanup = async () => {
    try {
      setCleaningPos(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/nlp/clean`, {
        method: "POST",
      });
      const result = await res.json();
      await fetchData();
      window.dispatchEvent(new Event("refresh-safe-spend"));
    } catch (err) {
      alert("Failed to run NLP cleaning.");
    } finally {
      setCleaningPos(false);
    }
  };
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Spending Analytics Explorer</h2>
          <p style={styles.subtitle}>Crunching 10,000+ Records...</p>
        </div>
        {}
        <div style={styles.skeletonContainer}>
          <div style={styles.skeletonSpinner}></div>
          <span style={{ color: "#94A3B8", fontWeight: 600 }}>
            Loading Data Vector...
          </span>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <div style={styles.headerCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Big Data Analytics: Annual Spending Trends
          </h2>
          <p style={styles.subtitle}>
            Aggregating 10,000+ randomized transactional records.
            Multi-dimensional time-series data grouped by month and categorical
            spending vector.
          </p>
        </div>
        <div>
          <motion.button
            style={styles.actionBtn}
            onClick={runNlpCleanup}
            disabled={cleaningPos}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {cleaningPos ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div style={styles.spinner}></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Run NLP Data Cleanser"
            )}
          </motion.button>
        </div>
      </div>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={450}>
          {}
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#A0AEC0"
              tick={{ fill: "#A0AEC0", fontSize: 13 }}
              tickMargin={10}
            />
            <YAxis
              stroke="#A0AEC0"
              tick={{ fill: "#A0AEC0", fontSize: 13 }}
              tickFormatter={(value) => `$${value}`}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ fontWeight: 500 }}
              labelStyle={{
                color: "#E2E8F0",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
              formatter={(val: number) => [`$${val.toFixed(2)}`, ""]}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            {categories.map((cat, idx) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                name={cat}
                stroke={
                  CATEGORY_COLORS[cat] ||
                  DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                }
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "24px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    color: "#F8FAFC",
  },
  headerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "24px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    background: "linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#94A3B8",
    maxWidth: "600px",
    lineHeight: 1.5,
  },
  actionBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(4px)",
    color: "#F8FAFC",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, background-color 0.2s",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
  },
  chartWrapper: {
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  skeletonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "400px",
  },
  skeletonSpinner: {
    width: "32px",
    height: "32px",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #38BDF8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  document.head.appendChild(style);
}
