import { IProduct } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card/Card';
import { formatPrice } from '@/utils/format';

interface IProductCardProps {
  product: IProduct;
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
}

export function ProductCard({ product, onEdit, onDelete }: IProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">{product.description}</p>
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="text-blue-500 hover:text-blue-700"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 