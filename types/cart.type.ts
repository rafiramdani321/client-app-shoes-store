export interface CreateCartType {
  product_id: string;
  product_size_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartItemType {
  id: string;
  cart_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    title: string;
    slug: string;
    is_active: boolean;
    price: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    subcategory_id: {
      id: string;
      name: string;
      slug: string;
    };
    ProductImage: {
      id: string;
      fileId: string;
      url: string;
    }[];
  };
  product_size: {
    id: string;
    stock: number;
    size: {
      id: string;
      size: string;
    };
  };
}

export interface CartsListType {
  id: string;
  user_id: string;
  CartItem: CartItemType[];
}
