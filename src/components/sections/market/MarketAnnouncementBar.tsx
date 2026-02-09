import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LangOption = {
    code: string;
    label: string;
};

type Props = {
    announcement: string;
    notifyText: string;
    currentShortLabel: string;
    currentLang: string;
    langOpen: boolean;
    langOptions: LangOption[];
    onToggleLang: () => void;
    onSelectLang: (code: string) => void;
    compact?: boolean;
};

const CHARCOAL = '#333334';
const OFF_BEIGE = '#ECEADD';

export default function MarketAnnouncementBar({
    announcement,
    notifyText,
    currentShortLabel,
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
                    style={({ pressed }) => [
                        styles.langBtn,
                        compact ? styles.langBtnCompact : styles.langBtnRegular,
                        pressed && styles.langBtnPressed,
                    ]}
                >
                    <Text style={styles.langBtnText}>{currentShortLabel}</Text>
                    <Text style={styles.langCaret}>▾</Text>
                </Pressable>
                {langOpen && (
                    <View style={[styles.langMenu, compact ? styles.langMenuCompact : styles.langMenuRegular]}>
                        {langOptions.map((option) => {
                            const active = option.code === currentLang;
                            return (
                                <Pressable
                                    key={option.code}
                                    onPress={() => onSelectLang(option.code)}
                                    style={({ pressed }) => [
                                        styles.langItem,
                                        active && styles.langItemActive,
                                        pressed && styles.langItemPressed,
                                    ]}
                                >
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

            <Pressable style={({ pressed }) => [styles.notifyBtn, compact ? styles.notifyBtnCompact : styles.notifyBtnRegular, pressed && styles.notifyBtnPressed]}>
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
        minWidth: 82,
    },
    langWrapRegular: {
        minWidth: 90,
    },
    langBtn: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.3)',
        borderRadius: 2,
        paddingHorizontal: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.22)',
    },
    langBtnCompact: {
        height: 28,
    },
    langBtnRegular: {
        height: 30,
        paddingHorizontal: 10,
    },
    langBtnPressed: {
        backgroundColor: 'rgba(51,51,52,0.1)',
    },
    langBtnText: {
        color: CHARCOAL,
        fontSize: 12,
        fontWeight: '700',
    },
    langCaret: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 12,
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
    },
    langItemActive: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    langItemPressed: {
        backgroundColor: 'rgba(51,51,52,0.14)',
    },
    langItemText: {
        color: CHARCOAL,
        fontSize: 12,
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
