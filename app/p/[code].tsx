import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useI18n } from '../../src/i18n/provider';
import { LANGUAGE_OPTIONS, toAppLanguage, type AppLanguage } from '../../src/i18n/languageOptions';
import { loadListingProducts, type RuntimeListingProduct } from '../../src/data/listingProductsRuntime';
import { getLocalizedProductTextFields } from '../../src/data/productTranslations';
import { withImageSize } from '../../src/data/imageUrl';
import MarketAnnouncementBar from '../../src/components/sections/market/MarketAnnouncementBar';
import MarketTopNav from '../../src/components/sections/market/MarketTopNav';
import ProductNotFoundSection from '../../src/components/sections/detail/ProductNotFoundSection';
import ProductDetailSection from '../../src/components/sections/detail/ProductDetailSection';
import Footer from '../../src/components/sections/Footer';

const OFF_BEIGE = '#ECEADD';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useLocalSearchParams<{ code?: string | string[]; from?: string | string[] }>();
    const { currentLanguage, setLanguage } = useI18n();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const [langOpen, setLangOpen] = useState(false);
    const [products, setProducts] = useState<RuntimeListingProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<ScrollView>(null);

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

    const idParam = Array.isArray(params.code) ? params.code[0] : params.code;
    const fromParam = Array.isArray(params.from) ? params.from[0] : params.from;
    const productId = useMemo(() => {
        const parsed = Number.parseInt((idParam ?? '').trim(), 10);
        return Number.isFinite(parsed) ? parsed : -1;
    }, [idParam]);
    const productIndex = useMemo(() => products.findIndex((item) => item.id === productId), [productId, products]);
    const product = productIndex >= 0 ? products[productIndex] : null;

    const lang: AppLanguage = toAppLanguage(currentLanguage);
    const localizedFields = useMemo(
        () => (product ? getLocalizedProductTextFields(product, lang) : null),
        [lang, product],
    );

    const isMobile = width <= 1120;
    const isPhone = width <= 760;
    const productNameFontSize = isPhone ? 28 : isMobile ? 36 : 50;
    const productNameLineHeight = isPhone ? 27 : isMobile ? 34 : 48;
    const imageHeight = isPhone ? 360 : isMobile ? 460 : 760;
    const brandWordmarkSize = isPhone ? 18 : isMobile ? 22 : 34;

    const imageUri = withImageSize(product?.imageUrl, 600);

    const goToListing = () => {
        if (fromParam === 'listing') {
            router.push({
                pathname: '/listing',
                params: { restoreState: '1' },
            });
            return;
        }
        if (fromParam === 'home' && productId > 0) {
            router.push({
                pathname: '/listing',
                params: { focusProductId: String(productId) },
            });
            return;
        }
        router.push('/listing');
    };

    const detailRows = product
        ? [
            { label: t('detail_page.release_year'), value: String(product.releaseYear) },
            { label: t('detail_page.season'), value: localizedFields?.season ?? product.season },
            { label: t('detail_page.gender'), value: localizedFields?.gender ?? product.gender },
            { label: t('detail_page.product_name'), value: localizedFields?.productName ?? product.productName },
            { label: t('detail_page.color_range'), value: localizedFields?.colorRange ?? product.colorRange },
            { label: t('detail_page.genre'), value: localizedFields?.genre ?? product.genre },
            { label: t('detail_page.size_range'), value: localizedFields?.sizeRange ?? product.sizeRange },
            { label: t('detail_page.material'), value: localizedFields?.material ?? product.material },
            { label: t('detail_page.feature'), value: localizedFields?.feature ?? product.feature },
            { label: t('detail_page.trim_spec'), value: localizedFields?.trimSpec ?? product.trimSpec },
        ]
        : [];

    return (
        <View style={styles.root}>
            <ScrollView ref={scrollRef} style={styles.root} contentContainerStyle={{ paddingBottom: 24 }}>
                <MarketAnnouncementBar
                    compact={isPhone}
                    announcement={t('detail_page.announcement')}
                    notifyText={t('detail_page.notify')}
                    currentLang={lang}
                    langOpen={langOpen}
                    langOptions={LANGUAGE_OPTIONS.map((opt) => ({ code: opt.code, label: opt.label }))}
                    onToggleLang={() => setLangOpen((v) => !v)}
                    onSelectLang={(code) => {
                        setLanguage(code);
                        setLangOpen(false);
                    }}
                />

                {!product ? (
                    <ProductNotFoundSection
                        title={isLoading ? t('detail_page.loading_products') : t('detail_page.product_missing')}
                        body={isLoading ? '' : t('detail_page.not_found_body')}
                        backText={t('detail_page.back_to_list')}
                        onBack={goToListing}
                    />
                ) : (
                    <>
                        <MarketTopNav
                            onBrandPress={() => router.push('/')}
                            primaryLabel={t('detail_page.browse')}
                            onPrimaryPress={goToListing}
                            onSearchPress={goToListing}
                            wordmarkSize={brandWordmarkSize}
                            marginTop={18}
                            horizontalPadding={isPhone ? 14 : 36}
                            stack={isPhone}
                        />

                        <ProductDetailSection
                            isMobile={isMobile}
                            imageUri={imageUri}
                            imagePlaceholderText={t('detail_page.image_preparing')}
                            imageHeight={imageHeight}
                            productNameFontSize={productNameFontSize}
                            productNameLineHeight={productNameLineHeight}
                            name={localizedFields?.productName ?? product.productName}
                            productCodeLabel={t('detail_page.product_code')}
                            productCode={product.code ?? ''}
                            finalPriceLabel={t('detail_page.final_price')}
                            finalPriceYen={product.finalPriceYen}
                            detailsTitle={t('detail_page.details_title')}
                            detailRows={detailRows}
                            backText={t('detail_page.back_to_list')}
                            onBack={goToListing}
                        />
                    </>
                )}

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
});
