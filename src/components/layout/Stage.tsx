import React from 'react';
import {
    View,
    StyleSheet,
    useWindowDimensions,
    ImageBackground,
    ImageSourcePropType,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, metrics } from '../../theme';

type Props = React.PropsWithChildren<{
    bg?: 'red' | 'dark' | 'light' | 'paper';
    scrim?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'left' | 'right' | 'center';
    valign?: 'top' | 'middle' | 'bottom';
    flow?: boolean;
    tall?: boolean;
    slim?: boolean;
    balanced?: boolean;
    minFull?: boolean;
    bgImage?: ImageSourcePropType;
    scrollY?: Animated.Value;
    bgImageStyle?: ImageStyle;
}>;

const Stage = ({
                   children,
                   bg = 'light',
                   scrim,
                   align = 'center',
                   valign = 'middle',
                   flow = false,
                   tall = false,
                   slim = false,
                   balanced = false,
                   minFull = true,
                   bgImage,
                   scrollY,
                   bgImageStyle
               }: Props) => {
    const { width, height } = useWindowDimensions();
    const isMobile = width <= 700;

    const minHeight = (() => {
        if (flow)
            return isMobile && minFull
                ? Math.max(0, height - metrics.navH)
                : undefined;
        let h = 0.56;
        if (tall) h = 0.68;
        if (slim) h = 0.42;
        const base = Math.max(640, Math.floor(h * height));
        return isMobile && minFull
            ? Math.max(base, Math.floor(height - metrics.navH))
            : base;
    })();

    const bgTranslateY = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 220],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        })
        : 0;

    const bgNode = (() => {
        if (bgImage) {
            const defaultImgStyle: ImageStyle = {
                width: '200%',
                height: '190%',
                ...( { objectPosition: 'right center' } as any),
            };

            return (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        scrollY && { transform: [{ translateY: bgTranslateY as any }] },
                    ]}
                >
                    <ImageBackground
                        source={bgImage}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        imageStyle={
                            StyleSheet.flatten([defaultImgStyle, bgImageStyle]) as any
                        }
                    >
                        {bg === 'red' && (
                            <LinearGradient
                                colors={[
                                    'rgba(228,55,55,0.45)',
                                    'rgba(223,43,43,0.3)',
                                    'rgba(200,31,31,0.22)',
                                ]}
                                style={StyleSheet.absoluteFillObject}
                            />
                        )}
                    </ImageBackground>
                </Animated.View>
            );
        }

        if (bg === 'red')
            return (
                <LinearGradient
                    colors={['#e43737', colors.brand, '#c81f1f']}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        if (bg === 'dark')
            return (
                <View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: colors.dark },
                    ]}
                />
            );
        if (bg === 'paper')
            return (
                <LinearGradient
                    colors={['#cfd6de', '#e6ebf1', '#eef2f7']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        return (
            <View
                style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: colors.light },
                ]}
            />
        );
    })();

    const scrimNode = (() => {
        if (!scrim) return null;
        const cols = ['rgba(0,0,0,.45)', 'rgba(0,0,0,.22)', 'transparent'] as const;
        if (scrim === 'left')
            return (
                <LinearGradient
                    pointerEvents="none"
                    colors={cols as any}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        if (scrim === 'right')
            return (
                <LinearGradient
                    pointerEvents="none"
                    colors={cols as any}
                    start={{ x: 1, y: 0.5 }}
                    end={{ x: 0, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        if (scrim === 'top')
            return (
                <LinearGradient
                    pointerEvents="none"
                    colors={cols as any}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        if (scrim === 'bottom')
            return (
                <LinearGradient
                    pointerEvents="none"
                    colors={cols as any}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        return null;
    })();

    const justifyContent =
        valign === 'top' ? 'flex-start' : valign === 'bottom' ? 'flex-end' : 'center';
    const alignItems =
        align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

    const basePaddingV = isMobile ? 32 : 40;

    const paddingV = balanced
        ? (isMobile ? 56 : 72)
        : basePaddingV;

    return (
        <View style={stylesLocal.stage}>
            {bgNode}
            {scrimNode}
            <View
                style={{
                    minHeight,
                    justifyContent,
                    alignItems,
                }}
            >
                <View style={stylesLocal.maxWrap}>
                    <View style={[stylesLocal.content, { paddingVertical: paddingV }]}>
                        {children}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Stage;

const stylesLocal = StyleSheet.create({
    stage: { position: 'relative', width: '100%' },
    maxWrap: {
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    content: { maxWidth: 1200, width: '100%' },
});
