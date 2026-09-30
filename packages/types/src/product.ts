export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
}