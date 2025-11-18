import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Stage from '../layout/Stage';
import pageStyles from '../styles/pageStyles';
import { colors, typeScale, metrics } from '../../theme';

const Founder: React.FC = () => {
    const { t } = useTranslation();
    const ww = typeof window === 'undefined' ? 1200 : window.innerWidth;
    const isMobile = ww <= metrics.bpSm;

    const sizes = {
        h2: typeScale.h2(ww),
        h3: typeScale.h3(ww),
        lead: typeScale.lead(ww),
    };

    const values = [
        t('founder.value1'),
        t('founder.value2'),
        t('founder.value3'),
        t('founder.value4'),
    ];

    return (
        <Stage
            bg="light"
            align="center"
            valign="top"
            flow
            minFull={false}
        >
            <View style={styles.outer}>
                <View style={styles.panel}>
                    {/* 代表挨拶 */}
                    <View style={styles.greetingBlock}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.redBar} />
                            <Text
                                style={[
                                    pageStyles.h3,
                                    styles.sectionTitle,
                                    { fontSize: sizes.h3 },
                                ]}
                            >
                                {t('founder.greetingTitle')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                pageStyles.p,
                                styles.body,
                                { fontSize: sizes.lead },
                            ]}
                        >
                            {t('founder.greetingBody')}
                        </Text>

                        <View style={styles.signatureRow}>
                            <Text
                                style={[
                                    pageStyles.p,
                                    { fontSize: sizes.lead },
                                ]}
                            >
                                {t('founder.ceoTitle')} {t('founder.ceoName')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.dividerSpace} />

                    {/* 経営理念 */}
                    <View style={styles.mvBlock}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.redBar} />
                            <Text
                                style={[
                                    pageStyles.h3,
                                    styles.sectionTitle,
                                    { fontSize: sizes.h3 },
                                ]}
                            >
                                {t('founder.mvTitle')}
                            </Text>
                        </View>

                        <View style={[styles.mvRow, isMobile && styles.mvRowStack]}>
                            <Text
                                style={[
                                    styles.valueLabel,
                                    { fontSize: sizes.h2 },
                                    isMobile && styles.valueLabelStack, // ★ 小屏：去掉右边距、加下边距
                                ]}
                            >
                                VALUE
                            </Text>

                            <View style={[styles.valuesCol, isMobile && styles.valuesColStack]}>
                                {values.map((val, idx) => (
                                    <Text
                                        key={`${val}-${idx}`}
                                        style={[
                                            pageStyles.h3,
                                            styles.valueText,
                                            { fontSize: sizes.lead + 2 },
                                        ]}
                                    >
                                        {val}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Stage>
    );
};

const styles = StyleSheet.create({
    outer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    panel: {
        width: '100%',
        maxWidth: 960,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingHorizontal: 40,
        paddingVertical: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 4,
    },

    greetingBlock: {
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    redBar: {
        width: 32,
        height: 2,
        backgroundColor: colors.brand,
        marginRight: 8,
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: 0,
    },
    body: {
        lineHeight: 22,
    },
    signatureRow: {
        marginTop: 24,
        alignSelf: 'flex-end',
    },

    dividerSpace: {
        height: 32,
    },

    mvBlock: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 24,
    },

    mvRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },

    mvRowStack: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

    valueLabel: {
        color: colors.brand,
        fontWeight: '900',
        letterSpacing: 3,
        marginRight: 24,
    },

    valueLabelStack: {
        marginRight: 0,
        marginBottom: 8,
    },

    valuesCol: {
        flex: 1,
    },

    valuesColStack: {
        flex: 0,
        width: '100%',
    },

    valueText: {
        marginBottom: 6,
        marginTop: 0,
        color: colors.ink,
    },
});

export default Founder;
