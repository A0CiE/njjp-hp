import React, { useEffect, useMemo, useState } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n } from '../../src/i18n/provider';
import { loadListingProducts, type RuntimeListingProduct } from '../../src/data/listingProductsRuntime';

type AppLang = 'en' | 'ja' | 'zh';

const CHARCOAL = '#333334';
const OFF_BEIGE = '#ECEADD';
const PANEL_BEIGE = '#E6E4D7';
const PRICE_GREEN = '#366E56';

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
        browse: string;
        home: string;
        detailsTitle: string;
        productCode: string;
        season: string;
        gender: string;
        productName: string;
        colorRange: string;
        genre: string;
        sizeRange: string;
        material: string;
        feature: string;
        trimSpec: string;
        finalPrice: string;
        backToList: string;
        productMissing: string;
        notFoundBody: string;
        loadingProducts: string;
    }
> = {
    en: {
        announcement: "We're just getting started. Get updates as new apparels are added.",
        notify: 'Get notified',
        browse: 'Browse Apparels',
        home: 'Home',
        detailsTitle: 'Product Specifications',
        productCode: 'Product code',
        season: 'Season',
        gender: 'Gender',
        productName: 'Product Name',
        colorRange: 'Color Range',
        genre: 'Genre',
        sizeRange: 'Size Range',
        material: 'Material',
        feature: 'Feature',
        trimSpec: 'Trim Specification',
        finalPrice: 'Final Price (仕入価格)',
        backToList: 'Back to listing',
        productMissing: 'Product not found',
        notFoundBody: 'This product code does not exist in the current listing dataset.',
        loadingProducts: 'Loading product details...',
    },
    zh: {
        announcement: '我们才刚刚开始。新增服装上架后会第一时间通知。',
        notify: '接收通知',
        browse: '服装列表',
        home: '首页',
        detailsTitle: '产品规格',
        productCode: '产品编码',
        season: '季节',
        gender: '性别',
        productName: '产品名',
        colorRange: '颜色范围',
        genre: '类目',
        sizeRange: '尺码范围',
        material: '素材构成',
        feature: '特长',
        trimSpec: '副资材规格',
        finalPrice: '最终价格（仕入価格）',
        backToList: '返回列表',
        productMissing: '未找到该产品',
        notFoundBody: '当前数据中不存在这个产品编码。',
        loadingProducts: '正在加载产品详情...',
    },
    ja: {
        announcement: 'サービスは始まったばかりです。新商品追加時にお知らせします。',
        notify: '通知を受け取る',
        browse: 'アパレル一覧',
        home: 'ホーム',
        detailsTitle: '商品仕様',
        productCode: '商品コード',
        season: 'シーズン',
        gender: '性別',
        productName: '商品名',
        colorRange: 'カラー展開',
        genre: 'ジャンル',
        sizeRange: 'サイズ展開',
        material: '素材構成',
        feature: '特長',
        trimSpec: '副資材仕様',
        finalPrice: '最終価格（仕入価格）',
        backToList: '一覧へ戻る',
        productMissing: '商品が見つかりません',
        notFoundBody: 'この商品コードは現在の一覧データに存在しません。',
        loadingProducts: '商品詳細を読み込み中...',
    },
};

const PLACEHOLDER_IMAGES: ImageSourcePropType[] = [
    require('../../src/assets/service-card-1.jpg'),
    require('../../src/assets/service-card-2.jpg'),
    require('../../src/assets/service-card-3.jpg'),
];

