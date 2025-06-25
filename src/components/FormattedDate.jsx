const FormattedDate = ({ date, format = "dd-mm-yyyy", locale = "es-ES" }) => {
    if (!date) return "-";
  
    const d = new Date(date);
  
    const pad = (n) => n.toString().padStart(2, "0");
  
    const formats = {
      "dd-mm-yy": `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${String(d.getFullYear()).slice(2)}`,
      "dd-mm-yyyy": `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`,
      "dd-mmm-yyyy": `${pad(d.getDate())}-${d.toLocaleString(locale, { month: "short" })}-${d.getFullYear()}`,
      "larga": d.toLocaleString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    };
  
    return <span>{formats[format] || formats["dd-mm-yyyy"]}</span>;
  };
  
  export default FormattedDate;
  