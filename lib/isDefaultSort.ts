export const isDefaultSort = (params: URLSearchParams) => {
  const sortBy = params.get("sortBy") || "created_at";
  const sortOrder = params.get("sortOrder") || "desc";
  return sortBy === "created_at" && sortOrder === "desc";
};
