// components/dashboard/recent-transactions.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userApi } from "@/lib/api/user";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadTransactions();
  }, []);
  const loadTransactions = async () => {
    try {
      const response = await userApi.getTransactions(1, 5);
      setTransactions(response.transactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusColor = (status: Transaction["tx_status"]) => {
    switch (status) {
      case "sukses":
        return "text-green-600 bg-green-50";
      case "gagal":
        return "text-red-600 bg-red-50";
      case "pending":
      case "processing":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const getStatusText = (status: Transaction["tx_status"]) => {
    switch (status) {
      case "sukses":
        return "Berhasil";
      case "gagal":
        return "Gagal";
      case "pending":
      case "processing":
        return "Diproses";
      default:
        return status;
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaksi Terakhir</CardTitle>
        <Link
          href="/history"
          className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
        >
          Lihat semua
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-shimmer rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {transaction.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.target_number}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(transaction.total_price)}
                  </p>
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-1 text-xs font-medium",
                      getStatusColor(transaction.tx_status)
                    )}
                  >
                    {getStatusText(transaction.tx_status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
