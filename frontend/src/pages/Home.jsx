import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <main className="home-page">
      <section className="figma-hero">
        <div className="figma-hero-text">
          <h1>
            ระบบวัดค่า
            <br />
            กล้ามเนื้อมืออ่อนแรง
          </h1>

          <p>
            วิเคราะห์ความแข็งแรงของกล้ามเนื้อมือ พร้อมติดตามผลย้อนหลัง
            เพื่อช่วยประเมินสุขภาพและการฟื้นฟูอย่างต่อเนื่อง
          </p>

          <div className="figma-hero-buttons">
            {token ? (
              <Link to="/assessment" className="figma-main-btn">
                บันทึกการวัด
              </Link>
            ) : (
              <Link to="/login" className="figma-sub-btn">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>

        <div className="figma-hero-image">
          <div className="video-card">
            <iframe
              className="youtube-video"
              src="https://www.youtube.com/embed/mUHRXV30Nhk?autoplay=1&mute=1&loop=1&playlist=mUHRXV30Nhk"
              title="Hand Grip Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="steps">
        <h2>✅ วิธีการทำงาน</h2>

        <div className="step-grid">
          <div className="step-card">
            <div className="step-icon">👏</div>
            <h3>เชื่อมต่ออุปกรณ์</h3>
            <p>รับค่าจาก ESP8266 และส่งข้อมูลเข้าสู่ระบบ</p>
          </div>

          <div className="step-card">
            <div className="step-icon">📊</div>
            <h3>บันทึกและตรวจสอบผล</h3>
            <p>ดูค่า Grip ล่าสุด ค่าเฉลี่ย และแนวโน้มย้อนหลัง</p>
          </div>

          <div className="step-card">
            <div className="step-icon">🩺</div>
            <h3>ประเมินสุขภาพมือ</h3>
            <p>ระบบช่วยประเมินระดับกล้ามเนื้อมืออ่อนแรงเบื้องต้น</p>
          </div>
        </div>
      </section>
    </main>
  );
}