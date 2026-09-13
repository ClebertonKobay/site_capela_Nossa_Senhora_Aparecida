import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B3A6B",
        }}
      >
        <div style={{ display: "flex", width: 22, height: 110, background: "#D4A537" }} />
        <div
          style={{
            display: "flex",
            width: 76,
            height: 22,
            background: "#D4A537",
            position: "absolute",
            marginTop: -18,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
