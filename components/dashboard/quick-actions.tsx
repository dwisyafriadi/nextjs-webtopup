// components/dashboard/quick-actions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Smartphone,
  Wifi,
  Zap,
  Droplets,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
const actions = [
  {
    name: "Pulsa",
    icon: Smartphone,
    href: "/ppob?category=pulsa",
    color: "bg-blue-500",
  },
  {
    name: "Paket Data",
    icon: Wifi,
    href: "/ppob?category=data",
    color: "bg-green-500",
  },
  {
    name: "Listrik PLN",
    icon: Zap,
    href: "/ppob?category=pln",
    color: "bg-yellow-500",
  },
  {
    name: "PDAM",
    icon: Droplets,
    href: "/ppob?category=pdam",
    color: "bg-cyan-500",
  },
  {
    name: "E-Money",
    icon: CreditCard,
    href: "/ppob?category=emoney",
    color: "bg-purple-500",
  },
  {
    name: "Voucher",
    icon: ShoppingBag,
    href: "/ppob?category=voucher",
    color: "bg-pink-500",
  },
];
export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Layanan Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div
                className={`${action.color} rounded-lg p-3 text-white group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
