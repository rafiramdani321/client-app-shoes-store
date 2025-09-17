import { apiFetch } from "@/lib/api";
import { ProductQueryParams } from "@/types/product.type";

export default class ProductsService {
  static async getProducts(params: ProductQueryParams) {
    const qs = new URLSearchParams();
    (Object.entries(params) as [keyof ProductQueryParams, any][]).forEach(
      ([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          qs.append(String(k), String(v));
      }
    );
    const res = await apiFetch(
      `/products?${qs.toString()}`,
      { method: "GET" },  
      { withAuth: false }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || data.error || "Failed fetch products");
    return data.data;
  }

  static async getProductBySlug(slug: string) {
    const res = await apiFetch(
      `/products/slug/${slug}`,
      { method: "GET" },
      { withAuth: false }
    );
    const results = await res.json();
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: results.error || "Failed fetch product",
      };
    }
    return results;
  }
}
