export interface ItemOverview {
    name: string;
    price: string;
    img_url: string;
}

export interface Item {
    name: string;
    price: string;
    img_url: string;
    sub_items: SubItem[]
}

export interface SubItem {
    name: string;
    price: string;
    img_url: string;
}