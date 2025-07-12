// components/dashboard/header.tsx - Fixed version
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useUserStore } from "@/lib/store/user";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { RefreshCw } from "lucide-react";
export function Header() {
  const user = useAuthStore((state) => state.user);
  const { balance, isRefreshing, refreshBalance } = useUserStore();
  useEffect(() => {
    if (user) {
      refreshBalance();
    }
  }, [user, refreshBalance]);
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="ml-12 lg:ml-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Halo, {user?.full_name || "User"}!
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Saldo Anda</p>
            <p className="text-lg font-semibold text-primary-600">
              {formatCurrency(balance)}
            </p>
          </div>
          <button
            onClick={refreshBalance}
            disabled={isRefreshing}
            className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={20}
              className={cn("text-gray-600", isRefreshing && "animate-spin")}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
