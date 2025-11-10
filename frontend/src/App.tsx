import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/hooks/useQueryClient';
import { ApiClientAxios } from './adapters/infrastructure/api/apiClient';
import { RouteService } from './core/application/routeService';
import { ComplianceService } from './core/application/complianceService';
import { BankingService } from './core/application/bankingService';
import { PoolService } from './core/application/poolService';
import { RoutesTab } from './adapters/ui/pages/RoutesTab';
import { CompareTab } from './adapters/ui/pages/CompareTab';
import { BankingTab } from './adapters/ui/pages/BankingTab';
import { PoolingTab } from './adapters/ui/pages/PoolingTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './shared/components/ui/card';
import { API_BASE_URL } from './shared/constants';

const apiClient = new ApiClientAxios(API_BASE_URL);
const routeService = new RouteService(apiClient);
const complianceService = new ComplianceService(apiClient);
const bankingService = new BankingService(apiClient);
const poolService = new PoolService(apiClient);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>FuelEU Maritime Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="routes" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="routes">Routes</TabsTrigger>
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                  <TabsTrigger value="banking">Banking</TabsTrigger>
                  <TabsTrigger value="pooling">Pooling</TabsTrigger>
                </TabsList>
                <TabsContent value="routes" className="mt-6">
                  <RoutesTab routeService={routeService} />
                </TabsContent>
                <TabsContent value="compare" className="mt-6">
                  <CompareTab routeService={routeService} />
                </TabsContent>
                <TabsContent value="banking" className="mt-6">
                  <BankingTab bankingService={bankingService} complianceService={complianceService} />
                </TabsContent>
                <TabsContent value="pooling" className="mt-6">
                  <PoolingTab poolService={poolService} complianceService={complianceService} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;

