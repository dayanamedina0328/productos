export interface DeleteProduct {
  execute(id: string): Promise<void>;
}
