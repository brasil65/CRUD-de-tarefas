"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsDashboardProps {
  total: number;
  completed: number;
  pending: number;
}

const StatsDashboard = ({ total, completed, pending }: StatsDashboardProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <Card className="col-span-2 p-5 rounded-3xl border-none bg-gradient-to-br from-primary to-slate-800 text-white shadow-xl shadow-primary/20 overflow-hidden relative">
        <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Progresso Geral</p>
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-4xl font-black">{percentage}%</h3>
            <p className="text-sm font-medium text-white/80">{completed} de {total} tarefas</p>
          </div>
          <Progress value={percentage} className="h-2 bg-white/20" />
        </div>
      </Card>

      <Card className="p-4 rounded-3xl border-none bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-2xl text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feitas</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{completed}</p>
        </div>
      </Card>

      <Card className="p-4 rounded-3xl border-none bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-2xl text-amber-600 dark:text-amber-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{pending}</p>
        </div>
      </Card>
    </div>
  );
};

export default StatsDashboard;