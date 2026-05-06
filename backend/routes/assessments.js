const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../db");

const gripNorms = {
  male: {
    "10-11": { weakBelow: 12.6, strongAbove: 22.4 },
    "12-13": { weakBelow: 19.4, strongAbove: 31.2 },
    "14-15": { weakBelow: 28.5, strongAbove: 44.3 },
    "16-17": { weakBelow: 32.6, strongAbove: 52.4 },
    "18-19": { weakBelow: 35.7, strongAbove: 55.5 },
    "20-24": { weakBelow: 36.8, strongAbove: 56.6 },
    "25-29": { weakBelow: 37.7, strongAbove: 57.5 },
    "30-34": { weakBelow: 36.0, strongAbove: 55.8 },
    "35-39": { weakBelow: 35.8, strongAbove: 55.6 },
    "40-44": { weakBelow: 35.5, strongAbove: 55.3 },
    "45-49": { weakBelow: 34.7, strongAbove: 54.5 },
    "50-54": { weakBelow: 32.9, strongAbove: 50.7 },
    "55-59": { weakBelow: 30.7, strongAbove: 48.5 },
    "60-64": { weakBelow: 30.2, strongAbove: 48.0 },
    "65-69": { weakBelow: 28.2, strongAbove: 44.0 },
    "70-99": { weakBelow: 21.3, strongAbove: 35.1 },
  },
  female: {
    "10-11": { weakBelow: 11.8, strongAbove: 21.6 },
    "12-13": { weakBelow: 14.6, strongAbove: 24.4 },
    "14-15": { weakBelow: 15.5, strongAbove: 27.3 },
    "16-17": { weakBelow: 17.2, strongAbove: 29.0 },
    "18-19": { weakBelow: 19.2, strongAbove: 31.0 },
    "20-24": { weakBelow: 21.5, strongAbove: 35.3 },
    "25-29": { weakBelow: 25.6, strongAbove: 41.4 },
    "30-34": { weakBelow: 21.5, strongAbove: 35.3 },
    "35-39": { weakBelow: 20.3, strongAbove: 34.1 },
    "40-44": { weakBelow: 18.9, strongAbove: 32.7 },
    "45-49": { weakBelow: 18.6, strongAbove: 32.4 },
    "50-54": { weakBelow: 18.1, strongAbove: 31.9 },
    "55-59": { weakBelow: 17.7, strongAbove: 31.5 },
    "60-64": { weakBelow: 17.2, strongAbove: 31.0 },
    "65-69": { weakBelow: 15.4, strongAbove: 27.2 },
    "70-99": { weakBelow: 14.7, strongAbove: 24.5 },
  },
};

function calcGripAssessment({ gender, age_group, grip_value }) {
  const norm = gripNorms[gender]?.[age_group];

  if (!norm) {
    throw new Error("ไม่พบเกณฑ์ประเมินของเพศหรือช่วงอายุนี้");
  }

  const grip = Number(grip_value);

  if (Number.isNaN(grip) || grip <= 0) {
    throw new Error("ค่าแรงบีบมือต้องมากกว่า 0");
  }

  if (grip < norm.weakBelow) {
    return {
      score: 40,
      result: "อ่อน",
      advice: `แรงบีบมือต่ำกว่าเกณฑ์ของช่วงอายุ ${age_group} ควรฝึกกล้ามเนื้อมือ/แขน และติดตามผลซ้ำ`,
    };
  }

  if (grip > norm.strongAbove) {
    return {
      score: 100,
      result: "แข็งแรง",
      advice: `แรงบีบมือสูงกว่าเกณฑ์ของช่วงอายุ ${age_group} ถือว่าอยู่ในระดับดี`,
    };
  }

  return {
    score: 80,
    result: "ปกติ",
    advice: `แรงบีบมืออยู่ในช่วงปกติของช่วงอายุ ${age_group}`,
  };
}

// POST /api/assessments
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { gender, age_group, hand, grip_value, note } = req.body;

    if (!["male", "female"].includes(gender)) {
      return res.status(400).json({ msg: "กรุณาเลือกเพศให้ถูกต้อง" });
    }

    if (!gripNorms[gender]?.[age_group]) {
      return res.status(400).json({ msg: "กรุณาเลือกช่วงอายุให้ถูกต้อง" });
    }

    if (!["left", "right"].includes(hand)) {
      return res.status(400).json({ msg: "กรุณาเลือกมือที่วัดให้ถูกต้อง" });
    }

    const { score, result, advice } = calcGripAssessment({
      gender,
      age_group,
      grip_value,
    });

    const genderText = gender === "male" ? "ชาย" : "หญิง";
    const handText = hand === "right" ? "ขวา" : "ซ้าย";

    const detailNote =
      `เพศ: ${genderText}, อายุ: ${age_group}, มือ: ${handText}, ` +
      `แรงบีบมือ: ${grip_value} kg` +
      (note ? `, หมายเหตุ: ${note}` : "");

    await db.query(
      "INSERT INTO assessments (user_id, score, result, advice, note, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [userId, score, result, advice, detailNote]
    );

    return res.json({
      msg: "บันทึกแบบประเมินสำเร็จ",
      score,
      result,
      advice,
    });
  } catch (err) {
    console.error("ASSESSMENTS POST ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server error" });
  }
});

// GET /api/assessments/me
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await db.query(
      "SELECT id, score, result, advice, note, created_at FROM assessments WHERE user_id=? ORDER BY created_at DESC",
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("ASSESSMENTS GET ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;