import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { useTranslation } from "react-i18next";

export default function Categories({ id, onLayout }: SectionProps){
  const { t } = useTranslation();
  const labels = t("categories.channels", { returnObjects: true }) as string[];
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <Text style={styles.metricTitle}>{t("categories.baseTitle")}</Text>
      <View style={styles.metric}>
        <Text style={styles.num}>7.5</Text>
        <Text style={styles.unit}>{t("categories.countUnit")}</Text>
      </View>
      <Text style={styles.channelsTitle}>{t("categories.channelsTitle")}</Text>
      <View style={styles.grid}>
        {labels.map((label) => (
          <View key={label} style={styles.channel}>
            <View style={styles.iconSquare} />
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  metricTitle:{ fontSize:20, fontWeight:"900", textAlign: "center" },
  metric:{ flexDirection: "row", alignItems:"flex-end", gap: 10, marginBottom: 18, justifyContent: "center" },
  num:{ color: "#df2b2b", fontWeight:"900", fontSize: 96, lineHeight: 88 },
  unit:{ color: "#df2b2b", fontWeight:"800", paddingBottom: 8, fontSize: 28 },
  channelsTitle:{ fontSize:20, fontWeight:"900", marginTop: 10, marginBottom: 14, textAlign: "center" },
  grid:{ flexDirection:"row", flexWrap:"wrap", gap: 16, justifyContent: "center" },
  channel:{ width: "30%", alignItems:"center", marginBottom: 16 },
  iconSquare:{ width: 66, height: 66, borderRadius: 14, backgroundColor: "#e5e7eb", borderWidth:1, borderColor: "#d1d5db", marginBottom: 6 },
  label:{ fontSize: 12 }
});