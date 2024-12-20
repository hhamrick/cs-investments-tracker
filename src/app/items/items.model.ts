export interface ItemOverview {
    name: string;
    price: number;
    max_price: number | null;
    img_url: string;
}

export interface ItemGroup {
    name: string;
    min_price: number;
    max_price: number;
    img_url: string;
    sub_items: Item[]
}

export interface Item {
    name: string;
    price: string;
    img_url: string;
}