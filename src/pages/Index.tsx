"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { ListTodo, Plus, Trash2, Check, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Task {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

/**
 * Tela principal do aplicativo.
 * Exibe lista de tarefas e permite criar, concluir e excluir.
 */
const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setSaving(true);
    const { error } = await supabase.from("tasks").insert([
      {
        title: newTask.trim(),
        status: "pending",
      },
    ]);

    setSaving(false);
    if (error) {
      showError("Erro ao criar tarefa");
    } else {
      showSuccess("Tarefa adicionada!");
      setNewTask("");
      fetchTasks();
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
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

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      showError("Erro ao remover tarefa");
    } else {
      showSuccess("Tarefa removida");
      fetchTasks();
    }
  };

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
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                FlowTasks
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Minhas Tarefas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-[80px] truncate">
                {user?.email?.split("@")[0]}
              </span>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-xl h-10 w-10 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {tasks.length}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-amber-500">{pendingTasks.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pendentes
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {completedTasks.length}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Concluídas
            </p>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            placeholder="Adicionar nova tarefa..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 h-12 rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={saving || !newTask.trim()}
            className="h-12 w-12 rounded-xl p-0 shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Pendentes ({pendingTasks.length})
            </h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-center transition-colors"
                  >
                    {task.status === "completed" && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </button>
                  <p className="flex-1 text-slate-700 dark:text-slate-200">
                    {task.title}
                  </p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Concluídas ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="h-6 w-6 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-white" />
                  </button>
                  <p className="flex-1 text-slate-400 dark:text-slate-500 line-through">
                    {task.title}
                  </p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ListTodo className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-1">
              Nenhuma tarefa ainda
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Adicione sua primeira tarefa acima!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;