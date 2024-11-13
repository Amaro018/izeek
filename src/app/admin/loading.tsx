export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={styles.loadingDots}>
        <div style={{ ...styles.loadingDot, animationDelay: "0s" }}></div>
        <div style={{ ...styles.loadingDot, animationDelay: "0.2s" }}></div>
        <div style={{ ...styles.loadingDot, animationDelay: "0.4s" }}></div>
      </div>
    </div>
  )
}

const styles = {
  loadingDots: {
    display: "flex",
    gap: "0.25rem",
  },
  loadingDot: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    backgroundColor: "#333",
    animation: "loading 0.7s ease-in-out infinite",
  },
}
