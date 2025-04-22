
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

type ResultType = {
  deadlineDate: Date;
  description: string;
  legalReference: string;
  daysLeft: number;
};

interface DeadlineResultProps {
  result: ResultType;
  onAddToCalendar: () => void;
}

export function DeadlineResult({ result, onAddToCalendar }: DeadlineResultProps) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resultado del Cálculo</span>
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-md",
            result.daysLeft <= 2 ? "bg-destructive/20 text-destructive" :
            result.daysLeft <= 5 ? "bg-orange-500/20 text-orange-500" :
            "bg-green-500/20 text-green-500"
          )}>
            {result.daysLeft <= 0 
              ? "¡Plazo vencido!" 
              : `${result.daysLeft} día${result.daysLeft !== 1 ? 's' : ''} restante${result.daysLeft !== 1 ? 's' : ''}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Fecha límite calculada</p>
          <p className="text-xl font-bold">
            {format(result.deadlineDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Descripción</p>
          <p className="text-base">{result.description}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Referencia Legal</p>
          <p className="text-sm">{result.legalReference}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onAddToCalendar} 
          className="w-full" 
          variant="outline"
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> 
          Agregar a Calendario
        </Button>
      </CardFooter>
    </Card>
  );
}

import { cn } from "@/lib/utils";
