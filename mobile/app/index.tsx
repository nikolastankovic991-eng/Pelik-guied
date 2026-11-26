import { Link } from "expo-router";
import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { groups } from "../data/categories";

const green = "#073D34";
export default function Home() {
  return <ScrollView contentContainerStyle={s.page}>
    <View style={s.hero}>
      <Text style={s.kicker}>DISCOVER GOZO</Text>
      <Text style={s.heroTitle}>Discover Gozo.{"\n"}Experience more.</Text>
      <Text style={s.heroText}>Your free guide to the island's best places, local businesses and experiences.</Text>
      <Link href="/destinations" asChild><Pressable style={s.goldButton}><Text style={s.goldText}>Explore Gozo  →</Text></Pressable></Link>
    </View>
    <Text style={s.heading}>Explore by category</Text>
    <View style={s.grid}>{groups.map(g=><Link key={g.title} href={{pathname:"/businesses",params:{group:g.title}}} asChild><Pressable style={s.tile}><Text style={s.emoji}>{g.emoji}</Text><Text style={s.tileTitle}>{g.title}</Text></Pressable></Link>)}</View>
    <Text style={s.heading}>Discover the island</Text>
    <Link href="/destinations" asChild><Pressable style={s.row}><Text style={s.rowEmoji}>📍</Text><View style={{flex:1}}><Text style={s.rowTitle}>Gozo's top destinations</Text><Text style={s.muted}>Beaches, landmarks, nature and villages</Text></View><Text style={s.arrow}>›</Text></Pressable></Link>
    <Link href="/businesses" asChild><Pressable style={s.row}><Text style={s.rowEmoji}>🏪</Text><View style={{flex:1}}><Text style={s.rowTitle}>Local businesses</Text><Text style={s.muted}>Find services, food, shops and activities</Text></View><Text style={s.arrow}>›</Text></Pressable></Link>
    <Link href="/submit" asChild><Pressable style={s.cta}><Text style={s.ctaTitle}>Own a business in Gozo?</Text><Text style={s.ctaText}>Apply for a free listing. Every application is reviewed before publication.</Text><Text style={s.goldText}>List your business →</Text></Pressable></Link>
    <Text style={s.footer}>GOZO GUIDE BY PELIK · FREE FOR EVERYONE</Text>
  </ScrollView>;
}
const s=StyleSheet.create({page:{padding:18,paddingBottom:42},hero:{backgroundColor:green,borderRadius:24,padding:24,marginBottom:24},kicker:{color:"#E7C56B",fontSize:12,fontWeight:"800",letterSpacing:2},heroTitle:{color:"#fff",fontSize:34,fontWeight:"800",lineHeight:40,marginTop:12},heroText:{color:"#E8EFEB",fontSize:15,lineHeight:23,marginTop:12},goldButton:{backgroundColor:"#E7C56B",padding:14,borderRadius:12,alignSelf:"flex-start",marginTop:20},goldText:{color:green,fontWeight:"800"},heading:{fontSize:21,fontWeight:"800",color:green,marginTop:14,marginBottom:14},grid:{flexDirection:"row",flexWrap:"wrap",gap:10},tile:{backgroundColor:"#fff",borderRadius:16,padding:14,width:"48%",minHeight:104,justifyContent:"center"},emoji:{fontSize:25},tileTitle:{fontWeight:"700",color:green,marginTop:8},row:{backgroundColor:"#fff",borderRadius:15,padding:15,marginBottom:10,flexDirection:"row",alignItems:"center",gap:12},rowEmoji:{fontSize:26},rowTitle:{fontWeight:"800",color:green},muted:{color:"#69766F",fontSize:12,marginTop:3},arrow:{fontSize:28,color:green},cta:{backgroundColor:"#E9E6D8",padding:20,borderRadius:18,marginTop:18},ctaTitle:{fontSize:19,fontWeight:"800",color:green},ctaText:{color:"#48564F",lineHeight:21,marginVertical:9},footer:{textAlign:"center",color:"#6D776F",fontSize:10,letterSpacing:1.3,marginTop:30}});
