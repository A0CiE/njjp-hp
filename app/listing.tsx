import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    ImageSourcePropType,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '../src/i18n/provider';
import { loadListingProducts, type RuntimeListingProduct } from '../src/data/listingProductsRuntime';

type SortKey = 'price' | 'productNumber' | 'productYear';
type MenuKey = 'season' | 'gender' | 'sort' | null;
type AppLang = 'en' | 'ja' | 'zh';
type DropdownOption = { value: string; label: string };

const ALL_FILTER_VALUE = '__ALL__';

type Apparel = {
    code: string;
    name: string;
    category: string;
    season: string;
    gender: string;
    releaseYear: number;
    price: number;
    image: ImageSourcePropType;
};

const PLACEHOLDER_IMAGES: ImageSourcePropType[] = [
    require('../src/assets/service-card-1.jpg'),
    require('../src/assets/service-card-2.jpg'),
    require('../src/assets/service-card-3.jpg'),
];

const LANG_OPTIONS: { code: AppLang; shortLabel: string; label: string }[] = [
    { code: 'en', shortLabel: 'EN', label: 'English' },
    { code: 'zh', shortLabel: 'ZH', label: '中文' },
    { code: 'ja', shortLabel: 'JA', label: '日本語' },
];

const COPY: Record<
    AppLang,
    {
        announcement: string;
        notify: string;
        home: string;
        searchPlaceholder: string;
        heroTop: string;
        heroBottom: string;
        viewDetails: string;
        loading: string;
        empty: string;
        allOption: string;
        seasonFilter: string;
        genderFilter: string;
        sortFilter: string;
        sortOptions: Record<SortKey, string>;
    }
> = {
    en: {
        announcement: "We're just getting started. Get updates as new apparels are added.",
        notify: 'Get notified',
        home: 'Home',
        searchPlaceholder: 'Search apparels',
        heroTop: 'Buy apparels at',
        heroBottom: 'the lowest cash prices.',
        viewDetails: 'View details',
        loading: 'Loading apparels...',
        empty: 'No products found.',
        allOption: 'All',
        seasonFilter: 'Season',
        genderFilter: 'Gender',
        sortFilter: 'Sort',
        sortOptions: {
            price: 'Price (Low to High)',
            productNumber: 'Product Number',
            productYear: 'Product Year',
        },
    },
    zh: {
        announcement: '我们才刚刚开始。新增服装上架后会第一时间通知。',
        notify: '接收通知',
        home: '首页',
        searchPlaceholder: '搜索服装',
        heroTop: '以最低现金价',
        heroBottom: '购买服装。',
        viewDetails: '查看详情',
        loading: '正在加载服装...',
        empty: '未找到商品。',
        allOption: '全部',
        seasonFilter: '季节',
        genderFilter: '性别',
        sortFilter: '排序',
        sortOptions: {
            price: '价格（从低到高）',
            productNumber: '产品编号',
            productYear: '产品年份',
        },
    },
    ja: {
        announcement: 'サービスは始まったばかりです。新商品追加時にお知らせします。',
        notify: '通知を受け取る',
        home: 'ホーム',
        searchPlaceholder: 'アパレルを検索',
        heroTop: 'アパレルを',
        heroBottom: '最安キャッシュ価格で。',
        viewDetails: '詳細を見る',
        loading: 'アパレルを読み込み中...',
        empty: '商品が見つかりません。',
        allOption: 'すべて',
        seasonFilter: 'シーズン',
        genderFilter: '性別',
        sortFilter: '並び替え',
        sortOptions: {
            price: '価格（安い順）',
            productNumber: '品番順',
            productYear: '発売年順',
        },
    },
};

const CHARCOAL = '#333334';
const OFF_BEIGE = '#ECEADD';
const PANEL_BEIGE = '#E6E4D7';
const PRICE_GREEN = '#366E56';

const compareCodes = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

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

