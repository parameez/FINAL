import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();

  return (
    <div className="content-card">
      <h1 className="section-title">ผลการประเมิน</h1>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #edf2ff",
          borderRadius: "16px",
          padding: "24px",
          marginTop: "16px",
        }}
      >
        <p style={{ marginBottom: "16px", color: "#4b5563" }}>
          หน้านี้พร้อมใช้งานแล้ว (เวอร์ชันกันจอขาว)
        </p>

        <button
          type="button"
          className="assessment-submit"
          onClick={() => navigate("/history")}
        >
          ไปหน้าประวัติการวัด
        </button>
      </div>
    </div>
  );
}