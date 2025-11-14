import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Section, {SectionProps} from "./Section";
import {useTranslation} from "react-i18next";

export default function Contact({id, onLayoutSection}: SectionProps) {
    const {t} = useTranslation();
    return (
        <Section id={id} onLayoutSection={onLayoutSection}>
            <View style={styles.head}>
                <Text style={styles.title}>{t("contact.title")}</Text>
                <View style={styles.accent}/>
                <Text style={styles.sub}>{t("contact.sub")}</Text>
            </View>

            <View style={styles.band}>
                <View style={styles.left}>
                    <View style={styles.telRow}>
                        <Text style={styles.telLabel}>{t("contact.tel")}</Text>
                        <Text style={styles.telNumber}>026-221-2211</Text>
                    </View>
                    <Text style={styles.hours}>{t("contact.hours")}</Text>
                    <Text style={styles.note}>{t("contact.note")}</Text>
                </View>
            </View>
        </Section>
    );
}

const styles = StyleSheet.create({
    head: {alignItems: "center", marginBottom: 12, gap: 8},
    title: {fontWeight: "900", letterSpacing: 4},
    accent: {width: 48, height: 3, backgroundColor: "#df2b2b", borderRadius: 2},
    sub: {color: "#6b7280"},
    band: {borderTopWidth: 2, borderBottomWidth: 2, borderColor: "#cfd4dd", paddingVertical: 18, marginTop: 12},
    left: {padding: 6, flex: 1},
    telRow: {flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 6},
    telLabel: {fontWeight: "900", letterSpacing: 1},
    telNumber: {fontWeight: "900", color: "#df2b2b", fontSize: 28},
    hours: {fontWeight: "700", color: "#374151"},
    note: {color: "#6b7280", fontSize: 12, marginTop: 4},
    arrow: {color: "#fff", opacity: .8},
});