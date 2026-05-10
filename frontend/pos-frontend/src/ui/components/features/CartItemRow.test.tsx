import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from '../../../domain/entities/Cart';

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 'item-1',
    product: {
      id: 'prod-1',
      sku: 'SKU-001',
      name: 'Producto A',
      description: 'Desc',
      price: 10,
      cost: 5,
      stock: 20,
      minStock: 2,
      category: { id: 'cat-1', name: 'Cat', level: 1, isActive: true },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    quantity: 2,
    unitPrice: 10,
    discount: 0,
    subtotal: 20,
    ...overrides,
  };
}

describe('CartItemRow', () => {
  it('muestra el nombre del producto', () => {
    render(
      <CartItemRow
        item={makeItem()}
        onQuantityChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText('Producto A')).toBeInTheDocument();
  });

  it('muestra el subtotal formateado', () => {
    render(
      <CartItemRow
        item={makeItem({ subtotal: 20 })}
        onQuantityChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('llama a onRemove al hacer clic en eliminar', async () => {
    const onRemove = vi.fn();
    render(
      <CartItemRow
        item={makeItem()}
        onQuantityChange={vi.fn()}
        onRemove={onRemove}
      />
    );
    await userEvent.click(screen.getByLabelText(/Eliminar Producto A/i));
    expect(onRemove).toHaveBeenCalledWith('item-1');
  });

  it('llama a onQuantityChange al incrementar', async () => {
    const onQuantityChange = vi.fn();
    render(
      <CartItemRow
        item={makeItem({ quantity: 2 })}
        onQuantityChange={onQuantityChange}
        onRemove={vi.fn()}
      />
    );
    await userEvent.click(screen.getByLabelText('Aumentar cantidad'));
    expect(onQuantityChange).toHaveBeenCalledWith('item-1', 3);
  });

  it('muestra el descuento cuando es mayor a 0', () => {
    render(
      <CartItemRow
        item={makeItem({ discount: 10 })}
        onQuantityChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText(/-10%/)).toBeInTheDocument();
  });
});
