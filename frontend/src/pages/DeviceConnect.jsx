import { useEffect, useState } from "react";
import API from "../services/api";

export default function DeviceConnect() {
  const [deviceId, setDeviceId] = useState("");
  const [currentDeviceId, setCurrentDeviceId] = useState("-");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/users/me");
        setCurrentDeviceId(res.data?.device_id || "-");
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  const saveDevice = async (e) => {
    e.preventDefault();

    if (!deviceId || Number(deviceId) <= 0) {
      alert("กรุณากรอก Device ID ให้ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const res = await API.put("/users/device", {
        device_id: Number(deviceId),
      });

      alert(res.data.msg || "เชื่อมต่อ Device ID สำเร็จ");
      setCurrentDeviceId(Number(deviceId));
      setDeviceId("");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "เชื่อมต่ออุปกรณ์ไม่สำเร็จ");
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
          maxWidth: 520,
          background: "#ffffff",
          borderRadius: 22,
          padding: 30,
          boxShadow: "0 12px 35px rgba(15, 23, 42, 0.12)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
            color: "#0f172a",
          }}
        >
          เชื่อมต่อเครื่องบีบมือ
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: 24,
          }}
        >
          Device ID ปัจจุบัน: <b>{currentDeviceId}</b>
        </p>

        <form onSubmit={saveDevice}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Device ID
          </label>

          <input
            type="number"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="กรอก Device ID ของเครื่อง เช่น 1"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 18,
              borderRadius: 12,
              border: "1px solid #d8e4f2",
              boxSizing: "border-box",
              fontSize: 16,
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
            {loading ? "กำลังบันทึก..." : "เชื่อมต่อ Device ID"}
          </button>
        </form>
      </div>
    </div>
  );
}