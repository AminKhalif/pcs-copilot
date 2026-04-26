export default function DtsConfirmationPage() {
  const submittedAt = "25 APR 2026, 14:37 EDT"
  const confirmNumber = "DTS-2026-09451"

  return (
    <div>
      {/* Success banner */}
      <div style={{
        background: "#ecf3ec",
        border: "1px solid #00a91c",
        borderLeft: "4px solid #00a91c",
        borderRadius: "4px",
        padding: "20px 24px",
        marginBottom: "28px",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
      }}>
        <div style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#00a91c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "700", color: "#1b1b1b", marginBottom: "4px" }}>
            Voucher submitted successfully
          </div>
          <div style={{ fontSize: "14px", color: "#2e6b30" }}>
            Your DD 1351-2 Travel Voucher has been submitted for Finance Officer review. You will receive a notification when it is approved.
          </div>
        </div>
      </div>

      {/* Confirmation details */}
      <div style={{ background: "white", border: "1px solid #dfe1e2", borderRadius: "4px", padding: "28px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1b1b1b", margin: "0 0 20px 0", paddingBottom: "14px", borderBottom: "1px solid #dfe1e2" }}>
          Submission Details
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Confirmation Number
            </div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#005ea2", fontFamily: "monospace", letterSpacing: "0.04em" }}>
              {confirmNumber}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Submitted
            </div>
            <div style={{ fontSize: "15px", color: "#1b1b1b" }}>
              {submittedAt}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Member
            </div>
            <div style={{ fontSize: "15px", color: "#1b1b1b" }}>SSG John A. Smith</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Voucher Type
            </div>
            <div style={{ fontSize: "15px", color: "#1b1b1b" }}>DD 1351-2 · PCS Travel Voucher</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Route
            </div>
            <div style={{ fontSize: "15px", color: "#1b1b1b" }}>Fort Bragg, NC → Camp Humphreys, ROK</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#71767a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Status
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff1d2", border: "1px solid #e5a000", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", fontWeight: "700", color: "#7a4f00" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5a000", display: "inline-block" }} />
              Pending Finance Review
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div style={{ background: "white", border: "1px solid #dfe1e2", borderRadius: "4px", padding: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1b1b1b", margin: "0 0 14px 0" }}>
          What happens next
        </h3>
        <ol style={{ margin: 0, padding: "0 0 0 18px", fontSize: "13px", color: "#565c65", lineHeight: "2" }}>
          <li>Your unit Finance Officer will review the voucher within 3–5 business days.</li>
          <li>If additional documentation is required, you will be contacted at your AKO email.</li>
          <li>Upon approval, payment will be deposited to your account on file within 2–3 business days.</li>
          <li>Save confirmation number <strong style={{ color: "#1b1b1b" }}>{confirmNumber}</strong> for your records.</li>
        </ol>
      </div>
    </div>
  )
}
