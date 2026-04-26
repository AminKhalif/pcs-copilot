"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const inp: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #565c65",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  backgroundColor: "white",
}

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: "700",
  color: "#1b1b1b",
  marginBottom: "6px",
}

export default function DtsLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const portal = searchParams.get("portal") ?? "clean"
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username === "jsmith" && password === "Army2026!") {
      router.push(portal === "compromised" ? "/mock-dts/compromised" : "/mock-dts/form")
    } else {
      setError("Invalid username or password. Contact your AO if you need assistance.")
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "12px", color: "#71767a", marginBottom: "6px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Defense Travel System
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1b1b1b", margin: "0 0 8px 0" }}>
          Sign in to DTS
        </h1>
        <p style={{ color: "#565c65", fontSize: "14px", margin: 0 }}>
          Use your CAC or DTS credentials to access your travel account.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
        {/* Login form */}
        <div style={{ background: "white", border: "1px solid #dfe1e2", borderRadius: "4px", padding: "28px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1b1b1b", margin: "0 0 20px 0", paddingBottom: "12px", borderBottom: "1px solid #dfe1e2" }}>
            DTS Username &amp; Password
          </h2>

          {error && (
            <div style={{ background: "#fff3f3", border: "1px solid #b50909", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#b50909" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="username" style={lbl}>DTS Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={inp}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="password" style={lbl}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inp}
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              style={{
                background: "#005ea2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                width: "100%",
                fontFamily: "inherit",
              }}
            >
              Sign In
            </button>
          </form>

          <p style={{ marginTop: "14px", fontSize: "12px", color: "#71767a" }}>
            Forgot password? Contact your Finance Office or call 1-888-435-7146.
          </p>
        </div>

        {/* Info panel */}
        <div>
          <div style={{ background: "white", border: "1px solid #dfe1e2", borderRadius: "4px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#1b1b1b", marginBottom: "8px" }}>
              System Notice
            </div>
            <p style={{ fontSize: "13px", color: "#565c65", margin: 0, lineHeight: "1.5" }}>
              DTS is authorized for official DoD travel only. All activity is monitored and recorded. Unauthorized use is prohibited under 18 U.S.C. § 1030.
            </p>
          </div>
          <div style={{ background: "#e7f3fa", border: "1px solid #99c4e6", borderRadius: "4px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a4480", marginBottom: "6px" }}>
              PCS Travel Vouchers (DD 1351-2)
            </div>
            <p style={{ fontSize: "13px", color: "#1a4480", margin: 0, lineHeight: "1.5" }}>
              Submit your PCS travel voucher within 5 days of arrival at your new duty station to claim authorized entitlements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
