"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrandPanel } from "@/components/auth/brand-panel";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(20, "Username não pode ter mais de 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Password deve ter pelo menos 8 caracteres"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterValues) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      form.setError("root", { message: data.error ?? "Erro ao criar conta" });
      return;
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-bg">
        <BrandPanel />

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="form-enter w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-9 h-9 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/platinum192.png"
                  alt="Platinum"
                  width={36}
                  height={36}
                />
              </div>
              <span className="font-semibold text-silver">Platinum</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Criar conta</h2>
              <p className="text-silver-dim text-sm mt-1.5">
                Já tens conta?{" "}
                <Link
                  href="/login"
                  className="text-purple-light hover:text-white transition-colors underline underline-offset-2"
                >
                  Entrar
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] uppercase tracking-widest text-silver-dim">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="mtx"
                          className="bg-bg-card border-border h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] uppercase tracking-widest text-silver-dim">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="mtx@gmail.com"
                          className="bg-bg-card border-border h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] uppercase tracking-widest text-silver-dim">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-bg-card border-border h-11 pr-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dim hover:text-silver transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
                    <p className="text-sm text-red-400">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 font-semibold tracking-wide"
                >
                  {form.formState.isSubmitting
                    ? "A criar conta..."
                    : "Criar conta"}
                </Button>
              </form>
            </Form>

          </div>
        </div>
      </div>
  );
}