import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useI18n } from '../src/i18n/provider';
import { loadListingProducts, type RuntimeListingProduct } from '../src/data/listingProductsRuntime';
import { withImageSize } from '../src/data/imageUrl';
import MarketAnnouncementBar from '../src/components/sections/market/MarketAnnouncementBar';
import MarketTopNav from '../src/components/sections/market/MarketTopNav';
import ListingHeroControls, {
    type ListingDropdownOption,
    type ListingMenuKey,
} from '../src/components/sections/listing/ListingHeroControls';
import ListingProductGrid from '../src/components/sections/listing/ListingProductGrid';
import Footer from '../src/components/sections/Footer';

type SortKey = 'default' | 'price' | 'productNumber' | 'productYear';
type AppLang = 'en' | 'ja' | 'zh';

const ALL_FILTER_VALUE = '__ALL__';
const OFF_BEIGE = '#ECEADD';
const CHARCOAL = '#333334';

const LANG_OPTIONS: { code: AppLang; shortLabel: string; label: string }[] = [
    { code: 'en', shortLabel: 'EN', label: 'English' },
    { code: 'zh', shortLabel: 'ZH', label: '中文' },
    { code: 'ja', shortLabel: 'JA', label: '日本語' },
];

type ApparelCard = {
    id: number;
    code: string | null;
    name: string;
    category: string;
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

export default function ListingPage() {
    const router = useRouter();
    const { currentLanguage, setLanguage } = useI18n();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [langOpen, setLangOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<ListingMenuKey>(null);
    const [sortBy, setSortBy] = useState<SortKey>('default');
    const [seasonFilter, setSeasonFilter] = useState(ALL_FILTER_VALUE);
    const [genderFilter, setGenderFilter] = useState(ALL_FILTER_VALUE);
    const [rawProducts, setRawProducts] = useState<RuntimeListingProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const heroReveal = useRef(new Animated.Value(0)).current;
    const sortReveal = useRef(new Animated.Value(0)).current;
    const cardReveal = useRef<Animated.Value[]>([]).current;
    const hoverScale = useRef<Record<string, Animated.Value>>({}).current;
    const scrollRef = useRef<ScrollView>(null);

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
        });

        cardReveal.length = rawProducts.length;

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
    }, [cardReveal, hoverScale, rawProducts]);

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

    const lang: AppLang = currentLanguage === 'zh' || currentLanguage === 'ja' || currentLanguage === 'en' ? currentLanguage : 'en';
    const currentLangOption = LANG_OPTIONS.find((option) => option.code === lang) ?? LANG_OPTIONS[0];

    const products = useMemo<ApparelCard[]>(
        () =>
            rawProducts.map((item) => ({
                id: item.id,
                code: item.code,
                name: item.productName,
                category: item.genre,
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
                item.category.toLowerCase().includes(q) ||
                (item.code ?? '').toLowerCase().includes(q);
            const seasonMatched = seasonFilter === ALL_FILTER_VALUE || item.season === seasonFilter;
            const genderMatched = genderFilter === ALL_FILTER_VALUE || item.gender === genderFilter;
            return queryMatched && seasonMatched && genderMatched;
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
    }, [genderFilter, products, query, seasonFilter, sortBy]);

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

    const cardAnimById = useMemo(() => {
        return rawProducts.reduce((acc, item, index) => {
            acc[String(item.id)] = cardReveal[index];
            return acc;
        }, {} as Record<string, Animated.Value | undefined>);
    }, [cardReveal, rawProducts]);

    const selectedSortLabel =
        sortBy === 'default'
            ? t('listing_page.default_order')
            : sortOptions.find((option) => option.value === sortBy)?.label ?? sortOptions[0].label;
    const selectedSeasonLabel = seasonOptions.find((option) => option.value === seasonFilter)?.label ?? t('listing_page.all_option');
    const selectedGenderLabel = genderOptions.find((option) => option.value === genderFilter)?.label ?? t('listing_page.all_option');
    const sortHeading = t('listing_page.sort_heading', { count: filtered.length });

    const isMobile = width <= 800;
    const isTablet = width <= 980;
    const containerPadding = width > 1320 ? 66 : width > 980 ? 40 : 18;
    const gridGap = 28;
    const columns = isMobile ? 1 : isTablet ? 2 : 3;
    const contentWidth = Math.max(0, width - containerPadding * 2);
    const controlPanelWidth = isMobile ? contentWidth : Math.min(840, Math.max(520, contentWidth * 0.62));
    const cardWidth = columns === 1 ? contentWidth : Math.max(220, (contentWidth - gridGap * (columns - 1)) / columns);
    const heroFontSize = Math.max(52, Math.min(78, width * 0.055));
    const brandWordmarkSize = isMobile ? 22 : 34;
    const imageHeight = isMobile ? 360 : isTablet ? 370 : 470;
    const sortLabelSize = isMobile ? 16 : 25;
    const cardNameSize = isMobile ? 34 : isTablet ? 38 : 43;
    const cardPriceSize = isMobile ? 31 : isTablet ? 34 : 38;

    const animateHover = (id: number, active: boolean) => {
        const value = hoverScale[String(id)];
        if (!value) {
            return;
        }

        Animated.spring(value, {
            toValue: active ? 1.03 : 1,
            useNativeDriver: true,
            friction: 8,
            tension: 140,
        }).start();
    };

    const closeOpenMenu = () => {
        setOpenMenu((prev) => (prev === null ? prev : null));
    };

    const toggleMenu = (key: Exclude<ListingMenuKey, null>) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };

    return (
        <View style={styles.root}>
            <ScrollView
                ref={scrollRef}
                style={styles.root}
                contentContainerStyle={{ paddingBottom: 24 }}
                onScrollBeginDrag={closeOpenMenu}
                onMomentumScrollBegin={closeOpenMenu}
            >
                <MarketAnnouncementBar
                    compact
                    announcement={t('listing_page.announcement')}
                    notifyText={t('listing_page.notify')}
                    currentShortLabel={currentLangOption.shortLabel}
                    currentLang={lang}
                    langOpen={langOpen}
                    langOptions={LANG_OPTIONS.map((opt) => ({ code: opt.code, label: opt.label }))}
                    onToggleLang={() => setLangOpen((v) => !v)}
                    onSelectLang={(code) => {
                        setLanguage(code as AppLang);
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
                        heroStyle={heroStyle}
                        sortStyle={sortStyle}
                        sortHeading={sortHeading}
                        sortLabelSize={sortLabelSize}
                        controlPanelWidth={controlPanelWidth}
                        seasonLabel={t('listing_page.season_filter')}
                        genderLabel={t('listing_page.gender_filter')}
                        sortLabel={t('listing_page.sort_filter')}
                        selectedSeasonLabel={selectedSeasonLabel}
                        selectedGenderLabel={selectedGenderLabel}
                        selectedSortLabel={selectedSortLabel}
                        seasonOptions={seasonOptions}
                        genderOptions={genderOptions}
                        sortOptions={sortOptions}
                        selectedSeasonValue={seasonFilter}
                        selectedGenderValue={genderFilter}
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
                        cardPriceSize={cardPriceSize}
                        cardAnimById={cardAnimById}
                        hoverScaleById={hoverScale}
                        onHoverChange={animateHover}
                        onOpenDetail={(id) => router.push({ pathname: '/p/[code]', params: { code: String(id) } })}
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
