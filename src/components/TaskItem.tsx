"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Pencil, Flag, FileText } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import EditTaskDialog from "./EditTaskDialog";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
}

const CATEGORIES: Record<string, { label: string, color: string }> = {
  work: { label: "Trabalho", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  personal: { label: "Pessoal", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  health: { label: "Saúde", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  urgent: { label: "Urgente", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
};

const TaskItem = ({ task, onUpdate }: { task: Task; onUpdate: () => void }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isCompleted = task.status === "completed";

  const toggleStatus = async () => {
    const { error } = await supabase.from("tasks").update({ status: isCompleted ? "pending" : "completed" }).eq("id", task.id);
    if (!error) onUpdate();
  };

  const priorityColors = { low: "text-blue-500", medium: "text-amber-500", high: "text-rose-500" };
  const currentCategory = CATEGORIES[task.category || "personal"];

  return (
    <>
      <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={toggleStatus}
          className="mt-1 h-5 w-5 rounded-full border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className={cn("text-base font-bold truncate transition-all", isCompleted ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100")}>
              {task.title}
            </h4>
            {currentCategory && (
              <span className={cn("text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md", currentCategory.color)}>
                {currentCategory.label}
              </span>
            )}
          </div>
          
          {task.description && !isCompleted && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            {task.due_date && (
              <div className="flex items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.due_date), "dd/MM")}
              </div>
            )}
            <div className={cn("flex items-center text-[10px] font-bold uppercase tracking-wider", priorityColors[task.priority as keyof typeof priorityColors])}>
              <Flag className="h-3 w-3 mr-1 fill-current" />
              {task.priority === 'low' ? 'Baixa' : task.priority === 'high' ? 'Alta' : 'Média'}
            </div>
            {task.description && <FileText className="h-3 w-3 text-slate-300" />}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)} className="h-8 w-8 text-slate-400 hover:text-primary">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={async () => { await supabase.from("tasks").delete().eq("id", task.id); onUpdate(); }} className="h-8 w-8 text-slate-400 hover:text-rose-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditTaskDialog task={task as any} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onUpdate={onUpdate} />
    </>
  );
};

export default TaskItem;