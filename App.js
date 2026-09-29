import React, {useMemo, useState} from "react";
import {Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {StatusBar} from "expo-status-bar";

const API_BASE_URL = "https://YOUR-API-DOMAIN.example.com";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("English");
  const [message, setMessage] = useState("");

  const numericAmount = Number(amount) || 0;
  const canWithdraw = numericAmount > 0 && numericAmount <= balance && /^\d{4}$/.test(code);

  const languages = useMemo(() => ["English","French","Malagasy","Portuguese","Spanish"], []);

  async function submitWithdrawal() {
    if (!canWithdraw) {
      Alert.alert("Check withdrawal", "Enter an amount within your available balance and the correct 4-digit withdrawal code.");
      return;
    }

    // IMPORTANT: The server must validate the user's actual withdrawal code.
    // Never store the real withdrawal code in this app.
    try {
      const response = await fetch(`${API_BASE_URL}/api/withdrawals`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({amount: numericAmount, code, currency: "USD"})
      });
      if (!response.ok) throw new Error("Withdrawal request failed");
      const data = await response.json();
      if (!data.approved) throw new Error(data.message || "Withdrawal was not approved.");
      setBalance(Math.max(0, balance - numericAmount));
      setAmount("");
      setCode("");
      Alert.alert("Withdrawal submitted", "Your withdrawal request was submitted.");
    } catch (e) {
      Alert.alert("Withdrawal unavailable", "Connect the app to your secure backend before enabling real withdrawals.");
    }
  }

  async function translateMessage() {
    if (!message.trim()) return;
    Alert.alert("Translator", `Translation to ${language} requires a configured translation service.`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.logo}>FIVE THOUSAND MILES</Text>
        <Text style={styles.sub}>Trading & education</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {screen === "home" && (
          <>
            <Text style={styles.title}>Welcome</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Available balance</Text>
              <Text style={styles.balance}>${balance.toFixed(2)}</Text>
            </View>
            <Button title="Withdraw funds" onPress={() => setScreen("withdraw")} />
            <Button title="Chat & translator" onPress={() => setScreen("chat")} />
            <Text style={styles.note}>
              This app is a starter project. Real-money transactions must be connected to a secure,
              compliant backend and must not rely on client-side validation.
            </Text>
          </>
        )}

        {screen === "withdraw" && (
          <>
            <Text style={styles.title}>Withdraw</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Available balance</Text>
              <Text style={styles.balance}>${balance.toFixed(2)}</Text>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountRow}>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#777"
                  style={styles.input}
                />
                <Pressable style={styles.max} onPress={() => setAmount(balance.toFixed(2))}>
                  <Text style={styles.maxText}>MAX</Text>
                </Pressable>
              </View>
              <Text style={styles.label}>4-digit withdrawal code</Text>
              <TextInput
                value={code}
                onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0,4))}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                placeholder="••••"
                placeholderTextColor="#777"
                style={styles.input}
              />
              <Text style={styles.helper}>A withdrawal cannot be submitted until the backend confirms the correct 4-digit code.</Text>
            </View>
            <Button title="Submit withdrawal" onPress={submitWithdrawal} disabled={!canWithdraw} />
            <Button title="Back" onPress={() => setScreen("home")} secondary />
          </>
        )}

        {screen === "chat" && (
          <>
            <Text style={styles.title}>Chat & Translator</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Translate to</Text>
              <View style={styles.languageRow}>
                {languages.map(l => (
                  <Pressable key={l} onPress={() => setLanguage(l)} style={[styles.lang, language === l && styles.langActive]}>
                    <Text style={styles.langText}>{l}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                placeholder="Type a message..."
                placeholderTextColor="#777"
                style={[styles.input, styles.textarea]}
              />
              <Button title={`Translate to ${language}`} onPress={translateMessage} />
            </View>
            <Button title="Back" onPress={() => setScreen("home")} secondary />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Button({title, onPress, disabled, secondary}) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#08101d"},
  header:{paddingHorizontal:20,paddingTop:14,paddingBottom:10,borderBottomWidth:1,borderBottomColor:"#1d2a3b"},
  logo:{color:"#fff",fontSize:18,fontWeight:"800",letterSpacing:1},
  sub:{color:"#8fa0b5",marginTop:3},
  content:{padding:20,paddingBottom:40},
  title:{color:"#fff",fontSize:30,fontWeight:"800",marginBottom:18},
  card:{backgroundColor:"#101b2b",borderRadius:16,padding:18,marginBottom:16,borderWidth:1,borderColor:"#203149"},
  label:{color:"#9eacbd",fontSize:13,marginTop:10,marginBottom:7},
  balance:{color:"#fff",fontSize:34,fontWeight:"800",marginBottom:10},
  input:{backgroundColor:"#091321",borderWidth:1,borderColor:"#2a3a50",borderRadius:10,color:"#fff",padding:13,fontSize:16},
  amountRow:{flexDirection:"row",gap:8},
  amountRow:{flexDirection:"row",alignItems:"center"},
  amountRow: {flexDirection:"row", alignItems:"center"},
  max:{backgroundColor:"#fff",paddingVertical:14,paddingHorizontal:16,borderRadius:10,marginLeft:8},
  maxText:{color:"#08101d",fontWeight:"800"},
  helper:{color:"#8494a8",fontSize:12,lineHeight:18,marginTop:9},
  button:{backgroundColor:"#fff",padding:15,borderRadius:12,alignItems:"center",marginBottom:12},
  secondary:{backgroundColor:"#172337"},
  disabled:{opacity:.45},
  buttonText:{color:"#08101d",fontWeight:"800"},
  note:{color:"#74859b",fontSize:12,lineHeight:18,marginTop:8},
  languageRow:{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:14},
  lang:{borderWidth:1,borderColor:"#2a3a50",paddingVertical:8,paddingHorizontal:10,borderRadius:20},
  langActive:{backgroundColor:"#fff",borderColor:"#fff"},
  langText:{color:"#fff",fontSize:12},
  textarea:{minHeight:120,textAlignVertical:"top",marginBottom:12}
});
