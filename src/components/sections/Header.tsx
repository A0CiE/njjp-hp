import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../i18n/provider';
import { colors } from '../../theme';

type Lang = 'zh'|'en'|'ja';
const LANGS: { code: Lang; label: string }[] = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
];

export default function Header({ onNav }: { onNav?: (id: string)=>void }){
    const { t } = useTranslation();
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
            { id: 'handbook', label: t('nav.handbook') },
            { id: 'founder', label: t('nav.founder') },
        ], [t]);

    const go = (id: string)=>{ setMenuOpen(false); onNav?.(id); };
    const currentLabel = LANGS.find(l => l.code === currentLanguage)?.label ?? currentLanguage.toUpperCase();

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
                            <Pressable key={n.id} onPress={()=>go(n.id)} style={styles.navLink}>
                                <Text style={styles.navLinkText}>{n.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                <View style={styles.rightArea}>
                    {compact && (
                        <Pressable onPress={()=>setMenuOpen(v=>!v)} style={styles.menuButton} accessibilityLabel="Open menu">
                            <View style={styles.bar}/><View style={styles.bar}/><View style={styles.bar}/>
                        </Pressable>
                    )}

                    <View style={styles.langWrap}>
                        <Pressable
                            onPress={()=>setLangOpen(v=>!v)}
                            style={styles.langBtn}
                            accessibilityLabel="Change language"
                            accessibilityRole="button"
                        >
                            <Text style={styles.langBtnText}>{currentLabel}</Text>
                            <Text style={styles.caret}>▾</Text>
                        </Pressable>

                        {langOpen && (
                            <View style={styles.langPanel}>
                                {LANGS.map(({code,label})=>(
                                    <Pressable
                                        key={code}
                                        onPress={()=>{ setLanguage(code); setLangOpen(false); }}
                                        style={[styles.langItem, code===currentLanguage && styles.langItemActive]}
                                    >
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
                            <Pressable key={n.id} onPress={()=>go(n.id)} style={styles.menuItem}>
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
    navLinkText:{ fontSize:14, color:colors.ink },

    rightArea:{ flexDirection:'row', alignItems:'center', gap:10 },
    menuButton:{ width:40, height:40, borderWidth:1, borderColor:colors.rule, borderRadius:10, alignItems:'center', justifyContent:'center' },
    bar:{ width:20, height:2, backgroundColor:colors.ink, marginVertical:2, borderRadius:2 },

    langWrap:{ position:'relative' },
    langBtn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8,
        borderWidth:1, borderColor:colors.rule, borderRadius:8, minWidth:90, justifyContent:'space-between' },
    langBtnText:{ fontWeight:'700' },
    caret:{ opacity:.7 },

    langPanel:{ position:'absolute', right:0, top:48, backgroundColor:'#fff', borderWidth:1, borderColor:colors.rule,
        borderRadius:12, padding:6, width:180, shadowColor:'#000', shadowOpacity:.12, shadowRadius:16, elevation:6, zIndex:999 },
    langItem:{ paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
    langItemActive:{ backgroundColor:'#f3f4f6' },
    langItemText:{ fontSize:15 },

    backdrop:{ position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'rgba(0,0,0,.2)' },
    menuPanel:{ position:'absolute', right:20, top:56, backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:colors.rule,
        padding:8, width:240, shadowColor:'#000', shadowOpacity:.15, shadowRadius:16, elevation:6 },
    menuItem:{ paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
    menuItemText:{ fontSize:16 },
});
