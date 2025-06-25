const DevBanner = () => {
    if (process.env.NODE_ENV !== "development") return null;
  
    return (
      <div style={bannerStyle}>
        🧪 Modo Desarrollo Activo
      </div>
    );
  };
  
  const bannerStyle = {
    position: "fixed",
    top: "10px",
    right: "10px",
    backgroundColor: "#ffcc00",
    color: "#000",
    padding: "6px 12px",
    borderRadius: "5px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  };
  
  export default DevBanner;
  