import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table';
import type { TableColumn } from './Table';

interface Row { id: string; name: string; value: number }

const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'value', header: 'Valor', render: (r) => `$${r.value}` },
];

const data: Row[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

describe('Table', () => {
  it('renderiza los encabezados', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  it('renderiza las filas de datos', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('usa la función render personalizada', () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('muestra estado vacío cuando no hay datos', () => {
    render(<Table columns={columns} data={[]} rowKey={(r) => r.id} />);
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('muestra estado vacío personalizado', () => {
    render(<Table columns={columns} data={[]} rowKey={(r) => r.id} emptyState={<span>Sin resultados</span>} />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('muestra skeleton cuando loading=true', () => {
    const { container } = render(<Table columns={columns} data={[]} rowKey={(r) => r.id} loading />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('llama a onSort al hacer clic en columna ordenable', async () => {
    const onSort = vi.fn();
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} onSort={onSort} />);
    await userEvent.click(screen.getByText('Nombre'));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('llama a onRowClick al hacer clic en una fila', async () => {
    const onRowClick = vi.fn();
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
