export interface Product {
  id: number | string;
  name: string;
  description?: string;
  category: number;
  category_name?: string;
  price: number;
  stock: number;
  image_url?: string;
  active: boolean;
}