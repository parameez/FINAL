const router = require("express").Router();
const db = require("../db");

/**
 * POST /api/iot/grip
 * เครื่องบีบมือส่งค่าเข้ามา
 *
 * Headers:
 * x-api-key: <IOT_API_KEY>
 *
 * Body:
 * {
 *   "device_id": 1,
 *   "grip_value": 35.5,
 *   "hand": "right"
 * }
 */
router.post("/grip", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== process.env.IOT_API_KEY) {
      return res.status(401).json({ msg: "Unauthorized device" });
    }

    const { device_id, grip_value, hand = "right" } = req.body;

    if (!device_id || grip_value === undefined) {
      return res.status(400).json({
        msg: "Missing device_id or grip_value",
      });
    }

    if (!["left", "right"].includes(hand)) {
      return res.status(400).json({
        msg: "hand must be left or right",
      });
    }

    const valueNum = Number(grip_value);

    if (Number.isNaN(valueNum) || valueNum <= 0) {
      return res.status(400).json({
        msg: "Invalid grip_value",
      });
    }

    // หา user ที่ผูกกับ device_id นี้
    const users = await db.query(
      `
      SELECT user_id
      FROM tp_user
      WHERE device_id = ?
      LIMIT 1
      `,
      [Number(device_id)]
    );

    if (users.length === 0) {
      return res.status(404).json({
        msg: "ยังไม่มีผู้ใช้เชื่อมต่อ Device ID นี้",
        device_id: Number(device_id),
      });
    }

    const userId = users[0].user_id;

    // บันทึกค่า grip ให้ user คนนั้นอัตโนมัติ
    const result = await db.query(
      `
      INSERT INTO tp_user_grip
        (user_id, device_id, hand, grip_value, measured_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [userId, Number(device_id), hand, valueNum]
    );

    return res.json({
      msg: "Saved",
      grip_id: result.insertId,
      user_id: userId,
      device_id: Number(device_id),
      grip_value: valueNum,
      hand,
    });
  } catch (err) {
    console.error("IOT GRIP ERROR:", err.message);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

// GET /api/iot/grip/latest
router.get("/grip/latest", async (req, res) => {
  try {
    const rows = await db.query(
      `
      SELECT 
        g.grip_id,
        g.user_id,
        u.username,
        u.full_name,
        u.gender,
        g.device_id,
        g.hand,
        g.grip_value,
        g.measured_at
      FROM tp_user_grip g
      LEFT JOIN tp_user u
        ON g.user_id = u.user_id
      ORDER BY g.measured_at DESC, g.grip_id DESC
      LIMIT 1
      `
    );

    return res.json(rows[0] || null);
  } catch (err) {
    console.error("IOT LATEST ERROR:", err.message);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

// GET /api/iot/grip/history?limit=20
router.get("/grip/history", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 200);

    const rows = await db.query(
      `
      SELECT 
        g.grip_id,
        g.user_id,
        u.username,
        u.full_name,
        u.gender,
        g.device_id,
        g.hand,
        g.grip_value,
        g.measured_at
      FROM tp_user_grip g
      LEFT JOIN tp_user u
        ON g.user_id = u.user_id
      ORDER BY g.measured_at DESC, g.grip_id DESC
      LIMIT ?
      `,
      [limit]
    );

    return res.json(rows);
  } catch (err) {
    console.error("IOT HISTORY ERROR:", err.message);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;