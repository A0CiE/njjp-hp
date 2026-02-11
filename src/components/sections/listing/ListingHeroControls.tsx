import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export type ListingMenuKey = 'season' | 'gender' | 'sort' | null;

export type ListingDropdownOption = {
    value: string;
    label: string;
};

type Props = {
    isMobile: boolean;
    heroTop: string;
    heroBottom: string;
    heroFontSize: number;
    heroTextMaxWidth: number;
    heroStyle: any;
    sortStyle: any;
    sortHeading: string;
    sortLabelSize: number;
    controlPanelWidth: number;

    seasonLabel: string;
    genderLabel: string;
    sortLabel: string;

    selectedSeasonLabel: string;
    selectedGenderLabel: string;
    selectedSortLabel: string;

    seasonOptions: ListingDropdownOption[];
    genderOptions: ListingDropdownOption[];
    sortOptions: ListingDropdownOption[];

    selectedSeasonValue: string;
    selectedGenderValue: string;
    selectedSortValue: string;

    openMenu: ListingMenuKey;
    onToggleMenu: (key: Exclude<ListingMenuKey, null>) => void;
    onSelectSeason: (value: string) => void;
    onSelectGender: (value: string) => void;
    onSelectSort: (value: string) => void;
};

const CHARCOAL = '#333334';
const OFF_BEIGE = '#ECEADD';

