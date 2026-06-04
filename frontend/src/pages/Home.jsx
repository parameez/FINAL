import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {
  const token = localStorage.getItem("token");

  const topPlayerRef = useRef(null);
  const bottomPlayerRef = useRef(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayers();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = createPlayers;
    };

    const createPlayers = () => {
      if (!window.YT || !window.YT.Player) return;

      topPlayerRef.current = new window.YT.Player("top-video", {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              bottomPlayerRef.current?.pauseVideo();
            }
          },
        },
      });

      bottomPlayerRef.current = new window.YT.Player("bottom-video", {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              topPlayerRef.current?.pauseVideo();
            }
          },
        },
      });
    };

    loadYouTubeAPI();
  }, []);

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

        <div
          className="figma-hero-image"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#0f172a",
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.4,
              margin: 0,
              width: "100%",
            }}
          >
            เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง
          </h3>

          <div className="video-card">
            <iframe
              id="top-video"
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

        <div
          className="step-grid"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          <div className="step-card">
            <div className="step-icon">📌</div>

            <h3>วิธีการใช้งาน Website</h3>

            <p>
              แนะนำขั้นตอนการใช้งานระบบ การเชื่อมต่ออุปกรณ์
              การบันทึกค่าแรงบีบมือ และการดูผลย้อนหลัง
            </p>

            <div
              className="video-card"
              style={{
                marginTop: 14,
                width: "100%",
                maxWidth: 720,
                boxShadow: "none",
              }}
            >
              <iframe
                id="bottom-video"
                className="youtube-video"
                src="https://www.youtube.com/embed/7DsXcJ66Rrc?enablejsapi=1"
                title="วิธีการใช้งาน Website"
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