const toLang = (v: string): AppLang => (v === 'zh' || v === 'ja' || v === 'en' ? v : 'en');

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useLocalSearchParams<{ code?: string | string[] }>();
    const { currentLanguage, setLanguage } = useI18n();
    const { width } = useWindowDimensions();

    const [langOpen, setLangOpen] = useState(false);
    const [products, setProducts] = useState<RuntimeListingProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            try {
                const rows = await loadListingProducts();
                if (!cancelled) {
                    setProducts(rows);
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

    const codeParam = Array.isArray(params.code) ? params.code[0] : params.code;
    const productIndex = useMemo(
        () => products.findIndex((item) => item.code === codeParam),
        [codeParam, products],
    );
    const product = productIndex >= 0 ? products[productIndex] : null;

    const lang: AppLang = toLang(currentLanguage) as AppLang;
    const copy = COPY[lang];
    const currentLangOption = LANG_OPTIONS.find((option) => option.code === lang) ?? LANG_OPTIONS[0];

    const isMobile = width <= 1120;
    const heroTitleSize = isMobile ? 54 : 74;
    const imageHeight = isMobile ? 460 : 760;

    const imageSource =
        product?.imageUrl
            ? { uri: product.imageUrl }
            : productIndex >= 0
                ? PLACEHOLDER_IMAGES[productIndex % PLACEHOLDER_IMAGES.length]
                : PLACEHOLDER_IMAGES[0];

    if (!product) {
        return (
            <View style={styles.root}>
                <ScrollView style={styles.root}>
                    <View style={styles.announcement}>
                        <View style={styles.langWrap}>
                            <Pressable onPress={() => setLangOpen((v) => !v)} style={styles.langBtn}>
                                <Text style={styles.langBtnText}>{currentLangOption.shortLabel}</Text>
                                <Text style={styles.langCaret}>▾</Text>
                            </Pressable>
                            {langOpen && (
                                <View style={styles.langMenu}>
                                    {LANG_OPTIONS.map((option) => (
                                        <Pressable
                                            key={option.code}
                                            onPress={() => {
                                                setLanguage(option.code);
                                                setLangOpen(false);
                                            }}
                                            style={styles.langItem}
                                        >
                                            <Text style={styles.langItemText}>{option.label}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text style={styles.annText}>{copy.announcement}</Text>
                        <View style={styles.notifyBtn}>
                            <Text style={styles.notifyText}>{copy.notify}</Text>
                        </View>
                    </View>

                    <View style={styles.notFoundWrap}>
                        <Text style={styles.notFoundTitle}>{isLoading ? copy.loadingProducts : copy.productMissing}</Text>
                        <Text style={styles.notFoundBody}>{isLoading ? '' : copy.notFoundBody}</Text>
                        <Pressable style={styles.backBtn} onPress={() => router.push('/listing')}>
                            <Text style={styles.backBtnText}>{copy.backToList}</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const name = product.productName;
    const detailRows = [
        { label: copy.season, value: product.season },
        { label: copy.gender, value: product.gender },
        { label: copy.productName, value: product.productName },
        { label: copy.colorRange, value: product.colorRange },
        { label: copy.genre, value: product.genre },
        { label: copy.sizeRange, value: product.sizeRange },
        { label: copy.material, value: product.material },
        { label: copy.feature, value: product.feature },
        { label: copy.trimSpec, value: product.trimSpec },
    ];

    return (
        <View style={styles.root}>
            <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.announcement}>
                    <View style={styles.langWrap}>
                        <Pressable onPress={() => setLangOpen((v) => !v)} style={styles.langBtn}>
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
                                            style={[styles.langItem, active && styles.langItemActive]}
                                        >
                                            <Text style={styles.langItemText}>{option.label}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                    <Text style={styles.annText}>{copy.announcement}</Text>
                    <View style={styles.notifyBtn}>
                        <Text style={styles.notifyText}>{copy.notify}</Text>
                    </View>
                </View>

                <View style={styles.navRow}>
                    <Pressable style={styles.brandWrap} onPress={() => router.push('/')}>
                        <View style={styles.brandMark}>
                            <Text style={styles.brandMarkText}>NJ</Text>
                        </View>
                        <Text style={[styles.brandWordmark, { fontSize: isMobile ? 22 : 34 }]}>NANJI JAPAN</Text>
                    </Pressable>
                    <View style={styles.navActions}>
                        <Pressable style={styles.navBtn} onPress={() => router.push('/listing')}>
                            <Text style={styles.navBtnText}>{copy.browse}</Text>
                        </Pressable>
                        <Pressable style={styles.searchBtn} onPress={() => router.push('/listing')}>
                            <Text style={styles.searchBtnText}>⌕</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={[styles.contentRow, isMobile && styles.contentCol]}>
                    <View style={[styles.imagePanel, { height: imageHeight }]}>
                        <Image source={imageSource} resizeMode="contain" style={styles.productImage} />
                    </View>

                    <View style={styles.detailCol}>
                        <Text style={[styles.title, { fontSize: heroTitleSize, lineHeight: Math.round(heroTitleSize * 0.95) }]}>
                            {name}
                        </Text>
                        <Text style={styles.subText}>
                            {copy.productCode}: {product.code}
                        </Text>
                        <Text style={styles.priceLabelTop}>{copy.finalPrice}</Text>
                        <Text style={styles.finalPriceValue}>¥{product.finalPriceYen.toFixed(0)}</Text>

                        <Text style={styles.sectionTitle}>{copy.detailsTitle}</Text>

                        <View style={styles.infoCard}>
                            {detailRows.map((row, index) => (
                                <View key={row.label}>
                                    <Text style={styles.fieldLabel}>{row.label}</Text>
                                    <Text style={styles.fieldValue}>{row.value || '-'}</Text>
                                    {index !== detailRows.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>

                        <Pressable style={styles.backBtn} onPress={() => router.push('/listing')}>
                            <Text style={styles.backBtnText}>{copy.backToList}</Text>
                        </Pressable>
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
        height: 52,
        backgroundColor: '#E0DDCF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(51,51,52,0.08)',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        zIndex: 30,
    },
    langWrap: {
        minWidth: 90,
        position: 'relative',
    },
    langBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.3)',
        borderRadius: 2,
        height: 30,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.22)',
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
        top: 32,
        left: 0,
        minWidth: 116,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.2)',
        backgroundColor: OFF_BEIGE,
        borderRadius: 2,
        overflow: 'hidden',
    },
    langItem: {
        paddingHorizontal: 10,
        paddingVertical: 9,
    },
    langItemActive: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    langItemText: {
        color: CHARCOAL,
        fontSize: 12,
    },
    annText: {
        flex: 1,
        color: CHARCOAL,
        fontSize: 13,
        textAlign: 'center',
        opacity: 0.95,
    },
    notifyBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.4)',
        borderRadius: 2,
        paddingHorizontal: 14,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifyText: {
        color: CHARCOAL,
        fontSize: 13,
    },
    navRow: {
        marginTop: 18,
        paddingHorizontal: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    searchBtnText: {
        color: '#FDFBF0',
        fontSize: 19,
        marginTop: -2,
    },
    contentRow: {
        marginTop: 16,
        paddingHorizontal: 36,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 36,
    },
    contentCol: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        gap: 18,
    },
    imagePanel: {
        flex: 1.08,
        backgroundColor: PANEL_BEIGE,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '74%',
        height: '74%',
    },
    detailCol: {
        flex: 0.72,
        minWidth: 320,
        maxWidth: 620,
    },
    title: {
        color: CHARCOAL,
        fontFamily: 'serif',
        letterSpacing: -1.2,
    },
    subText: {
        marginTop: 10,
        color: 'rgba(51,51,52,0.8)',
        fontSize: 15,
    },
    priceLabelTop: {
        marginTop: 18,
        color: 'rgba(51,51,52,0.72)',
        fontSize: 14,
    },
    finalPriceValue: {
        marginTop: 4,
        color: PRICE_GREEN,
        fontFamily: 'serif',
        fontSize: 58,
        lineHeight: 62,
    },
    sectionTitle: {
        marginTop: 24,
        color: CHARCOAL,
        fontFamily: 'serif',
        fontSize: 40,
        lineHeight: 42,
    },
    infoCard: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.12)',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    fieldLabel: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 13,
        marginBottom: 8,
    },
    fieldValue: {
        color: CHARCOAL,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    },
    divider: {
        marginBottom: 12,
        height: 1,
        backgroundColor: 'rgba(51,51,52,0.15)',
    },
    backBtn: {
        marginTop: 18,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.24)',
        borderRadius: 2,
        height: 42,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    backBtnText: {
        color: CHARCOAL,
        fontSize: 14,
        fontWeight: '600',
    },
    notFoundWrap: {
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    notFoundTitle: {
        color: CHARCOAL,
        fontFamily: 'serif',
        fontSize: 42,
        lineHeight: 44,
    },
    notFoundBody: {
        marginTop: 10,
        color: 'rgba(51,51,52,0.8)',
        fontSize: 16,
    },
});
