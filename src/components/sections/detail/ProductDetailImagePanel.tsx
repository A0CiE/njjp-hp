import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
    isMobile: boolean;
    imageUri: string;
    imagePlaceholderText: string;
    imageHeight: number;
};

const PANEL_BEIGE = '#E6E4D7';

export default function ProductDetailImagePanel({ isMobile, imageUri, imagePlaceholderText, imageHeight }: Props) {
    return (
        <View style={[styles.imagePanel, { height: imageHeight }, isMobile && styles.imagePanelMobile]}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} resizeMode="contain" style={styles.productImage} />
            ) : (
                <Text style={styles.imagePlaceholder}>{imagePlaceholderText}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    imagePanel: {
        width: '100%',
        backgroundColor: PANEL_BEIGE,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    imagePanelMobile: {
        flex: 0,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'auto',
        width: '100%',
    },
    productImage: {
        width: '88%',
        height: '88%',
    },
    imagePlaceholder: {
        color: 'rgba(51,51,52,0.64)',
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 18,
    },
});
