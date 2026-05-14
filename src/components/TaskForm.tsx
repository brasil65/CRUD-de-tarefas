"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Loader2, Flag, Tag, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { showSuccess, showError } from "@/utils/toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  onTaskCreated: () => void;
}

const CATEGORIES = [
  { id: "work", label: "Trabalho" },
  { id: "personal", label: "Pessoal" },
  { id: "health", label: "Saúde" },
  { id: "urgent", label: "Urgente" },
];

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("tasks").insert([
      {
        title: title.trim(),
        description: description.trim() || null,
        user_id: user?.id || null,
        due_date: dueDate?.toISOString() || null,
        priority,
        category,
        status: "pending",
      },
    ]);

    setLoading(false);
    if (error) {
      showError("Erro ao criar tarefa");
    } else {
      showSuccess("Tarefa criada!");
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setShowDetails(false);
      onTaskCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-1">
      <div className="flex gap-2">
        <Input
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm h-12 px-4 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <Button 
          type="button"
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className={cn("rounded-xl h-12 w-12 p-0", showDetails && "text-primary bg-primary/5")}
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !title.trim()} 
          className="rounded-xl h-12 w-12 p-0 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>

      {showDetails && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <Input
            placeholder="Adicionar nota ou descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm h-10 px-4 text-xs mb-2 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full text-[10px] font-bold uppercase tracking-wider px-3",
                dueDate ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {dueDate ? format(dueDate, "dd/MM") : "Data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="h-8 w-auto rounded-full text-[10px] font-bold uppercase tracking-wider px-3 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none focus:ring-0">
            <div className="flex items-center gap-1.5">
              <Flag className={cn("h-3 w-3 fill-current", { "text-blue-500": priority === "low", "text-amber-500": priority === "medium", "text-rose-500": priority === "high" })} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="low" className="text-xs">Baixa</SelectItem>
            <SelectItem value="medium" className="text-xs">Média</SelectItem>
            <SelectItem value="high" className="text-xs">Alta</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 w-auto rounded-full text-[10px] font-bold uppercase tracking-wider px-3 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none focus:ring-0">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3 w-3 text-slate-400" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CATEGORIES.map(cat => <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default TaskForm;