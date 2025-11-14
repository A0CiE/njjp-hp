import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function Handbook({ id, onLayoutSection, scrollY }: SectionProps & { scrollY: number }){
  const { t } = useTranslation();
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <View style={styles.stage}>
        <LinearGradient colors={["#2f3340","#4b5563"]} style={StyleSheet.absoluteFillObject}/>
        <View style={styles.scrim}/>
        <View style={styles.copy}>
          <Text style={styles.h2}>{t("handbookTitle")}</Text>
          <Text style={styles.lead}>深色背景替代图片；文字反白并靠右侧排版，同时保留渐变背景。</Text>
          <View style={styles.rule}/>
          <Text style={styles.h3}>品牌要素</Text>
          <Text style={styles.p}>Logo 规范 / 色彩 / 字体 / 网格留白。</Text>
          <Text style={styles.h3}>商品规范</Text>
          <Text style={styles.p}>标签与尺码合规；包装与印刷规范。</Text>
          <Text style={styles.h3}>传播物料</Text>
          <Text style={styles.p}>线上封面与线下 POP/海报/道具。</Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  stage:{ height: 340, borderRadius: 12, overflow: "hidden" },
  scrim:{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  copy:{ flex:1, padding: 20, alignItems: "flex-end", justifyContent: "center" },
  h2:{ color: "#fff", fontWeight:"900", fontSize: 22 },
  lead:{ color: "#e5e7eb", marginTop: 6 },
  rule:{ height:1, backgroundColor: "rgba(255,255,255,0.2)", alignSelf:"stretch", marginVertical: 10 },
  h3:{ color: "#fff", fontWeight:"800", marginTop: 6, alignSelf:"flex-end" },
  p:{ color: "#e5e7eb", alignSelf:"flex-end" }
});