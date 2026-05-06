import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar figma-navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-circle">
          ⌁
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">
          หน้าหลัก
        </Link>

        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        <Link to="/history" className="nav-link">
          ผลการทดสอบ
        </Link>

        <Link to="/assessment" className="nav-link">
          เมนูสุขภาพ
        </Link>

        <button type="button" className="nav-link nav-button">
          ติดต่อ
        </button>
      </div>

      <div className="navbar-right">
        <button type="button" className="search-btn">
          ค้นหา
        </button>

        {token ? (
          <>
            <div className="user-chip">👤 {username || "User"}</div>
            <button className="logout-btn" onClick={logout}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <Link to="/login" className="login-small">
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}