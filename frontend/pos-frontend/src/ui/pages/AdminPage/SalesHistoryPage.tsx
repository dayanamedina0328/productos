import { useState, useEffect, useCallback } from 'react';
import type { Sale } from '../../../domain/entities/Sale';
import { SaleStatus, PaymentMethod } from '../../../domain/entities/Sale';
import { getSalesHistoryUseCase } from '../../../infrastructure/di/container';
import { Table } from '../../components/base/Table';
import type { TableColumn } from '../../components/base/Table';
import { Badge } from '../../components/base/Badge';
import { Input } from '../../components/base/Input';
import { EmptyState } from '../../components/base/EmptyState';

const statusLabels: Record<SaleStatus, string> = {
  [SaleStatus.PENDING]: 'Pendiente',
  [SaleStatus.COMPLETED]: 'Completada',
  [SaleStatus.CANCELLED]: 'Cancelada',
  [SaleStatus.REFUNDED]: 'Reembolsada',
};

const statusVariant = {
  [SaleStatus.PENDING]: 'warning',
  [SaleStatus.COMPLETED]: 'success',
  [SaleStatus.CANCELLED]: 'danger',
  [SaleStatus.REFUNDED]: 'default',
} as const;

const methodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CARD]: 'Tarjeta',
  [PaymentMethod.TRANSFER]: 'Transferencia',
  [PaymentMethod.MIXED]: 'Mixto',
};

/**
 * SalesHistoryPage — historial de ventas con filtros.
 * Tarea 6.13.
 */
const SalesHistoryPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSalesHistoryUseCase.execute({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
      setSales(result.items);
    } catch {
      // silencioso — en producción se mostraría una notificación
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => { void loadSales(); }, [loadSales]);

  const columns: TableColumn<Sale>[] = [
    { key: 'invoiceNumber', header: 'Factura', className: 'font-mono text-xs' },
    {
      key: 'createdAt',
      header: 'Fecha',
      sortable: true,
      render: (s) =>
        new Intl.DateTimeFormat('es', { dateStyle: 'short', timeStyle: 'short' }).format(
          new Date(s.createdAt)
        ),
    },
    { key: 'total', header: 'Total', sortable: true, render: (s) => `$${s.total.toFixed(2)}` },
    { key: 'paymentMethod', header: 'Método', render: (s) => methodLabels[s.paymentMethod] },
    {
      key: 'status',
      header: 'Estado',
      render: (s) => (
        <Badge variant={statusVariant[s.status]}>{statusLabels[s.status]}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Historial de Ventas</h2>
      </div>

      {/* Filtros de fecha */}
      <div className="flex gap-4">
        <Input label="Desde" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input label="Hasta" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <Table
        columns={columns}
        data={sales}
        rowKey={(s) => s.id}
        loading={loading}
        emptyState={<EmptyState title="No hay ventas" description="Las ventas aparecerán aquí" />}
      />
    </div>
  );
};

export default SalesHistoryPage;
