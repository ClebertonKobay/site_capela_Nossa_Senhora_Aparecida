import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", width: 4, height: 20, background: "#D4A537" }} />
        <div
          style={{
            display: "flex",
            width: 14,
            height: 4,
            background: "#D4A537",
            position: "absolute",
            marginTop: -2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
