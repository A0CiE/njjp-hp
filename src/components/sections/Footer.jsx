import React from "react";
import { View, Text, Pressable } from "react-native";

import styles from '../styles/pageStyles';

export default function Footer({ onBackToTop }: { onBackToTop: () => void }){
    return (
      <View style={styles.footer}>
          <View style={styles.top}>
              <View style={{flex:1}}>
                  <Text style={styles.strong}>NANJI JAPAN 株式会社</Text>
                  <Text style={styles.line}>〒545-0052 大阪府大阪市阿倍野区阿倍野筋 3-6-8</Text>
              </View>
          </View>
          <View style={styles.bottom}>
              <Text style={styles.copy}>© NANJI JAPAN · 2025</Text>
              <Pressable onPress={onBackToTop}><Text style={styles.back}>返回顶部 ↑</Text></Pressable>
          </View>
      </View>
  )
}
