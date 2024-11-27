const APIKEY = process.env.STEAMMARKETAPIKEY;
const APPID = 730;

export async function getCSItems() {
    let res = await fetch(`https://api.steamapis.com/market/items/${APPID}?api_key=${APIKEY}&format=compact`);

    if (res.ok) {
        return await res.json();
    }
    return null;
}

export async function getItemImgs() {
    let res = await fetch(`https://api.steamapis.com/image/items/${APPID}`);

    if (res.ok) {
        return await res.json();
    }
    return null;
}