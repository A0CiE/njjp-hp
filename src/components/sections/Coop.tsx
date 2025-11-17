import React from 'react';
import {
    View,
    Text,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import Stage from '../layout/Stage';
import styles from '../styles/pageStyles';
import { typeScale } from '../../theme';

const Coop: React.FC = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const sizes = {
        h2: typeScale.h2(width),
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
    };

    return (
        <Stage bg="light" align="center" valign="middle" slim>
            <View style={styles.coopRow}>
                <View style={{ flex: 1 }}>
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
                        {t('coop.title')}
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
                        {t('coop.l1')}
                    </Text>
                    <Text
                        style={[
                            styles.p,
                            { textAlign: 'center', fontSize: sizes.lead },
                        ]}
                    >
                        {t('coop.p1')}
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
                        {t('coop.l2')}
                    </Text>
                    <Text
                        style={[
                            styles.p,
                            { textAlign: 'center', fontSize: sizes.lead },
                        ]}
                    >
                        {t('coop.p2')}
                    </Text>
                </View>

                <LinearGradient
                    colors={['#f87171', '#b91c1c']}
                    style={styles.coopDivider}
                />

                <View style={{ flex: 1, marginTop: 44 }}>
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
                        {t('coop.r1')}
                    </Text>
                    <Text
                        style={[
                            styles.p,
                            { textAlign: 'center', fontSize: sizes.lead },
                        ]}
                    >
                        {t('coop.rp1')}
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
                        {t('coop.r2')}
                    </Text>
                    <Text
                        style={[
                            styles.p,
                            { textAlign: 'center', fontSize: sizes.lead },
                        ]}
                    >
                        {t('coop.rp2')}
                    </Text>
                </View>
            </View>
        </Stage>
    );
}

export default Coop;
