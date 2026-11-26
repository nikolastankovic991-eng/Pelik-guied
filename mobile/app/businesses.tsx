import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Linking, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import { groups } from "../data/categories";

function isHttpUrl(value?: string | null) {
  if (!value) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

async function openExternal(url: string, label: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) throw new Error("Unsupported URL");
    await Linking.openURL(url);
  } catch {
    Alert.alert("Could not open link", `Please try again to open ${label}.`);
  }
}

type Business = {
  id: string;
  business_name: string;
  category: string;
  village: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  image_url: string | null;
};

export default function Businesses() {
  const params = useLocalSearchParams<{ group?: string }>();
  const [rows, setRows] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(params.group || "");
  const [reload, setReload] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { setGroup(params.group || ""); }, [params.group]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      const { data, error: requestError } = await supabase
        .from("businesses")
        .select("id,business_name,category,village,address,phone,website,description,image_url")
        .eq("status", "approved")
        .eq("published", true)
        .order("business_name");
      if (!active) return;
      if (requestError) {
        setError("We couldn't load the business directory. Please check your connection and try again.");
      } else {
        setRows((data || []) as Business[]);
      }
      setLoading(false);
      setRefreshing(false);
    }
    load().catch(() => {
      if (active) {
        setError("We couldn't load the business directory. Please try again.");
        setLoading(false);
        setRefreshing(false);
      }
    });
    return () => { active = false; };
  }, [reload]);

  const filtered = rows.filter(item => {
    const inGroup = !group || (groups.find(g => g.title === group)?.items.some(category => category === item.category) ?? false);
    const searchText = [item.business_name, item.category, item.village || "", item.description || ""].join(" ").toLowerCase();
    return inGroup && searchText.includes(query.trim().toLowerCase());
  });

  return (
    <View style={s.page}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search businesses or villages"
        placeholderTextColor="#87928B"
        returnKeyType="search"
        style={s.search}
        accessibilityLabel="Search businesses or villages"
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ title: "All", items: [] }, ...groups]}
        keyExtractor={item => item.title}
        style={s.filters}
        renderItem={({ item }) => {
          const selected = item.title === "All" ? !group : group === item.title;
          return (
            <Pressable
              onPress={() => setGroup(item.title === "All" ? "" : item.title)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[s.chip, selected && s.active]}
            >
              <Text style={[s.chipText, selected && s.activeText]}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
      {loading && rows.length === 0 ? (
        <View style={s.state}><ActivityIndicator color="#073D34" size="large" /><Text style={s.stateText}>Loading local businesses…</Text></View>
      ) : error && rows.length === 0 ? (
        <View style={s.state}>
          <Text style={s.emptyTitle}>Directory temporarily unavailable</Text>
          <Text style={s.stateText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => setReload(value => value + 1)} style={s.retry}><Text style={s.retryText}>Try again</Text></Pressable>
        </View>
      ) : (
        <>
        {error ? <Text accessibilityRole="alert" style={s.refreshNotice}>{error} Showing the last available results.</Text> : null}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing || (loading && rows.length > 0)} onRefresh={() => { setRefreshing(true); setReload(value => value + 1); }} tintColor="#073D34" />}
          contentContainerStyle={filtered.length ? s.results : s.emptyList}
          ListEmptyComponent={
            <View style={s.state}>
              <Text style={s.emptyTitle}>{rows.length ? "No matches found" : "Be the first to discover local listings"}</Text>
              <Text style={s.stateText}>{rows.length ? "Try another search or category." : "New businesses appear here after they have been reviewed and approved."}</Text>
              {query || group ? <Pressable accessibilityRole="button" onPress={() => { setQuery(""); setGroup(""); }} style={s.retry}><Text style={s.retryText}>Clear filters</Text></Pressable> : null}
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.card}>
              {isHttpUrl(item.image_url) ? <Image source={{ uri: item.image_url!.trim() }} style={s.image} accessibilityLabel={item.business_name} /> : null}
              <View style={s.cardBody}>
                <Text style={s.title}>{item.business_name}</Text>
                <Text style={s.meta}>{item.category} · {item.village || "Gozo"}</Text>
                {item.description ? <Text style={s.desc}>{item.description}</Text> : null}
                <View style={s.actions}>
                  {item.phone && item.phone.replace(/[^+0-9]/g, "").length >= 5 ? <Pressable accessibilityRole="link" accessibilityLabel={`Call ${item.business_name}`} onPress={() => openExternal("tel:" + item.phone!.replace(/[^+0-9]/g, ""), "the phone number")}><Text style={s.link}>Call</Text></Pressable> : null}
                  {isHttpUrl(item.website) ? <Pressable accessibilityRole="link" accessibilityLabel={`Visit ${item.business_name} website`} onPress={() => openExternal(item.website!.trim(), "the website")}><Text style={s.link}>Website</Text></Pressable> : null}
                  <Pressable accessibilityRole="link" accessibilityLabel={`Find ${item.business_name} on Google Maps`} onPress={() => openExternal("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([item.business_name, item.address, item.village, "Gozo Malta"].filter(Boolean).join(" ")), "Google Maps")}><Text style={s.link}>Google Maps ↗</Text></Pressable>
                </View>
              </View>
            </View>
          )}
        />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 14 },
  refreshNotice: { color: "#8A5A16", backgroundColor: "#FFF3D8", borderRadius: 9, padding: 10, marginBottom: 8, fontSize: 12 },
  search: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 12, color: "#24332E" },
  filters: { flexGrow: 0, maxHeight: 44 },
  chip: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 20, backgroundColor: "#E8E9E1", marginRight: 8, marginBottom: 10 },
  active: { backgroundColor: "#073D34" },
  chipText: { color: "#073D34", fontWeight: "700", fontSize: 12 },
  activeText: { color: "#fff" },
  results: { paddingBottom: 24, paddingTop: 3 },
  card: { backgroundColor: "#fff", borderRadius: 15, overflow: "hidden", marginBottom: 12 },
  image: { width: "100%", height: 170, backgroundColor: "#E4E7E2" },
  cardBody: { padding: 16 },
  title: { fontSize: 18, fontWeight: "800", color: "#073D34" },
  meta: { color: "#718078", fontSize: 12, marginTop: 4 },
  desc: { color: "#46544D", lineHeight: 21, marginTop: 8 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 18, marginTop: 12 },
  link: { color: "#0A6B56", fontWeight: "800" },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  state: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 10 },
  emptyTitle: { color: "#073D34", fontWeight: "800", fontSize: 17, textAlign: "center" },
  stateText: { color: "#65736B", textAlign: "center", lineHeight: 21 },
  retry: { backgroundColor: "#073D34", borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, marginTop: 6 },
  retryText: { color: "#fff", fontWeight: "800" }
});
