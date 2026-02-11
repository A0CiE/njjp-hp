import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import ProductDetailImagePanel from './ProductDetailImagePanel';
import ProductDetailHero from './ProductDetailHero';
import ProductDetailInfoCard, { type ProductDetailRow } from './ProductDetailInfoCard';
import ProductDetailBackButton from './ProductDetailBackButton';

type Props = {
    isMobile: boolean;
    imageUri: string;
    imagePlaceholderText: string;
    imageHeight: number;
    productNameFontSize: number;
    productNameLineHeight: number;
    name: string;
    productCodeLabel: string;
    productCode: string;
    finalPriceLabel: string;
    finalPriceYen: number;
    detailsTitle: string;
    detailRows: ProductDetailRow[];
    backText: string;
    onBack: () => void;
};

export default function ProductDetailSection({
    isMobile,
    imageUri,
    imagePlaceholderText,
    imageHeight,
    productNameFontSize,
    productNameLineHeight,
    name,
    productCodeLabel,
    productCode,
    finalPriceLabel,
    finalPriceYen,
    detailsTitle,
    detailRows,
    backText,
    onBack,
}: Props) {
    const stickyImageColStyle =
        !isMobile && Platform.OS === 'web'
            ? ({ position: 'sticky', top: 24, alignSelf: 'flex-start' } as const)
            : null;

    return (
        <View style={[styles.contentRow, isMobile && styles.contentCol]}>
            <View style={[styles.imageCol, isMobile && styles.imageColMobile, stickyImageColStyle as any]}>
                <ProductDetailImagePanel
                    isMobile={isMobile}
                    imageUri={imageUri}
                    imagePlaceholderText={imagePlaceholderText}
                    imageHeight={imageHeight}
                />
            </View>

            <View style={[styles.detailCol, isMobile && styles.detailColMobile]}>
                <ProductDetailHero
                    productNameFontSize={productNameFontSize}
                    productNameLineHeight={productNameLineHeight}
                    name={name}
                    productCodeLabel={productCodeLabel}
                    productCode={productCode}
                    finalPriceLabel={finalPriceLabel}
                    finalPriceYen={finalPriceYen}
                />
                <ProductDetailInfoCard detailsTitle={detailsTitle} detailRows={detailRows} />
                <ProductDetailBackButton backText={backText} onBack={onBack} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    imageCol: {
        flex: 1.08,
        minWidth: 0,
        alignSelf: 'flex-start',
    },
    imageColMobile: {
        width: '100%',
        flex: 0,
    },
    detailCol: {
        flex: 0.72,
        minWidth: 320,
        maxWidth: 620,
    },
    detailColMobile: {
        flex: 0,
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
    },
});
