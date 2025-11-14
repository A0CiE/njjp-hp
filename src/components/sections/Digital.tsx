import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { useTranslation } from "react-i18next";

export default function Digital({ id, onLayoutSection }: SectionProps){
  const { t } = useTranslation();
  const items = t("digital", { returnObjects: true }) as any[];
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <Text style={styles.h2}>{t("digitalTitle")}</Text>
      <View style={styles.list}>
        {items.map((it, idx)=> (
          <View key={idx} style={styles.item}>
            <View style={styles.thumb}/>
            <View style={{flex:1}}>
              <Text style={styles.title}>{it.title}</Text>
              {it.bullets.map((b:string)=> (<Text key={b} style={styles.bullet}>• {b}</Text>))}
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  h2:{ fontSize:22, fontWeight:"900", marginBottom: 10, textAlign: "center" },
  list:{ gap: 12 },
  item:{ flexDirection:"row", gap: 10 },
  thumb:{ width: 72, height: 56, borderRadius:8, backgroundColor: "#d1d5db" },
  title:{ color:"#df2b2b", fontWeight:"800" },
  bullet:{ color: "#374151", marginTop: 2 }
});