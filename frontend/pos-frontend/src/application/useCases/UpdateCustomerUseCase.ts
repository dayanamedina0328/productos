import type { CustomerRepository } from '../../domain/ports/CustomerRepository';
import type { UpdateCustomer, UpdateCustomerRequest } from '../ports/UpdateCustomer';
import type { Customer } from '../../domain/entities/Customer';

/**
 * UpdateCustomerUseCase
 *
 * Actualiza los datos de un cliente existente.
 * Verifica que el cliente exista antes de actualizar.
 *
 * Nota: el repositorio de dominio no expone un método `update` explícito;
 * se delega al adaptador de infraestructura que implementa la lógica de actualización.
 */
export class UpdateCustomerUseCase implements UpdateCustomer {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, request: UpdateCustomerRequest): Promise<Customer> {
    // Verificar que el cliente existe
    const existing = await this.customerRepository.findById(id);

    // Construir el objeto actualizado manteniendo los campos no modificados
    const updated: Customer = {
      ...existing,
      ...(request.name !== undefined && { name: request.name }),
      ...(request.email !== undefined && { email: request.email }),
      ...(request.phone !== undefined && { phone: request.phone }),
      ...(request.address !== undefined && { address: request.address }),
      ...(request.creditLimit !== undefined && { creditLimit: request.creditLimit }),
      ...(request.isActive !== undefined && { isActive: request.isActive }),
    };

    // Persistir a través del repositorio (el adaptador maneja el PATCH/PUT)
    return this.customerRepository.save({
      name: updated.name,
      nit: updated.nit,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      type: updated.type,
      creditLimit: updated.creditLimit,
    });
  }
}
