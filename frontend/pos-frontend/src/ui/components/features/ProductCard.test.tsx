import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import type { Product } from '../../../domain/entities/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Producto A',
    description: 'Descripción',
    price: 10.5,
    cost: 5,
    stock: 20,
    minStock: 3,
    category: { id: 'cat-1', name: 'Cat', level: 1, isActive: true },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('ProductCard', () => {
  it('muestra el nombre del producto', () => {
    render(<ProductCard product={makeProduct()} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Producto A')).toBeInTheDocument();
  });

  it('muestra el SKU', () => {
    render(<ProductCard product={makeProduct()} onAddToCart={vi.fn()} />);
    expect(screen.getByText('SKU-001')).toBeInTheDocument();
  });

  it('muestra el precio formateado', () => {
    render(<ProductCard product={makeProduct({ price: 9.99 })} onAddToCart={vi.fn()} />);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('llama a onAddToCart al hacer clic en Agregar', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={makeProduct()} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByRole('button', { name: /Agregar Producto A/i }));
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
  });

  it('deshabilita el botón cuando el producto está sin stock', () => {
    render(<ProductCard product={makeProduct({ stock: 0 })} onAddToCart={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deshabilita el botón cuando el producto está inactivo', () => {
    render(<ProductCard product={makeProduct({ isActive: false })} onAddToCart={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('muestra el indicador de stock bajo', () => {
    render(<ProductCard product={makeProduct({ stock: 2, minStock: 3 })} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
  });

  it('muestra la imagen cuando imageUrl está definido', () => {
    render(<ProductCard product={makeProduct({ imageUrl: 'https://img.com/p.jpg' })} onAddToCart={vi.fn()} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://img.com/p.jpg');
  });
});
