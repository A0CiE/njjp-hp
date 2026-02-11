import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ListingProductCard, { type ListingGridItem } from './ListingProductCard';

type Props = {
    isLoading: boolean;
    loadingText: string;
    emptyText: string;
    viewDetailsText: string;
    imagePlaceholderText: string;
    items: ListingGridItem[];
    cardWidth: number;
    imageHeight: number;
    cardNameSize: number;
    cardNameLineHeight: number;
    cardPriceSize: number;
    cardPriceLineHeight: number;
    cardAnimById: Record<string, Animated.Value | undefined>;
    hoverScaleById: Record<string, Animated.Value | undefined>;
    ctaHoverById: Record<string, Animated.Value | undefined>;
    onHoverChange: (id: number, active: boolean) => void;
    onOpenDetail: (id: number) => void;
    gridGap: number;
};

export default function ListingProductGrid({
    isLoading,
    loadingText,
    emptyText,
    viewDetailsText,
    imagePlaceholderText,
    items,
    cardWidth,
    imageHeight,
    cardNameSize,
    cardNameLineHeight,
    cardPriceSize,
    cardPriceLineHeight,
    cardAnimById,
    hoverScaleById,
    ctaHoverById,
    onHoverChange,
    onOpenDetail,
    gridGap,
}: Props) {
    return (
        <View style={[styles.grid, { gap: gridGap }]}>
            {isLoading ? (
                <View style={styles.stateWrap}>
                    <Text style={styles.stateText}>{loadingText}</Text>
                </View>
            ) : items.length === 0 ? (
                <View style={styles.stateWrap}>
                    <Text style={styles.stateText}>{emptyText}</Text>
                </View>
            ) : (
                items.map((item) => {
                    const itemKey = String(item.id);

                    return (
                        <ListingProductCard
                            key={itemKey}
                            item={item}
                            cardWidth={cardWidth}
                            imageHeight={imageHeight}
                            cardNameSize={cardNameSize}
                            cardNameLineHeight={cardNameLineHeight}
                            cardPriceSize={cardPriceSize}
                            cardPriceLineHeight={cardPriceLineHeight}
                            viewDetailsText={viewDetailsText}
                            imagePlaceholderText={imagePlaceholderText}
                            reveal={cardAnimById[itemKey]}
                            scale={hoverScaleById[itemKey]}
                            ctaHover={ctaHoverById[itemKey]}
                            onHoverChange={onHoverChange}
                            onOpenDetail={onOpenDetail}
                        />
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});
