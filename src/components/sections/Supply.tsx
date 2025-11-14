
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { useTranslation } from "react-i18next";

export default function Supply({ id, onLayoutSection }: SectionProps){
  const { t } = useTranslation();
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <View style={styles.card}>
        <Text style={styles.h2}>{t("supplyTitle")}</Text>
        <Text style={styles.h3}>供应侧</Text>
        <Text>CSR 与指南；透明与责任；品质稳定与规模效率。</Text>
        <Text style={styles.h3}>产品侧</Text>
        <Text>材料工艺升级；研发—打样—量产闭环；追溯与抽检。</Text>
      </View>
    </Section>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor:"#eef2f7", borderRadius:14, padding:18, alignItems:"center" },
  h2:{ fontSize:22, fontWeight:"900", textAlign:"center" },
  h3:{ fontSize:16, fontWeight:"800", marginTop:8, textAlign:"center" }
});
