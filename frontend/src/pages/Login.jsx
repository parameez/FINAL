import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("userId", String(res.data.user.userId));

      nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "ล็อกอินไม่สำเร็จ");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-logo">⌁</div>
          <h1>Handgrip Assessment System</h1>
          <p>เข้าสู่ระบบเพื่อติดตามค่าแรงบีบมือและผลประเมินสุขภาพ</p>
        </div>

        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">กรอกบัญชีผู้ใช้เพื่อเข้าสู่ระบบ</p>

          <form onSubmit={submit}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="main-btn">
              Login
            </button>

            <div className="auth-link">
              <span>Don’t have account?</span>
              <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}