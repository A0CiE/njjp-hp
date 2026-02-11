import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type ProductDetailRow = {
    label: string;
    value: string;
};

type Props = {
    detailsTitle: string;
    detailRows: ProductDetailRow[];
};

const CHARCOAL = '#333334';

export default function ProductDetailInfoCard({ detailsTitle, detailRows }: Props) {
    return (
        <>
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
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 24,
        color: CHARCOAL,
        fontFamily: 'serif',
        fontSize: 27,
        lineHeight: 28,
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
});
