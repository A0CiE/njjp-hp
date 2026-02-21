import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export type RuntimeListingProduct = {
    id: number;
    code: string | null;
    releaseYear: number;
    season: string;
    gender: string;
    categoryKey: ProductCategoryKey;
    productName: string;
    colorRange: string;
    genre: string;
    sizeRange: string;
    material: string;
    feature: string;
    trimSpec: string;
    finalPriceYen: number;
    imageUrl: string | null;
};

export type ProductCategoryKey =
    | 'tops'
    | 'bottoms'
    | 'outerwear'
    | 'dresses'
    | 'skirts'
    | 'knitwear'
    | 'sets'
    | 'accessories'
    | 'other';

export const PRODUCT_CATEGORY_KEYS: ProductCategoryKey[] = [
    'tops',
    'bottoms',
    'outerwear',
    'dresses',
    'skirts',
    'knitwear',
    'sets',
    'accessories',
    'other',
];

const VALID_CATEGORY_KEYS = new Set<ProductCategoryKey>(PRODUCT_CATEGORY_KEYS);
const EXPECTED_COLS = 15;
const PRODUCTS_TEXT_ASSET = require('./products.txt');

let cache: RuntimeListingProduct[] | null = null;
let pendingLoad: Promise<RuntimeListingProduct[]> | null = null;

const parsePrice = (raw: string): number => {
    const clean = raw.replace(/[¥,\s]/g, '');
    const value = Number.parseFloat(clean);
    return Number.isFinite(value) ? value : 0;
};

const normalizeCell = (value: string): string => value.trim().replace(/^"|"$/g, '');

const parseItemId = (raw: string, fallbackId: number): number => {
    const parsed = Number.parseInt(raw.trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
    }
    return fallbackId;
};

const parseOptionalText = (raw: string): string | null => {
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const parseReleaseYear = (raw: string): number => {
    const parsed = Number.parseInt(raw.trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
    }
    return 26;
};

const deriveCategoryKey = (productName: string, genre: string): ProductCategoryKey => {
    const name = productName.trim();
    const nameLower = name.toLowerCase();
    const genreValue = genre.trim().toLowerCase();

    if (name.includes('セット')) {
        return 'sets';
    }
    if (name.includes('靴下') || genreValue === '靴下') {
        return 'accessories';
    }
    if (name.includes('ボクサーパンツ') || name.includes('ショーツ') || genreValue === 'インナー') {
        return 'accessories';
    }
    if (
        name.includes('パンツ') ||
        name.includes('レギンス') ||
        name.includes('短パン') ||
        genreValue === 'スウェットパンツ'
    ) {
        return 'bottoms';
    }
    if (
        name.includes('コート') ||
        name.includes('ジャケット') ||
        name.includes('マウンテン') ||
        name.includes('ベスト') ||
        genreValue === 'コート' ||
        genreValue === 'ダウンジャケット' ||
        genreValue === 'マウンテンパーカー'
    ) {
        return 'outerwear';
    }
    if (
        nameLower.includes('tシャツ') ||
        name.includes('ポロシャツ') ||
        name.includes('タンクトップ') ||
        name.includes('インナー') ||
        name.includes('パーカー') ||
        genreValue === 'uvカット' ||
        genreValue === '綿100' ||
        genreValue === '速乾' ||
        genreValue === 'スウェット' ||
        genreValue === '保温'
    ) {
        return 'tops';
    }
    return 'other';
};

const parseCategoryKey = (raw: string, productName: string, genre: string): ProductCategoryKey => {
    const normalized = raw.trim().toLowerCase() as ProductCategoryKey;
    if (VALID_CATEGORY_KEYS.has(normalized)) {
        return normalized;
    }
    return deriveCategoryKey(productName, genre);
};

const parseLine = (line: string, fallbackId: number): RuntimeListingProduct | null => {
    const cols = line.split('|').map(normalizeCell);
    if (cols.length === 13) {
        const maybeYear = Number.parseInt((cols[2] || '').trim(), 10);
        const hasReleaseYearInColumn3 = Number.isFinite(maybeYear);
        if (hasReleaseYearInColumn3) {
            // New schema with missing trailing image URL.
            cols.push('');
        } else {
            // Legacy schema without release year.
            cols.splice(2, 0, '26');
        }
    }
    if (cols.length === EXPECTED_COLS - 1) {
        cols.push(deriveCategoryKey(cols[5] ?? '', cols[7] ?? ''));
    }
    if (cols.length < EXPECTED_COLS) {
        return null;
    }

    const [
        rawId,
        code,
        rawReleaseYear,
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
        rawCategoryKey,
    ] = cols;

    return {
        id: parseItemId(rawId, fallbackId),
        code: parseOptionalText(code),
        releaseYear: parseReleaseYear(rawReleaseYear),
        season,
        gender,
        categoryKey: parseCategoryKey(rawCategoryKey ?? '', productName, genre),
        productName,
        colorRange,
        genre,
        sizeRange,
        material,
        feature,
        trimSpec,
        finalPriceYen: parsePrice(finalPrice),
        imageUrl: parseOptionalText(imageUrl),
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
        .map((line, index) => parseLine(line, index + 1))
        .filter((item): item is RuntimeListingProduct => item !== null);
};

const readAssetText = async (): Promise<string> => {
    const [asset] = await Asset.loadAsync(PRODUCTS_TEXT_ASSET);
    const assetUri = asset.localUri ?? asset.uri;

    if (!assetUri) {
        throw new Error('Unable to locate products.txt asset URI');
    }

    try {
        return await FileSystem.readAsStringAsync(assetUri);
    } catch {
        const response = await fetch(assetUri);
        if (!response.ok) {
            throw new Error(`Failed to fetch products.txt: ${response.status}`);
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
