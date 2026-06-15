import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function History() {
  const [gripRows, setGripRows] = useState([]);
  const [assessRows, setAssessRows] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const userId = localStorage.getItem("userId");

  const genderText = (gender) => {
    if (gender === "male") return "ชาย";
    if (gender === "female") return "หญิง";
    if (gender === "other") return "อื่น ๆ";
    return "-";
  };

  const resultText = (result) => {
    if (result === "อ่อน") return "อ่อน";
    if (result === "ปกติ") return "ปกติ";
    if (result === "แข็งแรง") return "แข็งแรง";
    return result || "-";
  };

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const user = await API.get("/users/me");
        setUserInfo(user.data || null);

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

  const displayName =
    userInfo?.full_name ||
    userInfo?.username ||
    gripRows[0]?.full_name ||
    gripRows[0]?.username ||
    assessRows[0]?.full_name ||
    assessRows[0]?.username ||
    "-";

  const displayGender =
    userInfo?.gender || gripRows[0]?.gender || assessRows[0]?.gender || "other";

  const displayDeviceId = userInfo?.device_id || gripRows[0]?.device_id || "-";

  const displayBirthDate =
    userInfo?.birth_date ||
    gripRows[0]?.birth_date ||
    assessRows[0]?.birth_date ||
    "-";

  const yearOptions = useMemo(() => {
    const years = new Set();

    gripRows.forEach((row) => {
      if (row.measured_at) {
        years.add(new Date(row.measured_at).getFullYear());
      }
    });

    assessRows.forEach((row) => {
      if (row.created_at) {
        years.add(new Date(row.created_at).getFullYear());
      }
    });

    return [...years].sort((a, b) => b - a);
  }, [gripRows, assessRows]);

  const checkDateFilter = (dateValue) => {
    if (!dateValue) return false;

    const date = new Date(dateValue);
    const month = String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    const matchMonth = filterMonth === "all" || filterMonth === month;
    const matchYear = filterYear === "all" || filterYear === year;

    return matchMonth && matchYear;
  };

  const filteredGripRows = useMemo(() => {
    return gripRows.filter((row) => checkDateFilter(row.measured_at));
  }, [gripRows, filterMonth, filterYear]);

  const filteredAssessRows = useMemo(() => {
    return assessRows.filter((row) => checkDateFilter(row.created_at));
  }, [assessRows, filterMonth, filterYear]);

  if (loading) {
    return (
      <div className="content-card" style={{ textAlign: "center" }}>
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div
      className="content-card"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h1 className="section-title" style={{ textAlign: "center" }}>
        History
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbeafe",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ color: "#64748b", marginBottom: 6 }}>ชื่อผู้ใช้</div>
          <strong style={{ fontSize: 18 }}>{displayName}</strong>
        </div>

        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbeafe",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ color: "#64748b", marginBottom: 6 }}>เพศ</div>
          <strong style={{ fontSize: 18 }}>{genderText(displayGender)}</strong>
        </div>

        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbeafe",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ color: "#64748b", marginBottom: 6 }}>วันเกิด</div>
          <strong style={{ fontSize: 18 }}>
            {displayBirthDate !== "-"
              ? new Date(displayBirthDate).toLocaleDateString("th-TH")
              : "-"}
          </strong>
        </div>

        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbeafe",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ color: "#64748b", marginBottom: 6 }}>Device ID</div>
          <strong style={{ fontSize: 18 }}>{displayDeviceId}</strong>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          background: "#f8fbff",
          border: "1px solid #dbeafe",
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <strong>ตัวกรองประวัติ</strong>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{
            height: 42,
            borderRadius: 12,
            border: "1px solid #dbeafe",
            padding: "0 12px",
          }}
        >
          <option value="all">ทุกเดือน</option>
          {monthNames.map((name, index) => (
            <option key={name} value={String(index + 1)}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{
            height: 42,
            borderRadius: 12,
            border: "1px solid #dbeafe",
            padding: "0 12px",
          }}
        >
          <option value="all">ทุกปี</option>
          {yearOptions.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="figma-sub-btn"
          onClick={() => {
            setFilterMonth("all");
            setFilterYear("all");
          }}
          style={{ height: 42 }}
        >
          ล้างตัวกรอง
        </button>
      </div>

      <div className="section-block">
        <h2 className="sub-title">Grip History</h2>

        {filteredGripRows.length === 0 ? (
          <div className="empty-state">ยังไม่มีประวัติการวัดแรงบีบมือ</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Grip ID</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>เพศ</th>
                  <th>Device ID</th>
                  <th>Hand</th>
                  <th>Grip Value</th>
                  <th>อายุ</th>
                  <th>ช่วงอายุ</th>
                  <th>ผลประเมิน</th>
                  <th>คะแนน</th>
                  <th>คำแนะนำ</th>
                  <th>Measured At</th>
                </tr>
              </thead>

              <tbody>
                {filteredGripRows.map((row) => (
                  <tr key={row.grip_id}>
                    <td>{row.grip_id}</td>
                    <td>{row.full_name || row.username || "-"}</td>
                    <td>{genderText(row.gender)}</td>
                    <td>{row.device_id ?? "-"}</td>
                    <td>{row.hand === "right" ? "ขวา" : "ซ้าย"}</td>
                    <td>{row.grip_value} kg</td>
                    <td>{row.age ?? "-"}</td>
                    <td>{row.age_group || "-"}</td>
                    <td>{resultText(row.result)}</td>
                    <td>{row.score ?? "-"}</td>
                    <td>{row.advice || "-"}</td>
                    <td>
                      {row.measured_at
                        ? new Date(row.measured_at).toLocaleString("th-TH")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section-block">
        <h2 className="sub-title">Assessment History</h2>

        {filteredAssessRows.length === 0 ? (
          <div className="empty-state">ยังไม่มีประวัติการประเมิน</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>เพศ</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Advice</th>
                  <th>Note</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssessRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.full_name || row.username || "-"}</td>
                    <td>{genderText(row.gender)}</td>
                    <td>{row.score ?? "-"}</td>
                    <td>{row.result || "-"}</td>
                    <td>{row.advice || "-"}</td>
                    <td>{row.note || "-"}</td>
                    <td>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("th-TH")
                        : "-"}
                    </td>
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