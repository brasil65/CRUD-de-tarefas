"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface Task {
  id: string;
  title: string;
  due_date: string | null;
}

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditTaskDialog = ({ task, open, onOpenChange, onUpdate }: EditTaskDialogProps) => {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        due_date: dueDate?.toISOString() || null,
      })
      .eq("id", task.id);

    setLoading(false);
    if (error) {
      showError("Erro ao atualizar tarefa");
    } else {
      showSuccess("Tarefa atualizada!");
      onUpdate();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="rounded-lg bg-slate-50 border-none h-11 focus-visible:ring-1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de conclusão</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg bg-slate-50 border-none h-11",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Sem data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={loading} className="flex-1 sm:flex-none rounded-lg px-8">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;