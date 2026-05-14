"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import StatsDashboard from "@/components/StatsDashboard";
import { ListTodo, Filter, Search, Trash2, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  created_at: string;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "due">("created");

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order(sortBy === "created" ? "created_at" : "due_date", { ascending: false, nullsFirst: false });

    if (!error && data) setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user, sortBy]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completed = tasks.filter(t => t.status === 'completed').length;

  if (authLoading && loading) return <div className="p-8"><Skeleton className="h-40 w-full rounded-3xl" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg"><ListTodo className="h-5 w-5" /></div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">FlowTasks</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <StatsDashboard total={tasks.length} completed={completed} pending={tasks.length - completed} />

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar tarefas..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm"
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1"><div className="h-4 w-1 bg-primary rounded-full" /><h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Planejar meu dia</h2></div>
          <TaskForm onTaskCreated={fetchTasks} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <Tabs defaultValue="all" className="w-[180px]" onValueChange={setFilter}>
              <TabsList className="bg-slate-200/50 dark:bg-slate-900 h-9 rounded-lg p-1">
                <TabsTrigger value="all" className="text-[10px] uppercase font-bold">Tudo</TabsTrigger>
                <TabsTrigger value="pending" className="text-[10px] uppercase font-bold">Faltam</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setSortBy(sortBy === "created" ? "due" : "created")} className="h-8 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> {sortBy === "created" ? "Criação" : "Prazo"}
              </Button>
              {completed > 0 && (
                <Button variant="ghost" size="sm" onClick={async () => { await supabase.from("tasks").delete().eq("status", "completed"); fetchTasks(); }} className="h-8 text-[10px] font-bold uppercase tracking-wider text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {loading ? <Skeleton className="h-20 w-full rounded-2xl" /> : filteredTasks.map(task => <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />)}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;