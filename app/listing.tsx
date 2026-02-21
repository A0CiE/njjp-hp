import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useI18n } from '../src/i18n/provider';
import { LANGUAGE_OPTIONS, toAppLanguage, type AppLanguage } from '../src/i18n/languageOptions';
import {
    loadListingProducts,
    PRODUCT_CATEGORY_KEYS,
    type ProductCategoryKey,
    type RuntimeListingProduct,
} from '../src/data/listingProductsRuntime';
import { withImageSize } from '../src/data/imageUrl';
import {
    getListingViewState,
    saveListingViewState,
    type ListingCategoryFilter,
    type ListingSortKey,
} from '../src/state/listingViewState';
import MarketAnnouncementBar from '../src/components/sections/market/MarketAnnouncementBar';
import MarketTopNav from '../src/components/sections/market/MarketTopNav';
import ListingHeroControls, {
    type ListingDropdownOption,
    type ListingMenuKey,
} from '../src/components/sections/listing/ListingHeroControls';
import ListingProductGrid from '../src/components/sections/listing/ListingProductGrid';
import Footer from '../src/components/sections/Footer';

type SortKey = ListingSortKey;
type ListingPageParams = {
    restoreState?: string | string[];
    focusProductId?: string | string[];
};

const ALL_FILTER_VALUE = '__ALL__';
const OFF_BEIGE = '#ECEADD';
const CHARCOAL = '#333334';

type ApparelCard = {
    id: number;
    code: string | null;
    name: string;
    categoryKey: ProductCategoryKey;
    genre: string;
    season: string;
    gender: string;
    releaseYear: number;
    price: number;
    imageUri: string;
};

const compareCodes = (a: string | null, b: string | null): number => {
    const left = (a ?? '').trim();
    const right = (b ?? '').trim();
    if (!left && !right) {
        return 0;
    }
    if (!left) {
        return 1;
    }
    if (!right) {
        return -1;
    }
    return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
};
const compareById = (a: ApparelCard, b: ApparelCard): number => a.id - b.id;

const seasonRank = (season: string): number => {
    const v = season.toLowerCase();
    const rankByToken = [
        { rank: 4, tokens: ['spring', '春'] },
        { rank: 3, tokens: ['summer', '夏'] },
        { rank: 2, tokens: ['autumn', 'fall', '秋'] },
        { rank: 1, tokens: ['winter', '冬'] },
    ];
    for (const entry of rankByToken) {
        if (entry.tokens.some((token) => v.includes(token))) {
            return entry.rank;
        }
    }
    return 0;
};

const compareByYearSeasonCode = (a: ApparelCard, b: ApparelCard): number => {
    const yearDiff = b.releaseYear - a.releaseYear;
    if (yearDiff !== 0) {
        return yearDiff;
    }
    const seasonDiff = seasonRank(b.season) - seasonRank(a.season);
    if (seasonDiff !== 0) {
        return seasonDiff;
    }
    const codeDiff = compareCodes(a.code, b.code);
    if (codeDiff !== 0) {
        return codeDiff;
    }
    return compareById(a, b);
};

const getViewportWidthWithoutScrollbar = (fallbackWidth: number): number => {
    if (Platform.OS !== 'web') {
        return fallbackWidth;
    }
    return Math.max(0, fallbackWidth - 15);
};

