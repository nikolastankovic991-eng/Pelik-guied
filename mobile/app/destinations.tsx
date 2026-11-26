import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

type Place = {
  name: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
  mapUrl?: string;
  tags?: string;
};

function isHttpUrl(value?: string) {\n  if (!value) return false;\n  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }\n}\n\nasync function openExternal(url?: string) {\n  if (!isHttpUrl(url)) { Alert.alert("Link unavailable", "This link is not valid."); return; }\n  try {\n    const supported = await Linking.canOpenURL(url!);\n    if (!supported) throw new Error("Unsupported link");\n    await Linking.openURL(url!);\n  } catch { Alert.alert("Could not open link", "Please try again or check your device connection."); }\n}\n\nconst placesUrl = "https://nikolastankovic991-eng.github.io/Pelik-guied/data/gozo-places.json";

export default function Destinations() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(placesUrl);
      if (!response.ok) throw new Error("Destination feed unavailable");
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected destination data");
      setPlaces(data as Place[]);
    } catch {
      setPlaces([]);
      setError("We couldn't load Gozo destinations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  if (loading && !places.length) {
    return <View style={s.center}><ActivityIndicator color="#073D34" size="large" /><Text style={s.desc}>Loading Gozo destinations…</Text></View>;
  }

  if (error && !places.length) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Destinations temporarily unavailable</Text>
        <Text style={s.desc}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={loadPlaces} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={s.list}
      data={places}
      keyExtractor={item => item.name}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPlaces} tintColor="#073D34" />}
      ListHeaderComponent={<Text style={s.intro}>Discover Gozo’s beaches, villages, history and natural landmarks. Pull down to refresh.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          {isHttpUrl(item.imageUrl) ? <Image source={{ uri: item.imageUrl! }} accessibilityLabel={item.imageAlt || item.name} style={s.image} resizeMode="cover" /> : <View style={s.imagePlaceholder}><Text style={s.placeholderText}>GOZO</Text></View>}
          <View style={s.body}>
            <Text style={s.title}>{item.name}</Text>
            <Text style={s.desc}>{item.description}</Text>
            {item.imageCredit ? (
              <Text style={s.credit}>
                {item.imageCredit} · <Text accessibilityRole="link" accessibilityLabel={`Photo source for ${item.name}`} onPress={() => openExternal(item.imageCreditUrl)} style={s.link}>Photo source</Text>
              </Text>
            ) : null}
            {isHttpUrl(item.mapUrl) ? <Pressable accessibilityRole="link" accessibilityLabel={`Open ${item.name} in Google Maps`} onPress={() => openExternal(item.mapUrl)} style={s.button}><Text style={s.buttonText}>Open in Google Maps ↗</Text></Pressable> : null}
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  list: { padding: 14, paddingBottom: 30 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 28 },
  intro: { color: "#56645C", lineHeight: 21, marginBottom: 14 },
  card: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", marginBottom: 15 },
  image: { width: "100%", height: 190, backgroundColor: "#E4E7E2" },
  imagePlaceholder: { width: "100%", height: 130, backgroundColor: "#073D34", alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#E7C56B", fontWeight: "900", letterSpacing: 4, fontSize: 18 },
  body: { padding: 16 },
  title: { fontSize: 19, fontWeight: "800", color: "#073D34" },
  desc: { color: "#46544D", lineHeight: 21, marginTop: 6, textAlign: "center" },
  credit: { fontSize: 10, color: "#68736D", marginTop: 9 },
  link: { color: "#0C6754", textDecorationLine: "underline" },
  button: { backgroundColor: "#073D34", padding: 12, borderRadius: 10, alignSelf: "flex-start", marginTop: 13 },
  buttonText: { color: "#fff", fontWeight: "700" }
});
