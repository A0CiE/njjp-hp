import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type DetailRow = {
    label: string;
    value: string;
};

type Props = {
    isMobile: boolean;
    imageUri: string;
    imagePlaceholderText: string;
    imageHeight: number;
    heroTitleSize: number;
    name: string;
    productCodeLabel: string;
    productCode: string;
    finalPriceLabel: string;
    finalPriceYen: number;
    detailsTitle: string;
    detailRows: DetailRow[];
    backText: string;
    onBack: () => void;
};

const CHARCOAL = '#333334';
const PANEL_BEIGE = '#E6E4D7';
const PRICE_GREEN = '#366E56';

export default function ProductDetailSection({
    isMobile,
    imageUri,
    imagePlaceholderText,
    imageHeight,
    heroTitleSize,
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
    return (
        <View style={[styles.contentRow, isMobile && styles.contentCol]}>
            <View style={[styles.imagePanel, { height: imageHeight }, isMobile && styles.imagePanelMobile]}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} resizeMode="contain" style={styles.productImage} />
                ) : (
                    <Text style={styles.imagePlaceholder}>{imagePlaceholderText}</Text>
                )}
            </View>

            <View style={[styles.detailCol, isMobile && styles.detailColMobile]}>
                <Text style={[styles.title, { fontSize: heroTitleSize, lineHeight: Math.round(heroTitleSize * 0.95) }]}>{name}</Text>
                <Text style={styles.subText}>
                    {productCodeLabel}: {productCode}
                </Text>
                <Text style={styles.priceLabelTop}>{finalPriceLabel}</Text>
                <Text style={styles.finalPriceValue}>¥{finalPriceYen.toFixed(0)}</Text>

                <Text style={styles.sectionTitle}>{detailsTitle}</Text>

                <View style={styles.infoCard}>
                    {detailRows.map((row, index) => (
                        <View key={row.label}>
                            <Text style={styles.fieldLabel}>{row.label}</Text>
                            <Text style={styles.fieldValue}>{row.value || '-'}</Text>
                            {index !== detailRows.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                <Pressable style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>{backText}</Text>
                </Pressable>
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
    imagePanel: {
        flex: 1.08,
        backgroundColor: PANEL_BEIGE,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    imagePanelMobile: {
        flex: 0,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'auto',
        width: '100%',
    },
    productImage: {
        width: '74%',
        height: '74%',
    },
    imagePlaceholder: {
        color: 'rgba(51,51,52,0.64)',
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 18,
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
});
