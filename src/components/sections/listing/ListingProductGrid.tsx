import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type Item = {
    id: number;
    code: string | null;
    name: string;
    price: number;
    imageUri: string;
};

type Props = {
    isLoading: boolean;
    loadingText: string;
    emptyText: string;
    viewDetailsText: string;
    imagePlaceholderText: string;
    items: Item[];
    cardWidth: number;
    imageHeight: number;
    cardNameSize: number;
    cardPriceSize: number;
    cardAnimById: Record<string, Animated.Value | undefined>;
    hoverScaleById: Record<string, Animated.Value | undefined>;
    onHoverChange: (id: number, active: boolean) => void;
    onOpenDetail: (id: number) => void;
    gridGap: number;
};

const CHARCOAL = '#333334';
const PANEL_BEIGE = '#E6E4D7';
const PRICE_GREEN = '#366E56';

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
    cardPriceSize,
    cardAnimById,
    hoverScaleById,
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
                    const reveal = cardAnimById[itemKey];
                    const scale = hoverScaleById[itemKey];
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
                        <Animated.View key={itemKey} style={[styles.cardShell, { width: cardWidth }, revealStyle]}>
                            <Pressable
                                onHoverIn={() => onHoverChange(item.id, true)}
                                onHoverOut={() => onHoverChange(item.id, false)}
                                onPress={() => onOpenDetail(item.id)}
                                style={styles.cardPress}
                            >
                                <View style={[styles.imagePanel, { height: imageHeight }]}> 
                                    {item.imageUri ? (
                                        <Animated.Image
                                            source={{ uri: item.imageUri }}
                                            resizeMode="contain"
                                            style={[
                                                styles.itemImage,
                                                {
                                                    transform: [{ scale: scale ?? 1 }],
                                                },
                                            ]}
                                        />
                                    ) : (
                                        <Text style={styles.imagePlaceholder}>{imagePlaceholderText}</Text>
                                    )}
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
                                    <Text style={styles.cardCode}>{item.code ?? ''}</Text>
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
                                        onPress={() => onOpenDetail(item.id)}
                                        style={({ pressed }) => [styles.viewBtn, pressed && styles.viewBtnPressed]}
                                    >
                                        <Text style={styles.viewBtnText}>{viewDetailsText}</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </Animated.View>
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
    imagePlaceholder: {
        color: 'rgba(51,51,52,0.6)',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 16,
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
