import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    backText: string;
    onBack: () => void;
};

const CHARCOAL = '#333334';

export default function ProductDetailBackButton({ backText, onBack }: Props) {
    return (
        <Pressable style={styles.backBtn} onPress={onBack}>
            {({ hovered, pressed }) => (
                <View style={[styles.backBtnInner, hovered && styles.backBtnHovered, pressed && styles.backBtnPressed]}>
                    <Text style={styles.backBtnText}>{backText}</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        marginTop: 18,
        height: 42,
        minWidth: 140,
        alignSelf: 'flex-start',
    },
    backBtnInner: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.24)',
        borderRadius: 2,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    backBtnHovered: {
        backgroundColor: 'rgba(176,174,162,0.35)',
        borderColor: 'rgba(128,126,116,0.92)',
    },
    backBtnPressed: {
        backgroundColor: 'rgba(160,158,146,0.45)',
    },
    backBtnText: {
        color: CHARCOAL,
        fontSize: 14,
        fontWeight: '600',
    },
});
