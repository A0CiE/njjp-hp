import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

import Stage from '../layout/Stage';
import styles from '../styles/pageStyles';
import {typeScale} from '../../theme';

const heroImage = require('../../assets/hero-bg.jpg');

type HeroSectionProps = {
    scrollY?: Animated.Value;
};

const Hero: React.FC<HeroSectionProps> = ({scrollY}) => {
    const {t} = useTranslation();
    const {width} = useWindowDimensions();

    const sizes = {
        h1: typeScale.h1(width),
        lead: typeScale.lead(width),
    };

    const fade = useRef(new Animated.Value(0)).current;
    const translateIn = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(translateIn, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fade, translateIn]);

    const scrollOffset = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 220],
            outputRange: [0, -18],
            extrapolate: 'clamp',
        })
        : 0;

    const animatedStyle = {
        opacity: fade,
        transform: [
            {translateY: translateIn},
            ...(scrollY ? [{translateY: scrollOffset as any}] : []),
        ],
    };

    return (
        <Stage
            bg="red"
            scrim="left"
            align="center"
            valign="middle"
            balanced
            minFull
            bgImage={heroImage}
            scrollY={scrollY}
        >
            <Animated.View style={animatedStyle}>
                <View>
                    <Text
                        style={[
                            styles.muted,
                            {
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                                color: '#e5e7eb',
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {t('hero.tag')}
                    </Text>

                    <Text
                        style={[
                            styles.h1,
                            {
                                color: '#fff',
                                textAlign: 'center',
                                fontSize: sizes.h1,
                                lineHeight: Math.round(sizes.h1 * 1.12),
                            },
                        ]}
                    >
                        {t('hero.title')}
                    </Text>

                    <Text
                        style={[
                            styles.lead,
                            {
                                color: '#e5e7eb',
                                textAlign: 'center',
                                fontSize: sizes.lead,
                            },
                        ]}
                    >
                        {t('hero.lead')}
                    </Text>
                </View>
            </Animated.View>
        </Stage>
    );
};

export default Hero;
