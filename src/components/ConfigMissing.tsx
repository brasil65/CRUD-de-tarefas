"use client";

import React from "react";
import { KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ConfigMissing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-xl rounded-3xl overflow-hidden p-2">
        <CardHeader className="pb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl mb-4">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-black text-slate-900 dark:text-white">
            Configuração Pendente
          </CardTitle>
          <CardDescription>
            O aplicativo foi carregado, mas as variáveis de ambiente do Supabase ainda não foram configuradas na hospedagem.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> Como resolver na Vercel:
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 font-medium">
              <li>Acesse o painel do seu projeto na Vercel.</li>
              <li>Vá em <strong className="text-slate-800 dark:text-slate-200">Settings</strong> > <strong className="text-slate-800 dark:text-slate-200">Environment Variables</strong>.</li>
              <li>Adicione as chaves:
                <code className="block bg-white dark:bg-slate-950 px-2 py-1 rounded-md text-xs font-mono mt-1 text-primary">VITE_SUPABASE_URL</code>
                <code className="block bg-white dark:bg-slate-950 px-2 py-1 rounded-md text-xs font-mono mt-1 text-primary">VITE_SUPABASE_ANON_KEY</code>
              </li>
              <li>Salve e faça um <strong className="text-slate-800 dark:text-slate-200">Redeploy</strong> do projeto.</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Suas chaves continuam 100% seguras e ocultas do GitHub!</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};