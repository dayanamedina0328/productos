import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../../domain/entities/Product';
import type { CreateProductRequest, UpdateProductRequest } from '../../../domain/ports/ProductRepository';
import {
  getProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} from '../../../infrastructure/di/container';
import { Table } from '../../components/base/Table';
import type { TableColumn } from '../../components/base/Table';
import { Button } from '../../components/base/Button';
import { Modal } from '../../components/base/Modal';
import { Input } from '../../components/base/Input';
import { Badge } from '../../components/base/Badge';
import { StockIndicator } from '../../components/features/StockIndicator';
import { EmptyState } from '../../components/base/EmptyState';
import { AppNotificationContainer } from '../../components/base/AppNotification';
import type { AppNotificationItem } from '../../components/base/AppNotification';

type ModalMode = 'create' | 'edit' | null;

/**
 * ProductManagementPage — CRUD completo de productos con tabla paginada.
 * Tarea 6.8.
 */
const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<CreateProductRequest>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const notify = useCallback((item: Omit<AppNotificationItem, 'id'>) => {
    setNotifications((prev) => [...prev, { ...item, id: `n-${Date.now()}` }]);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProductsUseCase.execute();
      setProducts(result.items);
    } catch (err) {
      notify({ type: 'error', title: 'Error al cargar productos', message: err instanceof Error ? err.message : '' });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const openCreate = () => {
    setForm({});
    setFormErrors({});
    setEditingProduct(null);
    setModalMode('create');
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      minStock: product.minStock,
      sku: product.sku,
    });
    setFormErrors({});
    setEditingProduct(product);
    setModalMode('edit');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name?.trim()) errors.name = 'El nombre es requerido';
    if (!form.sku?.trim()) errors.sku = 'El SKU es requerido';
    if (!form.price || form.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (form.stock === undefined || form.stock < 0) errors.stock = 'El stock no puede ser negativo';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (modalMode === 'create') {
        await createProductUseCase.execute(form as CreateProductRequest);
        notify({ type: 'success', title: 'Producto creado' });
      } else if (editingProduct) {
        await updateProductUseCase.execute(editingProduct.id, form as UpdateProductRequest);
        notify({ type: 'success', title: 'Producto actualizado' });
      }
      setModalMode(null);
      await loadProducts();
    } catch (err) {
      notify({ type: 'error', title: 'Error al guardar', message: err instanceof Error ? err.message : '' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    setLoading(true);
    try {
      await deleteProductUseCase.execute(product.id);
      notify({ type: 'success', title: 'Producto eliminado' });
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err) {
      notify({ type: 'error', title: 'No se pudo eliminar', message: err instanceof Error ? err.message : '' });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Product>[] = [
    { key: 'sku', header: 'SKU', sortable: true, className: 'font-mono text-xs' },
    { key: 'name', header: 'Nombre', sortable: true },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      render: (p) => `$${p.price.toFixed(2)}`,
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (p) => <StockIndicator stock={p.stock} minStock={p.minStock} showCount />,
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (p) => (
        <Badge variant={p.isActive ? 'success' : 'default'}>
          {p.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (p) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(p)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Productos</h2>
        <Button variant="primary" onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      <Table
        columns={columns}
        data={products}
        rowKey={(p) => p.id}
        loading={loading}
        emptyState={
          <EmptyState title="No hay productos" description="Crea el primer producto" />
        }
      />

      {/* Modal crear/editar */}
      <Modal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Nuevo producto' : 'Editar producto'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" required value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={formErrors.name} />
          <Input label="SKU" required value={form.sku ?? ''} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} error={formErrors.sku} />
          <Input label="Precio" type="number" required value={form.price ?? ''} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) }))} error={formErrors.price} />
          <Input label="Costo" type="number" value={form.cost ?? ''} onChange={(e) => setForm((f) => ({ ...f, cost: parseFloat(e.target.value) }))} />
          <Input label="Stock" type="number" required value={form.stock ?? ''} onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) }))} error={formErrors.stock} />
          <Input label="Stock mínimo" type="number" value={form.minStock ?? ''} onChange={(e) => setForm((f) => ({ ...f, minStock: parseInt(e.target.value) }))} />
          <div className="col-span-2">
            <Input label="Descripción" value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalMode(null)}>Cancelar</Button>
          <Button variant="primary" loading={loading} onClick={() => void handleSave()}>Guardar</Button>
        </div>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-gray-600">
          ¿Estás segura de que deseas eliminar <strong>{deleteConfirm?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" loading={loading} onClick={() => deleteConfirm && void handleDelete(deleteConfirm)}>Eliminar</Button>
        </div>
      </Modal>

      <AppNotificationContainer notifications={notifications} onClose={(id) => setNotifications((n) => n.filter((x) => x.id !== id))} />
    </div>
  );
};

export default ProductManagementPage;
