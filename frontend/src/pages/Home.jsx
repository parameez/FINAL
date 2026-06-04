import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Home() {
  const token = localStorage.getItem("token");

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const pauseVideo = (iframeRef) => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "pauseVideo",
        args: [],
      }),
      "*"
    );
  };

  const playVideo = (iframeRef) => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "playVideo",
        args: [],
      }),
      "*"
    );
  };

  const handlePlayVideo1 = () => {
    pauseVideo(video2Ref);
    playVideo(video1Ref);
  };

  const handlePlayVideo2 = () => {
    pauseVideo(video1Ref);
    playVideo(video2Ref);
  };

  return (
    <main className="home-page">
      <section className="figma-hero">
        <div className="figma-hero-text">
          <h1>
            ระบบวัดค่า
            <br />
            กล้ามเนื้อมือ
            <br />
            อ่อนแรง
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
          <h3
            style={{
              textAlign: "center",
              marginBottom: 12,
              color: "#0f172a",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง
          </h3>

          <div className="video-card">
            <iframe
              ref={video1Ref}
              className="youtube-video"
              src="https://www.youtube.com/embed/pUN9OUGqZzA?enablejsapi=1"
              title="เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="steps">
        <h2>✅ วิธีใช้งาน</h2>

        <div className="step-grid">
          <div className="step-card">
            <div className="step-icon">▶️</div>
            <h3>คลิปที่ 1: เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง</h3>
            <p>ทำความเข้าใจเกี่ยวกับภาวะกล้ามเนื้อมืออ่อนแรงเบื้องต้น</p>

            <button
              type="button"
              className="figma-main-btn"
              onClick={handlePlayVideo1}
              style={{
                marginTop: 12,
                marginBottom: 12,
                border: "none",
                cursor: "pointer",
              }}
            >
              เปิดคลิปที่ 1
            </button>

            <div
              className="video-card"
              style={{
                marginTop: 14,
                width: "100%",
                boxShadow: "none",
              }}
            >
              <iframe
                ref={video1Ref}
                className="youtube-video"
                src="https://www.youtube.com/embed/pUN9OUGqZzA?enablejsapi=1"
                title="คลิปที่ 1 เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="step-card">
            <div className="step-icon">📌</div>
            <h3>คลิปที่ 2: วิธีใช้งานระบบ</h3>
            <p>แนะนำขั้นตอนการใช้งานระบบและการดูผลการวัดแรงบีบมือ</p>

            <button
              type="button"
              className="figma-main-btn"
              onClick={handlePlayVideo2}
              style={{
                marginTop: 12,
                marginBottom: 12,
                border: "none",
                cursor: "pointer",
              }}
            >
              เปิดคลิปที่ 2
            </button>

            <div
              className="video-card"
              style={{
                marginTop: 14,
                width: "100%",
                boxShadow: "none",
              }}
            >
              <iframe
                ref={video2Ref}
                className="youtube-video"
                src="https://www.youtube.com/embed/7DsXcJ66Rrc?enablejsapi=1"
                title="คลิปที่ 2 วิธีใช้งานระบบ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}