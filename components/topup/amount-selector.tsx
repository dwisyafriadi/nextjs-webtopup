// components/topup/amount-selector.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TopUpOption } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
interface AmountSelectorProps {
  options: TopUpOption[];
  selectedAmount: number;
  onSelectAmount: (amount: number) => void;
  minAmount: number;
  maxAmount: number;
}
export function AmountSelector({
  options,
  selectedAmount,
  onSelectAmount,
  minAmount,
  maxAmount,
}: AmountSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Nominal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset amounts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map((option) => (
            <button
              key={option.amount}
              onClick={() => onSelectAmount(option.amount)}
              className={cn(
                "relative rounded-lg border-2 p-4 text-center transition-all",
                selectedAmount === option.amount
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {option.popular && (
                <span className="absolute -top-2 -right-2 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                  Populer
                </span>
              )}
              <p className="font-semibold text-gray-900">{option.label}</p>
            </button>
          ))}
        </div>
        {/* Custom amount */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Atau masukkan nominal lain
          </label>
          <Input
            type="number"
            placeholder={`Min. ${formatCurrency(minAmount)}`}
            value={selectedAmount || ""}
            onChange={(e) => onSelectAmount(parseInt(e.target.value) || 0)}
            min={minAmount}
            max={maxAmount}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-gray-500">
            Min. {formatCurrency(minAmount)} - Maks. {formatCurrency(maxAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
