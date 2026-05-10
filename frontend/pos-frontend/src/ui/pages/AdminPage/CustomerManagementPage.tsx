import { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../../../domain/entities/Customer';
import { CustomerType } from '../../../domain/entities/Customer';
import type { CreateCustomerRequest } from '../../../domain/ports/CustomerRepository';
import {
  getCustomersUseCase,
  createCustomerUseCase,
  updateCustomerUseCase,
} from '../../../infrastructure/di/container';
import { Table } from '../../components/base/Table';
import type { TableColumn } from '../../components/base/Table';
import { Button } from '../../components/base/Button';
import { Modal } from '../../components/base/Modal';
import { Input } from '../../components/base/Input';
import { Badge } from '../../components/base/Badge';
import { EmptyState } from '../../components/base/EmptyState';
import { AppNotificationContainer } from '../../components/base/AppNotification';
import type { AppNotificationItem } from '../../components/base/AppNotification';

type ModalMode = 'create' | 'edit' | null;

const typeLabels: Record<CustomerType, string> = {
  [CustomerType.REGULAR]: 'Regular',
  [CustomerType.VIP]: 'VIP',
  [CustomerType.CORPORATE]: 'Corporativo',
};

/**
 * CustomerManagementPage — gestión de clientes con validación de NIT único.
 * Tarea 6.11.
 */
const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [form, setForm] = useState<Partial<CreateCustomerRequest>>({ type: CustomerType.REGULAR });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const notify = useCallback((item: Omit<AppNotificationItem, 'id'>) => {
    setNotifications((prev) => [...prev, { ...item, id: `n-${Date.now()}` }]);
  }, []);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCustomersUseCase.execute();
      setCustomers(result.items);
    } catch (err) {
      notify({ type: 'error', title: 'Error al cargar clientes', message: err instanceof Error ? err.message : '' });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { void loadCustomers(); }, [loadCustomers]);

  const openCreate = () => {
    setForm({ type: CustomerType.REGULAR });
    setFormErrors({});
    setEditingCustomer(null);
    setModalMode('create');
  };

  const openEdit = (customer: Customer) => {
    setForm({ name: customer.name, nit: customer.nit, email: customer.email, phone: customer.phone, address: customer.address, type: customer.type, creditLimit: customer.creditLimit });
    setFormErrors({});
    setEditingCustomer(customer);
    setModalMode('edit');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name?.trim()) errors.name = 'El nombre es requerido';
    if (!form.nit?.trim()) errors.nit = 'El NIT es requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (modalMode === 'create') {
        await createCustomerUseCase.execute(form as CreateCustomerRequest);
        notify({ type: 'success', title: 'Cliente creado' });
      } else if (editingCustomer) {
        await updateCustomerUseCase.execute(editingCustomer.id, { name: form.name, email: form.email, phone: form.phone, address: form.address, creditLimit: form.creditLimit });
        notify({ type: 'success', title: 'Cliente actualizado' });
      }
      setModalMode(null);
      await loadCustomers();
    } catch (err) {
      notify({ type: 'error', title: 'Error al guardar', message: err instanceof Error ? err.message : '' });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Customer>[] = [
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'nit', header: 'NIT', className: 'font-mono text-xs' },
    { key: 'email', header: 'Email', render: (c) => c.email ?? '—' },
    { key: 'phone', header: 'Teléfono', render: (c) => c.phone ?? '—' },
    { key: 'type', header: 'Tipo', render: (c) => <Badge variant={c.type === CustomerType.VIP ? 'warning' : c.type === CustomerType.CORPORATE ? 'primary' : 'default'}>{typeLabels[c.type]}</Badge> },
    { key: 'isActive', header: 'Estado', render: (c) => <Badge variant={c.isActive ? 'success' : 'default'}>{c.isActive ? 'Activo' : 'Inactivo'}</Badge> },
    { key: 'actions', header: 'Acciones', render: (c) => <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>Editar</Button> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h2>
        <Button variant="primary" onClick={openCreate}>+ Nuevo cliente</Button>
      </div>

      <Table columns={columns} data={customers} rowKey={(c) => c.id} loading={loading} emptyState={<EmptyState title="No hay clientes" description="Registra el primer cliente" />} />

      <Modal isOpen={modalMode !== null} onClose={() => setModalMode(null)} title={modalMode === 'create' ? 'Nuevo cliente' : 'Editar cliente'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" required value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} />
          <Input label="NIT" required value={form.nit ?? ''} onChange={(e) => setForm((f) => ({ ...f, nit: e.target.value }))} error={formErrors.nit} disabled={modalMode === 'edit'} hint={modalMode === 'edit' ? 'El NIT no se puede modificar' : undefined} />
          <Input label="Email" type="email" value={form.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Teléfono" value={form.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <div className="col-span-2">
            <Input label="Dirección" value={form.address ?? ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <Input label="Límite de crédito" type="number" value={form.creditLimit ?? ''} onChange={(e) => setForm((f) => ({ ...f, creditLimit: parseFloat(e.target.value) }))} />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalMode(null)}>Cancelar</Button>
          <Button variant="primary" loading={loading} onClick={() => void handleSave()}>Guardar</Button>
        </div>
      </Modal>

      <AppNotificationContainer notifications={notifications} onClose={(id) => setNotifications((n) => n.filter((x) => x.id !== id))} />
    </div>
  );
};

export default CustomerManagementPage;
