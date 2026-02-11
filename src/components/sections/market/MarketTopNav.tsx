import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import NanjiBrand from './NanjiBrand';

type Props = {
    onBrandPress: () => void;
    primaryLabel: string;
    onPrimaryPress: () => void;
    onSearchPress: () => void;
    wordmarkSize?: number;
    marginTop?: number;
    horizontalPadding?: number;
    stack?: boolean;
};

const CHARCOAL = '#333334';

export default function MarketTopNav({
    onBrandPress,
    primaryLabel,
    onPrimaryPress,
    onSearchPress,
    wordmarkSize = 34,
    marginTop = 28,
    horizontalPadding = 0,
    stack = false,
}: Props) {
    return (
        <View
            style={[
                styles.navRow,
                { marginTop, paddingHorizontal: horizontalPadding },
                stack && styles.navRowStack,
            ]}
        >
            <NanjiBrand onPress={onBrandPress} wordmarkSize={wordmarkSize} style={styles.brandWrap} />

            <View style={[styles.navActions, stack && styles.navActionsStack]}>
                <Pressable
                    onPress={onPrimaryPress}
                    style={({ pressed, hovered }: any) => [styles.navBtn, hovered && styles.navBtnHovered, pressed && styles.navBtnPressed]}
                >
                    <Text style={styles.navBtnText}>{primaryLabel}</Text>
                </Pressable>
                <Pressable
                    onPress={onSearchPress}
                    style={({ pressed, hovered }: any) => [styles.searchBtn, hovered && styles.searchBtnHovered, pressed && styles.searchBtnPressed]}
                >
                    <Text style={styles.searchBtnText}>⌕</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        minWidth: 0,
    },
    navRowStack: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 10,
    },
    brandWrap: {
        minWidth: 0,
        flexShrink: 1,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    navActionsStack: {
        justifyContent: 'flex-end',
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
    navBtnHovered: {
        backgroundColor: 'rgba(51,51,52,0.1)',
        borderColor: 'rgba(51,51,52,0.65)',
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
    searchBtnHovered: {
        backgroundColor: '#2d2d2f',
    },
    searchBtnText: {
        color: '#FDFBF0',
        fontSize: 19,
        marginTop: -2,
    },
});
