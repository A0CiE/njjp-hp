import React, {useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Pressable,
    ImageBackground,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import Stage from '../layout/Stage';
import pageStyles from '../styles/pageStyles';
import {colors, layout, typeScale} from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CARD_BACKGROUNDS = [
    require('../../assets/service-card-1.jpg'),
    require('../../assets/service-card-2.jpg'),
    require('../../assets/service-card-3.jpg'),
];

const Services: React.FC = () => {
    const {t} = useTranslation();
    const items = t('services.items', {returnObjects: true}) as {
        title: string;
        desc: string;
    }[];

    const ww = typeof window === 'undefined' ? 1200 : window.innerWidth;
    const sizes = {
        h2: typeScale.h2(ww),
        cardTitle: typeScale.dTitle(ww),
        lead: typeScale.lead(ww),
    };

    const scalesRef = useRef<Animated.Value[]>(
        items.map(() => new Animated.Value(1))
    );
    const scales = scalesRef.current;

    const animateScale = (index: number, to: number) => {
        Animated.spring(scales[index], {
            toValue: to,
            useNativeDriver: true,
            friction: 7,
            tension: 120,
        }).start();
    };

    return (
        <Stage bg="light">
            <View style={pageStyles.wrap}>
                <View style={styles.head}>
                    <Text
                        style={[
                            pageStyles.h2,
                            {
                                fontSize: sizes.h2,
                                lineHeight: Math.round(sizes.h2 * 1.18),
                            },
                        ]}
                    >
                        {t('services.title')}
                    </Text>
                </View>

                <View style={styles.grid}>
                    {items.map((item, index) => {
                        const scale = scales[index];
                        const bgSource =
                            CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];

                        return (
                            <AnimatedPressable
                                key={index}
                                activeOpacity={0.9}
                                style={[styles.card, {transform: [{scale}]}]}
                                onHoverIn={() => animateScale(index, 1.03)}
                                onHoverOut={() => animateScale(index, 1)}
                                onPressIn={() => animateScale(index, 1.03)}
                                onPressOut={() => animateScale(index, 1)}
                            >
                                <ImageBackground
                                    source={bgSource}
                                    style={styles.cardBg}
                                    imageStyle={styles.cardBgImage}
                                    resizeMode="cover"
                                >
                                    <View style={styles.overlay}/>
                                    <View style={styles.cardContent}>
                                        <Text
                                            style={[
                                                styles.cardTitle,
                                                {fontSize: sizes.cardTitle},
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={[
                                                pageStyles.lead,
                                                styles.cardDesc,
                                                {fontSize: sizes.lead},
                                            ]}
                                        >
                                            {item.desc}
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </AnimatedPressable>
                        );
                    })}
                </View>
            </View>
        </Stage>
    );
};

const styles = StyleSheet.create({
    head: {
        alignItems: 'center',
        marginBottom: 22,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: layout.radiusLg,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardBg: {
        flex: 1,
    },
    cardBgImage: {
        borderRadius: layout.radiusLg,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(248,250,252,0.88)',
    },
    cardContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: 1,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontWeight: '900',
        marginBottom: 6,
        color: colors.ink,
    },
    cardDesc: {
        marginBottom: 18,
    },
    arrow: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        color: colors.inkWeak,
    },
});

export default Services;
