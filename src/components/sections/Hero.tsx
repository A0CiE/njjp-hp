
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function Hero({ id, onLayoutSection, scrollY }: SectionProps & { scrollY: number }){
  const { t } = useTranslation();
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <View style={styles.stage}>
        <LinearGradient
          colors={["#5f6d7b","#2e333a","#16191f"]}
          start={{x:0.2,y:0.4}} end={{x:1,y:1}}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scrim}/>
        <View style={styles.copy}>
          <Text style={styles.tag}>{t("heroTag")}</Text>
          <Text style={styles.h1}>{t("heroTitle")}</Text>
          <Text style={styles.lead}>参照 PDF 封面构图，使用渐变作背景；遮罩提高对比度，文字叠加。</Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  stage: { height: 360, borderRadius: 12, overflow: "hidden" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  copy: { flex: 1, padding: 20, justifyContent: "center" },
  tag: { color: "#cbd5e1", letterSpacing: 2, textTransform: "uppercase" },
  h1: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 6 },
  lead: { color: "#e5e7eb", marginTop: 6 }
});
