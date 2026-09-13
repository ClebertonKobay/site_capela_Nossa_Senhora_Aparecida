import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#1B3A6B",
          color: "#F7F4EC",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#D4A537",
            marginBottom: 40,
          }}
        />
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: "center", padding: "0 80px" }}>
          Capela Nossa Senhora Aparecida
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#D4A537" }}>Boa Vista, Ponta Grossa - PR</div>
      </div>
    ),
    { ...size },
  );
}
