import { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import { supabase } from "../lib/supabase";
import { groups } from "../data/categories";

const villages = ["Victoria", "Xagħra", "Nadur", "Qala", "Għajnsielem", "Xewkija", "Żebbuġ", "Għarb", "Għasri", "Munxar", "Fontana", "Kerċem", "San Lawrenz", "Sannat", "Marsalforn", "Xlendi"];
const privacyUrl = "https://nikolastankovic991-eng.github.io/Pelik-guied/privacy.html";
function validWebAddress(value: string) {
  try {
    const parsed = new URL(value.trim());
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && !!parsed.hostname && parsed.hostname.includes(".");
  } catch {
    return false;
  }
}


export default function Submit() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  const field = (label: string, value: string, set: (v: string) => void, placeholder = "", multiline = false) => (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        maxLength={label === "Business name *" ? 120 : label === "Address" ? 180 : label === "Phone" ? 40 : label === "Email" ? 254 : label === "Website" || label === "Photo URL (optional)" ? 2048 : 1000}
        value={value}
        onChangeText={set}
        placeholder={placeholder}
        style={[s.input, multiline && s.multiline]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        autoCapitalize={label === "Email" ? "none" : "sentences"}
        keyboardType={label === "Email" ? "email-address" : label === "Phone" ? "phone-pad" : "default"}
      />
    </View>
  );

  async function send() {
    if (!name.trim() || !category || !village) {
      Alert.alert("Missing information", "Business name, category and village are required.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Check email", "Please enter a valid email address.");
      return;
    }
    if (website.trim() && !/^https?:\/\//i.test(website.trim())) {
      Alert.alert("Check website", "Please include https:// or http:// at the beginning of the website address.");
      return;
    }
    if (imageUrl.trim() && !/^https?:\/\//i.test(imageUrl.trim())) {
      Alert.alert("Check photo link", "Please enter a photo URL beginning with https:// or http://.");
      return;
    }
    if (!consent) {
      Alert.alert("Consent required", "Please confirm that you have read the privacy notice before submitting.");
      return;
    }
    if (!supabase) {
      Alert.alert("Not configured", "The app connection is not configured yet.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.from("business_submissions").insert({
        business_name: name.trim(),
        category,
        village,
        address: address.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        website: website.trim() || null,
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
        status: "pending",
        published: false,
        featured: false
      });
      if (error) throw error;
      Alert.alert("Application received", "Your free application is pending administrator review. It will not appear publicly unless it is approved and published.");
      setName(""); setCategory(""); setVillage(""); setAddress(""); setPhone(""); setEmail(""); setWebsite(""); setImageUrl(""); setDescription(""); setConsent(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      Alert.alert("Could not submit", "We could not send your application. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
      <View style={s.intro}>
        <Text style={s.introTitle}>List your business for free</Text>
        <Text style={s.introText}>There are no listing fees or subscriptions. Every application is checked by the Gozo Guide team before anything can appear publicly.</Text>
      </View>

      {field("Business name *", name, setName, "Your business name")}
      <Text style={s.label}>Category *</Text>
      {groups.map(group => (
        <View key={group.title} style={s.categoryGroup}>
          <Text style={s.group}>{group.emoji}  {group.title}</Text>
          <View style={s.options}>
            {group.items.map(item => (
              <Pressable key={item} onPress={() => setCategory(item)} accessibilityRole="radio" accessibilityState={{ selected: category === item }} style={[s.option, category === item && s.selected]}>
                <Text style={[s.optionText, category === item && s.selectedText]}>{category === item ? "✓  " : ""}{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Text style={s.label}>Village *</Text>
      <View style={s.options}>
        {villages.map(item => (
          <Pressable key={item} onPress={() => setVillage(item)} accessibilityRole="radio" accessibilityState={{ selected: village === item }} style={[s.option, village === item && s.selected]}>
            <Text style={[s.optionText, village === item && s.selectedText]}>{village === item ? "✓  " : ""}{item}</Text>
          </Pressable>
        ))}
      </View>

      {field("Address", address, setAddress, "Street and locality")}
      {field("Phone", phone, setPhone, "Business phone number")}
      {field("Email", email, setEmail, "Business email")}
      {field("Website", website, setWebsite, "https://")}
      {field("Photo URL (optional)", imageUrl, setImageUrl, "Link to a photo you have permission to use")}
      {field("Description", description, setDescription, "Tell visitors about your business", true)}

      <Pressable onPress={() => setConsent(value => !value)} style={s.consentRow} accessibilityRole="checkbox" accessibilityState={{ checked: consent }}>
        <View style={[s.checkbox, consent && s.checkboxChecked]}>{consent ? <Text style={s.check}>✓</Text> : null}</View>
        <Text style={s.consentText}>I have read the <Text style={s.inlineLink} accessibilityRole="link" onPress={async () => { try { await Linking.openURL(privacyUrl); } catch { Alert.alert("Could not open privacy notice", "Please try again later."); } }}>Privacy Notice</Text> and confirm I am authorised to submit these business details and any materials provided.</Text>
      </Pressable>

      <Pressable disabled={busy} onPress={send} accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} style={[s.button, busy && s.buttonDisabled]}>
        <Text style={s.buttonText}>{busy ? "Submitting…" : "Submit free application"}</Text>
      </Pressable>
      <Text style={s.foot}>Your application starts as pending and unpublished. Only an administrator can approve and publish it. Accommodation listings are not accepted.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 18, paddingBottom: 48 },
  intro: { backgroundColor: "#073D34", padding: 18, borderRadius: 16, marginBottom: 8 },
  introTitle: { color: "#E7C56B", fontSize: 19, fontWeight: "800" },
  introText: { color: "#F0F4F1", lineHeight: 21, marginTop: 8 },
  label: { fontWeight: "800", color: "#073D34", marginTop: 16, marginBottom: 7 },
  input: { backgroundColor: "#fff", borderRadius: 11, padding: 14, borderWidth: 1, borderColor: "#e1e4dd", color: "#24332e" },
  multiline: { minHeight: 110, paddingTop: 13 },
  categoryGroup: { marginTop: 8 },
  group: { fontWeight: "800", color: "#073D34", marginBottom: 7 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  option: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e5e8e1" },
  optionText: { color: "#3f5148", fontSize: 13 },
  selected: { backgroundColor: "#dcebe3", borderColor: "#0A6B56" },
  selectedText: { fontWeight: "800", color: "#073D34" },
  consentRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 22 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: "#839087", borderRadius: 5, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginTop: 1 },
  checkboxChecked: { backgroundColor: "#073D34", borderColor: "#073D34" },
  check: { color: "#fff", fontWeight: "900" },
  consentText: { flex: 1, color: "#46544D", fontSize: 13, lineHeight: 19 },
  inlineLink: { color: "#0A6B56", fontWeight: "800", textDecorationLine: "underline" },
  button: { backgroundColor: "#073D34", padding: 16, borderRadius: 12, marginTop: 24, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "800" },
  foot: { color: "#778078", fontSize: 11, lineHeight: 17, marginTop: 14 }
});