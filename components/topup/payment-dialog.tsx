// components/topup/payment-dialog.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { topupApi } from "@/lib/api/topup";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { CheckCircle, Clock, Copy, ExternalLink } from "lucide-react";
interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any;
}
export function PaymentDialog({
  isOpen,
  onClose,
  paymentData,
}: PaymentDialogProps) {
  const router = useRouter();
  const refreshBalance = useUserStore((state) => state.refreshBalance);
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );
  const [isChecking, setIsChecking] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Start checking payment status
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  const checkPaymentStatus = async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const response = await topupApi.checkPaymentStatus(paymentData.orderId);
      if (response.status === "PAID" || response.status === "SUCCESS") {
        setStatus("success");
        refreshBalance();
        toast({
          title: "Pembayaran berhasil!",
          description: "Saldo Anda telah ditambahkan",
          variant: "success",
        });
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
    } finally {
      setIsChecking(false);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      variant: "success",
    });
  };
  if (status === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pembayaran Berhasil!</h3>
            <p className="text-gray-600">
              Saldo sebesar {formatCurrency(paymentData.amount)} telah
              ditambahkan
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Selesaikan Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Selesaikan pembayaran sebelum{" "}
                {new Date(paymentData.expiresAt).toLocaleTimeString("id-ID")}
              </span>
            </div>
          </div>
          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(paymentData.totalAmount)}
            </p>
          </div>
          {/* Payment Instructions */}
          {paymentData.payment.qrString && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Scan QR Code:</p>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      paymentData.payment.qrString
                    )}`}
                    alt="QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">
                Scan menggunakan aplikasi e-wallet Anda
              </p>
            </div>
          )}
          {paymentData.payment.vaNumber && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Virtual Account Number:</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 font-mono text-lg">
                  {paymentData.payment.vaNumber}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(paymentData.payment.vaNumber)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {paymentData.payment.paymentUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open(paymentData.payment.paymentUrl, "_blank")
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Buka Halaman Pembayaran
            </Button>
          )}
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={checkPaymentStatus}
              isLoading={isChecking}
            >
              Cek Status
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onClose();
                router.push("/history");
              }}
            >
              Lihat Riwayat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
