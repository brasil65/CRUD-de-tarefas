"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import { ListTodo, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
}

type FilterStatus = "all" | "pending" | "completed";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const fetchTasks = async () => {
    // Busca todas as tarefas (as políticas de RLS do Supabase ainda se aplicam se houver usuário)
    const query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTasks();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">FlowTasks</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Produtividade</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-8">
        {/* Formulário de Nova Tarefa */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Planejar meu dia</h2>
          </div>
          <TaskForm onTaskCreated={fetchTasks} />
        </section>

        {/* Filtros e Lista */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tarefas</h2>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {tasks.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {completedCount} de {tasks.length} concluídas
              </p>
            </div>
            
            <Tabs defaultValue="all" className="w-full" onValueChange={(val) => setFilter(val as FilterStatus)}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 h-11 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Todas</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Pendentes</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Feitas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
              ))
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm animate-in fade-in duration-500">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-7 w-7 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Nada por aqui</h3>
                <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                  {filter === "all" 
                    ? "Sua lista de tarefas está vazia. Que tal começar agora?" 
                    : `Não há tarefas ${filter === "pending" ? "pendentes" : "concluídas"} no momento.`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;