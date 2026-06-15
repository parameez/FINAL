import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    gender: "other",
    birth_date: "",
  });

  const nav = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.birth_date) {
      alert("กรุณาระบุวันเกิด");
      return;
    }

    try {
      await API.post("/auth/register", form);
      alert("สมัครสำเร็จ");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "สมัครไม่สำเร็จ");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            ⌁
          </Link>

          <h1>Create Account</h1>
          <p>
            สมัครสมาชิกเพื่อเริ่มบันทึกค่าแรงบีบมือ ดูประวัติย้อนหลัง
            และประเมินสุขภาพกล้ามเนื้อมือ
          </p>
        </div>

        <div className="auth-card">
          <h2>Register</h2>
          <p className="auth-subtitle">สร้างบัญชีผู้ใช้ใหม่</p>

          <form onSubmit={submit}>
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              required
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />

            <input
              name="full_name"
              placeholder="Full name"
              value={form.full_name}
              onChange={onChange}
              required
            />

            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="other">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label
              style={{
                display: "block",
                marginTop: 12,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              วันเกิด
            </label>

            <input
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={onChange}
              required
            />

            <button type="submit" className="main-btn">
              Register
            </button>

            <div className="auth-link">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}