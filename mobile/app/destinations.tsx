import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Linking, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";

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

function isHttpUrl(value?: string) {
  if (!value) return false;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

async function openExternal(url?: string) {
  if (!isHttpUrl(url)) { Alert.alert("Link unavailable", "This link is not valid."); return; }
  try {
    const supported = await Linking.canOpenURL(url!);
    if (!supported) throw new Error("Unsupported link");
    await Linking.openURL(url!);
  } catch { Alert.alert("Could not open link", "Please try again or check your device connection."); }
}

const placesUrl = "https://nikolastankovic991-eng.github.io/Pelik-guied/data/gozo-places.json";

export default function Destinations() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(placesUrl);
      if (!response.ok) throw new Error("Destination feed unavailable");
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every((item) => item && typeof item === "object" && typeof item.name === "string" && typeof item.description === "string")) throw new Error("Unexpected destination data");
      setPlaces(data as Place[]);
    } catch {
      setError("We couldn't refresh Gozo destinations. Please check your connection and try again.");
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

  const filteredPlaces = places.filter((place) => [place.name, place.description, place.tags || ""].join(" ").toLowerCase().includes(query.trim().toLowerCase()));

  if (error && !places.length) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Destinations temporarily unavailable</Text>
        <Text style={s.desc}>{error}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Retry loading Gozo destinations" onPress={loadPlaces} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={s.list}
      data={places}
      keyExtractor={item => item.name}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPlaces} tintColor="#073D34" />}
      ListHeaderComponent={<View>{error ? <Text accessibilityRole="alert" style={s.refreshNotice}>{error} Showing the last available destinations.</Text> : null}<Text style={s.intro}>Discover Gozo’s beaches, villages, history and natural landmarks. Pull down to refresh.</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search destinations" placeholderTextColor="#87928B" returnKeyType="search" accessibilityLabel="Search Gozo destinations" style={s.search} /></View>}
      ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTitle}>{places.length ? "No destinations found" : "No destinations available"}</Text><Text style={s.emptyText}>{places.length ? "Try another search term." : "Pull down to refresh or try again later."}</Text>{query ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={s.button}><Text style={s.buttonText}>Clear search</Text></Pressable> : null}</View>}
      renderItem={({ item }) => (
        <View style={s.card}>
          {isHttpUrl(item.imageUrl) ? <Image source={{ uri: item.imageUrl! }} accessibilityLabel={item.imageAlt || item.name} style={s.image} resizeMode="cover" /> : <View style={s.imagePlaceholder}><Text style={s.placeholderText}>GOZO</Text></View>}
          <View style={s.body}>
            <Text style={s.title}>{item.name}</Text>
            <Text style={s.desc}>{item.description}</Text>
            {item.imageCredit ? (
              <Text style={s.credit}>
                {item.imageCredit}{isHttpUrl(item.imageCreditUrl) ? <> · <Text accessibilityRole="link" accessibilityLabel={`Photo source for ${item.name}`} onPress={() => openExternal(item.imageCreditUrl)} style={s.link}>Photo source</Text></> : null}
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
  refreshNotice: { color: "#8A5A16", backgroundColor: "#FFF3D8", borderRadius: 9, padding: 10, marginBottom: 10, fontSize: 12 },
  intro: { color: "#56645C", lineHeight: 21, marginBottom: 14 },
  search: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 14, color: "#24332E" },
  empty: { alignItems: "center", padding: 28, gap: 8 },
  emptyTitle: { color: "#073D34", fontWeight: "800", fontSize: 17 },
  emptyText: { color: "#65736B", textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", marginBottom: 15 },
  image: { width: "100%", height: 190, backgroundColor: "#E4E7E2" },
  imagePlaceholder: { width: "100%", height: 130, backgroundColor: "#073D34", alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#E7C56B", fontWeight: "900", letterSpacing: 4, fontSize: 18 },
  body: { padding: 16 },
  title: { fontSize: 19, fontWeight: "800", color: "#073D34" },
  desc: { color: "#46544D", lineHeight: 21, marginTop: 6 },
  credit: { fontSize: 10, color: "#68736D", marginTop: 9 },
  link: { color: "#0C6754", textDecorationLine: "underline" },
  button: { backgroundColor: "#073D34", padding: 12, borderRadius: 10, alignSelf: "flex-start", marginTop: 13 },
  buttonText: { color: "#fff", fontWeight: "700" }
});
