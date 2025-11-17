import { StyleSheet } from 'react-native';
import {colors, layout} from '../../theme';

const styles = StyleSheet.create({
    // ---- Typography ----
    h1:{ fontWeight:'900', color:colors.ink, marginBottom:8 },
    h2:{ fontWeight:'900', color:colors.ink, marginBottom:8 },
    h3:{ fontWeight:'800', color:colors.ink, marginTop:14, marginBottom:6 },
    lead:{ color:colors.inkWeak, marginBottom:6 },
    p:{ color:colors.ink },
    muted:{ color:colors.inkWeak },
    rule:{ height:1, backgroundColor:'rgba(0,0,0,.12)', marginVertical:12 },

    // ---- Generic section layout helpers ----
    wrap: {
        width: '100%',
        maxWidth: layout.maxWidth,
        alignSelf: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // ---- Categories / metric ----
    metricTitle:{ fontWeight:'800', marginBottom:10, lineHeight:28 },
    metric:{ flexDirection:'row', alignItems:'flex-end', gap:12, marginVertical:6, marginBottom:36 },
    metricNum:{ fontWeight:'900', color:colors.brand, letterSpacing:-0.5 },
    metricUnit:{ fontWeight:'700', color:colors.brand },

    channelsTitle:{ fontWeight:'800', marginBottom:18, lineHeight:28 },
    channelGrid:{ flexDirection:'row', flexWrap:'wrap' },
    channel:{ alignItems:'center', marginBottom:28 },
    iconSquare:{ width:80, height:80, borderRadius:16, backgroundColor:'#e5e7eb', borderWidth:1, borderColor:'#d1d5db' },
    label:{ marginTop:8, color:colors.ink },

    // ---- Digital blocks ----
    dList:{ display:'flex', gap:18 },
    dItem:{ flexDirection:'row', gap:14, alignItems:'flex-start', marginBottom:12, alignSelf:'center', width:'100%', maxWidth:780 },
    dThumb:{ width:76, height:62, borderRadius:8, backgroundColor:'#e5e7eb', borderWidth:1, borderColor:'#cbd5e1' },
    dTitle:{ color:colors.brand, fontWeight:'800', marginBottom:4 },
    li:{ color:'#374151', lineHeight:22, fontSize:15 },

    // ---- Coop ----
    coopRow:{ flexDirection:'row', alignItems:'flex-start', gap:24 },
    coopDivider:{ width:12, borderRadius:6, height:'100%' },

    // ---- Footer ----
    footer:{ borderTopWidth: 1, borderTopColor: "#e5e7eb" },
    top:{ paddingHorizontal: 16, paddingVertical: 20, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
    bottom:{ borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingHorizontal: 16, paddingVertical: 12, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
    strong:{ fontWeight:"900" },
    line:{ color:"#374151", marginTop: 4 },
    copy:{ color:"#6b7280" },
    back:{ color:"#6b7280", textDecorationLine:"none" }
});

export default styles;
