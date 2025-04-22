
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, isWeekend, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { legalDeadlineTypes, calculateLegalDeadline } from "@/lib/legal-utils";
import { DeadlineResult } from "@/components/DeadlineResult";

// Esquema de validación para el formulario
const formSchema = z.object({
  legalType: z.string({
    required_error: "Por favor, selecciona el tipo de gestión judicial",
  }),
  notificationDate: z.date({
    required_error: "Por favor, selecciona la fecha de notificación",
  }),
  reminderDays: z.number().min(0).default(1),
});

type ResultType = {
  deadlineDate: Date;
  description: string;
  legalReference: string;
  daysLeft: number;
} | null;

const LegalDeadlineCalculator = () => {
  const [result, setResult] = useState<ResultType>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminderDays: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const deadline = calculateLegalDeadline(values.legalType, values.notificationDate);
      
      const selectedType = legalDeadlineTypes.find(t => t.id === values.legalType);
      
      if (!deadline || !selectedType) {
        throw new Error("No se pudo calcular el plazo legal.");
      }
      
      const daysLeft = differenceInDays(deadline, new Date());
      
      setResult({
        deadlineDate: deadline,
        description: selectedType.description,
        legalReference: selectedType.legalReference,
        daysLeft: daysLeft
      });
      
      toast.success("Plazo calculado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al calcular el plazo");
    }
  };

  const addToCalendar = () => {
    if (!result) return;
    
    // Esta función se implementará más adelante con las APIs de Google Calendar y Apple Calendar
    toast.success("Funcionalidad de calendario en desarrollo");
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="legalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Gestión Judicial</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de gestión" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {legalDeadlineTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona el tipo de gestión judicial según el Código de Procedimiento Civil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notificationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Notificación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={es}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Fecha en que se realizó la notificación o se dictó la resolución.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reminderDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Días de Anticipación para Recordatorio</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Días de anticipación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 día antes</SelectItem>
                    <SelectItem value="2">2 días antes</SelectItem>
                    <SelectItem value="3">3 días antes</SelectItem>
                    <SelectItem value="5">5 días antes</SelectItem>
                    <SelectItem value="7">1 semana antes</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  ¿Con cuántos días de anticipación deseas recibir el recordatorio?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Calcular Plazo
          </Button>
        </form>
      </Form>

      {result && (
        <DeadlineResult 
          result={result} 
          onAddToCalendar={addToCalendar} 
        />
      )}
    </div>
  );
};

export default LegalDeadlineCalculator;
