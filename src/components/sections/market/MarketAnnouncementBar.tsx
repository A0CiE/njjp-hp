import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppLanguage } from '../../../i18n/languageOptions';
import { getLanguageFlagSource } from '../../shared/languageFlags';

type LangOption = {
    code: AppLanguage;
    label: string;
};

type Props = {
    announcement: string;
    notifyText: string;
    currentLang: AppLanguage;
    langOpen: boolean;
    langOptions: LangOption[];
    onToggleLang: () => void;
    onSelectLang: (code: AppLanguage) => void;
    compact?: boolean;
};

const CHARCOAL = '#333334';
const OFF_BEIGE = '#ECEADD';

export default function MarketAnnouncementBar({
    announcement,
    notifyText,
    currentLang,
    langOpen,
    langOptions,
    onToggleLang,
    onSelectLang,
    compact = true,
}: Props) {
    return (
        <View style={[styles.announcement, compact ? styles.announcementCompact : styles.announcementRegular]}>
            <View style={[styles.langWrap, compact ? styles.langWrapCompact : styles.langWrapRegular]}>
                <Pressable
                    onPress={onToggleLang}
                    style={({ pressed, hovered }: any) => [
                        styles.langBtn,
                        compact ? styles.langBtnCompact : styles.langBtnRegular,
                        hovered && styles.langBtnHovered,
                        pressed && styles.langBtnPressed,
                    ]}
                >
                    <Image
                        source={getLanguageFlagSource(currentLang)}
                        style={styles.langBtnFlag}
                        accessibilityIgnoresInvertColors
                    />
                </Pressable>
                {langOpen && (
                    <View style={[styles.langMenu, compact ? styles.langMenuCompact : styles.langMenuRegular]}>
                        {langOptions.map((option) => {
                            return (
                                <Pressable
                                    key={option.code}
                                    onPress={() => onSelectLang(option.code)}
                                    style={({ pressed, hovered }: any) => [
                                        styles.langItem,
                                        hovered && styles.langItemHovered,
                                        pressed && styles.langItemPressed,
                                    ]}
                                >
                                    <Image
                                        source={getLanguageFlagSource(option.code)}
                                        style={styles.langItemFlag}
                                        accessibilityIgnoresInvertColors
                                    />
                                    <Text style={styles.langItemText}>{option.label}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            </View>

            <Text
                numberOfLines={compact ? 1 : 2}
                ellipsizeMode="tail"
                style={[styles.annText, compact ? styles.annTextCompact : styles.annTextRegular]}
            >
                {announcement}
            </Text>

            <Pressable
                style={({ pressed, hovered }: any) => [
                    styles.notifyBtn,
                    compact ? styles.notifyBtnCompact : styles.notifyBtnRegular,
                    hovered && styles.notifyBtnHovered,
                    pressed && styles.notifyBtnPressed,
                ]}
            >
                <Text style={[styles.notifyText, compact ? styles.notifyTextCompact : styles.notifyTextRegular]}>{notifyText}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    announcement: {
        backgroundColor: '#E0DDCF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(51,51,52,0.08)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30,
    },
    announcementCompact: {
        minHeight: 38,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 10,
    },
    announcementRegular: {
        minHeight: 52,
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    langWrap: {
        position: 'relative',
    },
    langWrapCompact: {
        minWidth: 34,
    },
    langWrapRegular: {
        minWidth: 38,
    },
    langBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.3)',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.22)',
    },
    langBtnCompact: {
        width: 32,
        height: 28,
    },
    langBtnRegular: {
        width: 36,
        height: 30,
    },
    langBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.1)',
    },
    langBtnHovered: {
        backgroundColor: 'rgba(51,51,52,0.08)',
        borderColor: 'rgba(51,51,52,0.44)',
    },
    langBtnFlag: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    langMenu: {
        position: 'absolute',
        left: 0,
        minWidth: 112,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        backgroundColor: OFF_BEIGE,
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 40,
    },
    langMenuCompact: {
        top: 30,
    },
    langMenuRegular: {
        top: 32,
        minWidth: 116,
        borderColor: 'rgba(51,51,52,0.2)',
    },
    langItem: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    langItemPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    langItemHovered: {
        backgroundColor: 'rgba(51,51,52,0.1)',
    },
    langItemText: {
        color: CHARCOAL,
        fontSize: 12,
    },
    langItemFlag: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    annText: {
        flex: 1,
        color: CHARCOAL,
        textAlign: 'center',
        minWidth: 0,
    },
    annTextCompact: {
        fontSize: 12,
        opacity: 0.9,
    },
    annTextRegular: {
        fontSize: 13,
        opacity: 0.95,
    },
    notifyBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.4)',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    notifyBtnCompact: {
        paddingHorizontal: 14,
        height: 28,
    },
    notifyBtnRegular: {
        paddingHorizontal: 14,
        height: 30,
    },
    notifyBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    notifyBtnHovered: {
        backgroundColor: 'rgba(51,51,52,0.1)',
        borderColor: 'rgba(51,51,52,0.55)',
    },
    notifyText: {
        color: CHARCOAL,
    },
    notifyTextCompact: {
        fontSize: 12,
    },
    notifyTextRegular: {
        fontSize: 13,
    },
});
