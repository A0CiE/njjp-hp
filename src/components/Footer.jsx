import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Footer({ onBackToTop }: { onBackToTop: () => void }){
    return (
      <View style={styles.footer}>
          <View style={styles.top}>
              <View style={{flex:1}}>
                  <Text style={styles.strong}>NANJI JAPAN 株式会社</Text>
                  <Text style={styles.line}>〒150-0001 東京都渋谷区神宮前 〇〇-〇〇 Nanji BLDG 5F</Text>
                  <Text style={styles.line}>Tel. 03-0000-0000 ｜ Mail. contact@nanji.jp</Text>
              </View>
          </View>
          <View style={styles.bottom}>
              <Text style={styles.copy}>© NANJI JAPAN · 2025</Text>
              <Pressable onPress={onBackToTop}><Text style={styles.back}>返回顶部 ↑</Text></Pressable>
          </View>
      </View>
  )
}
const styles = StyleSheet.create({
    footer:{ borderTopWidth: 1, borderTopColor: "#e5e7eb" },
    top:{ paddingHorizontal: 16, paddingVertical: 20, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
    bottom:{ borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingHorizontal: 16, paddingVertical: 12, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
    strong:{ fontWeight:"900" },
    line:{ color:"#374151", marginTop: 4 },
    copy:{ color:"#6b7280" },
    back:{ color:"#6b7280", textDecorationLine:"none" }
});