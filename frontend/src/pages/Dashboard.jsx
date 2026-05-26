import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [gripData, setGripData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await API.get("/dashboard/summary");
        setSummary(res1.data);

        const userId = localStorage.getItem("userId");
        if (userId) {
          const res2 = await API.get(`/grip/user/${userId}`);
          setGripData(res2.data || []);
        }
      } catch (err) {
        console.error("DASHBOARD LOAD ERROR:", err);
      }
    };

    load();
  }, []);

  const filteredGripData = useMemo(() => {
    if (filterType === "all") return gripData;

    const now = new Date();

    return gripData.filter((item) => {
      const date = new Date(item.measured_at);

      if (filterType === "day") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      }

      if (filterType === "month") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }

      return true;
    });
  }, [gripData, filterType]);

  if (!summary) {
    return <div className="content-card">Loading...</div>;
  }

  const latestGrip =
    filteredGripData.length > 0
      ? filteredGripData[0]
      : summary.latestGrip || null;

  const avgGrip =
    filteredGripData.length > 0
      ? (
          filteredGripData.reduce(
            (sum, item) => sum + Number(item.grip_value || 0),
            0
          ) / filteredGripData.length
        ).toFixed(2)
      : "0.00";

  const chartData = [...filteredGripData].reverse().map((item) => ({
    ...item,
    measured_label: new Date(item.measured_at).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <div className="content-card">
      <div className="dashboard-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="page-subtitle">
            สรุปผลค่าแรงบีบมือและแนวโน้มสุขภาพของผู้ใช้
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/assessment")}
        >
          เริ่มทำแบบประเมิน
        </button>
      </div>

      <div className="filter-row">
        <button
          className={filterType === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilterType("all")}
        >
          ทั้งหมด
        </button>

        <button
          className={filterType === "day" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilterType("day")}
        >
          วันนี้
        </button>

        <button
          className={
            filterType === "month" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setFilterType("month")}
        >
          เดือนนี้
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Grip ล่าสุด</h3>
          <p>
            {latestGrip
              ? `${latestGrip.grip_value} kg (${
                  latestGrip.hand === "right" ? "ขวา" : "ซ้าย"
                })`
              : "ไม่มีข้อมูล"}
          </p>
        </div>

        <div className="stat-box">
          <h3>ค่าเฉลี่ย Grip</h3>
          <p>{avgGrip} kg</p>
        </div>

        <div className="stat-box">
          <h3>จำนวนครั้งที่วัด</h3>
          <p>{filteredGripData.length}</p>
        </div>
      </div>

      <div className="section-block">
        <h3 className="sub-title">แนวโน้ม Grip</h3>

        {chartData.length === 0 ? (
          <div className="empty-state">ยังไม่มีข้อมูลกราฟ</div>
        ) : (
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="measured_label" />
                <YAxis />
                <Tooltip
                  labelFormatter={(_, payload) => {
                    if (payload && payload.length > 0) {
                      return new Date(
                        payload[0].payload.measured_at
                      ).toLocaleString("th-TH");
                    }
                    return "";
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="grip_value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}