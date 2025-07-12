// app/(dashboard)/topup/page.tsx
import { useState, useEffect } from "react";
import { topupApi } from "@/lib/api/topup";
import { TopUpOption, PaymentMethod } from "@/lib/types";
import { AmountSelector } from "@/components/topup/amount-selector";
import { PaymentMethodSelector } from "@/components/topup/payment-method-selector";
import { TopUpSummary } from "@/components/topup/topup-summary";
import { PaymentDialog } from "@/components/topup/payment-dialog";
import { toast } from "@/components/ui/toaster";
export default function TopUpPage() {
  const [options, setOptions] = useState<{
    amounts: TopUpOption[];
    paymentMethods: PaymentMethod[];
    minAmount: number;
    maxAmount: number;
  } | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  useEffect(() => {
    loadOptions();
  }, []);
  const loadOptions = async () => {
    try {
      const data = await topupApi.getOptions();
      setOptions(data);
    } catch (error) {
      toast({
        title: "Gagal memuat opsi",
        description: "Silakan coba lagi",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleTopUp = async () => {
    if (!selectedAmount || !selectedMethod) {
      toast({
        title: "Lengkapi data",
        description: "Pilih nominal dan metode pembayaran",
        variant: "error",
      });
      return;
    }
    try {
      const response = await topupApi.createTopup({
        amount: selectedAmount,
        paymentMethod: selectedMethod.code,
      });
      setPaymentData(response.data);
      setShowPaymentDialog(true);
    } catch (error: any) {
      toast({
        title: "Gagal membuat pembayaran",
        description: error.message,
        variant: "error",
      });
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-shimmer rounded" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 animate-shimmer rounded-lg" />
            <div className="h-64 animate-shimmer rounded-lg" />
          </div>
          <div className="h-64 animate-shimmer rounded-lg" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Up Saldo</h1>
        <p className="text-gray-500">Tambah saldo untuk transaksi PPOB</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Selection */}
          <AmountSelector
            options={options?.amounts || []}
            selectedAmount={selectedAmount}
            onSelectAmount={setSelectedAmount}
            minAmount={options?.minAmount || 10000}
            maxAmount={options?.maxAmount || 5000000}
          />
          {/* Payment Method Selection */}
          <PaymentMethodSelector
            methods={options?.paymentMethods || []}
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            amount={selectedAmount}
          />
        </div>
        {/* Summary */}
        <div>
          <TopUpSummary
            amount={selectedAmount}
            paymentMethod={selectedMethod}
            onTopUp={handleTopUp}
          />
        </div>
      </div>
      {/* Payment Dialog */}
      {showPaymentDialog && paymentData && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          paymentData={paymentData}
        />
      )}
    </div>
  );
}
