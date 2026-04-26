export default function DtsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Gov banner */}
      <div style={{ backgroundColor: "#1b1b1b", padding: "4px 24px" }}>
        <span style={{ color: "#a9aeb1", fontSize: "11px" }}>
          🇺🇸 An official website of the United States Government
        </span>
      </div>

      {/* Agency header */}
      <header style={{ backgroundColor: "#005ea2", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div>
          <div style={{ color: "white", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.01em" }}>
            Defense Travel System
          </div>
          <div style={{ color: "#99c4e6", fontSize: "12px", marginTop: "2px" }}>
            Defense Travel Management Office (DTMO) · DoD
          </div>
        </div>
      </header>

      {/* Nav bar */}
      <div style={{ backgroundColor: "#162e51", padding: "0 24px", display: "flex", gap: "0" }}>
        {["Travel Vouchers", "Authorizations", "My Trips", "Reports", "Help"].map((item, i) => (
          <div
            key={item}
            style={{
              color: i === 0 ? "white" : "#99c4e6",
              fontSize: "13px",
              fontWeight: i === 0 ? "700" : "400",
              padding: "10px 16px",
              borderBottom: i === 0 ? "3px solid white" : "3px solid transparent",
              cursor: "default",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Page content */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>

      <footer style={{ borderTop: "1px solid #dfe1e2", padding: "16px 24px", textAlign: "center", color: "#71767a", fontSize: "12px", marginTop: "48px" }}>
        Defense Travel Management Office (DTMO) · Privacy Policy · Accessibility · Contact DTS Help Desk: 1-888-435-7146
      </footer>
    </div>
  )
}
