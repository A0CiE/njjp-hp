import React, {useEffect, useRef} from 'react';
import {
    View,
    Text,
    useWindowDimensions,
    Animated,
    LayoutChangeEvent,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import Stage from '../layout/Stage';
import styles from '../styles/pageStyles';
import {typeScale} from '../../theme';

const companyImage = require('../../assets/company-bg.jpg');

type HandbookProps = {
    scrollY?: Animated.Value;
};

const Handbook: React.FC<HandbookProps> = ({scrollY}) => {
    const {t} = useTranslation();
    const {width, height} = useWindowDimensions();

    const sizes = {
        h2: typeScale.h2(width),
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
    };

    const anim = useRef(new Animated.Value(0)).current;
    const sectionTopRef = useRef(0);
    const hasAnimatedRef = useRef(false);

    const opacity = anim;
    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 0],
    });

    const onLayout = (e: LayoutChangeEvent) => {
        sectionTopRef.current = e.nativeEvent.layout.y;
    };

    useEffect(() => {
        if (!scrollY) {
            Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
            return;
        }

        const id = scrollY.addListener(({value}) => {
            if (hasAnimatedRef.current) return;

            const sectionTop = sectionTopRef.current;
            const triggerPoint = sectionTop - height * 0.8; // 提前一点点触发

            if (value >= triggerPoint) {
                hasAnimatedRef.current = true;
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver: true,
                }).start();
            }
        });

        return () => {
            scrollY.removeListener(id);
        };
    }, [scrollY, height, anim]);

    return (
        <Animated.View
            onLayout={onLayout}
            style={{opacity, transform: [{translateY}]}}
        >
            <Stage
                bg="dark"
                scrim="right"
                align="center"
                valign="middle"
                bgImage={companyImage}
                bgImageStyle={{
                    width: '120%',
                    height: '120%',
                    ...( { objectPosition: 'right center' } as any ),
                }}
            >
                <View>
                    <Text
                        style={[
                            styles.h2,
                            {
                                color: '#e5e7eb',
                                textAlign: 'center',
                                fontSize: sizes.h2,
                                lineHeight: Math.round(sizes.h2 * 1.18),
                            },
                        ]}
                    >
                        {t('handbook.title')}
                    </Text>

                    <Text
                        style={[
                            styles.lead,
                            {
                                color: '#94a3b8',
                                textAlign: 'center',
                                fontSize: sizes.lead,
                            },
                        ]}
                    >
                        {t('handbook.lead')}
                    </Text>

                    <View
                        style={[
                            styles.rule,
                            {backgroundColor: 'rgba(255,255,255,.18)'},
                        ]}
                    />

                    {['0', '1', '2'].map((i) => (
                        <View key={i} style={{marginBottom: 6}}>
                            <Text
                                style={[
                                    styles.h3,
                                    {
                                        color: '#e5e7eb',
                                        textAlign: 'center',
                                        fontSize: sizes.h3,
                                        lineHeight: Math.round(sizes.h3 * 1.25),
                                    },
                                ]}
                            >
                                {t(`handbook.items.${i}`)}
                            </Text>
                            <Text
                                style={[
                                    styles.p,
                                    {
                                        color: '#e5e7eb',
                                        textAlign: 'center',
                                        fontSize: sizes.lead,
                                    },
                                ]}
                            >
                                {t(`handbook.itemBodies.${i}`)}
                            </Text>
                        </View>
                    ))}
                </View>
            </Stage>
        </Animated.View>
    );
};

export default Handbook;
