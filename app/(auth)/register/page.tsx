// app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Daftar</CardTitle>
        <CardDescription>Buat akun Eceran TopUp baru</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <Link href="/login" className="text-primary-600 hover:underline">
            Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
