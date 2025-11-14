import React, { useCallback } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Stage from "../Stage";

export interface SectionProps {
  id: string;
  onLayoutSection: (id: string, y: number) => void;
  children?: React.ReactNode;
}

export default function Section({ id, onLayoutSection, children }: SectionProps){
  const onLayout = useCallback((e: LayoutChangeEvent)=>{
    const { y } = e.nativeEvent.layout;
    onLayoutSection(id, y);
  },[id, onLayoutSection]);

  return (
    <View onLayout={onLayout}>
        <Stage bg="paper" scrim="left" align="center" valign="middle">
      <View style={styles.inner}>
        {children}
      </View>
        </Stage>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 36, paddingHorizontal: 16, alignItems: "center" },
  inner: { width: "100%", maxWidth: 1200 }
});