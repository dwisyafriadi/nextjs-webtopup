// components/topup/topup-summary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
interface TopUpSummaryProps {
  amount: number;
  paymentMethod: PaymentMethod | null;
  onTopUp: () => void;
}
export function TopUpSummary({
  amount,
  paymentMethod,
  onTopUp,
}: TopUpSummaryProps) {
  const getMethodFee = () => {
    if (!paymentMethod || !amount) return 0;
    if (paymentMethod.fee < 100) {
      // Percentage fee
      return Math.ceil((amount * paymentMethod.fee) / 100);
    }
    return paymentMethod.fee;
  };
  const systemFee = Math.ceil(amount * 0.01); // 1% system fee
  const totalAmount = amount + getMethodFee() + systemFee;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nominal</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          {paymentMethod && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Biaya {paymentMethod.name}
                </span>
                <span className="font-medium">
                  {formatCurrency(getMethodFee())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{formatCurrency(systemFee)}</span>
              </div>
            </>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(paymentMethod ? totalAmount : amount)}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={onTopUp}
          className="w-full"
          disabled={!amount || !paymentMethod}
        >
          Lanjutkan Pembayaran
        </Button>
        <p className="text-xs text-center text-gray-500">
          Dengan melanjutkan, Anda setuju dengan syarat dan ketentuan yang
          berlaku
        </p>
      </CardContent>
    </Card>
  );
}
