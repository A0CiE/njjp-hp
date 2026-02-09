import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export type RuntimeListingProduct = {
    code: string;
    season: string;
    gender: string;
    productName: string;
    colorRange: string;
    genre: string;
    sizeRange: string;
    material: string;
    feature: string;
    trimSpec: string;
    finalPriceYen: number;
    imageUrl: string;
};

const EXPECTED_COLS = 12;
const LISTING_TEXT_ASSET = require('./listing_products.txt');

let cache: RuntimeListingProduct[] | null = null;
let pendingLoad: Promise<RuntimeListingProduct[]> | null = null;

const parsePrice = (raw: string): number => {
    const clean = raw.replace(/[¥,\s]/g, '');
    const value = Number.parseFloat(clean);
    return Number.isFinite(value) ? value : 0;
};

const normalizeCell = (value: string): string => value.trim().replace(/^"|"$/g, '');

const parseLine = (line: string): RuntimeListingProduct | null => {
    const cols = line.split('|').map(normalizeCell);
    if (cols.length < EXPECTED_COLS) {
        return null;
    }

    const [
        code,
        season,
        gender,
        productName,
        colorRange,
        genre,
        sizeRange,
        material,
        feature,
        trimSpec,
        finalPrice,
        imageUrl,
    ] = cols;

    if (!code) {
        return null;
    }

    return {
        code,
        season,
        gender,
        productName,
        colorRange,
        genre,
        sizeRange,
        material,
        feature,
        trimSpec,
        finalPriceYen: parsePrice(finalPrice),
        imageUrl,
    };
};

export const parseListingProductsText = (text: string): RuntimeListingProduct[] => {
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length <= 1) {
        return [];
    }

    return lines
        .slice(1)
        .map(parseLine)
        .filter((item): item is RuntimeListingProduct => item !== null);
};

const readAssetText = async (): Promise<string> => {
    const [asset] = await Asset.loadAsync(LISTING_TEXT_ASSET);
    const assetUri = asset.localUri ?? asset.uri;

    if (!assetUri) {
        throw new Error('Unable to locate listing_products.txt asset URI');
    }

    try {
        return await FileSystem.readAsStringAsync(assetUri);
    } catch {
        const response = await fetch(assetUri);
        if (!response.ok) {
            throw new Error(`Failed to fetch listing_products.txt: ${response.status}`);
        }
        return await response.text();
    }
};

export const loadListingProducts = async (): Promise<RuntimeListingProduct[]> => {
    if (cache) {
        return cache;
    }

    if (!pendingLoad) {
        pendingLoad = (async () => {
            const text = await readAssetText();
            cache = parseListingProductsText(text);
            return cache;
        })().finally(() => {
            pendingLoad = null;
        });
    }

    return pendingLoad;
};

export const clearListingProductsCache = () => {
    cache = null;
};
