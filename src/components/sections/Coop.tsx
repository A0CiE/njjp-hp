import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Section, { SectionProps } from "./Section";

export default function Coop({ id, onLayoutSection }: SectionProps){
  return (
    <Section id={id} onLayoutSection={onLayoutSection}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.h2}>合作模式</Text>
          <Text style={styles.h3}>股权结构</Text>
          <Text>成立合资公司：南极 60%，C&A 40%。</Text>
          <Text style={styles.h3}>资源投入</Text>
          <Text>南极：经营管理；C&A：品牌与线上销售权。</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Text style={styles.h3}>经营管理</Text>
          <Text>南极全权负责 C&A 品牌经营管理</Text>
          <Text style={styles.h3}>利润分成</Text>
          <Text>C&A 分享 40% 利润。</Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  row:{ flexDirection:"row", gap: 16, alignItems: "flex-start" },
  col:{ flex:1 },
  divider:{ width: 8, borderRadius:4, backgroundColor: "#b91c1c", height: "100%" },
  h2:{ fontSize:20, fontWeight:"900", marginBottom: 8 },
  h3:{ fontSize:16, fontWeight:"800", marginTop: 8 }
});