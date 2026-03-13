import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(180,160,255,1) 0%, rgba(124,92,255,1) 55%, rgba(67,53,132,1) 100%)",
        color: "white",
        fontSize: 128,
        fontWeight: 700,
        borderRadius: 120,
      }}
    >
      PF
    </div>,
    size,
  );
}
