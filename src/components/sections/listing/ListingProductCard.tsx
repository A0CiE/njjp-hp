import React from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export type ListingGridItem = {
    id: number;
    code: string | null;
    name: string;
    price: number;
    imageUri: string;
};

type Props = {
    item: ListingGridItem;
    cardWidth: number;
    imageHeight: number;
    cardNameSize: number;
    cardNameLineHeight: number;
    cardPriceSize: number;
    cardPriceLineHeight: number;
    viewDetailsText: string;
    imagePlaceholderText: string;
    reveal?: Animated.Value;
    scale?: Animated.Value;
    ctaHover?: Animated.Value;
    onHoverChange: (id: number, active: boolean) => void;
    onOpenDetail: (id: number) => void;
};

const CHARCOAL = '#333334';
const PANEL_BEIGE = '#E6E4D7';
const PRICE_GREEN = '#366E56';

export default function ListingProductCard({
    item,
    cardWidth,
    imageHeight,
    cardNameSize,
    cardNameLineHeight,
    cardPriceSize,
    cardPriceLineHeight,
    viewDetailsText,
    imagePlaceholderText,
    reveal,
    scale,
    ctaHover,
    onHoverChange,
    onOpenDetail,
}: Props) {
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

    const ctaFillAnimatedStyle = ctaHover
        ? {
            opacity: ctaHover.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
        }
        : null;

    const bindHover = {
        onHoverIn: () => onHoverChange(item.id, true),
        onHoverOut: () => onHoverChange(item.id, false),
        onPressIn: () => onHoverChange(item.id, true),
        onPressOut: () => onHoverChange(item.id, false),
        ...(Platform.OS === 'web'
            ? ({
                onMouseEnter: () => onHoverChange(item.id, true),
                onMouseLeave: () => onHoverChange(item.id, false),
            } as any)
            : null),
    };

    return (
        <Animated.View style={[styles.cardShell, { width: cardWidth }, revealStyle]}>
            <Pressable {...bindHover} onPress={() => onOpenDetail(item.id)} style={styles.cardPress}>
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
                                lineHeight: cardNameLineHeight,
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
                                lineHeight: cardPriceLineHeight,
                            },
                        ]}
                    >
                        ¥{item.price.toFixed(0)}
                    </Text>

                    <Pressable
                        {...bindHover}
                        onPress={() => onOpenDetail(item.id)}
                        style={({ pressed }) => [styles.viewBtnPressable, pressed && styles.viewBtnPressablePressed]}
                    >
                        <Animated.View style={styles.viewBtn}>
                            <Animated.View pointerEvents="none" style={[styles.viewBtnFill, ctaFillAnimatedStyle as any]} />
                            <Text style={styles.viewBtnText}>{viewDetailsText}</Text>
                        </Animated.View>
                    </Pressable>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
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
        width: '88%',
        height: '88%',
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
    viewBtnPressable: {
        marginTop: 20,
        minWidth: 122,
        height: 32,
    },
    viewBtnPressablePressed: {
        opacity: 0.9,
    },
    viewBtn: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.14)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    viewBtnFill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(176,174,162,0.98)',
    },
    viewBtnText: {
        color: 'rgba(51,51,52,0.74)',
        fontSize: 14,
    },
});
