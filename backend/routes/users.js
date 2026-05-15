const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../db");

// GET /api/users/me
// ดึงข้อมูลผู้ใช้ที่ login อยู่
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await db.query(
      `
      SELECT 
        user_id,
        username,
        full_name,
        gender,
        device_id
      FROM tp_user
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    return res.json(rows[0] || null);
  } catch (err) {
    console.error("GET USER ME ERROR:", err.message);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/users/device
// ให้ user ผูก Device ID กับบัญชีตัวเอง
router.put("/device", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { device_id } = req.body;

    if (!device_id || Number(device_id) <= 0) {
      return res.status(400).json({ msg: "กรุณากรอก Device ID ให้ถูกต้อง" });
    }

    await db.query(
      `
      UPDATE tp_user
      SET device_id = ?
      WHERE user_id = ?
      `,
      [Number(device_id), userId]
    );

    return res.json({
      msg: "เชื่อมต่อ Device ID สำเร็จ",
      user_id: userId,
      device_id: Number(device_id),
    });
  } catch (err) {
    console.error("UPDATE DEVICE ERROR:", err.message);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;