const releaseYear = (item: RuntimeListingProduct): number => {
    const text = `${item.productName} ${item.season}`;
    const matched = text.match(/\b(20\d{2})\b/);
    if (matched) {
        const parsed = Number.parseInt(matched[1], 10);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return 2025;
};

const compareByYearSeasonCode = (a: Apparel, b: Apparel): number => {
    const yearDiff = b.releaseYear - a.releaseYear;
    if (yearDiff !== 0) {
        return yearDiff;
    }
    const seasonDiff = seasonRank(b.season) - seasonRank(a.season);
    if (seasonDiff !== 0) {
        return seasonDiff;
    }
    return compareCodes(a.code, b.code);
};

export default function ListingPage() {
    const router = useRouter();
    const { currentLanguage, setLanguage } = useI18n();
    const { width } = useWindowDimensions();

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [langOpen, setLangOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuKey>(null);
    const [sortBy, setSortBy] = useState<SortKey>('productYear');
    const [seasonFilter, setSeasonFilter] = useState(ALL_FILTER_VALUE);
    const [genderFilter, setGenderFilter] = useState(ALL_FILTER_VALUE);
    const [rawProducts, setRawProducts] = useState<RuntimeListingProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const heroReveal = useRef(new Animated.Value(0)).current;
    const sortReveal = useRef(new Animated.Value(0)).current;
    const cardReveal = useRef<Animated.Value[]>([]).current;
    const hoverScale = useRef<Record<string, Animated.Value>>({}).current;

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

            if (!hoverScale[item.code]) {
                hoverScale[item.code] = new Animated.Value(1);
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

    const lang: AppLang = currentLanguage === 'zh' || currentLanguage === 'ja' || currentLanguage === 'en'
        ? currentLanguage
        : 'en';
    const copy = COPY[lang];
    const currentLangOption = LANG_OPTIONS.find((option) => option.code === lang) ?? LANG_OPTIONS[0];

    const products = useMemo<Apparel[]>(
        () =>
            rawProducts.map((item, index) => ({
                code: item.code,
                name: item.productName,
                category: item.genre,
                season: item.season,
                gender: item.gender,
                releaseYear: releaseYear(item),
                price: item.finalPriceYen,
                image: item.imageUrl
                    ? { uri: item.imageUrl }
                    : PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
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
                item.code.toLowerCase().includes(q);
            const seasonMatched = seasonFilter === ALL_FILTER_VALUE || item.season === seasonFilter;
            const genderMatched = genderFilter === ALL_FILTER_VALUE || item.gender === genderFilter;
            return queryMatched && seasonMatched && genderMatched;
        });

        const sorted = [...rows];
        sorted.sort((a, b) => {
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
                return compareByYearSeasonCode(a, b);
            }
            return compareByYearSeasonCode(a, b);
        });
        return sorted;
    }, [genderFilter, products, query, seasonFilter, sortBy]);

    const cardAnimById = useMemo(() => {
        return rawProducts.reduce((acc, item, index) => {
            acc[item.code] = cardReveal[index];
            return acc;
        }, {} as Record<string, Animated.Value>);
    }, [cardReveal, rawProducts]);

    const animateHover = (code: string, active: boolean) => {
        const value = hoverScale[code];
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

    const sortOptions = useMemo<DropdownOption[]>(
        () =>
            (Object.keys(copy.sortOptions) as SortKey[]).map((key) => ({
                value: key,
                label: copy.sortOptions[key],
            })),
        [copy],
    );

    const seasonOptions = useMemo<DropdownOption[]>(() => {
        const values = [...new Set(rawProducts.map((item) => item.season).filter(Boolean))];
        values.sort((a, b) => {
            const rankDiff = seasonRank(b) - seasonRank(a);
            if (rankDiff !== 0) {
                return rankDiff;
            }
            return a.localeCompare(b);
        });
        return [{ value: ALL_FILTER_VALUE, label: copy.allOption }, ...values.map((value) => ({ value, label: value }))];
    }, [copy.allOption, rawProducts]);

    const genderOptions = useMemo<DropdownOption[]>(() => {
        const values = [...new Set(rawProducts.map((item) => item.gender).filter(Boolean))];
        values.sort((a, b) => a.localeCompare(b));
        return [{ value: ALL_FILTER_VALUE, label: copy.allOption }, ...values.map((value) => ({ value, label: value }))];
    }, [copy.allOption, rawProducts]);

    const selectedSortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? sortOptions[0].label;
    const selectedSeasonLabel = seasonOptions.find((option) => option.value === seasonFilter)?.label ?? copy.allOption;
    const selectedGenderLabel = genderOptions.find((option) => option.value === genderFilter)?.label ?? copy.allOption;
    const sortHeading =
        lang === 'en'
            ? `Filter and sort ${filtered.length} apparels`
            : lang === 'ja'
                ? `全${filtered.length}件を絞り込み・並び替え`
                : `筛选并排序，共${filtered.length}件`;

    const isMobile = width <= 800;
    const isTablet = width <= 1150;
    const containerPadding = width > 1320 ? 66 : width > 980 ? 40 : 18;
    const gridGap = 28;
    const columns = isMobile ? 1 : isTablet ? 2 : 3;
    const contentWidth = Math.max(0, width - containerPadding * 2);
    const controlPanelWidth = isMobile ? contentWidth : Math.min(840, Math.max(520, contentWidth * 0.62));
    const cardWidth =
        columns === 1
            ? contentWidth
            : Math.max(220, (contentWidth - gridGap * (columns - 1)) / columns);
    const heroFontSize = Math.max(52, Math.min(78, width * 0.055));
    const imageHeight = isMobile ? 360 : isTablet ? 370 : 470;
    const brandWordmarkSize = isMobile ? 22 : 34;
    const sortLabelSize = isMobile ? 16 : 25;
    const cardNameSize = isMobile ? 34 : isTablet ? 38 : 43;
    const cardPriceSize = isMobile ? 31 : isTablet ? 34 : 38;
    const openDetail = (code: string) => {
        router.push({ pathname: '/p/[code]', params: { code } });
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 48 }}>
                <View style={styles.announcement}>
                    <View style={styles.langWrap}>
                        <Pressable
                            onPress={() => setLangOpen((v) => !v)}
                            style={({ pressed }) => [styles.langBtn, pressed && styles.langBtnPressed]}
                        >
                            <Text style={styles.langBtnText}>{currentLangOption.shortLabel}</Text>
                            <Text style={styles.langCaret}>▾</Text>
                        </Pressable>
                        {langOpen && (
                            <View style={styles.langMenu}>
                                {LANG_OPTIONS.map((option) => {
                                    const active = option.code === lang;
                                    return (
                                        <Pressable
                                            key={option.code}
                                            onPress={() => {
                                                setLanguage(option.code);
                                                setLangOpen(false);
                                            }}
                                            style={({ pressed }) => [
                                                styles.langItem,
                                                active && styles.langItemActive,
                                                pressed && styles.langItemPressed,
                                            ]}
                                        >
                                            <Text style={styles.langItemText}>{option.label}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    <Text style={styles.annText}>{copy.announcement}</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.notifyBtn,
                            pressed && styles.notifyBtnPressed,
                        ]}
                    >
                        <Text style={styles.notifyText}>{copy.notify}</Text>
                    </Pressable>
                </View>

                <View style={[styles.mainWrap, { paddingHorizontal: containerPadding }]}>
                    <View style={[styles.navRow, isMobile && styles.navRowStack]}>
                        <Pressable style={styles.brandWrap} onPress={() => router.push('/')}>
                            <View style={styles.brandMark}>
                                <Text style={styles.brandMarkText}>NJ</Text>
                            </View>
                            <Text style={[styles.brandWordmark, { fontSize: brandWordmarkSize }]}>NANJI JAPAN</Text>
                        </Pressable>

                        <View style={styles.navActions}>
                            <Pressable
                                onPress={() => router.push('/')}
                                style={({ pressed }) => [
                                    styles.navBtn,
                                    pressed && styles.navBtnPressed,
                                ]}
                            >
                                <Text style={styles.navBtnText}>{copy.home}</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setSearchOpen((v) => !v)}
                                style={({ pressed }) => [
                                    styles.searchBtn,
                                    pressed && styles.searchBtnPressed,
                                ]}
                            >
                                <Text style={styles.searchBtnText}>⌕</Text>
                            </Pressable>
                        </View>
                    </View>

                    {searchOpen && (
                        <View style={styles.searchPanel}>
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder={copy.searchPlaceholder}
                                placeholderTextColor="rgba(51,51,52,0.55)"
                                style={styles.searchInput}
                            />
                        </View>
                    )}

                    <View style={[styles.heroRow, isMobile && styles.heroRowStack]}>
                        <Animated.Text
                            style={[
                                styles.heroTitle,
                                heroStyle,
                                {
                                    fontSize: heroFontSize,
                                    lineHeight: Math.round(heroFontSize * 0.96),
                                },
                            ]}
                        >
                            {copy.heroTop}{'\n'}{copy.heroBottom}
                        </Animated.Text>

                        <Animated.View style={[styles.sortBlock, sortStyle, { width: controlPanelWidth }]}>
                            <Text style={[styles.sortLabel, { fontSize: sortLabelSize, lineHeight: Math.round(sortLabelSize * 1.1) }]}>
                                {sortHeading}
                            </Text>
                            <View style={styles.controlRow}>
                                <View style={styles.controlCol}>
                                    <Text style={styles.controlCaption}>{copy.seasonFilter}</Text>
                                    <View style={styles.sortControlWrap}>
                                        <Pressable
                                            onPress={() => setOpenMenu((v) => (v === 'season' ? null : 'season'))}
                                            style={({ pressed }) => [styles.sortTrigger, pressed && styles.sortTriggerPressed]}
                                        >
                                            <Text numberOfLines={1} style={styles.sortTriggerText}>{selectedSeasonLabel}</Text>
                                            <Text style={styles.sortCaret}>⌄</Text>
                                        </Pressable>

                                        {openMenu === 'season' && (
                                            <View style={styles.sortMenu}>
                                                {seasonOptions.map((option) => {
                                                    const active = option.value === seasonFilter;
                                                    return (
                                                        <Pressable
                                                            key={`season-${option.value}`}
                                                            onPress={() => {
                                                                setSeasonFilter(option.value);
                                                                setOpenMenu(null);
                                                            }}
                                                            style={({ pressed }) => [
                                                                styles.sortItem,
                                                                active && styles.sortItemActive,
                                                                pressed && styles.sortItemPressed,
                                                            ]}
                                                        >
                                                            <Text style={styles.sortItemText}>{option.label}</Text>
                                                        </Pressable>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.controlCol}>
                                    <Text style={styles.controlCaption}>{copy.genderFilter}</Text>
                                    <View style={styles.sortControlWrap}>
                                        <Pressable
                                            onPress={() => setOpenMenu((v) => (v === 'gender' ? null : 'gender'))}
                                            style={({ pressed }) => [styles.sortTrigger, pressed && styles.sortTriggerPressed]}
                                        >
                                            <Text numberOfLines={1} style={styles.sortTriggerText}>{selectedGenderLabel}</Text>
                                            <Text style={styles.sortCaret}>⌄</Text>
                                        </Pressable>

                                        {openMenu === 'gender' && (
                                            <View style={styles.sortMenu}>
                                                {genderOptions.map((option) => {
                                                    const active = option.value === genderFilter;
                                                    return (
                                                        <Pressable
                                                            key={`gender-${option.value}`}
                                                            onPress={() => {
                                                                setGenderFilter(option.value);
                                                                setOpenMenu(null);
                                                            }}
                                                            style={({ pressed }) => [
                                                                styles.sortItem,
                                                                active && styles.sortItemActive,
                                                                pressed && styles.sortItemPressed,
                                                            ]}
                                                        >
                                                            <Text style={styles.sortItemText}>{option.label}</Text>
                                                        </Pressable>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.controlCol}>
                                    <Text style={styles.controlCaption}>{copy.sortFilter}</Text>
                                    <View style={styles.sortControlWrap}>
                                        <Pressable
                                            onPress={() => setOpenMenu((v) => (v === 'sort' ? null : 'sort'))}
                                            style={({ pressed }) => [styles.sortTrigger, pressed && styles.sortTriggerPressed]}
                                        >
                                            <Text numberOfLines={1} style={styles.sortTriggerText}>{selectedSortLabel}</Text>
                                            <Text style={styles.sortCaret}>⌄</Text>
                                        </Pressable>

                                        {openMenu === 'sort' && (
                                            <View style={styles.sortMenu}>
                                                {sortOptions.map((option) => {
                                                    const active = option.value === sortBy;
                                                    return (
                                                        <Pressable
                                                            key={option.value}
                                                            onPress={() => {
                                                                setSortBy(option.value as SortKey);
                                                                setOpenMenu(null);
                                                            }}
                                                            style={({ pressed }) => [
                                                                styles.sortItem,
                                                                active && styles.sortItemActive,
                                                                pressed && styles.sortItemPressed,
                                                            ]}
                                                        >
                                                            <Text style={styles.sortItemText}>{option.label}</Text>
                                                        </Pressable>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </View>

                    <View style={[styles.grid, { gap: gridGap }]}>
                        {isLoading ? (
                            <View style={styles.stateWrap}>
                                <Text style={styles.stateText}>{copy.loading}</Text>
                            </View>
                        ) : filtered.length === 0 ? (
                            <View style={styles.stateWrap}>
                                <Text style={styles.stateText}>{copy.empty}</Text>
                            </View>
                        ) : (
                            filtered.map((item) => {
                                const reveal = cardAnimById[item.code];
                                const revealStyle = {
                                    opacity: reveal ?? 1,
                                    transform: reveal
                                        ? [
                                            {
                                                translateY: reveal.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [22, 0],
                                                }),
                                            },
                                        ]
                                        : [{ translateY: 0 }],
                                };
                                return (
                                    <Animated.View key={item.code} style={[styles.cardShell, { width: cardWidth }, revealStyle]}>
                                        <Pressable
                                            onHoverIn={() => animateHover(item.code, true)}
                                            onHoverOut={() => animateHover(item.code, false)}
                                            onPress={() => openDetail(item.code)}
                                            style={styles.cardPress}
                                        >
                                            <View style={[styles.imagePanel, { height: imageHeight }]}>
                                                <Animated.Image
                                                    source={item.image}
                                                    resizeMode="contain"
                                                    style={[
                                                        styles.itemImage,
                                                        {
                                                            transform: [{ scale: hoverScale[item.code] ?? 1 }],
                                                        },
                                                    ]}
                                                />
                                            </View>

                                            <View style={styles.cardTextWrap}>
                                                <Text
                                                    style={[
                                                        styles.cardName,
                                                        {
                                                            fontSize: cardNameSize,
                                                            lineHeight: Math.round(cardNameSize * 1.04),
                                                        },
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.cardCode}>{item.code}</Text>
                                                <Text
                                                    style={[
                                                        styles.cardPrice,
                                                        {
                                                            fontSize: cardPriceSize,
                                                            lineHeight: Math.round(cardPriceSize * 1.05),
                                                        },
                                                    ]}
                                                >
                                                    ¥{item.price.toFixed(0)}
                                                </Text>

                                                <Pressable
                                                    onPress={() => openDetail(item.code)}
                                                    style={({ pressed }) => [
                                                        styles.viewBtn,
                                                        pressed && styles.viewBtnPressed,
                                                    ]}
                                                >
                                                    <Text style={styles.viewBtnText}>{copy.viewDetails}</Text>
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                );
                            })
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: OFF_BEIGE,
    },
    announcement: {
        height: 38,
        backgroundColor: '#E0DDCF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(51,51,52,0.08)',
        zIndex: 30,
    },
    langWrap: {
        minWidth: 82,
        position: 'relative',
    },
    langBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.3)',
        borderRadius: 2,
        height: 28,
        paddingHorizontal: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.22)',
    },
    langBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.1)',
    },
    langBtnText: {
        color: CHARCOAL,
        fontSize: 12,
        fontWeight: '700',
    },
    langCaret: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 12,
    },
    langMenu: {
        position: 'absolute',
        top: 30,
        left: 0,
        minWidth: 112,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        backgroundColor: OFF_BEIGE,
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 40,
    },
    langItem: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    langItemActive: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    langItemPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    langItemText: {
        color: CHARCOAL,
        fontSize: 12,
    },
    annText: {
        flex: 1,
        color: CHARCOAL,
        fontSize: 12,
        opacity: 0.9,
        textAlign: 'center',
    },
    notifyBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.4)',
        paddingHorizontal: 14,
        height: 28,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    notifyBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    notifyText: {
        color: CHARCOAL,
        fontSize: 12,
    },
    mainWrap: {
        width: '100%',
        alignSelf: 'center',
    },
    navRow: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    navRowStack: {
        alignItems: 'flex-start',
    },
    brandWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandMark: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#E62A2A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandMarkText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
    },
    brandWordmark: {
        color: '#111',
        fontWeight: '900',
        fontSize: 34,
        letterSpacing: 0.2,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    navBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.5)',
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    navBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    navBtnText: {
        color: CHARCOAL,
        fontSize: 14,
    },
    searchBtn: {
        width: 36,
        height: 36,
        borderRadius: 2,
        backgroundColor: CHARCOAL,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBtnPressed: {
        backgroundColor: '#1f1f20',
    },
    searchBtnText: {
        color: '#FDFBF0',
        fontSize: 19,
        marginTop: -2,
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
    heroRow: {
        marginTop: 82,
        marginBottom: 56,
        minHeight: 172,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 20,
        position: 'relative',
        zIndex: 12,
        overflow: 'visible',
    },
    heroRowStack: {
        marginTop: 56,
        marginBottom: 30,
        minHeight: 120,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 18,
    },
    heroTitle: {
        color: CHARCOAL,
        fontFamily: 'serif',
        letterSpacing: -1.2,
        maxWidth: 600,
    },
    sortBlock: {
        maxWidth: '100%',
        zIndex: 20,
        overflow: 'visible',
    },
    sortLabel: {
        color: CHARCOAL,
        fontSize: 25,
        lineHeight: 28,
        marginBottom: 8,
    },
    sortControlWrap: {
        position: 'relative',
        zIndex: 30,
        overflow: 'visible',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        flexWrap: 'wrap',
    },
    controlCol: {
        flex: 1,
        minWidth: 150,
    },
    controlCaption: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 12,
        marginBottom: 6,
    },
    sortTrigger: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        backgroundColor: OFF_BEIGE,
        height: 42,
        borderRadius: 2,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortTriggerPressed: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    sortTriggerText: {
        color: CHARCOAL,
        fontSize: 15,
        flex: 1,
        paddingRight: 10,
    },
    sortCaret: {
        color: CHARCOAL,
        fontSize: 16,
    },
    sortMenu: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        borderRadius: 2,
        backgroundColor: OFF_BEIGE,
        overflow: 'hidden',
        zIndex: 40,
        elevation: 6,
    },
    sortItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    sortItemActive: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    sortItemPressed: {
        backgroundColor: 'rgba(51,51,52,0.06)',
    },
    sortItemText: {
        color: CHARCOAL,
        fontSize: 14,
    },
    grid: {
        position: 'relative',
        zIndex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    stateWrap: {
        width: '100%',
        minHeight: 180,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.12)',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.22)',
    },
    stateText: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 16,
    },
    cardShell: {
        marginBottom: 14,
    },
    cardPress: {
        width: '100%',
    },
    imagePanel: {
        width: '100%',
        backgroundColor: PANEL_BEIGE,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    itemImage: {
        width: '78%',
        height: '78%',
    },
    cardTextWrap: {
        alignItems: 'center',
        paddingTop: 18,
        paddingHorizontal: 10,
    },
    cardName: {
        textAlign: 'center',
        color: CHARCOAL,
        fontFamily: 'serif',
    },
    cardCode: {
        marginTop: 4,
        color: 'rgba(51,51,52,0.6)',
        fontSize: 11,
        letterSpacing: 0.6,
    },
    cardPrice: {
        marginTop: 6,
        textAlign: 'center',
        color: PRICE_GREEN,
        fontWeight: '600',
    },
    viewBtn: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.14)',
        borderRadius: 10,
        minWidth: 122,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.22)',
    },
    viewBtnText: {
        color: 'rgba(51,51,52,0.74)',
        fontSize: 14,
    },
});
