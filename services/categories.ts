import { apiFetch } from "@/lib/api";
import { CategoryQueryParams } from "@/types/dashboad.admin.type";

export default class CategoriesSerive {
  static async getCategories(params: CategoryQueryParams) {
    const qs = new URLSearchParams();
    (Object.entries(params) as [keyof CategoryQueryParams, any][]).forEach(
      ([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          qs.append(String(k), String(v));
      }
    );
    const res = await apiFetch(
      `/categories?${qs.toString()}`,
      { method: "GET" },
      { withAuth: false }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed fetch categories");
    return data.data;
  }

  static async getCategoryById(id: string) {
    const res = await apiFetch(
      `/categories/${id}`,
      {
        method: "GET",
      },
      { withAuth: false }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed fetch category by id");
    return data.data;
  }
}
