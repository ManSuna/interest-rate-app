const formatRate = (v) => {
  if (v === null || v === undefined || v === "") return "";

  let str = v.toString();

  // If no decimal point, add .00
  if (!str.includes(".")) {
    return str + ".00";
  }

  const parts = str.split(".");
  const decimals = parts[1] || "";

  if (decimals.length === 0) {
    return str + "00";   // "1." -> "1.00"
  } else if (decimals.length === 1) {
    return str + "0";    // "1.2" -> "1.20"
  } else {
    return str;          // "1.1234" -> "1.1234"
  }
};