import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    gender: "other",
  });

  const nav = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

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
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={onChange}
            />

            <input
              name="full_name"
              placeholder="Full name"
              value={form.full_name}
              onChange={onChange}
            />

            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="other">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

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