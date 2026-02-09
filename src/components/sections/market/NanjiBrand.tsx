import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
    onPress: () => void;
    wordmarkSize?: number;
    style?: StyleProp<ViewStyle>;
};

export default function NanjiBrand({ onPress, wordmarkSize = 34, style }: Props) {
    return (
        <Pressable onPress={onPress} style={[styles.wrap, style]}>
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
    },
});
