// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
        <CardDescription>Masuk ke akun Eceran TopUp Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Belum punya akun? </span>
          <Link href="/register" className="text-primary-600 hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
