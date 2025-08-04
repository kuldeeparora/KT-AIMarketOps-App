export interface StockLevel {
    SKU: string;
    Quantity: number;
}
export interface GetStockLevelsOptions {
    encryptedLogin: string;
    retailerId: string;
    pageSize?: number;
    endpoint: string;
}
/**
 * Fetch all stock levels from SellerDynamics with paging and error handling.
 * @param options GetStockLevelsOptions
 * @returns Promise<StockLevel[]>
 */
export declare function getAllStockLevels({ encryptedLogin, retailerId, pageSize, endpoint, }: GetStockLevelsOptions): Promise<StockLevel[]>;
