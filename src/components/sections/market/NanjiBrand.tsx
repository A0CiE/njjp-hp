import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
    onPress: () => void;
    wordmarkSize?: number;
    style?: StyleProp<ViewStyle>;
};

export default function NanjiBrand({ onPress, wordmarkSize = 34, style }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed, hovered }: any) => [
                styles.wrap,
                style,
                hovered && styles.wrapHovered,
                pressed && styles.wrapPressed,
            ]}
        >
            <View style={styles.mark}>
                <Text style={styles.markText}>NJ</Text>
            </View>
            <Text numberOfLines={1} style={[styles.wordmark, { fontSize: wordmarkSize }]}>
                NANJI JAPAN
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
        flexShrink: 1,
        borderRadius: 8,
        paddingHorizontal: 2,
        paddingVertical: 1,
    },
    wrapHovered: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    wrapPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    mark: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#E62A2A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    markText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
    },
    wordmark: {
        color: '#111',
        fontWeight: '900',
        letterSpacing: 0.2,
        flexShrink: 1,
    },
});
