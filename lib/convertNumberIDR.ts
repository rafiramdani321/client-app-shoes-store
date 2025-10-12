export const formatNumber = (value: string) => {
  if (!value) return "";
  return parseInt(value, 10).toLocaleString("id-ID");
};

export const unformatNumber = (value: string) => value.replace(/\./g, "");
