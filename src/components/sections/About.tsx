import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import styles from '../styles/pageStyles';
import Stage from '../layout/Stage';
import { typeScale } from '../../theme';

const aboutImage = require('../../assets/about-bg.jpg');

const About: React.FC = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const sizes = {
        h2: typeScale.h2(width),
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
    };

    return (
        <Stage bg="light" scrim="right" align="center" valign="middle" bgImage={aboutImage}>
            <View style={styles.wrap}>
                <Text
                    style={[
                        styles.h2,
                        {
                            textAlign: 'center',
                            fontSize: sizes.h2,
                            lineHeight: Math.round(sizes.h2 * 1.18),
                        },
                    ]}
                >
                    {t('about.title')}
                </Text>

                <Text
                    style={[
                        styles.lead,
                        { textAlign: 'center', fontSize: sizes.lead },
                    ]}
                >
                    {t('about.lead')}
                </Text>

                <View
                    style={[
                        styles.rule,
                        { backgroundColor: '#cbd5e1' },
                    ]}
                />

                <Text
                    style={[
                        styles.h3,
                        {
                            textAlign: 'center',
                            fontSize: sizes.h3,
                            lineHeight: Math.round(sizes.h3 * 1.25),
                        },
                    ]}
                >
                    {t('about.overview')}
                </Text>

                <Text
                    style={[
                        styles.p,
                        { textAlign: 'center', fontSize: sizes.lead },
                    ]}
                >
                    {t('about.overviewBody')}
                </Text>

                <Text
                    style={[
                        styles.h3,
                        {
                            textAlign: 'center',
                            fontSize: sizes.h3,
                            lineHeight: Math.round(sizes.h3 * 1.25),
                        },
                    ]}
                >
                    {t('about.key')}
                </Text>

                <Text
                    style={[
                        styles.p,
                        { textAlign: 'center', fontSize: sizes.lead },
                    ]}
                >
                    {t('about.keyBody')}
                </Text>
            </View>
        </Stage>
    );
}

export default About;
