import { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {
  const [gripRows, setGripRows] = useState([]);
  const [assessRows, setAssessRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const g = await API.get(`/grip/user/${userId}`);
        setGripRows(g.data || []);

        const a = await API.get(`/assessments/me`);
        setAssessRows(a.data || []);
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.msg || "โหลดประวัติไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  if (loading) {
    return <div className="content-card">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="content-card">
      <h1 className="section-title">History</h1>

      <div className="section-block">
        <h2 className="sub-title">Grip History</h2>

        {gripRows.length === 0 ? (
          <div className="empty-state">ยังไม่มีประวัติการวัดแรงบีบมือ</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Grip ID</th>
                  <th>Device ID</th>
                  <th>Hand</th>
                  <th>Grip Value</th>
                  <th>Measured At</th>
                </tr>
              </thead>
              <tbody>
                {gripRows.map((row) => (
                  <tr key={row.grip_id}>
                    <td>{row.grip_id}</td>
                    <td>{row.device_id ?? "-"}</td>
                    <td>{row.hand}</td>
                    <td>{row.grip_value} kg</td>
                    <td>{new Date(row.measured_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section-block">
        <h2 className="sub-title">Assessment History</h2>

        {assessRows.length === 0 ? (
          <div className="empty-state">ยังไม่มีประวัติการประเมิน</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Advice</th>
                  <th>Note</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {assessRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.score ?? "-"}</td>
                    <td>{row.result || "-"}</td>
                    <td>{row.advice || "-"}</td>
                    <td>{row.note || "-"}</td>
                    <td>{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}