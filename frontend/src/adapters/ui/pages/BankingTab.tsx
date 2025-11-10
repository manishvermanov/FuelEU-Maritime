import { useState } from 'react';
import { BankingService } from '../../../core/application/bankingService';
import { ComplianceService } from '../../../core/application/complianceService';
import { useCB } from '../hooks/useCompliance';
import { useBankSurplus, useApplyBank } from '../hooks/useBanking';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { formatNumber } from '../../../shared/utils';

interface BankingTabProps {
  bankingService: BankingService;
  complianceService: ComplianceService;
}

export function BankingTab({ bankingService, complianceService }: BankingTabProps) {
  const { data: cbData = [], isLoading, error } = useCB(complianceService);
  const bankSurplusMutation = useBankSurplus(bankingService);
  const applyBankMutation = useApplyBank(bankingService);

  const totalCB = cbData.reduce((sum, item) => sum + item.cbBefore, 0);
  const canBank = totalCB > 0;
  const canApply = cbData.some((item) => item.cbBefore < 0);

  const handleBankSurplus = async () => {
    try {
      const result = await bankSurplusMutation.mutateAsync();
      alert(`Banked ${formatNumber(result.totalSurplus)} surplus from ${result.eligibleRoutes.length} routes`);
    } catch (err: any) {
      alert(`Error: ${err?.response?.data?.error || err?.message || 'Failed to bank surplus'}`);
    }
  };

  const handleApplyBank = async () => {
    try {
      const result = await applyBankMutation.mutateAsync();
      alert(
        `Applied ${formatNumber(result.applied)} from bank. CB After: ${formatNumber(result.cbAfter)}, Remaining: ${formatNumber(result.bankRemaining)}`,
      );
    } catch (err: any) {
      alert(`Error: ${err?.response?.data?.error || err?.message || 'Failed to apply bank'}`);
    }
  };

  if (isLoading) return <div className="p-4">Loading compliance data...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading compliance: {String(error)}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banking Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={handleBankSurplus} disabled={!canBank || bankSurplusMutation.isPending}>
            Bank Surplus
          </Button>
          <Button onClick={handleApplyBank} disabled={!canApply || applyBankMutation.isPending} variant="secondary">
            Apply Banked
          </Button>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route Code</TableHead>
            <TableHead>CB Before</TableHead>
            <TableHead>CB After</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cbData.map((item) => {
            const applied = item.cbAfter - item.cbBefore;
            return (
              <TableRow key={item.routeId}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell className={item.cbBefore >= 0 ? 'text-green-600' : 'text-destructive'}>
                  {formatNumber(item.cbBefore)}
                </TableCell>
                <TableCell className={item.cbAfter >= 0 ? 'text-green-600' : 'text-destructive'}>
                  {formatNumber(item.cbAfter)}
                </TableCell>
                <TableCell>{applied !== 0 ? formatNumber(applied) : '-'}</TableCell>
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

