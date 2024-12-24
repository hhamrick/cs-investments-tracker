export interface Stats {
    total_quantity: number;
    total_spent: number;
    total_sold: number;
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

export interface InventoryItem {
    name: string;
    group_name: string;
    quantity: number;
    price: number;
    img_url: string;
}