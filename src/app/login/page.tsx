"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons/github";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/panel";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  // Credenciales de la cuenta de demostración (solo lectura). Son públicas a
  // propósito: permiten al cliente probar la capa de usuario en un clic.
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

  async function signInWithCredentials(credEmail: string, credPassword: string) {
    const res = await signIn("credentials", {
      email: credEmail,
      password: credPassword,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Credenciales incorrectas o usuario inexistente.");
      return false;
    }
    toast.success("Sesión iniciada correctamente.");
    router.push(callbackUrl);
    router.refresh();
    return true;
  }

  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setLoading(true);
    await signInWithCredentials(email, password);
    setLoading(false);
  }

  async function handleDemoSignIn() {
    if (!demoEmail || !demoPassword) return;
    setDemoLoading(true);
    await signInWithCredentials(demoEmail, demoPassword);
    setDemoLoading(false);
  }

  function handleGithubSignIn() {
    setOauthLoading(true);
    signIn("github", { callbackUrl });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="font-heading text-2xl">Acceso al panel</CardTitle>
        <CardDescription>
          Carpintería Los Artesanos · gestión interna
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGithubSignIn}
          disabled={oauthLoading}
        >
          {oauthLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GithubIcon className="size-4" />
          )}
          Continuar con GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              o con credenciales
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </Button>
        </form>

        {demoEmail && demoPassword && (
          <div className="space-y-2 rounded-lg border border-dashed bg-muted/40 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              ¿Solo quieres echar un vistazo? Entra en el panel en modo
              demostración (solo lectura).
            </p>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleDemoSignIn}
              disabled={demoLoading}
            >
              {demoLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Eye className="size-4" />
              )}
              Entrar como demostración
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Cargando…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
