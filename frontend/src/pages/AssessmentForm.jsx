import { useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const ageGroups = [
  "10-11",
  "12-13",
  "14-15",
  "16-17",
  "18-19",
  "20-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45-49",
  "50-54",
  "55-59",
  "60-64",
  "65-69",
  "70-99",
];

export default function AssessmentForm() {
  const [deviceId, setDeviceId] = useState("");
  const [gender, setGender] = useState("male");
  const [ageGroup, setAgeGroup] = useState("20-24");
  const [hand, setHand] = useState("right");
  const [gripValue, setGripValue] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const title = useMemo(() => {
    return gender === "male"
      ? "เกณฑ์แรงบีบมือเพศชาย"
      : "เกณฑ์แรงบีบมือเพศหญิง";
  }, [gender]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!deviceId || Number(deviceId) <= 0) {
      alert("กรุณากรอก Device ID ให้ถูกต้อง");
      return;
    }

    if (!gripValue || Number(gripValue) <= 0) {
      alert("กรุณากรอกค่าแรงบีบมือให้ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/assessments", {
        device_id: Number(deviceId),
        gender,
        age_group: ageGroup,
        hand,
        grip_value: Number(gripValue),
        note: note || "",
      });

      alert(
        `บันทึกสำเร็จ\n` +
          `ผลประเมิน: ${res.data.result}\n` +
          `คะแนน: ${res.data.score}\n` +
          `คำแนะนำ: ${res.data.advice}`
      );

      navigate("/history");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "บันทึกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef6ff",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#ffffff",
          borderRadius: 22,
          padding: 28,
          boxShadow: "0 12px 35px rgba(15, 23, 42, 0.12)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            marginBottom: 20,
            color: "#0f172a",
          }}
        >
          แบบประเมินแรงบีบมือ
        </h2>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>{title}</h3>
          <p style={{ marginBottom: 0, color: "#475569", lineHeight: 1.7 }}>
            เลือกเพศและช่วงอายุ จากนั้นกรอก Device ID และค่าแรงบีบมือหน่วยกิโลกรัม
            (kg) ระบบจะประเมินว่าอยู่ในระดับ อ่อน / ปกติ / แข็งแรง
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Device ID
          </label>
          <input
            type="number"
            min="1"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="กรอก Device ID เช่น 1"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            เพศ
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          >
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>

          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            ช่วงอายุ
          </label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          >
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age} ปี
              </option>
            ))}
          </select>

          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            มือที่วัด
          </label>
          <select
            value={hand}
            onChange={(e) => setHand(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          >
            <option value="right">ขวา</option>
            <option value="left">ซ้าย</option>
          </select>

          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            ค่าแรงบีบมือ (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={gripValue}
            onChange={(e) => setGripValue(e.target.value)}
            placeholder="เช่น 35.5"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            บันทึกเพิ่มเติม
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ใส่ได้/ไม่ใส่ก็ได้"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 18,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 14,
              background: loading ? "#94a3b8" : "#6aa9e9",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกแบบประเมิน"}
          </button>
        </form>
      </div>
    </div>
  );
}