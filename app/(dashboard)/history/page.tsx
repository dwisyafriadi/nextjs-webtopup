// app/(dashboard)/history/page.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { userApi } from "@/lib/api/user";
import { topupApi } from "@/lib/api/topup";
import { Transaction } from "@/lib/types";
import { TransactionList } from "@/components/history/transaction-list";
import { TopupHistoryList } from "@/components/history/topup-history-list";
import { TransactionDetail } from "@/components/history/transaction-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
export default function HistoryPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction");
  const [ppobTransactions, setPpobTransactions] = useState<Transaction[]>([]);
  const [topupHistory, setTopupHistory] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    transactionId
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    loadHistory();
  }, [currentPage]);
  const loadHistory = async () => {
    setIsLoading(true);
    try {
      // Load PPOB transactions
      const ppobResponse = await userApi.getTransactions(currentPage, 10);
      setPpobTransactions(ppobResponse.transactions);
      setTotalPages(ppobResponse.pagination.pages);
      // Load topup history
      const topupResponse = await topupApi.getHistory(currentPage, 10);
      setTopupHistory(topupResponse.history);
    } catch (error) {
      toast({
        title: "Gagal memuat riwayat",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (selectedTransaction) {
    return (
      <TransactionDetail
        transactionId={selectedTransaction}
        onBack={() => setSelectedTransaction(null)}
      />
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p className="text-gray-500">Lihat semua transaksi Anda</p>
      </div>
      <Tabs defaultValue="ppob" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ppob">PPOB</TabsTrigger>
          <TabsTrigger value="topup">Top Up</TabsTrigger>
        </TabsList>
        <TabsContent value="ppob" className="mt-6">
          <TransactionList
            transactions={ppobTransactions}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSelectTransaction={setSelectedTransaction}
          />
        </TabsContent>
        <TabsContent value="topup" className="mt-6">
          <TopupHistoryList
            history={topupHistory}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
// app/(dashboard)/profile/page.tsx
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { userApi } from "@/lib/api/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { User, Lock, Phone, Mail, Calendar, Hash } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const profileSchema = z.object({
  full_name: z.string().min(3, "Nama minimal 3 karakter"),
  phone_number: z
    .string()
    .regex(/^(08|62)\d{9,12}$/, "Nomor telepon tidak valid"),
});
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password minimal 6 karakter"),
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
    },
  });
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  const handleUpdateProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(data);
      updateUser(response.user);
      toast({
        title: "Profil berhasil diperbarui",
        variant: "success",
      });
      setIsEditingProfile(false);
    } catch (error: any) {
      toast({
        title: "Gagal memperbarui profil",
        description: error.message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await userApi.changePassword(data);
      toast({
        title: "Password berhasil diubah",
        variant: "success",
      });
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Gagal mengubah password",
        description: error.message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-500">Kelola informasi akun Anda</p>
      </div>
      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informasi Profil</CardTitle>
          {!isEditingProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditingProfile ? (
            <form
              onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <Input
                  {...profileForm.register("full_name")}
                  error={profileForm.formState.errors.full_name?.message}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor Telepon</label>
                <Input
                  {...profileForm.register("phone_number")}
                  error={profileForm.formState.errors.phone_number?.message}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" isLoading={isLoading}>
                  Simpan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingProfile(false);
                    profileForm.reset();
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{user?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nomor Telepon</p>
                  <p className="font-medium">{user?.phone_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Kode Referral</p>
                  <p className="font-medium">{user?.referral_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Bergabung Sejak</p>
                  <p className="font-medium">
                    {formatDate(user?.created_at || "")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Change Password */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Keamanan</CardTitle>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Ubah Password
            </Button>
          )}
        </CardHeader>
        {isChangingPassword && (
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Password Lama</label>
                <Input
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  error={passwordForm.formState.errors.currentPassword?.message}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password Baru</label>
                <Input
                  type="password"
                  {...passwordForm.register("newPassword")}
                  error={passwordForm.formState.errors.newPassword?.message}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" isLoading={isLoading}>
                  Ubah Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    passwordForm.reset();
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
