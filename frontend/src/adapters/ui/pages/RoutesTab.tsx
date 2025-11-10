import { useState, useMemo } from 'react';
import { RouteService } from '../../../core/application/routeService';
import { RouteFilters } from '../../../core/domain/route';
import { useRoutes, useSetBaseline } from '../hooks/useRoutes';
import { Button } from '../../../shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Select } from '../../../shared/components/ui/select';
import { Input } from '../../../shared/components/ui/input';
import { formatNumber } from '../../../shared/utils';

interface RoutesTabProps {
  routeService: RouteService;
}

export function RoutesTab({ routeService }: RoutesTabProps) {
  const [filters, setFilters] = useState<RouteFilters>({});
  const { data: routes = [], isLoading, error } = useRoutes(routeService, filters);
  const setBaselineMutation = useSetBaseline(routeService);

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map((r) => r.vesselType))), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map((r) => r.fuelType))), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map((r) => r.year))).sort(), [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
      if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
      if (filters.year && route.year !== filters.year) return false;
      return true;
    });
  }, [routes, filters]);

  const handleSetBaseline = async (routeId: string) => {
    try {
      await setBaselineMutation.mutateAsync(routeId);
    } catch (err) {
      console.error('Failed to set baseline:', err);
    }
  };

  if (isLoading) return <div className="p-4">Loading routes...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading routes: {String(error)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Vessel Type</label>
          <Select
            value={filters.vesselType || ''}
            onChange={(e) => setFilters({ ...filters, vesselType: e.target.value || undefined })}
          >
            <option value="">All</option>
            {vesselTypes.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Fuel Type</label>
          <Select
            value={filters.fuelType || ''}
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
          >
            <option value="">All</option>
            {fuelTypes.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Year</label>
          <Select
            value={filters.year?.toString() || ''}
            onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">All</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Vessel Type</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Target Intensity</TableHead>
            <TableHead>Actual Intensity</TableHead>
            <TableHead>Fuel (tons)</TableHead>
            <TableHead>Baseline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutes.map((route) => (
            <TableRow key={route.id}>
              <TableCell className="font-medium">{route.code}</TableCell>
              <TableCell>{route.vesselType}</TableCell>
              <TableCell>{route.fuelType}</TableCell>
              <TableCell>{route.year}</TableCell>
              <TableCell>{formatNumber(Number(route.targetIntensity))}</TableCell>
              <TableCell>{formatNumber(Number(route.actualIntensity))}</TableCell>
              <TableCell>{formatNumber(Number(route.fuelTons))}</TableCell>
              <TableCell>{route.baseline ? '✅' : ''}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={route.baseline ? 'secondary' : 'default'}
                  onClick={() => handleSetBaseline(route.id)}
                  disabled={setBaselineMutation.isPending || route.baseline}
                >
                  {route.baseline ? 'Baseline' : 'Set Baseline'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

