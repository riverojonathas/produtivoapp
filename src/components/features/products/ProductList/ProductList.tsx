import { IProduct } from '@/types/product';
import { ProductCard } from '../ProductCard/ProductCard';

interface IProductListProps {
  products: IProduct[];
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
}

export function ProductList({ products, onEdit, onDelete }: IProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 