import { useState, useEffect, useCallback } from 'react';
import type { Sale } from '../../../domain/entities/Sale';
import { SaleStatus, PaymentMethod } from '../../../domain/entities/Sale';
import { getSalesHistoryUseCase } from '../../../infrastructure/di/container';
import { Card, CardHeader, CardTitle } from '../../components/base/Card';
import { Spinner } from '../../components/base/Spinner';

type Period = 'daily' | 'weekly' | 'monthly';

interface Metrics {
  totalRevenue: number;
  totalSales: number;
  averageTicket: number;
  byMethod: Record<string, number>;
  completedCount: number;
  cancelledCount: number;
}

function computeMetrics(sales: Sale[]): Metrics {
  const completed = sales.filter((s) => s.status === SaleStatus.COMPLETED);
  const totalRevenue = completed.reduce((sum, s) => sum + s.total, 0);
  const byMethod: Record<string, number> = {};

  for (const s of completed) {
    byMethod[s.paymentMethod] = (byMethod[s.paymentMethod] ?? 0) + s.total;
  }

  return {
    totalRevenue,
    totalSales: sales.length,
    averageTicket: completed.length > 0 ? totalRevenue / completed.length : 0,
    byMethod,
    completedCount: completed.length,
    cancelledCount: sales.filter((s) => s.status === SaleStatus.CANCELLED).length,
  };
}

const methodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CARD]: 'Tarjeta',
  [PaymentMethod.TRANSFER]: 'Transferencia',
  [PaymentMethod.MIXED]: 'Mixto',
};

/**
 * ReportsDashboardPage — métricas diarias/semanales/mensuales.
 * Tarea 6.14.
 */
const ReportsDashboardPage = () => {
  const [period, setPeriod] = useState<Period>('daily');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now);

      if (period === 'daily') startDate.setDate(now.getDate() - 1);
      else if (period === 'weekly') startDate.setDate(now.getDate() - 7);
      else startDate.setMonth(now.getMonth() - 1);

      const result = await getSalesHistoryUseCase.execute({ startDate, endDate: now });
      setMetrics(computeMetrics(result.items));
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { void loadMetrics(); }, [loadMetrics]);

  const periodLabels: Record<Period, string> = {
    daily: 'Hoy',
    weekly: 'Esta semana',
    monthly: 'Este mes',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Reportes</h2>

        {/* Selector de período */}
        <div className="flex rounded-lg border border-gray-200 p-1 gap-1" role="group" aria-label="Período">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" aria-label="Cargando métricas..." />
        </div>
      ) : metrics ? (
        <>
          {/* KPIs principales */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <p className="text-xs text-gray-500">Ingresos totales</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Ventas realizadas</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{metrics.completedCount}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Ticket promedio</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">${metrics.averageTicket.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500">Canceladas</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{metrics.cancelledCount}</p>
            </Card>
          </div>

          {/* Desglose por método de pago */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por método de pago</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {Object.entries(metrics.byMethod).map(([method, amount]) => {
                const pct = metrics.totalRevenue > 0 ? (amount / metrics.totalRevenue) * 100 : 0;
                return (
                  <div key={method}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{methodLabels[method as PaymentMethod] ?? method}</span>
                      <span className="font-medium">${amount.toFixed(2)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${methodLabels[method as PaymentMethod] ?? method}: ${pct.toFixed(1)}%`}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(metrics.byMethod).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Sin datos para el período seleccionado</p>
              )}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default ReportsDashboardPage;