export default function ListingPage() {
    const router = useRouter();
    const params = useLocalSearchParams<ListingPageParams>();
    const { currentLanguage, setLanguage } = useI18n();
    const { t } = useTranslation();
    const { width: windowWidth } = useWindowDimensions();

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [langOpen, setLangOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<ListingMenuKey>(null);
    const [sortBy, setSortBy] = useState<SortKey>('default');
    const [seasonFilter, setSeasonFilter] = useState(ALL_FILTER_VALUE);
    const [genderFilter, setGenderFilter] = useState(ALL_FILTER_VALUE);
    const [categoryFilter, setCategoryFilter] = useState<ListingCategoryFilter>(ALL_FILTER_VALUE);
    const [rawProducts, setRawProducts] = useState<RuntimeListingProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverBindingsVersion, setHoverBindingsVersion] = useState(0);
    const [gridTopY, setGridTopY] = useState<number | null>(null);

    const heroReveal = useRef(new Animated.Value(0)).current;
    const sortReveal = useRef(new Animated.Value(0)).current;
    const cardReveal = useRef<Animated.Value[]>([]).current;
    const hoverScale = useRef<Record<string, Animated.Value>>({}).current;
    const ctaHover = useRef<Record<string, Animated.Value>>({}).current;
    const scrollRef = useRef<ScrollView>(null);
    const currentScrollYRef = useRef(0);
    const pendingInitialScrollYRef = useRef<number | null>(null);
    const pendingFocusProductIdRef = useRef<number | null>(null);
    const initialRestoreAppliedRef = useRef(false);
    const cardOffsetByIdRef = useRef<Record<number, number>>({});
    const restoreStateParam = Array.isArray(params.restoreState) ? params.restoreState[0] : params.restoreState;
    const focusProductIdParam = Array.isArray(params.focusProductId) ? params.focusProductId[0] : params.focusProductId;

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            try {
                const rows = await loadListingProducts();
                if (!cancelled) {
                    setRawProducts(rows);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        initialRestoreAppliedRef.current = false;
        pendingInitialScrollYRef.current = null;
        pendingFocusProductIdRef.current = null;

        if (restoreStateParam === '1') {
            const snapshot = getListingViewState();
            if (!snapshot) {
                return;
            }
            setSearchOpen(snapshot.searchOpen);
            setQuery(snapshot.query);
            setSortBy(snapshot.sortBy);
            setSeasonFilter(snapshot.seasonFilter);
            setGenderFilter(snapshot.genderFilter);
            setCategoryFilter(snapshot.categoryFilter);
            pendingInitialScrollYRef.current = Math.max(0, snapshot.scrollY);
            return;
        }

        const parsedFocusId = Number.parseInt((focusProductIdParam ?? '').trim(), 10);
        if (Number.isFinite(parsedFocusId) && parsedFocusId > 0) {
            pendingFocusProductIdRef.current = parsedFocusId;
        }
    }, [focusProductIdParam, restoreStateParam]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(heroReveal, {
                toValue: 1,
                duration: 550,
                useNativeDriver: true,
            }),
            Animated.timing(sortReveal, {
                toValue: 1,
                delay: 350,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [heroReveal, sortReveal]);

    useEffect(() => {
        rawProducts.forEach((item, index) => {
            if (!cardReveal[index]) {
                cardReveal[index] = new Animated.Value(0);
            } else {
                cardReveal[index].setValue(0);
            }

            const itemKey = String(item.id);
            if (!hoverScale[itemKey]) {
                hoverScale[itemKey] = new Animated.Value(1);
            }
            if (!ctaHover[itemKey]) {
                ctaHover[itemKey] = new Animated.Value(0);
            } else {
                ctaHover[itemKey].setValue(0);
            }
        });

        cardReveal.length = rawProducts.length;
        // Force one re-bind render so freshly initialized refs are attached to card styles.
        setHoverBindingsVersion((v) => v + 1);

        if (cardReveal.length > 0) {
            Animated.stagger(
                90,
                cardReveal.map((value) =>
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 420,
                        useNativeDriver: true,
                    }),
                ),
            ).start();
        }
    }, [cardReveal, ctaHover, hoverScale, rawProducts]);

    const heroStyle = {
        opacity: heroReveal,
        transform: [
            {
                translateY: heroReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                }),
            },
        ],
    };

    const sortStyle = {
        opacity: sortReveal,
        transform: [
            {
                translateY: sortReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                }),
            },
        ],
    };

    const lang: AppLanguage = toAppLanguage(currentLanguage);

    const products = useMemo<ApparelCard[]>(
        () =>
            rawProducts.map((item) => ({
                id: item.id,
                code: item.code,
                name: item.productName,
                categoryKey: item.categoryKey,
                genre: item.genre,
                season: item.season,
                gender: item.gender,
                releaseYear: item.releaseYear,
                price: item.finalPriceYen,
                imageUri: withImageSize(item.imageUrl, 400),
            })),
        [rawProducts],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const rows = products.filter((item) => {
            const queryMatched =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.genre.toLowerCase().includes(q) ||
                (item.code ?? '').toLowerCase().includes(q);
            const seasonMatched = seasonFilter === ALL_FILTER_VALUE || item.season === seasonFilter;
            const genderMatched = genderFilter === ALL_FILTER_VALUE || item.gender === genderFilter;
            const categoryMatched = categoryFilter === ALL_FILTER_VALUE || item.categoryKey === categoryFilter;
            return queryMatched && seasonMatched && genderMatched && categoryMatched;
        });

        const sorted = [...rows];
        sorted.sort((a, b) => {
            if (sortBy === 'default') {
                return compareById(a, b);
            }
            if (sortBy === 'price') {
                const priceDiff = a.price - b.price;
                if (priceDiff !== 0) {
                    return priceDiff;
                }
                return compareByYearSeasonCode(a, b);
            }
            if (sortBy === 'productNumber') {
                const codeDiff = compareCodes(a.code, b.code);
                if (codeDiff !== 0) {
                    return codeDiff;
                }
                return compareById(a, b);
            }
            return compareByYearSeasonCode(a, b);
        });
        return sorted;
    }, [categoryFilter, genderFilter, products, query, seasonFilter, sortBy]);

    const sortOptions = useMemo<ListingDropdownOption[]>(
        () => [
            { value: 'price', label: t('listing_page.sort_options.price') },
            { value: 'productNumber', label: t('listing_page.sort_options.product_number') },
            { value: 'productYear', label: t('listing_page.sort_options.product_year') },
        ],
        [currentLanguage, t],
    );

    const seasonOptions = useMemo<ListingDropdownOption[]>(() => {
        const values = [...new Set(rawProducts.map((item) => item.season).filter(Boolean))];
        values.sort((a, b) => {
            const rankDiff = seasonRank(b) - seasonRank(a);
            if (rankDiff !== 0) {
                return rankDiff;
            }
            return a.localeCompare(b);
        });
        return [{ value: ALL_FILTER_VALUE, label: t('listing_page.all_option') }, ...values.map((value) => ({ value, label: value }))];
    }, [currentLanguage, rawProducts, t]);

    const genderOptions = useMemo<ListingDropdownOption[]>(() => {
        const values = [...new Set(rawProducts.map((item) => item.gender).filter(Boolean))];
        values.sort((a, b) => a.localeCompare(b));
        return [{ value: ALL_FILTER_VALUE, label: t('listing_page.all_option') }, ...values.map((value) => ({ value, label: value }))];
    }, [currentLanguage, rawProducts, t]);

    const categoryOptions = useMemo<ListingDropdownOption[]>(() => {
        return [
            { value: ALL_FILTER_VALUE, label: t('listing_page.all_option') },
            ...PRODUCT_CATEGORY_KEYS.map((value) => ({
                value,
                label: t(`listing_page.category_options.${value}`),
            })),
        ];
    }, [currentLanguage, t]);

    const cardAnimById = useMemo(() => {
        return rawProducts.reduce((acc, item, index) => {
            acc[String(item.id)] = cardReveal[index];
            return acc;
        }, {} as Record<string, Animated.Value | undefined>);
    }, [cardReveal, hoverBindingsVersion, rawProducts]);

    const selectedSortLabel =
        sortBy === 'default'
            ? t('listing_page.default_order')
            : sortOptions.find((option) => option.value === sortBy)?.label ?? sortOptions[0].label;
    const selectedSeasonLabel = seasonOptions.find((option) => option.value === seasonFilter)?.label ?? t('listing_page.all_option');
    const selectedGenderLabel = genderOptions.find((option) => option.value === genderFilter)?.label ?? t('listing_page.all_option');
    const selectedCategoryLabel =
        categoryOptions.find((option) => option.value === categoryFilter)?.label ?? t('listing_page.all_option');
    const sortHeading = t('listing_page.sort_heading', { count: filtered.length });

    const layoutWidth = getViewportWidthWithoutScrollbar(windowWidth);
    const isMobile = layoutWidth <= 800;
    const isTablet = layoutWidth <= 1200;
    const containerPadding = layoutWidth > 1320 ? 66 : layoutWidth > 980 ? 40 : 18;
    const gridGap = layoutWidth <= 980 ? 20 : 28;
    const contentWidth = Math.max(0, layoutWidth - containerPadding * 2);
    const minSquareCardWidth = isMobile ? 220 : layoutWidth <= 1200 ? 260 : 300;
    const maxColumns = isMobile ? 2 : 4;
    const fitColumns = Math.max(1, Math.floor((contentWidth + gridGap) / (minSquareCardWidth + gridGap)));
    const columns = Math.max(1, Math.min(maxColumns, fitColumns));
    const desktopHeroMinWidth = layoutWidth > 1480 ? 520 : 460;
    const desktopControlMaxByRoom = Math.max(420, contentWidth - desktopHeroMinWidth - 20);
    const controlPanelWidth = isMobile
        ? contentWidth
        : Math.max(420, Math.min(840, Math.min(contentWidth * 0.58, desktopControlMaxByRoom)));
    const heroTextMaxWidth = isMobile ? contentWidth : Math.max(320, contentWidth - controlPanelWidth - 20);
    const cardWidth = Math.max(180, (contentWidth - gridGap * (columns - 1)) / columns);
    const heroFontSize = Math.max(50, Math.min(74, layoutWidth * 0.053));
    const brandWordmarkSize = isMobile ? 22 : 34;
    const imageHeight = cardWidth;
    const sortLabelSize = isMobile ? 16 : 25;
    const cardNameSize = isMobile ? 23 : isTablet ? 25 : 29;
    const cardNameLineHeight = isMobile ? 24 : isTablet ? 26 : 30;
    const cardPriceSize = isMobile ? 21 : isTablet ? 23 : 25;
    const cardPriceLineHeight = isMobile ? 22 : isTablet ? 24 : 26;

    const animateHover = (id: number, active: boolean) => {
        const key = String(id);
        const scaleValue = hoverScale[key];
        const ctaValue = ctaHover[key];

        if (scaleValue) {
            Animated.spring(scaleValue, {
                toValue: active ? 1.06 : 1,
                useNativeDriver: true,
                friction: 8,
                tension: 140,
            }).start();
        }

        if (ctaValue) {
            Animated.timing(ctaValue, {
                toValue: active ? 1 : 0,
                duration: 180,
                useNativeDriver: false,
            }).start();
        }
    };

    const closeOpenMenu = () => {
        setOpenMenu((prev) => (prev === null ? prev : null));
    };

    const toggleMenu = (key: Exclude<ListingMenuKey, null>) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };

    const saveCurrentListingViewState = () => {
        saveListingViewState({
            searchOpen,
            query,
            seasonFilter,
            genderFilter,
            categoryFilter,
            sortBy,
            scrollY: currentScrollYRef.current,
        });
    };

    const openDetailFromListing = (id: number) => {
        saveCurrentListingViewState();
        router.push({
            pathname: '/p/[code]',
            params: {
                code: String(id),
                from: 'listing',
            },
        });
    };

    useEffect(() => {
        if (isLoading || initialRestoreAppliedRef.current || !scrollRef.current) {
            return;
        }

        if (pendingInitialScrollYRef.current !== null) {
            const targetY = Math.max(0, pendingInitialScrollYRef.current);
            initialRestoreAppliedRef.current = true;
            pendingInitialScrollYRef.current = null;
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ y: targetY, animated: false });
                currentScrollYRef.current = targetY;
            });
            return;
        }

        const focusProductId = pendingFocusProductIdRef.current;
        if (!focusProductId || gridTopY === null) {
            return;
        }

        const measuredCardOffset = cardOffsetByIdRef.current[focusProductId];
        let targetY: number | null = null;

        if (Number.isFinite(measuredCardOffset)) {
            targetY = Math.max(0, gridTopY + measuredCardOffset - 28);
        } else {
            const targetIndex = filtered.findIndex((item) => item.id === focusProductId);
            if (targetIndex < 0) {
                initialRestoreAppliedRef.current = true;
                pendingFocusProductIdRef.current = null;
                return;
            }
            const targetRow = Math.floor(targetIndex / columns);
            const estimatedRowHeight = imageHeight + 154;
            targetY = Math.max(0, gridTopY + targetRow * (estimatedRowHeight + gridGap) - 28);
        }

        if (targetY !== null) {
            initialRestoreAppliedRef.current = true;
            pendingFocusProductIdRef.current = null;
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ y: targetY as number, animated: false });
                currentScrollYRef.current = targetY as number;
            });
        }
    }, [columns, filtered, gridGap, gridTopY, imageHeight, isLoading]);

    return (
        <View style={styles.root}>
            <ScrollView
                ref={scrollRef}
                style={styles.root}
                contentContainerStyle={{ paddingBottom: 24 }}
                scrollEventThrottle={16}
                onScroll={(event) => {
                    currentScrollYRef.current = event.nativeEvent.contentOffset.y;
                }}
                onScrollBeginDrag={closeOpenMenu}
                onMomentumScrollBegin={closeOpenMenu}
            >
                <MarketAnnouncementBar
                    compact
                    announcement={t('listing_page.announcement')}
                    notifyText={t('listing_page.notify')}
                    currentLang={lang}
                    langOpen={langOpen}
                    langOptions={LANGUAGE_OPTIONS.map((opt) => ({ code: opt.code, label: opt.label }))}
                    onToggleLang={() => setLangOpen((v) => !v)}
                    onSelectLang={(code) => {
                        setLanguage(code);
                        setLangOpen(false);
                    }}
                />

                <View style={[styles.mainWrap, { paddingHorizontal: containerPadding }]}> 
                    <MarketTopNav
                        onBrandPress={() => router.push('/')}
                        primaryLabel={t('listing_page.home')}
                        onPrimaryPress={() => router.push('/')}
                        onSearchPress={() => setSearchOpen((v) => !v)}
                        wordmarkSize={brandWordmarkSize}
                        marginTop={28}
                        stack={isMobile}
                    />

                    {searchOpen && (
                        <View style={styles.searchPanel}>
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder={t('listing_page.search_placeholder')}
                                placeholderTextColor="rgba(51,51,52,0.55)"
                                style={styles.searchInput}
                            />
                        </View>
                    )}

                    <ListingHeroControls
                        isMobile={isMobile}
                        heroTop={t('listing_page.hero_top')}
                        heroBottom={t('listing_page.hero_bottom')}
                        heroFontSize={heroFontSize}
                        heroTextMaxWidth={heroTextMaxWidth}
                        heroStyle={heroStyle}
                        sortStyle={sortStyle}
                        sortHeading={sortHeading}
                        sortLabelSize={sortLabelSize}
                        controlPanelWidth={controlPanelWidth}
                        seasonLabel={t('listing_page.season_filter')}
                        genderLabel={t('listing_page.gender_filter')}
                        categoryLabel={t('listing_page.category_filter')}
                        sortLabel={t('listing_page.sort_filter')}
                        selectedSeasonLabel={selectedSeasonLabel}
                        selectedGenderLabel={selectedGenderLabel}
                        selectedCategoryLabel={selectedCategoryLabel}
                        selectedSortLabel={selectedSortLabel}
                        seasonOptions={seasonOptions}
                        genderOptions={genderOptions}
                        categoryOptions={categoryOptions}
                        sortOptions={sortOptions}
                        selectedSeasonValue={seasonFilter}
                        selectedGenderValue={genderFilter}
                        selectedCategoryValue={categoryFilter}
                        selectedSortValue={sortBy}
                        openMenu={openMenu}
                        onToggleMenu={toggleMenu}
                        onSelectSeason={(value) => {
                            setSeasonFilter(value);
                            setOpenMenu(null);
                        }}
                        onSelectGender={(value) => {
                            setGenderFilter(value);
                            setOpenMenu(null);
                        }}
                        onSelectCategory={(value) => {
                            setCategoryFilter(value as ListingCategoryFilter);
                            setOpenMenu(null);
                        }}
                        onSelectSort={(value) => {
                            setSortBy(value as SortKey);
                            setOpenMenu(null);
                        }}
                    />

                    <ListingProductGrid
                        isLoading={isLoading}
                        loadingText={t('listing_page.loading')}
                        emptyText={t('listing_page.empty')}
                        viewDetailsText={t('listing_page.view_details')}
                        imagePlaceholderText={t('listing_page.image_preparing')}
                        items={filtered}
                        cardWidth={cardWidth}
                        imageHeight={imageHeight}
                        cardNameSize={cardNameSize}
                        cardNameLineHeight={cardNameLineHeight}
                        cardPriceSize={cardPriceSize}
                        cardPriceLineHeight={cardPriceLineHeight}
                        cardAnimById={cardAnimById}
                        hoverScaleById={hoverScale}
                        ctaHoverById={ctaHover}
                        onHoverChange={animateHover}
                        onOpenDetail={openDetailFromListing}
                        onCardLayout={(id, y) => {
                            cardOffsetByIdRef.current[id] = y;
                        }}
                        onGridLayout={(y) => {
                            setGridTopY(y);
                        }}
                        gridGap={gridGap}
                    />
                </View>

                <Footer
                    onBackToTop={() => {
                        scrollRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: OFF_BEIGE,
    },
    mainWrap: {
        width: '100%',
        alignSelf: 'center',
    },
    searchPanel: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.14)',
        backgroundColor: 'rgba(255,255,255,0.34)',
        borderRadius: 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        color: CHARCOAL,
        fontSize: 15,
        paddingVertical: 2,
    },
});
