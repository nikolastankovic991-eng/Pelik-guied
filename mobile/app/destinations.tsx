import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";

type Place = { name:string; description:string; imageUrl?:string; imageAlt?:string; imageCredit?:string; imageCreditUrl?:string; mapUrl?:string; tags?:string };
export default function Destinations() {
 const [places,setPlaces]=useState<Place[]>([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{ fetch("https://nikolastankovic991-eng.github.io/Pelik-guied/data/gozo-places.json").then(r=>{ if (!r.ok) throw new Error("Could not load destinations"); return r.json(); }).then((data: Place[])=>setPlaces(Array.isArray(data)?data:[])).catch(()=>setPlaces([])).finally(()=>setLoading(false)); },[]);
 if(loading) return <View style={s.center}><ActivityIndicator color="#073D34"/><Text>Loading Gozo destinations…</Text></View>;
 if(!places.length) return <View style={s.center}><Text style={s.title}>Destinations are temporarily unavailable.</Text><Text style={s.desc}>Please check your connection and try again.</Text></View>;
 return <FlatList contentContainerStyle={s.list} data={places} keyExtractor={x=>x.name} renderItem={({item})=><View style={s.card}>
 {item.imageUrl?<Image source={{uri:item.imageUrl}} accessibilityLabel={item.imageAlt||item.name} style={s.image}/>:null}
 <View style={s.body}><Text style={s.title}>{item.name}</Text><Text style={s.desc}>{item.description}</Text>
 {item.imageCredit?<Text style={s.credit}>{item.imageCredit} · <Text onPress={()=>item.imageCreditUrl&&Linking.openURL(item.imageCreditUrl)} style={s.link}>Photo source</Text></Text>:null}
 {item.mapUrl?<Pressable onPress={()=>Linking.openURL(item.mapUrl!)} style={s.button}><Text style={s.buttonText}>Open in Google Maps ↗</Text></Pressable>:null}</View></View>}/>
}
const s=StyleSheet.create({list:{padding:14},center:{flex:1,alignItems:"center",justifyContent:"center",gap:10},card:{backgroundColor:"#fff",borderRadius:18,overflow:"hidden",marginBottom:15},image:{width:"100%",height:190,backgroundColor:"#e4e7e2"},body:{padding:16},title:{fontSize:19,fontWeight:"800",color:"#073D34"},desc:{color:"#46544D",lineHeight:21,marginTop:6},credit:{fontSize:10,color:"#68736D",marginTop:9},link:{color:"#0C6754",textDecorationLine:"underline"},button:{backgroundColor:"#073D34",padding:12,borderRadius:10,alignSelf:"flex-start",marginTop:13},buttonText:{color:"#fff",fontWeight:"700"}});
