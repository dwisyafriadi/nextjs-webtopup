// components/topup/payment-method-selector.tsx
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  amount: number;
}
export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelectMethod,
  amount,
}: PaymentMethodSelectorProps) {
  const getMethodFee = (method: PaymentMethod) => {
    if (method.fee < 100) {
      // Percentage fee
      return Math.ceil((amount * method.fee) / 100);
    }
    return method.fee;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.code}
            onClick={() => onSelectMethod(method)}
            className={cn(
              "w-full rounded-lg border-2 p-4 text-left transition-all",
              selectedMethod?.code === method.code
                ? "border-primary-600 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {method.image ? (
                  <Image
                    src={method.image}
                    alt={method.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-200" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
              {amount > 0 && (
                <p className="text-sm text-gray-500">
                  Biaya: {formatCurrency(getMethodFee(method))}
                </p>
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
