
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulação de login
    setTimeout(() => {
      login();
      toast({
        title: "Login bem-sucedido!",
        description: "Você será redirecionado para o dashboard.",
      });
      router.push('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="/imagem login.png"
        alt="Paisagem de uma fazenda ao amanhecer"
        layout="fill"
        objectFit="cover"
        className="-z-10"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Image src="/Icone DOIS.png" alt="DOIS Logo" width={80} height={80} />
            </div>
            <CardTitle className="text-2xl font-headline">Acessar o Sistema</CardTitle>
            <CardDescription>Use suas credenciais para entrar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
