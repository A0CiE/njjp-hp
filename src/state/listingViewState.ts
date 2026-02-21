import type { ProductCategoryKey } from '../data/listingProductsRuntime';

export type ListingSortKey = 'default' | 'price' | 'productNumber' | 'productYear';

export type ListingCategoryFilter = ProductCategoryKey | '__ALL__';

export type ListingViewStateSnapshot = {
    searchOpen: boolean;
    query: string;
    seasonFilter: string;
    genderFilter: string;
    categoryFilter: ListingCategoryFilter;
    sortBy: ListingSortKey;
    scrollY: number;
};

let listingViewStateSnapshot: ListingViewStateSnapshot | null = null;

export const saveListingViewState = (snapshot: ListingViewStateSnapshot) => {
    listingViewStateSnapshot = { ...snapshot };
};

export const getListingViewState = (): ListingViewStateSnapshot | null => {
    if (!listingViewStateSnapshot) {
        return null;
    }
    return { ...listingViewStateSnapshot };
};

