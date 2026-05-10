export interface ClearCart {
  execute(cartId: string): Promise<void>;
}
