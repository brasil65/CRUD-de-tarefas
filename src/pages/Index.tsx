"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { ListTodo, Plus, Trash2, CheckCircle2, Circle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Interface de uma tarefa.
 */
interface Task {
  id: string;
  title: string;
  status: "pending" | "completed";
  created_at: string;
}

/**
 * Tela principal do aplicativo.
 * Exibe lista de tarefas e permite criar novas.
 */
const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Busca tarefas do banco de dados.
   */
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showError("Erro ao carregar tarefas");
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  /**
   * Cria uma nova tarefa no banco.
   */
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setSaving(true);
    const { error } = await supabase.from("tasks").insert({
      title: newTask.trim(),
      status: "pending",
    });

    setSaving(false);

    if (error) {
      showError("Erro ao criar tarefa");
    } else {
      showSuccess("Tarefa criada!");
      setNewTask("");
      fetchTasks();
    }
  };

  /**
   * Alterna o status da tarefa entre pendente e concluída.
   */
  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      showError("Erro ao atualizar tarefa");
    } else {
      fetchTasks();
    }
  };

  /**
   * Remove uma tarefa do banco.
   */
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      showError("Erro ao remover tarefa");
    } else {
      showSuccess("Tarefa removida");
      fetchTasks();
    }
  };

  /**
   * Faz logout do usuário.
   */
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Erro ao sair");
    } else {
      showSuccess("Até logo!");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <ListTodo className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Minhas Tarefas
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {user?.email?.split("@")[0]}
              </span>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Formulário de nova tarefa */}
        <form onSubmit={createTask} className="flex gap-2">
          <Input
            placeholder="O que você precisa fazer?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={saving || !newTask.trim()}
            className="h-12 px-4 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                <Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pendingTasks.length}
                </p>
                <p className="text-xs text-slate-500">Pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedTasks.length}
                </p>
                <p className="text-xs text-slate-500">Concluídas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tarefas pendentes */}
        {pendingTasks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Pendentes
            </h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="flex-shrink-0"
                  >
                    <Circle className="h-6 w-6 text-slate-400 hover:text-primary transition-colors" />
                  </button>
                  <span className="flex-1 text-slate-900 dark:text-white">
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lista de tarefas concluídas */}
        {completedTasks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Concluídas
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 group"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="flex-shrink-0"
                  >
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </button>
                  <span className="flex-1 text-slate-500 line-through">
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Estado vazio */}
        {tasks.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Nenhuma tarefa ainda
            </h3>
            <p className="text-slate-500">
              Adicione sua primeira tarefa acima para começar!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;