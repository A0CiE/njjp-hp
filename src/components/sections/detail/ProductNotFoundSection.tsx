import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    body?: string;
    backText: string;
    onBack: () => void;
};

const CHARCOAL = '#333334';

export default function ProductNotFoundSection({ title, body, backText, onBack }: Props) {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>{title}</Text>
            {!!body && <Text style={styles.body}>{body}</Text>}
            <Pressable style={styles.backBtn} onPress={onBack}>
                <Text style={styles.backBtnText}>{backText}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    title: {
        color: CHARCOAL,
        fontFamily: 'serif',
        fontSize: 42,
        lineHeight: 44,
    },
    body: {
        marginTop: 10,
        color: 'rgba(51,51,52,0.8)',
        fontSize: 16,
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
