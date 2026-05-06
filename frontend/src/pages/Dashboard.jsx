import { useEffect, useState } from "react";
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

  if (!summary) {
    return <div className="content-card">Loading...</div>;
  }

  const latestGrip = gripData.length > 0 ? gripData[0] : summary.latestGrip || null;

  const avgGrip =
    gripData.length > 0
      ? (
          gripData.reduce((sum, item) => sum + Number(item.grip_value || 0), 0) /
          gripData.length
        ).toFixed(2)
      : Number(summary.avgGrip || 0).toFixed(2);

  const chartData = [...gripData].reverse().map((item) => ({
    ...item,
    measured_label: new Date(item.measured_at).toLocaleDateString(),
  }));

  return (
    <div className="content-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="page-subtitle">
            สรุปผลค่าแรงบีบมือและแนวโน้มสุขภาพของผู้ใช้
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/assessment")}
          style={{ height: 48 }}
        >
          เริ่มทำแบบประเมิน
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Grip ล่าสุด</h3>
          <p>
            {latestGrip
              ? `${latestGrip.grip_value} kg (${latestGrip.hand})`
              : "ไม่มีข้อมูล"}
          </p>
        </div>

        <div className="stat-box">
          <h3>ค่าเฉลี่ย Grip</h3>
          <p>{avgGrip} kg</p>
        </div>

        <div className="stat-box">
          <h3>จำนวนครั้งที่วัด</h3>
          <p>{gripData.length}</p>
        </div>
      </div>

      <div className="section-block">
        <h3 className="sub-title">แนวโน้ม Grip</h3>

        {chartData.length === 0 ? (
          <div className="empty-state">ยังไม่มีข้อมูลกราฟ</div>
        ) : (
          <div
            style={{
              width: "100%",
              height: 320,
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid #edf2ff",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="measured_label" />
                <YAxis />
                <Tooltip
                  labelFormatter={(_, payload) => {
                    if (payload && payload.length > 0) {
                      return new Date(
                        payload[0].payload.measured_at
                      ).toLocaleString();
                    }
                    return "";
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="grip_value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}