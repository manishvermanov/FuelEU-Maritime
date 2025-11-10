import { RouteService } from '../../../core/application/routeService';
import { useComparison } from '../hooks/useRoutes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../../shared/utils';
import { COMPLIANCE_THRESHOLD } from '../../../shared/constants';

interface CompareTabProps {
  routeService: RouteService;
}

export function CompareTab({ routeService }: CompareTabProps) {
  const { data: comparisons = [], isLoading, error } = useComparison(routeService);

  if (isLoading) return <div className="p-4">Loading comparison data...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading comparison: {String(error)}</div>;

  const chartData = comparisons.map((comp) => ({
    name: comp.code,
    baseline: comp.baselineIntensity,
    candidate: comp.candidateIntensity,
    threshold: COMPLIANCE_THRESHOLD,
  }));

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route Code</TableHead>
            <TableHead>Baseline Intensity</TableHead>
            <TableHead>Candidate Intensity</TableHead>
            <TableHead>% Difference</TableHead>
            <TableHead>Compliant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.map((comp) => (
            <TableRow key={comp.routeId}>
              <TableCell className="font-medium">{comp.code}</TableCell>
              <TableCell>{formatNumber(comp.baselineIntensity, 4)}</TableCell>
              <TableCell>{formatNumber(comp.candidateIntensity, 4)}</TableCell>
              <TableCell className={comp.percentDiff > 0 ? 'text-destructive' : 'text-green-600'}>
                {comp.percentDiff > 0 ? '+' : ''}
                {formatNumber(comp.percentDiff, 2)}%
              </TableCell>
              <TableCell>{comp.compliant ? '✅' : '❌'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Intensity Comparison Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#8884d8" name="Baseline Intensity" />
                <Bar dataKey="candidate" fill="#82ca9d" name="Candidate Intensity" />
                <Bar dataKey="threshold" fill="#ff7300" name="Compliance Threshold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

