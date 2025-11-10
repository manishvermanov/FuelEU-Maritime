import { useState, useMemo } from 'react';
import { PoolService } from '../../../core/application/poolService';
import { ComplianceService } from '../../../core/application/complianceService';
import { useAdjustedCB } from '../hooks/useCompliance';
import { useCreatePool } from '../hooks/usePool';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { formatNumber } from '../../../shared/utils';

interface PoolingTabProps {
  poolService: PoolService;
  complianceService: ComplianceService;
}

export function PoolingTab({ poolService, complianceService }: PoolingTabProps) {
  const { data: adjustedCB = [], isLoading, error } = useAdjustedCB(complianceService);
  const createPoolMutation = useCreatePool(poolService);
  const [poolName, setPoolName] = useState('');
  const [selectedRouteIds, setSelectedRouteIds] = useState<Set<string>>(new Set());

  const totalAdjustedCB = useMemo(() => {
    return adjustedCB
      .filter((item) => selectedRouteIds.has(item.routeId))
      .reduce((sum, item) => sum + item.adjustedCb, 0);
  }, [adjustedCB, selectedRouteIds]);

  const isValidPool = useMemo(() => {
    if (selectedRouteIds.size === 0) return false;
    if (!poolName.trim()) return false;
    if (totalAdjustedCB < 0) return false;

    const selected = adjustedCB.filter((item) => selectedRouteIds.has(item.routeId));
    const hasDeficit = selected.some((item) => item.cbBefore < 0);
    const hasSurplus = selected.some((item) => item.cbBefore > 0);

    if (hasDeficit && totalAdjustedCB < 0) return false;

    return true;
  }, [poolName, selectedRouteIds, totalAdjustedCB, adjustedCB]);

  const toggleRoute = (routeId: string) => {
    const newSet = new Set(selectedRouteIds);
    if (newSet.has(routeId)) {
      newSet.delete(routeId);
    } else {
      newSet.add(routeId);
    }
    setSelectedRouteIds(newSet);
  };

  const handleCreatePool = async () => {
    if (!isValidPool) return;

    try {
      const result = await createPoolMutation.mutateAsync({
        name: poolName,
        memberRouteIds: Array.from(selectedRouteIds),
      });
      alert(`Pool "${result.name}" created successfully!`);
      setPoolName('');
      setSelectedRouteIds(new Set());
    } catch (err: any) {
      alert(`Error: ${err?.response?.data?.error || err?.message || 'Failed to create pool'}`);
    }
  };

  if (isLoading) return <div className="p-4">Loading adjusted CB data...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading adjusted CB: {String(error)}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Pool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Pool Name</label>
            <Input value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="Enter pool name" />
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-lg font-semibold ${totalAdjustedCB >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              Total Adjusted CB: {formatNumber(totalAdjustedCB)}
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedRouteIds.size} route{selectedRouteIds.size !== 1 ? 's' : ''}
            </div>
          </div>
          <Button onClick={handleCreatePool} disabled={!isValidPool || createPoolMutation.isPending}>
            Create Pool
          </Button>
          {!isValidPool && selectedRouteIds.size > 0 && (
            <div className="text-sm text-destructive">
              {totalAdjustedCB < 0 && 'Total adjusted CB must be non-negative. '}
              {!poolName.trim() && 'Pool name is required.'}
            </div>
          )}
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Route Code</TableHead>
            <TableHead>CB Before</TableHead>
            <TableHead>Adjusted CB</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustedCB.map((item) => {
            const isSelected = selectedRouteIds.has(item.routeId);
            return (
              <TableRow key={item.routeId} className={isSelected ? 'bg-muted/50' : ''}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRoute(item.routeId)}
                    className="w-4 h-4"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell className={item.cbBefore >= 0 ? 'text-green-600' : 'text-destructive'}>
                  {formatNumber(item.cbBefore)}
                </TableCell>
                <TableCell className={item.adjustedCb >= 0 ? 'text-green-600' : 'text-destructive'}>
                  {formatNumber(item.adjustedCb)}
                </TableCell>
                <TableCell>
                  {item.cbBefore > 0 ? 'Surplus' : item.cbBefore < 0 ? 'Deficit' : 'Neutral'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

