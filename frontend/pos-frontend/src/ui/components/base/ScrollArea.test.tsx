import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renderiza los hijos', () => {
    render(<ScrollArea><p>Contenido</p></ScrollArea>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('aplica overflow-y-auto por defecto (vertical)', () => {
    const { container } = render(<ScrollArea>X</ScrollArea>);
    expect(container.firstChild).toHaveClass('overflow-y-auto');
  });

  it('aplica overflow-x-auto para dirección horizontal', () => {
    const { container } = render(<ScrollArea direction="horizontal">X</ScrollArea>);
    expect(container.firstChild).toHaveClass('overflow-x-auto');
  });

  it('aplica overflow-auto para dirección both', () => {
    const { container } = render(<ScrollArea direction="both">X</ScrollArea>);
    expect(container.firstChild).toHaveClass('overflow-auto');
  });

  it('aplica maxHeight cuando se proporciona', () => {
    const { container } = render(<ScrollArea maxHeight="300px">X</ScrollArea>);
    expect((container.firstChild as HTMLElement).style.maxHeight).toBe('300px');
  });
});
