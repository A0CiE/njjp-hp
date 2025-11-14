
import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import Section, { SectionProps } from "./Section";
import { useTranslation } from "react-i18next";

function Card({ title, desc }: { title: string; desc: string; }){
  const tilt = useRef(new Animated.Value(0)).current;
  const onIn = ()=> Animated.spring(tilt, { toValue: 1, useNativeDriver: true }).start();
  const onOut = ()=> Animated.spring(tilt, { toValue: 0, useNativeDriver: true }).start();
  const rX = tilt.interpolate({ inputRange:[0,1], outputRange:["0deg","6deg"] });
  const rY = tilt.interpolate({ inputRange:[0,1], outputRange:["0deg","-10deg"] });
  const translateY = tilt.interpolate({ inputRange:[0,1], outputRange:[0,-3] });
  return (
    <Pressable onPressIn={onIn} onPressOut={onOut} style={{flex:1}}>
      <Animated.View style={[styles.svc, { transform:[{ perspective:1000 },{ rotateX:rX },{ rotateY:rY },{ translateY }] }]}>
        <View style={styles.tile}/>
        <Text style={styles.svcTitle}>{title}</Text>
        <Text style={styles.svcDesc}>{desc}</Text>
        <Text style={styles.arrow}>→</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function Services({ id, onLayoutSection }: SectionProps){
  const { t } = useTranslation();
  const items = t("services",{ returnObjects:true }) as any[];
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <Text style={styles.h2}>{t("servicesTitle")}</Text>
      <View style={styles.grid}>
        {items.map((it,i)=>(<Card key={i} title={it.title} desc={it.desc}/>))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  h2: { fontSize: 22, fontWeight: "900", marginBottom: 12, textAlign: "center" },
  grid: { flexDirection: "row", gap: 12 },
  svc: { flex: 1, backgroundColor: "#f6f7fb", borderWidth: 1, borderColor: "#e6e9f0", borderRadius: 12, padding: 16, minHeight: 150 },
  tile: { width: 64, height: 64, borderRadius: 14, backgroundColor: "#e6ebf1", borderWidth: 1, borderColor: "#d5dae3", marginBottom: 10 },
  svcTitle: { fontWeight: "900", marginBottom: 4 },
  svcDesc: { color: "#4b5563" },
  arrow: { position: "absolute", right: 12, bottom: 12, opacity: 0.6 }
});
