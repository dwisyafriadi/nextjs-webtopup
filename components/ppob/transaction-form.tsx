// components/ppob/transaction-form.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, Provider, Category } from "@/lib/types";
import { ppobApi } from "@/lib/api/ppob";
import { useUserStore } from "@/lib/store/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils/format";
import { AlertCircle } from "lucide-react";
const schema = z.object({
  target_number: z.string().min(1, "Nomor tujuan harus diisi"),
});
type FormData = z.infer<typeof schema>;
interface TransactionFormProps {
  product: Product;
  provider: Provider | null;
  category: Category | null;
}
export function TransactionForm({
  product,
  provider,
  category,
}: TransactionFormProps) {
  const router = useRouter();
  const { balance, refreshBalance } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: FormData) => {
    if (balance < product.final_price) {
      toast({
        title: "Saldo tidak cukup",
        description: "Silakan top up terlebih dahulu",
        variant: "error",
      });
      return;
    }
    setShowConfirmation(true);
  };
  const processTransaction = async (targetNumber: string) => {
    setIsProcessing(true);
    try {
      // Create transaction
      const txResponse = await ppobApi.createTransaction({
        product_id: product.id,
        target_number: targetNumber,
      });
      const transactionId = txResponse.transaction.transaction_id;
      // Process payment with balance
      const paymentResponse = await ppobApi.createPayment({
        transaction_id: transactionId,
        payment_method: "balance",
      });
      if (paymentResponse.success) {
        toast({
          title: "Transaksi berhasil dibuat",
          description: "Transaksi sedang diproses",
          variant: "success",
        });
        // Refresh balance
        refreshBalance();
        // Redirect to transaction detail
        router.push(`/history?transaction=${transactionId}`);
      }
    } catch (error: any) {
      toast({
        title: "Transaksi gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
    }
  };
  const getPlaceholder = () => {
    if (category?.slug === "pln") {
      return "Masukkan nomor meter/ID pelanggan";
    } else if (category?.slug === "pulsa" || category?.slug === "data") {
      return "Masukkan nomor HP (08xx)";
    } else if (category?.slug === "emoney") {
      return "Masukkan nomor e-wallet";
    }
    return "Masukkan nomor tujuan";
  };
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Produk</label>
                <div className="mt-1 rounded-lg bg-gray-50 p-4">
                  <p className="font-semibold">{product.product_name}</p>
                  <p className="text-sm text-gray-500">{provider?.name}</p>
                </div>
              </div>
              <div>
                <label htmlFor="target_number" className="text-sm font-medium">
                  Nomor Tujuan
                </label>
                <Input
                  id="target_number"
                  placeholder={getPlaceholder()}
                  {...register("target_number")}
                  error={errors.target_number?.message}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Harga</label>
                <div className="mt-1 text-2xl font-bold text-primary-600">
                  {formatCurrency(product.final_price)}
                </div>
              </div>
              {balance < product.final_price && (
                <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">
                    Saldo tidak cukup. Saldo Anda: {formatCurrency(balance)}
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing || balance < product.final_price}
                isLoading={isProcessing}
              >
                Lanjutkan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Produk</span>
              <span className="font-medium">{product.product_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Provider</span>
              <span className="font-medium">{provider?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Harga</span>
              <span className="font-medium">
                {formatCurrency(product.price)}
              </span>
            </div>
            {(product.markup_value > 0 || product.markup_percent > 0) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">
                  {formatCurrency(product.final_price - product.price)}
                </span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(product.final_price)}
                </span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saldo Anda</span>
                <span className="font-medium">{formatCurrency(balance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sisa Saldo</span>
                <span className="font-medium">
                  {formatCurrency(Math.max(0, balance - product.final_price))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          product={product}
          targetNumber={register("target_number").value}
          onConfirm={() => processTransaction(register("target_number").value)}
          onCancel={() => setShowConfirmation(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
// Confirmation Dialog Component
interface ConfirmationDialogProps {
  product: Product;
  targetNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}
function ConfirmationDialog({
  product,
  targetNumber,
  onConfirm,
  onCancel,
  isProcessing,
}: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Konfirmasi Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Anda akan melakukan transaksi:
          </p>
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Produk</span>
              <span className="font-medium">{product.product_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nomor Tujuan</span>
              <span className="font-medium">{targetNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-primary-600">
                {formatCurrency(product.final_price)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Transaksi tidak dapat dibatalkan setelah diproses.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={onConfirm}
              isLoading={isProcessing}
              className="flex-1"
            >
              Konfirmasi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
