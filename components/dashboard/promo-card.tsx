// components/dashboard/promo-card.tsx
export function PromoCard() {
  return (
    <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Promo Spesial!</h3>
            <p className="mb-4">
              Dapatkan cashback 10% untuk setiap transaksi pulsa dan paket data
            </p>
            <p className="text-sm opacity-90">
              Berlaku hingga 31 Desember 2024
            </p>
          </div>
          <div className="text-6xl opacity-20">🎉</div>
        </div>
      </CardContent>
    </Card>
  );
}
