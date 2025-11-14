import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function Founder({ id, onLayoutSection }: SectionProps){
  const { t } = useTranslation();
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <View style={styles.stage}>
        <LinearGradient colors={["#5f6d7b","#2e333a","#16191f"]} start={{x:0.2,y:0.4}} end={{x:1,y:1}} style={StyleSheet.absoluteFillObject}/>
        <View style={styles.scrim}/>
        <View style={styles.copy}>
          <Text style={styles.h2}>{t("founderTitle")}</Text>
          <Text style={styles.lead}>The Founder‘s Value: CONFIDENCE · TRUST · RELIABILITY · PARTNERSHIP</Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  stage:{ height: 240, borderRadius: 12, overflow: "hidden" },
  scrim:{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  copy:{ flex:1, padding: 20, justifyContent:"center" },
  h2:{ color: "#fff", fontWeight:"900", fontSize: 20 },
  lead:{ color: "#e5e7eb", marginTop: 6 }
});