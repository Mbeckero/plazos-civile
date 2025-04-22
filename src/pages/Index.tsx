
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegalDeadlineCalculator from "@/components/LegalDeadlineCalculator";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          LegalPlazos Chile
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Sistema de gestión de plazos judiciales según el Código de Procedimiento Civil chileno.
        </p>

        <Tabs defaultValue="calculator" className="w-full max-w-3xl">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="calculator">Calculadora de Plazos</TabsTrigger>
            <TabsTrigger value="events">Mis Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calculadora de Plazos Judiciales</CardTitle>
                <CardDescription>
                  Ingresa los datos de la gestión judicial para calcular automáticamente los plazos legales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LegalDeadlineCalculator />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Eventos Calendario</CardTitle>
                <CardDescription>
                  Gestiona tus eventos de calendario y plazos judiciales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Próximamente: Visualización y gestión de todos tus eventos de calendario.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
