export interface SubCategoryBaseType {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryBaseType {
  name: string;
  slug: string;
  SubCategory: SubCategoryBaseType;
}

export interface CategoryList extends CategoryBaseType {
  id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
