import type React from "react"

interface NumbersThatSpeakProps {
  /** Responsive width - defaults to 100% */
  width?: number | string
  /** Responsive height - defaults to auto */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
  /** Theme palette */
  theme?: "light" | "dark"
  /** Responsive size variant */
  size?: "sm" | "md" | "lg"
}

/**
 * Numbers that speak – Financial dashboard with layered charts
 * Responsive component with mobile-friendly scaling
 * Single-file component following the v0-ready pattern used in this repo.
 */
const NumbersThatSpeak: React.FC<NumbersThatSpeakProps> = ({
  width = "100%",
  height = "auto",
  className = "",
  theme = "dark",
  size = "md",
}) => {
  // Responsive sizing without scaling
  const responsiveSizes = {
    sm: { 
      containerWidth: "280px", 
      containerHeight: "180px",
      titleFontSize: "12px",
      valueFontSize: "16px", 
      axisFontSize: "9px",
      barWidth: "8px",
      padding: "12px"
    },
    md: { 
      containerWidth: "360px", 
      containerHeight: "240px",
      titleFontSize: "14px",
      valueFontSize: "20px", 
      axisFontSize: "10px",
      barWidth: "10px",
      padding: "16px"
    },
    lg: { 
      containerWidth: "480px", 
      containerHeight: "300px",
      titleFontSize: "16px",
      valueFontSize: "24px", 
      axisFontSize: "12px",
      barWidth: "12px",
      padding: "20px"
    },
  }

  const sizes = responsiveSizes[size]

  // Design tokens (derived from Figma local variables)
  const themeVars =
    theme === "light"
      ? {
          "--nts-surface": "#ffffff",
          "--nts-text-primary": "#2f3037",
          "--nts-text-secondary": "rgba(47,48,55,0.8)",
          "--nts-text-muted": "rgba(55,50,47,0.7)",
          "--nts-border": "rgba(47,48,55,0.12)",
          "--nts-shadow": "rgba(47,48,55,0.06)",
        }
      : ({
          "--nts-surface": "#ffffff",
          "--nts-text-primary": "#2f3037",
          "--nts-text-secondary": "rgba(47,48,55,0.8)",
          "--nts-text-muted": "rgba(55,50,47,0.7)",
          "--nts-border": "rgba(47,48,55,0.12)",
          "--nts-shadow": "rgba(47,48,55,0.06)",
        } as React.CSSProperties)

  // Figma-exported assets
  const imgSchedule = "/placeholder.svg?height=271&width=431"
  const imgYAxisLine = "/placeholder.svg?height=17&width=295"
  const imgYAxisLine1 = "/placeholder.svg?height=13&width=295"
  const imgYAxisLine2 = "/placeholder.svg?height=13&width=295"

  return (
    <div
      className={`${className} w-full max-w-full overflow-hidden flex items-center justify-center`}
      style={
        {
          width,
          height,
          position: "relative",
          background: "transparent",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="داشبورد مالی نمایش نمودارهای درآمد فاکتور شده"
      data-name="Numbers that speak"
      data-node-id="454:5856"
    >
      {/* Main dashboard container */}
      <div
        style={{
          width: sizes.containerWidth,
          height: sizes.containerHeight,
          background: "var(--nts-surface)",
          borderRadius: "8px",
          boxShadow: "0px 0px 0px 1px rgba(47,48,55,0.12), 0px 2px 4px -1px rgba(47,48,55,0.06), 0px 3px 6px -1.5px rgba(47,48,55,0.06)",
          padding: sizes.padding,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
        }}
      >
        {/* Header Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontFamily: "Vazir, sans-serif",
              fontWeight: 600,
              fontSize: sizes.titleFontSize,
              lineHeight: "1.4",
              color: "var(--nts-text-secondary)",
            }}
          >
            درآمد فاکتور شده
          </div>
          <div
            style={{
              fontFamily: "Vazir, sans-serif",
              fontWeight: 500,
              fontSize: sizes.valueFontSize,
              lineHeight: "1.2",
              color: "var(--nts-text-primary)",
            }}
          >
            ۳۱۷ میلیون تومان
          </div>
        </div>

        {/* Chart Container */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Y-Axis Labels */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "120px" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", minWidth: "60px" }}>
              {["۵۰۰میلیون", "۳۰۰میلیون", "۲۰۰میلیون", "۱۰۰میلیون", "۰"].map((label, index) => (
                <div
                  key={index}
                  style={{
                    fontFamily: "'Vazir', sans-serif",
                    fontWeight: 500,
                    fontSize: sizes.axisFontSize,
                    color: "var(--nts-text-muted)",
                    textAlign: "right",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, position: "relative", height: "100px" }}>
              {/* Grid Lines */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: "100%", height: "1px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                ))}
              </div>

              {/* Chart Bars */}
              <div style={{ position: "absolute", bottom: "0px", left: 0, right: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 4px", height: "100%" }}>
                {[
                  { height: 60, color: "#5D4E37" },
                  { height: 80, color: "#5D4E37" },
                  { height: 40, color: "#5D4E37" },
                  { height: 70, color: "#5D4E37" },
                  { height: 60, color: "#5D4E37" },
                  { height: 70, color: "#5D4E37" },
                  { height: 60, color: "#5D4E37" },
                  { height: 75, color: "#5D4E37" },
                  { height: 80, color: "#5D4E37" },
                  { height: 55, color: "#5D4E37" },
                  { height: 70, color: "#5D4E37" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      width: sizes.barWidth,
                      height: `${item.height}%`,
                      backgroundColor: item.color,
                      borderRadius: "2px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'Vazir', sans-serif",
              fontWeight: 500,
              fontSize: sizes.axisFontSize,
              color: "var(--nts-text-muted)",
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            <div>مرداد ۱۴۰۳</div>
            <div>مرداد ۱۴۰۴</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumbersThatSpeak
