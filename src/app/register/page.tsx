"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function describeFirebaseError(error: unknown): string {
  const code = (error as AuthError | undefined)?.code;
  switch (code) {
    case "auth/email-already-in-use":
      return "Ese email ya está registrado. Intenta iniciar sesión.";
    case "auth/invalid-email":
      return "El formato del email no es válido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/network-request-failed":
      return "Sin conexión con Firebase. Revisa tu red.";
    default:
      return "No se pudo crear la cuenta. Inténtalo de nuevo.";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (error) {
      setLoading(false);
      toast.error(describeFirebaseError(error));
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.message("Cuenta creada. Inicia sesión para acceder al panel.");
      router.push("/login");
      return;
    }

    toast.success("Cuenta creada. ¡Bienvenido!");
    router.push("/panel");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="font-heading text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Tu identidad se registra en Firebase Auth y se valida vía NextAuth.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Repite la contraseña</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Crear cuenta
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
