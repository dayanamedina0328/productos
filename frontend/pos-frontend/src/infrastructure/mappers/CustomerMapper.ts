import type { Customer } from '../../domain/entities/Customer';
import { CustomerType } from '../../domain/entities/Customer';

export interface CustomerApiResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  nit: string;
  address?: string;
  type?: string;
  credit_limit?: number;
  creditLimit?: number;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
}

/**
 * CustomerMapper — convierte entre la respuesta de la API y la entidad de dominio.
 */
export class CustomerMapper {
  static toDomain(raw: CustomerApiResponse): Customer {
    const typeMap: Record<string, CustomerType> = {
      regular: CustomerType.REGULAR,
      vip: CustomerType.VIP,
      corporate: CustomerType.CORPORATE,
    };

    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      nit: raw.nit,
      address: raw.address,
      type: typeMap[raw.type?.toLowerCase() ?? 'regular'] ?? CustomerType.REGULAR,
      creditLimit: raw.creditLimit ?? raw.credit_limit,
      isActive: raw.isActive ?? raw.is_active ?? true,
      createdAt: new Date(raw.createdAt ?? raw.created_at ?? Date.now()),
    };
  }

  static toDomainList(rawList: CustomerApiResponse[]): Customer[] {
    return rawList.map(CustomerMapper.toDomain);
  }
}
