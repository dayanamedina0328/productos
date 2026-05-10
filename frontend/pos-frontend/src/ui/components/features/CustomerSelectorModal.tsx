import { useEffect } from 'react';
import type { Customer } from '../../../domain/entities/Customer';
import { useCustomers } from '../../hooks/useCustomers';
import { Modal } from '../base/Modal';
import { SearchInput } from '../base/SearchInput';
import { Spinner } from '../base/Spinner';
import { EmptyState } from '../base/EmptyState';
import { Badge } from '../base/Badge';
import { CustomerType } from '../../../domain/entities/Customer';

export interface CustomerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

const typeLabels: Record<CustomerType, string> = {
  [CustomerType.REGULAR]: 'Regular',
  [CustomerType.VIP]: 'VIP',
  [CustomerType.CORPORATE]: 'Corporativo',
};

const typeBadgeVariant = {
  [CustomerType.REGULAR]: 'default',
  [CustomerType.VIP]: 'warning',
  [CustomerType.CORPORATE]: 'primary',
} as const;

/**
 * CustomerSelectorModal — búsqueda y selección de cliente.
 * Tarea 6.5.
 */
export function CustomerSelectorModal({ isOpen, onClose, onSelect }: CustomerSelectorModalProps) {
  const { searchResults, loading, searchCustomers } = useCustomers();

  // Cargar todos los clientes al abrir
  useEffect(() => {
    if (isOpen) {
      void searchCustomers('');
    }
  }, [isOpen, searchCustomers]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar cliente" size="md">
      <div className="space-y-4">
        <SearchInput
          onChange={(q) => void searchCustomers(q)}
          debounce={300}
          placeholder="Buscar por nombre o NIT..."
          aria-label="Buscar cliente"
        />

        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" aria-label="Buscando clientes..." />
            </div>
          ) : searchResults.length === 0 ? (
            <EmptyState
              title="No se encontraron clientes"
              description="Intenta con otro nombre o NIT"
            />
          ) : (
            <ul className="divide-y divide-gray-100" role="listbox" aria-label="Clientes encontrados">
              {searchResults.map((customer) => (
                <li key={customer.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => handleSelect(customer)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 rounded-lg transition-colors"
                  >
                    {/* Avatar */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-400">NIT: {customer.nit}</p>
                    </div>

                    {/* Tipo */}
                    <Badge variant={typeBadgeVariant[customer.type]} size="sm">
                      {typeLabels[customer.type]}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
