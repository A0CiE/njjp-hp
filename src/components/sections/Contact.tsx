import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import pageStyles from '../styles/pageStyles';
import { colors, typeScale } from '../../theme';
import Stage from '../layout/Stage';

const Contact: React.FC = () => {
    const { t } = useTranslation();

    const ww = typeof window === 'undefined' ? 1200 : window.innerWidth;
    const sizes = {
        h2: typeScale.h2(ww),
        lead: typeScale.lead(ww),
    };

    return (
        <Stage bg="light">
            <View style={pageStyles.wrap}>
                {/* Header */}
                <View style={styles.head}>
                    <Text
                        style={[
                            pageStyles.h2,
                            {
                                fontSize: sizes.h2,
                                lineHeight: Math.round(sizes.h2 * 1.18),
                                letterSpacing: 3,
                                textTransform: 'uppercase',
                            },
                        ]}
                    >
                        {t('contact.title')}
                    </Text>
                    <View style={styles.accent} />
                    <Text
                        style={[
                            pageStyles.lead,
                            styles.headSub,
                            { fontSize: sizes.lead },
                        ]}
                    >
                        {t('contact.sub')}
                    </Text>
                </View>

                <View style={styles.band}>
                    {/* Left: phone info */}
                    <View style={styles.phone}>
                        <View style={styles.phoneRow}>
                            <Text style={styles.phoneLabel}>{t('contact.telLabel')}</Text>
                            <Text style={styles.phoneNumber}>
                                {t('contact.telNumber')}
                            </Text>
                        </View>
                        <Text style={styles.hours}>{t('contact.hours')}</Text>
                        <Text style={[pageStyles.lead, styles.note]}>
                            {t('contact.note')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.mail}
                        activeOpacity={0.9}
                        onPress={() => {
                            Linking.openURL('mailto:takumi0508@nanji-jp.com');
                        }}
                    >
                        <View style={styles.iconMail}>
                            <View style={[styles.iconFlap, styles.iconFlapLeft]} />
                            <View style={[styles.iconFlap, styles.iconFlapRight]} />
                        </View>
                        <Text style={styles.mailText}>{t('contact.mailCta')}</Text>
                        <Text style={styles.mailArrow}>→</Text>
                    </TouchableOpacity>
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
    accent: {
        width: 48,
        height: 3,
        backgroundColor: colors.brand,
        borderRadius: 2,
        marginVertical: 8,
    },
    headSub: {
        textAlign: 'center',
    },

    band: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#cfd4dd',
        paddingVertical: 22,
        flexDirection: 'row',
        columnGap: 24,
    } as any,

    phone: {
        flex: 1.2,
        justifyContent: 'center',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    phoneLabel: {
        fontWeight: '900',
        letterSpacing: 2,
        marginRight: 6,
    },
    phoneNumber: {
        fontWeight: '900',
        color: colors.brand,
        fontSize: 28,
    },
    hours: {
        fontWeight: '700',
        color: '#374151',
    },
    note: {
        marginTop: 8,
        fontSize: 13,
    },

    mail: {
        flex: 1,
        backgroundColor: '#6b7280',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#666a73',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: 'center',
    },
    iconMail: {
        width: 30,
        height: 22,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 4,
        marginRight: 14,
        position: 'relative',
        overflow: 'hidden',
    },
    iconFlap: {
        position: 'absolute',
        top: 6,
        width: 13,
        height: 2,
        backgroundColor: '#fff',
    },
    iconFlapLeft: {
        left: 2,
        transform: [{ rotate: '32deg' }],
    },
    iconFlapRight: {
        right: 2,
        transform: [{ rotate: '-32deg' }],
    },
    mailText: {
        color: '#fff',
        fontWeight: '800',
    },
    mailArrow: {
        color: '#fff',
        marginLeft: 8,
    },
});

export default Contact;
