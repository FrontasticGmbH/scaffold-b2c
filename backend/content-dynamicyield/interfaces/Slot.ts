export interface Slot {
  sku: string;
  productData: {
    price: number;
    name: string;
    description: string;
    url: string;
    image_url: string;
    categories: string[];
    group_id: string;
  };
}
