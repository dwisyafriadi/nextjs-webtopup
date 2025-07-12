// app/(dashboard)/ppob/page.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ppobApi } from "@/lib/api/ppob";
import { Category, Provider, Product } from "@/lib/types";
import { CategoryList } from "@/components/ppob/category-list";
import { ProviderList } from "@/components/ppob/provider-list";
import { ProductList } from "@/components/ppob/product-list";
import { TransactionForm } from "@/components/ppob/transaction-form";
import { toast } from "@/components/ui/toaster";
export default function PPOBPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const category = categories.find((c) => c.slug === categoryParam);
      if (category) {
        handleSelectCategory(category);
      }
    }
  }, [categoryParam, categories]);
  const loadCategories = async () => {
    try {
      const response = await ppobApi.getCategories();
      setCategories(response.categories);
    } catch (error) {
      toast({
        title: "Gagal memuat kategori",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectCategory = async (category: Category) => {
    setSelectedCategory(category);
    setSelectedProvider(null);
    setSelectedProduct(null);
    setProducts([]);
    try {
      const response = await ppobApi.getProvidersByCategory(category.id);
      setProviders(response.providers);
    } catch (error) {
      toast({
        title: "Gagal memuat provider",
        variant: "error",
      });
    }
  };
  const handleSelectProvider = async (provider: Provider) => {
    setSelectedProvider(provider);
    setSelectedProduct(null);
    try {
      const response = await ppobApi.getProductsByProvider(
        provider.id,
        selectedCategory?.id
      );
      setProducts(response.products);
    } catch (error) {
      toast({
        title: "Gagal memuat produk",
        variant: "error",
      });
    }
  };
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else if (selectedProvider) {
      setSelectedProvider(null);
      setProducts([]);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setProviders([]);
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-shimmer rounded" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PPOB</h1>
          <p className="text-gray-500">
            {selectedProduct
              ? "Isi detail transaksi"
              : selectedProvider
              ? "Pilih produk"
              : selectedCategory
              ? "Pilih provider"
              : "Pilih kategori layanan"}
          </p>
        </div>
        {(selectedCategory || selectedProvider || selectedProduct) && (
          <button
            onClick={handleBack}
            className="text-primary-600 hover:underline"
          >
            ← Kembali
          </button>
        )}
      </div>
      {/* Content */}
      {!selectedCategory && (
        <CategoryList
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />
      )}
      {selectedCategory && !selectedProvider && (
        <ProviderList
          providers={providers}
          onSelectProvider={handleSelectProvider}
        />
      )}
      {selectedProvider && !selectedProduct && (
        <ProductList
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      )}
      {selectedProduct && (
        <TransactionForm
          product={selectedProduct}
          provider={selectedProvider}
          category={selectedCategory}
        />
      )}
    </div>
  );
}
// components/ppob/category-list.tsx
import { Category } from "@/lib/types";
import {
  Smartphone,
  Wifi,
  Zap,
  Droplets,
  CreditCard,
  ShoppingBag,
  Gamepad2,
  Phone,
} from "lucide-react";
const categoryIcons: Record<string, any> = {
  pulsa: Smartphone,
  data: Wifi,
  pln: Zap,
  pdam: Droplets,
  emoney: CreditCard,
  voucher: ShoppingBag,
  game: Gamepad2,
  telkom: Phone,
};
interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}
export function CategoryList({
  categories,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = categoryIcons[category.slug] || ShoppingBag;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary-50 p-3 group-hover:bg-primary-100">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <span className="font-medium text-gray-900">{category.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
// components/ppob/provider-list.tsx
import { Provider } from "@/lib/types";
interface ProviderListProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
}
export function ProviderList({
  providers,
  onSelectProvider,
}: ProviderListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onSelectProvider(provider)}
          className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-300"
        >
          <h3 className="font-semibold text-gray-900">{provider.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{provider.brand_code}</p>
        </button>
      ))}
    </div>
  );
}
// components/ppob/product-list.tsx
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}
export function ProductList({ products, onSelectProduct }: ProductListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className="rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-primary-300"
        >
          <h3 className="font-semibold text-gray-900">
            {product.product_name}
          </h3>
          {product.deskripsi && (
            <p className="mt-1 text-sm text-gray-500">{product.deskripsi}</p>
          )}
          <p className="mt-3 text-lg font-bold text-primary-600">
            {formatCurrency(product.final_price)}
          </p>
        </button>
      ))}
    </div>
  );
}
