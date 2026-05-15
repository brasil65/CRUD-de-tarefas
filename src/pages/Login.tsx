"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center text-center space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')} 
            className="self-start -ml-4 mb-4 text-slate-500 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 mb-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo ao FlowTasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Faça login para salvar suas tarefas na nuvem</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
                radii: {
                  buttonRadius: '12px',
                  inputRadius: '12px',
                }
              }
            }
          }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                button_label: 'Entrar',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                button_label: 'Cadastrar',
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;