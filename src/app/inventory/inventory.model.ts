export interface Stats {
    total_quantity: number;
    total_spent: number;
    avg_price: number;
}

export interface Transaction {
    id: number;
    item_name: string;
    quantity: number;
    price: number;
}

export interface Inventory {
    stats: Stats;
    transactions: Transaction[];
}