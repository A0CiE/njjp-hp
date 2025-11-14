import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, metrics } from '../theme';

type Props = React.PropsWithChildren<{
  bg?: 'red'|'dark'|'light'|'paper';
  scrim?: 'left'|'right'|'top'|'bottom';
  align?: 'left'|'right'|'center';
  valign?: 'top'|'middle'|'bottom';
  flow?: boolean;
  tall?: boolean;
  slim?: boolean;
  balanced?: boolean;
  minFull?: boolean;
}>;

export default function Stage({
  children, bg='light', scrim, align='center', valign='middle', flow=false, tall=false, slim=false, balanced=false, minFull=true
}: Props){
  const { width, height } = useWindowDimensions();
  const isMobile = width <= 700;

  const minHeight = (()=>{
    if (flow) return isMobile && minFull ? Math.max(0, height - metrics.navH) : undefined;
    let h = 0.56; if (tall) h = 0.68; if (slim) h = 0.42;
    const base = Math.max(640, Math.floor(h * height));
    return isMobile && minFull ? Math.max(base, Math.floor(height - metrics.navH)) : base;
  })();

  const bgNode = (()=>{
    if (bg === 'red') return <LinearGradient colors={['#e43737', colors.brand, '#c81f1f']} style={StyleSheet.absoluteFillObject} />;
    if (bg === 'dark') return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.dark }]} />;
    if (bg === 'paper') return <LinearGradient colors={['#cfd6de','#e6ebf1','#eef2f7']} start={{x:0,y:0.5}} end={{x:1,y:0.5}} style={StyleSheet.absoluteFillObject} />;
    return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.light }]} />;
  })();

  const scrimNode = (()=>{
    if (!scrim) return null;
    const cols = ['rgba(0,0,0,.45)','rgba(0,0,0,.22)','transparent'] as const;
    if (scrim === 'left') return <LinearGradient pointerEvents="none" colors={cols as any} start={{x:0,y:0.5}} end={{x:1,y:0.5}} style={StyleSheet.absoluteFillObject} />;
    if (scrim === 'right') return <LinearGradient pointerEvents="none" colors={cols as any} start={{x:1,y:0.5}} end={{x:0,y:0.5}} style={StyleSheet.absoluteFillObject} />;
    if (scrim === 'top') return <LinearGradient pointerEvents="none" colors={cols as any} start={{x:0.5,y:0}} end={{x:0.5,y:1}} style={StyleSheet.absoluteFillObject} />;
    if (scrim === 'bottom') return <LinearGradient pointerEvents="none" colors={cols as any} start={{x:0.5,y:1}} end={{x:0.5,y:0}} style={StyleSheet.absoluteFillObject} />;
    return null;
  })();

  const justifyContent = valign === 'top' ? 'flex-start' : valign === 'bottom' ? 'flex-end' : 'center';
  const alignItems = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  const paddingV = balanced ? (isMobile ? 56 : 72) : 0;

  return (
    <View style={[styles.stage, { minHeight }]}>
      {bgNode}
      {scrimNode}
      <View style={[flow ? { position:'relative' } : StyleSheet.absoluteFillObject, { justifyContent, alignItems }]}>
        <View style={styles.maxWrap}>
          <View style={[styles.content, { paddingVertical: paddingV }]}>{children}</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage:{ position:'relative', width:'100%' },
  maxWrap:{ width:'100%', maxWidth:1200, alignSelf:'center', paddingHorizontal:20 },
  content:{ maxWidth:1200, width:'100%' }
});
