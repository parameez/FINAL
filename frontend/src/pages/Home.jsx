import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {
  const token = localStorage.getItem("token");

  const topPlayerRef = useRef(null);
  const bottomLeftPlayerRef = useRef(null);
  const bottomRightPlayerRef = useRef(null);

  useEffect(() => {
    const pauseOthers = (currentPlayer) => {
      const players = [
        topPlayerRef.current,
        bottomLeftPlayerRef.current,
        bottomRightPlayerRef.current,
      ];

      players.forEach((player) => {
        if (player && player !== currentPlayer) {
          try {
            player.pauseVideo();
          } catch (error) {
            console.log("pause error:", error);
          }
        }
      });
    };

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayers();
        return;
      }

      const oldScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!oldScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = createPlayers;
    };

    const createPlayers = () => {
      if (!window.YT || !window.YT.Player) return;

      if (!topPlayerRef.current) {
        topPlayerRef.current = new window.YT.Player("top-video", {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                pauseOthers(topPlayerRef.current);
              }
            },
          },
        });
      }

      if (!bottomLeftPlayerRef.current) {
        bottomLeftPlayerRef.current = new window.YT.Player("bottom-left-video", {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                pauseOthers(bottomLeftPlayerRef.current);
              }
            },
          },
        });
      }

      if (!bottomRightPlayerRef.current) {
        bottomRightPlayerRef.current = new window.YT.Player("bottom-right-video", {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                pauseOthers(bottomRightPlayerRef.current);
              }
            },
          },
        });
      }
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
              src="https://www.youtube.com/embed/Iex7RXiDV3o?enablejsapi=1"
              title="เรียนรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="steps">
        <div
          className="step-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {/* คลิปซ้าย */}
          <div
            className="step-card"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div className="step-icon">📌</div>

            <h3 style={{ marginBottom: 10 }}>วิธีการใช้งาน เครื่องมือและ Website</h3>

            <p style={{ marginBottom: 18 }}>
              แนะนำขั้นตอนการใช้งานระบบ การเชื่อมต่ออุปกรณ์
              การบันทึกค่าแรงบีบมือ และการดูผลย้อนหลัง
            </p>

            <div
              className="video-card"
              style={{
                width: "100%",
                boxShadow: "none",
                borderRadius: 22,
                overflow: "hidden",
                background: "#f8fbff",
                border: "1px solid #e2e8f0",
              }}
            >
              <iframe
                id="bottom-left-video"
                className="youtube-video"
                src="https://www.youtube.com/embed/FDERpo83TnE?enablejsapi=1"
                title="วิธีการใช้งาน เครื่องมือและ Website"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* คลิปขวา */}
          <div
            className="step-card"
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div className="step-icon">🩺</div>

            <h3 style={{ marginBottom: 10 }}>
              ให้ความรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง
            </h3>

            <p style={{ marginBottom: 18 }}>
              วิดีโอให้ความรู้เกี่ยวกับโรคกล้ามเนื้อมืออ่อนแรง
              เพื่อช่วยให้เข้าใจอาการ สาเหตุ และแนวทางดูแลเบื้องต้น
            </p>

            <div
              className="video-card"
              style={{
                width: "100%",
                boxShadow: "none",
                borderRadius: 22,
                overflow: "hidden",
                background: "#f8fbff",
                border: "1px solid #e2e8f0",
              }}
            >
              <iframe
                id="bottom-right-video"
                className="youtube-video"
                src="https://www.youtube.com/embed/xvKcgfuW0_g?enablejsapi=1"
                title="ให้ความรู้เรื่องโรคกล้ามเนื้อมืออ่อนแรง"
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