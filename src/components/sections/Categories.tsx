import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Stage from '../layout/Stage';

import styles from '../styles/pageStyles';
import { metrics, typeScale } from '../../theme';

const Categories: React.FC = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const sizes = {
        h3: typeScale.h3(width),
        lead: typeScale.lead(width),
        metricNum: typeScale.metricNum(width),
        metricUnit: typeScale.metricUnit(width),
    };

    const raw = t('categories.channels', { returnObjects: true }) as unknown;
    const channels: string[] = Array.isArray(raw) ? (raw as string[]) : [];

    const ww = width || 1200;
    const cols =
        ww >= metrics.bpMd ? 6 : ww >= metrics.bpSm ? 3 : 2;
    const itemW = `${100 / cols - 1.5}%` as any;

    return (
        <Stage bg="paper" scrim="left" align="center" valign="middle">
            <View style={{ alignItems: 'center' }}>
                <Text
                    style={[
                        styles.metricTitle,
                        { textAlign: 'center', fontSize: sizes.h3 },
                    ]}
                >
                    {t('categories.metricTitle')}
                </Text>

                <View style={[styles.metric, { justifyContent: 'center' }]}>
                    <Text
                        style={[
                            styles.metricNum,
                            {
                                fontSize: sizes.metricNum,
                                lineHeight: Math.round(sizes.metricNum * 0.95),
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {t('categories.usersValue')}
                    </Text>
                    <Text
                        style={[
                            styles.metricUnit,
                            { fontSize: sizes.metricUnit, textAlign: 'center' },
                        ]}
                    >
                        {t('categories.usersUnit')}
                    </Text>
                </View>

                <View style={{ marginTop: 12, width: '100%' }}>
                    <Text
                        style={[
                            styles.channelsTitle,
                            { textAlign: 'center', fontSize: sizes.h3 },
                        ]}
                    >
                        {t('categories.channelsTitle')}
                    </Text>

                    <View
                        style={[
                            styles.channelGrid,
                            { justifyContent: 'center' },
                        ]}
                    >
                        {channels.map((label) => (
                            <View
                                key={label}
                                style={[styles.channel, { width: itemW }]}
                            >
                                <View style={styles.iconSquare} />
                                <Text
                                    style={[
                                        styles.label,
                                        { textAlign: 'center', fontSize: sizes.lead },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Stage>
    );
}

export default Categories;
