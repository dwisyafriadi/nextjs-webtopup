// components/auth/register-form.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { Eye, EyeOff } from "lucide-react";
const registerSchema = z
  .object({
    full_name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    phone_number: z
      .string()
      .regex(/^(08|62)\d{9,12}$/, "Nomor telepon tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
    referral_code: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
type RegisterFormData = z.infer<typeof registerSchema>;
export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await authApi.register(registerData);
      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan cek email Anda untuk verifikasi",
        variant: "success",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Pendaftaran gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nama Lengkap
        </label>
        <Input
          id="full_name"
          placeholder="John Doe"
          {...register("full_name")}
          error={errors.full_name?.message}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone_number" className="text-sm font-medium">
          Nomor Telepon
        </label>
        <Input
          id="phone_number"
          placeholder="081234567890"
          {...register("phone_number")}
          error={errors.phone_number?.message}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="******"
            {...register("password")}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Konfirmasi Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="******"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="referral_code" className="text-sm font-medium">
          Kode Referral (Opsional)
        </label>
        <Input
          id="referral_code"
          placeholder="Masukkan kode referral"
          {...register("referral_code")}
          error={errors.referral_code?.message}
        />
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Daftar
      </Button>
    </form>
  );
}
