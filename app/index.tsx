import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors, metrics, typeScale } from '../src/theme';

import Stage from '../src/components/Stage';
import Header from '../src/components/Header';
import Contact from "../src/components/sections/Contact";
import Footer from "../src/components/Footer";


export default function Page(){
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [offsets, setOffsets] = useState<Record<string, number>>({});

  const onLayout = (id: string)=>(e:any)=>{
    const y = e.nativeEvent.layout.y as number;
    setOffsets(prev => ({ ...prev, [id]: y }));
  };
  const scrollToId = (id: string)=>{
    const y = offsets[id] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  const channels = useMemo(()=>{
    const raw = t('categories.channels', { returnObjects:true }) as unknown;
    return Array.isArray(raw) ? raw as string[] : [];
  }, [t]);

  const digitalBlocks = useMemo(()=>{
    const raw = t('digital.blocks', { returnObjects:true }) as unknown;
    return Array.isArray(raw) ? raw as { title:string; items:string[] }[] : [];
  }, [t]);

  const ww = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const cols = ww >= metrics.bpMd ? 6 : (ww >= metrics.bpSm ? 3 : 2);
  const itemW = `${100/cols - 1.5}%` as any;
  const sizes = {
    h1: typeScale.h1(ww), h2: typeScale.h2(ww), h3: typeScale.h3(ww), lead: typeScale.lead(ww),
    dTitle: typeScale.dTitle(ww), metricNum: typeScale.metricNum(ww), metricUnit: typeScale.metricUnit(ww)
  };

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <Header onNav={scrollToId}/>
      <ScrollView ref={scrollRef} contentContainerStyle={{paddingBottom:24}}>
        {/* HERO */}
        <View onLayout={onLayout('hero')}>
          <Stage bg="red" scrim="left" align="center" valign="middle">
            <View>
              <Text style={[styles.muted,{textTransform:'uppercase',letterSpacing:2,color:'#e5e7eb', textAlign:'center'}]}>{t('hero.tag')}</Text>
              <Text style={[styles.h1,{color:'#fff', textAlign:'center', fontSize:sizes.h1, lineHeight: Math.round(sizes.h1*1.12)}]}>{t('hero.title')}</Text>
              <Text style={[styles.lead,{color:'#e5e7eb', textAlign:'center', fontSize:sizes.lead}]}>{t('hero.lead')}</Text>
            </View>
          </Stage>
        </View>

        {/* ABOUT */}
        <View onLayout={onLayout('about')}>
          <Stage bg="light" scrim="right" align="center" valign="middle">
            <View style={{maxWidth:640, alignSelf:'center'}}>
              <Text style={[styles.h2,{textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18)}]}>{t('about.title')}</Text>
              <Text style={[styles.lead,{textAlign:'center', fontSize:sizes.lead}]}>{t('about.lead')}</Text>
              <View style={[styles.rule,{backgroundColor:'#cbd5e1'}]} />
              <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('about.overview')}</Text>
              <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('about.overviewBody')}</Text>
              <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('about.key')}</Text>
              <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('about.keyBody')}</Text>
            </View>
          </Stage>
        </View>

        {/* CATEGORIES */}
        <View onLayout={onLayout('categories')}>
          <Stage bg="paper" scrim="left" align="center" valign="middle">
            <View style={{alignItems:'center'}}>
              <Text style={[styles.metricTitle,{textAlign:'center', fontSize:sizes.h3}]}>{t('categories.metricTitle')}</Text>
              <View style={[styles.metric,{justifyContent:'center'}]}>
                <Text style={[styles.metricNum,{fontSize:sizes.metricNum,lineHeight:Math.round(sizes.metricNum*0.95), textAlign:'center'}]}>{t('categories.usersValue')}</Text>
                <Text style={[styles.metricUnit,{fontSize:sizes.metricUnit, textAlign:'center'}]}>{t('categories.usersUnit')}</Text>
              </View>

              <View style={{marginTop:12, width:'100%'}}>
                <Text style={[styles.channelsTitle,{textAlign:'center', fontSize:sizes.h3}]}>{t('categories.channelsTitle')}</Text>
                <View style={[styles.channelGrid,{justifyContent:'center'}]}>
                  {channels.map(label => (
                    <View key={label} style={[styles.channel,{width:itemW}]}>
                      <View style={styles.iconSquare}/>
                      <Text style={[styles.label,{textAlign:'center', fontSize:sizes.lead}]}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Stage>
        </View>

        {/* HANDBOOK */}
        <View onLayout={onLayout('handbook')}>
          <Stage bg="dark" scrim="right" align="center" valign="middle">
            <View>
              <Text style={[styles.h2, { color:'#e5e7eb', textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18) }]}>{t('handbook.title')}</Text>
              <Text style={[styles.lead, { color:'#94a3b8', textAlign:'center', fontSize:sizes.lead }]}>{t('handbook.lead')}</Text>
              <View style={[styles.rule,{backgroundColor:'rgba(255,255,255,.18)'}]} />
              {['0','1','2'].map((i)=> (
                <View key={i} style={{marginBottom:6}}>
                  <Text style={[styles.h3, { color:'#e5e7eb', textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25) }]}>{t(`handbook.items.${i}`)}</Text>
                  <Text style={[styles.p, { color:'#e5e7eb', textAlign:'center', fontSize:sizes.lead }]}>{t(`handbook.itemBodies.${i}`)}</Text>
                </View>
              ))}
            </View>
          </Stage>
        </View>

        {/* SUPPLY */}
        <View onLayout={onLayout('supply')}>
          <Stage bg="light" scrim="left" align="center" valign="middle">
            <View style={{alignItems:'center'}}>
              <Text style={[styles.h2,{textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18)}]}>{t('supply.title')}</Text>
              <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('supply.s1')}</Text>
              <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('supply.p1')}</Text>
              <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('supply.s2')}</Text>
              <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('supply.p2')}</Text>
            </View>
          </Stage>
        </View>

        {/* DIGITALIZATION */}
        <View onLayout={onLayout('digital')}>
          <Stage bg="light" align="center" valign="middle" slim>
            <View>
              <Text style={[styles.h2,{textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18)}]}>{t('digital.title')}</Text>
              <View style={styles.dList}>
                {digitalBlocks.map((blk) => (
                  <View key={blk.title} style={styles.dItem}>
                    <View style={styles.dThumb}/>
                    <View style={{flex:1}}>
                      <Text style={[styles.dTitle,{fontSize:sizes.h3, textAlign:'left'}]}>{blk.title}</Text>
                      {blk.items.map((it, idx)=>(<Text key={idx} style={[styles.lead,{fontSize:sizes.lead, textAlign:'left'}]}>• {it}</Text>))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Stage>
        </View>

        {/* COOP */}
        <View onLayout={onLayout('coop')}>
          <Stage bg="light" align="center" valign="middle" slim>
            <View style={styles.coopRow}>
              <View style={{flex:1}}>
                <Text style={[styles.h2,{textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18)}]}>{t('coop.title')}</Text>
                <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('coop.l1')}</Text>
                <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('coop.p1')}</Text>
                <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('coop.l2')}</Text>
                <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('coop.p2')}</Text>
              </View>
              <LinearGradient colors={['#f87171','#b91c1c']} style={styles.coopDivider}/>
              <View style={{flex:1, marginTop:44}}>
                <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('coop.r1')}</Text>
                <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('coop.rp1')}</Text>
                <Text style={[styles.h3,{textAlign:'center', fontSize:sizes.h3, lineHeight:Math.round(sizes.h3*1.25)}]}>{t('coop.r2')}</Text>
                <Text style={[styles.p,{textAlign:'center', fontSize:sizes.lead}]}>{t('coop.rp2')}</Text>
              </View>
            </View>
          </Stage>
        </View>

        {/* FOUNDER */}
        <View onLayout={onLayout('founder')}>
          <Stage bg="dark" scrim="left" align="center" valign="middle">
            <View>
              <Text style={[styles.h2, { color:'#e5e7eb', textAlign:'center', fontSize:sizes.h2, lineHeight:Math.round(sizes.h2*1.18) }]}>{t('founder.title')}</Text>
              <Text style={[styles.lead, { color:'#94a3b8', textAlign:'center', fontSize:sizes.lead }]}>{t('founder.lead')}</Text>
            </View>
          </Stage>
        </View>
        <Footer onBackToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h1:{ fontWeight:'900', color:colors.ink, marginBottom:8 },
  h2:{ fontWeight:'900', color:colors.ink, marginBottom:8 },
  h3:{ fontWeight:'800', color:colors.ink, marginTop:14, marginBottom:6 },
  lead:{ color:colors.inkWeak, marginBottom:6 },
  p:{ color:colors.ink },
  muted:{ color:colors.inkWeak },
  rule:{ height:1, backgroundColor:'rgba(0,0,0,.12)', marginVertical:12 },

  metricTitle:{ fontWeight:'800', marginBottom:10, lineHeight:28 },
  metric:{ flexDirection:'row', alignItems:'flex-end', gap:12, marginVertical:6, marginBottom:36 },
  metricNum:{ fontWeight:'900', color:colors.brand, letterSpacing:-0.5 },
  metricUnit:{ fontWeight:'700', color:colors.brand },

  channelsTitle:{ fontWeight:'800', marginBottom:18, lineHeight:28 },
  channelGrid:{ flexDirection:'row', flexWrap:'wrap' },
  channel:{ alignItems:'center', marginBottom:28 },
  iconSquare:{ width:80, height:80, borderRadius:16, backgroundColor:'#e5e7eb', borderWidth:1, borderColor:'#d1d5db' },
  label:{ marginTop:8, color:colors.ink },

  dList:{ display:'flex', gap:18 },
  dItem:{ flexDirection:'row', gap:14, alignItems:'flex-start', marginBottom:12, alignSelf:'center', width:'100%', maxWidth:780 },
  dThumb:{ width:76, height:62, borderRadius:8, backgroundColor:'#e5e7eb', borderWidth:1, borderColor:'#cbd5e1' },
  dTitle:{ color:colors.brand, fontWeight:'800', marginBottom:4 },
  li:{ color:'#374151', lineHeight:22, fontSize:15 },

  coopRow:{ flexDirection:'row', alignItems:'flex-start', gap:24 },
  coopDivider:{ width:12, borderRadius:6, height:'100%' },
});