export default function ListingHeroControls({
    isMobile,
    heroTop,
    heroBottom,
    heroFontSize,
    heroTextMaxWidth,
    heroStyle,
    sortStyle,
    sortHeading,
    sortLabelSize,
    controlPanelWidth,
    seasonLabel,
    genderLabel,
    sortLabel,
    selectedSeasonLabel,
    selectedGenderLabel,
    selectedSortLabel,
    seasonOptions,
    genderOptions,
    sortOptions,
    selectedSeasonValue,
    selectedGenderValue,
    selectedSortValue,
    openMenu,
    onToggleMenu,
    onSelectSeason,
    onSelectGender,
    onSelectSort,
}: Props) {
    const colStyleFor = (key: Exclude<ListingMenuKey, null>) => [
        styles.controlCol,
        openMenu === key ? styles.controlColActive : styles.controlColInactive,
    ];

    const wrapStyleFor = (key: Exclude<ListingMenuKey, null>) => [
        styles.sortControlWrap,
        openMenu === key ? styles.sortControlWrapActive : null,
    ];

    return (
        <View style={[styles.heroRow, isMobile && styles.heroRowStack]}>
            <View style={[styles.heroTitleWrap, { width: isMobile ? '100%' : heroTextMaxWidth, maxWidth: heroTextMaxWidth }]}>
                <Animated.Text
                    style={[
                        styles.heroTitle,
                        heroStyle,
                        {
                            fontSize: heroFontSize,
                            lineHeight: Math.round(heroFontSize * 0.96),
                        },
                    ]}
                >
                    {heroTop}
                    {'\n'}
                    {heroBottom}
                </Animated.Text>
            </View>

            <Animated.View
                style={[
                    styles.sortBlock,
                    sortStyle,
                    { width: controlPanelWidth },
                    openMenu ? styles.sortBlockMenuOpen : null,
                ]}
            >
                <Text style={[styles.sortLabel, { fontSize: sortLabelSize, lineHeight: Math.round(sortLabelSize * 1.1) }]}>
                    {sortHeading}
                </Text>

                <View style={styles.controlRow}>
                    <View style={colStyleFor('season')}>
                        <Text style={styles.controlCaption}>{seasonLabel}</Text>
                        <View style={wrapStyleFor('season')}>
                            <Pressable
                                onPress={() => onToggleMenu('season')}
                                style={({ pressed, hovered }: any) => [
                                    styles.sortTrigger,
                                    hovered && styles.sortTriggerHovered,
                                    pressed && styles.sortTriggerPressed,
                                ]}
                            >
                                <Text numberOfLines={1} style={styles.sortTriggerText}>
                                    {selectedSeasonLabel}
                                </Text>
                                <Text style={styles.sortCaret}>⌄</Text>
                            </Pressable>

                            {openMenu === 'season' && (
                                <View style={styles.sortMenu}>
                                    {seasonOptions.map((option) => {
                                        const active = option.value === selectedSeasonValue;
                                        return (
                                            <Pressable
                                                key={`season-${option.value}`}
                                                onPress={() => onSelectSeason(option.value)}
                                                style={({ pressed, hovered }: any) => [
                                                    styles.sortItem,
                                                    active && styles.sortItemActive,
                                                    hovered && styles.sortItemHovered,
                                                    pressed && styles.sortItemPressed,
                                                ]}
                                            >
                                                <Text style={styles.sortItemText}>{option.label}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={colStyleFor('gender')}>
                        <Text style={styles.controlCaption}>{genderLabel}</Text>
                        <View style={wrapStyleFor('gender')}>
                            <Pressable
                                onPress={() => onToggleMenu('gender')}
                                style={({ pressed, hovered }: any) => [
                                    styles.sortTrigger,
                                    hovered && styles.sortTriggerHovered,
                                    pressed && styles.sortTriggerPressed,
                                ]}
                            >
                                <Text numberOfLines={1} style={styles.sortTriggerText}>
                                    {selectedGenderLabel}
                                </Text>
                                <Text style={styles.sortCaret}>⌄</Text>
                            </Pressable>

                            {openMenu === 'gender' && (
                                <View style={styles.sortMenu}>
                                    {genderOptions.map((option) => {
                                        const active = option.value === selectedGenderValue;
                                        return (
                                            <Pressable
                                                key={`gender-${option.value}`}
                                                onPress={() => onSelectGender(option.value)}
                                                style={({ pressed, hovered }: any) => [
                                                    styles.sortItem,
                                                    active && styles.sortItemActive,
                                                    hovered && styles.sortItemHovered,
                                                    pressed && styles.sortItemPressed,
                                                ]}
                                            >
                                                <Text style={styles.sortItemText}>{option.label}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={colStyleFor('sort')}>
                        <Text style={styles.controlCaption}>{sortLabel}</Text>
                        <View style={wrapStyleFor('sort')}>
                            <Pressable
                                onPress={() => onToggleMenu('sort')}
                                style={({ pressed, hovered }: any) => [
                                    styles.sortTrigger,
                                    hovered && styles.sortTriggerHovered,
                                    pressed && styles.sortTriggerPressed,
                                ]}
                            >
                                <Text numberOfLines={1} style={styles.sortTriggerText}>
                                    {selectedSortLabel}
                                </Text>
                                <Text style={styles.sortCaret}>⌄</Text>
                            </Pressable>

                            {openMenu === 'sort' && (
                                <View style={styles.sortMenu}>
                                    {sortOptions.map((option) => {
                                        const active = option.value === selectedSortValue;
                                        return (
                                            <Pressable
                                                key={`sort-${option.value}`}
                                                onPress={() => onSelectSort(option.value)}
                                                style={({ pressed, hovered }: any) => [
                                                    styles.sortItem,
                                                    active && styles.sortItemActive,
                                                    hovered && styles.sortItemHovered,
                                                    pressed && styles.sortItemPressed,
                                                ]}
                                            >
                                                <Text style={styles.sortItemText}>{option.label}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    heroRow: {
        marginTop: 82,
        marginBottom: 56,
        minHeight: 172,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 20,
        position: 'relative',
        zIndex: 12,
        overflow: 'visible',
    },
    heroRowStack: {
        marginTop: 56,
        marginBottom: 30,
        minHeight: 120,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 18,
    },
    heroTitle: {
        color: CHARCOAL,
        fontFamily: 'serif',
        letterSpacing: -1.2,
        width: '100%',
        maxWidth: '100%',
    },
    heroTitleWrap: {
        minWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'flex-end',
    },
    sortBlock: {
        maxWidth: '100%',
        zIndex: 20,
        overflow: 'visible',
    },
    sortBlockMenuOpen: {
        zIndex: 140,
    },
    sortLabel: {
        color: CHARCOAL,
        marginBottom: 8,
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
        overflow: 'visible',
    },
    controlCol: {
        flex: 1,
        minWidth: 150,
        position: 'relative',
    },
    controlColInactive: {
        zIndex: 1,
    },
    controlColActive: {
        zIndex: 80,
    },
    controlCaption: {
        color: 'rgba(51,51,52,0.72)',
        fontSize: 12,
        marginBottom: 6,
    },
    sortControlWrap: {
        position: 'relative',
        overflow: 'visible',
    },
    sortControlWrapActive: {
        zIndex: 90,
    },
    sortTrigger: {
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        backgroundColor: OFF_BEIGE,
        height: 42,
        borderRadius: 2,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortTriggerPressed: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    sortTriggerHovered: {
        backgroundColor: 'rgba(51,51,52,0.06)',
        borderColor: 'rgba(51,51,52,0.34)',
    },
    sortTriggerText: {
        color: CHARCOAL,
        fontSize: 15,
        flex: 1,
        paddingRight: 10,
    },
    sortCaret: {
        color: CHARCOAL,
        fontSize: 16,
    },
    sortMenu: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: 'rgba(51,51,52,0.18)',
        borderRadius: 2,
        backgroundColor: OFF_BEIGE,
        overflow: 'hidden',
        zIndex: 120,
        elevation: 16,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    sortItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    sortItemActive: {
        backgroundColor: 'rgba(51,51,52,0.08)',
    },
    sortItemPressed: {
        backgroundColor: 'rgba(51,51,52,0.06)',
    },
    sortItemHovered: {
        backgroundColor: 'rgba(51,51,52,0.1)',
    },
    sortItemText: {
        color: CHARCOAL,
        fontSize: 14,
    },
});
