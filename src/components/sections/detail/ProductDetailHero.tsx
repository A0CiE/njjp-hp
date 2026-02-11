import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    productNameFontSize: number;
    productNameLineHeight: number;
    name: string;
    productCodeLabel: string;
    productCode: string;
    finalPriceLabel: string;
    finalPriceYen: number;
};

const CHARCOAL = '#333334';
const PRICE_GREEN = '#366E56';

export default function ProductDetailHero({
    productNameFontSize,
    productNameLineHeight,
    name,
    productCodeLabel,
    productCode,
    finalPriceLabel,
    finalPriceYen,
}: Props) {
    return (
        <View>
            <Text style={[styles.title, { fontSize: productNameFontSize, lineHeight: productNameLineHeight }]}>{name}</Text>
            <Text style={styles.subText}>
                {productCodeLabel}: {productCode}
            </Text>
            <Text style={styles.priceLabelTop}>{finalPriceLabel}</Text>
            <Text style={styles.finalPriceValue}>¥{finalPriceYen.toFixed(0)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
