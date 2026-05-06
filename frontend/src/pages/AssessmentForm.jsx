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

    if (!gripValue || Number(gripValue) <= 0) {
      alert("กรุณากรอกค่าแรงบีบมือให้ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/assessments", {
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
    <div className="container">
      <h2>แบบประเมินแรงบีบมือ</h2>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          maxWidth: 620,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0, color: "#475569" }}>
          เลือกเพศและช่วงอายุ จากนั้นกรอกค่าแรงบีบมือหน่วยกิโลกรัม (kg)
          ระบบจะประเมินว่าอยู่ในระดับ อ่อน / ปกติ / แข็งแรง
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ maxWidth: 620 }}>
        <label style={{ display: "block", marginBottom: 8 }}>เพศ</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        >
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
        </select>

        <label style={{ display: "block", marginBottom: 8 }}>ช่วงอายุ</label>
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        >
          {ageGroups.map((age) => (
            <option key={age} value={age}>
              {age} ปี
            </option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: 8 }}>มือที่วัด</label>
        <select
          value={hand}
          onChange={(e) => setHand(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        >
          <option value="right">ขวา</option>
          <option value="left">ซ้าย</option>
        </select>

        <label style={{ display: "block", marginBottom: 8 }}>
          ค่าแรงบีบมือ (kg)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={gripValue}
          onChange={(e) => setGripValue(e.target.value)}
          placeholder="เช่น 35.5"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <label style={{ display: "block", marginBottom: 8 }}>บันทึกเพิ่มเติม</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ใส่ได้/ไม่ใส่ก็ได้"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 12 }}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกแบบประเมิน"}
        </button>
      </form>
    </div>
  );
}