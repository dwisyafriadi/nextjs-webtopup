import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { useUserStore } from "@/lib/store/user";
import { ArrowUpRight, History } from "lucide-react";
import Link from "next/link";
export function BalanceCard() {
  const balance = useUserStore((state) => state.balance);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo Utama</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild>
            <Link href="/topup">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Top Up
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/history">
              <History className="mr-2 h-4 w-4" />
              Riwayat
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
