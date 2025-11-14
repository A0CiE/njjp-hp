
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { useTranslation } from "react-i18next";

export default function About({ id, onLayout }: SectionProps){
  const { t } = useTranslation();
  return (
    <Section id={id} onLayout={onLayout}>
      <View style={styles.card}>
        <Text style={styles.h2}>{t("aboutTitle")}</Text>
        <Text style={styles.lead}>{t("aboutLead")}</Text>
        <View style={styles.rule}/>
        <Text style={styles.h3}>发展概览</Text>
        <Text>1998 年以 <Text style={{fontWeight:"bold"}}>南极人</Text> 起步，后成长为多品牌平台；在基础款、内衣、家居服、外套等品类长期强势。</Text>
        <Text style={styles.h3}>关键数据</Text>
        <Text>FY2020 净利润约 <Text style={{fontWeight:"bold"}}>11 亿元人民币</Text>；规模优势带来较低平台成本。</Text>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#eef2f7", borderRadius: 14, padding: 20 },
  h2: { fontSize: 22, fontWeight: "900", textAlign: "center" },
  lead: { marginTop: 8, color: "#4b5563", textAlign: "center" },
  rule: { height: 1, backgroundColor: "#cbd5e1", marginVertical: 14 },
  h3: { fontSize: 16, fontWeight: "800", marginTop: 10, textAlign: "center" }
});
