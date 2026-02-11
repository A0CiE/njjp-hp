import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Image, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useI18n } from '../../i18n/provider';
import { LANGUAGE_OPTIONS } from '../../i18n/languageOptions';
import { colors } from '../../theme';
import { getLanguageFlagSource } from '../shared/languageFlags';

export default function Header({ onNav }: { onNav?: (id: string)=>void }){
    const { t } = useTranslation();
    const router = useRouter();
    const { currentLanguage, setLanguage } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);   // 导航折叠
    const [langOpen, setLangOpen] = useState(false);   // 语言下拉
    const { width } = useWindowDimensions();
    const compact = width <= 1040;

    const nav = useMemo(
        () => [
            { id: 'hero', label: t('nav.home') },
            { id: 'about', label: t('nav.about') },
            { id: 'services', label: t('nav.services') },
            { id: 'listing', label: t('nav.listing') },
            { id: 'handbook', label: t('nav.handbook') },
            { id: 'founder', label: t('nav.founder') },
        ], [t]);

    const go = (id: string)=>{
        setMenuOpen(false);
        if (id === 'listing' && !onNav) {
            router.push('/listing');
            return;
        }
        onNav?.(id);
    };

    return (
        <View style={styles.header}>
            <View style={styles.nav}>
                <View style={styles.brandWrap}>
                    <View style={styles.brandMark}><Text style={styles.brandMarkText}>NJ</Text></View>
                    <Text style={styles.brand}>NANJI JAPAN</Text>
                </View>

                {!compact && (
                    <View style={styles.navGroup}>
                        {nav.map(n => (
                            <Pressable
                                key={n.id}
                                onPress={()=>go(n.id)}
                                style={({ hovered, pressed }) => [
                                    styles.navLink,
                                    hovered && styles.navLinkHovered,
                                    pressed && styles.navLinkPressed,
                                ]}
                            >
                                <Text style={styles.navLinkText}>{n.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                <View style={styles.rightArea}>
                    {compact && (
                        <Pressable
                            onPress={()=>setMenuOpen(v=>!v)}
                            style={({ hovered, pressed }) => [
                                styles.menuButton,
                                hovered && styles.menuButtonHovered,
                                pressed && styles.menuButtonPressed,
                            ]}
                            accessibilityLabel="Open menu"
                        >
                            <View style={styles.bar}/><View style={styles.bar}/><View style={styles.bar}/>
                        </Pressable>
                    )}

                    <View style={styles.langWrap}>
                        <Pressable
                            onPress={()=>setLangOpen(v=>!v)}
                            style={({ hovered, pressed }) => [
                                styles.langBtn,
                                hovered && styles.langBtnHovered,
                                pressed && styles.langBtnPressed,
                            ]}
                            accessibilityLabel="Change language"
                            accessibilityRole="button"
                        >
                            <Image source={getLanguageFlagSource(currentLanguage)} style={styles.langBtnFlag} />
                        </Pressable>

                        {langOpen && (
                            <View style={styles.langPanel}>
                                {LANGUAGE_OPTIONS.map(({code,label})=>(
                                    <Pressable
                                        key={code}
                                        onPress={()=>{ setLanguage(code); setLangOpen(false); }}
                                        style={({ hovered, pressed }) => [
                                            styles.langItem,
                                            hovered && styles.langItemHovered,
                                            pressed && styles.langItemPressed,
                                        ]}
                                    >
                                        <Image source={getLanguageFlagSource(code)} style={styles.langItemFlag} />
                                        <Text style={styles.langItemText}>{label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={()=>setMenuOpen(false)}>
                    <Pressable style={styles.backdrop} onPress={()=>setMenuOpen(false)}><View/></Pressable>
                    <View style={styles.menuPanel}>
                        {nav.map(n => (
                            <Pressable
                                key={n.id}
                                onPress={()=>go(n.id)}
                                style={({ hovered, pressed }) => [
                                    styles.menuItem,
                                    hovered && styles.menuItemHovered,
                                    pressed && styles.menuItemPressed,
                                ]}
                            >
                                <Text style={styles.menuItemText}>{n.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{ position:'relative', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:colors.rule, zIndex:100 },
    nav:{ maxWidth:1200, alignSelf:'center', paddingHorizontal:20, paddingVertical:12, width:'100%',
        flexDirection:'row', alignItems:'center', justifyContent:'space-between' },

    brandWrap:{ flexDirection:'row', alignItems:'center', gap:10 },
    brandMark:{ width:36, height:36, borderRadius:10, backgroundColor:colors.brand, alignItems:'center', justifyContent:'center' },
    brandMarkText:{ color:'#fff', fontWeight:'900' },
    brand:{ fontWeight:'900', fontSize:16 },

    navGroup:{ flexDirection:'row', gap:8, flexShrink:1 },
    navLink:{ paddingHorizontal:10, paddingVertical:8, borderRadius:10, borderWidth:1, borderColor:'transparent' },
    navLinkHovered:{ borderColor:colors.rule, backgroundColor:'#f7f7f8' },
    navLinkPressed:{ backgroundColor:'#efeff1', borderColor:'#d7d8db' },
    navLinkText:{ fontSize:14, color:colors.ink },

    rightArea:{ flexDirection:'row', alignItems:'center', gap:10 },
    menuButton:{ width:40, height:40, borderWidth:1, borderColor:colors.rule, borderRadius:10, alignItems:'center', justifyContent:'center' },
    menuButtonHovered:{ backgroundColor:'#f7f7f8', borderColor:'#cfd0d4' },
    menuButtonPressed:{ backgroundColor:'#ececef', borderColor:'#c2c4c9' },
    bar:{ width:20, height:2, backgroundColor:colors.ink, marginVertical:2, borderRadius:2 },

    langWrap:{ position:'relative' },
    langBtn:{ width:42, height:36, alignItems:'center', justifyContent:'center',
        borderWidth:1, borderColor:colors.rule, borderRadius:8, backgroundColor:'#fff' },
    langBtnHovered:{ backgroundColor:'#f7f7f8', borderColor:'#cfd0d4' },
    langBtnPressed:{ backgroundColor:'#ececef', borderColor:'#c2c4c9' },
    langBtnFlag:{ width:22, height:22, borderRadius:11 },

    langPanel:{ position:'absolute', right:0, top:48, backgroundColor:'#fff', borderWidth:1, borderColor:colors.rule,
        borderRadius:12, padding:6, width:180, shadowColor:'#000', shadowOpacity:.12, shadowRadius:16, elevation:6, zIndex:999 },
    langItem:{ paddingHorizontal:12, paddingVertical:10, borderRadius:8, flexDirection:'row', alignItems:'center', gap:8 },
    langItemHovered:{ backgroundColor:'#f3f4f6' },
    langItemPressed:{ backgroundColor:'#eaebee' },
    langItemFlag:{ width:16, height:16, borderRadius:8 },
    langItemText:{ fontSize:15 },

    backdrop:{ position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'rgba(0,0,0,.2)' },
    menuPanel:{ position:'absolute', right:20, top:56, backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:colors.rule,
        padding:8, width:240, shadowColor:'#000', shadowOpacity:.15, shadowRadius:16, elevation:6 },
    menuItem:{ paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
    menuItemHovered:{ backgroundColor:'#f3f4f6' },
    menuItemPressed:{ backgroundColor:'#eaebee' },
    menuItemText:{ fontSize:16 },
});
