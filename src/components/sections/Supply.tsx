import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Stage from '../layout/Stage';
import styles from '../styles/pageStyles';
import { typeScale } from '../../theme';

const Supply: React.FC = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const sizes = {
        h2: typeScale.h2(width),
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
    };

    return (
        <Stage bg="light" scrim="left" align="center" valign="middle">
            <View style={{ alignItems: 'center' }}>
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
                    {t('supply.title')}
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
                    {t('supply.s1')}
                </Text>
                <Text
                    style={[
                        styles.p,
                        { textAlign: 'center', fontSize: sizes.lead },
                    ]}
                >
                    {t('supply.p1')}
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
                    {t('supply.s2')}
                </Text>
                <Text
                    style={[
                        styles.p,
                        { textAlign: 'center', fontSize: sizes.lead },
                    ]}
                >
                    {t('supply.p2')}
                </Text>
            </View>
        </Stage>
    );
}

export default Supply;

