import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PREFS = [
  { key: 'music', label: 'Music OK', icon: '🎵' },
  { key: 'ac', label: 'AC On', icon: '❄️' },
  { key: 'smoking', label: 'Smoking', icon: '🚬' },
  { key: 'pets', label: 'Pets OK', icon: '🐾' },
];

export default function OfferRideScreen({ navigation }) {
  const [from, setFrom] = useState('New Delhi, Connaught Place');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('2025-06-15');
  const [time, setTime] = useState('07:00 AM');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState('350');
  const [instantBook, setInstantBook] = useState(false);
  const [prefs, setPrefs] = useState({ music: true, ac: true, smoking: false, pets: false });
  const [stops, setStops] = useState('');

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const handlePublish = () => {
    if (!to.trim()) return Alert.alert('Missing Info', 'Please enter your destination.');
    if (!price || isNaN(price)) return Alert.alert('Invalid Price', 'Enter a valid price per seat.');
    Alert.alert('Ride Published! 🎉', `Your ride to ${to} is now live.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Top Bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Offer a Ride</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Route */}
        <View style={styles.section}>
          <Text style={styles.label}>Route</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>📍</Text>
            <TextInput
              style={styles.textInput}
              value={from}
              onChangeText={setFrom}
              placeholder="Pickup location"
              placeholderTextColor="#999"
            />
          </View>
          <Text style={styles.swapIcon}>⇅</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🏁</Text>
            <TextInput
              style={styles.textInput}
              value={to}
              onChangeText={setTo}
              placeholder="Where are you going?"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.row2}>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <Text style={styles.inputIcon}>📅</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <Text style={styles.inputIcon}>🕐</Text>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM AM"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Stops */}
        <View style={styles.section}>
          <Text style={styles.label}>Stops (optional)</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🛑</Text>
            <TextInput
              style={styles.textInput}
              value={stops}
              onChangeText={setStops}
              placeholder="e.g. Mathura, Vrindavan"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Seats */}
        <View style={styles.section}>
          <Text style={styles.label}>Available Seats</Text>
          <View style={styles.seatsRow}>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => setSeats(s => Math.max(1, s - 1))}
            >
              <Text style={styles.seatBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.seatCount}>{seats}</Text>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => setSeats(s => Math.min(6, s + 1))}
            >
              <Text style={styles.seatBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.seatLabel}>seats to offer</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>Price per Seat</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
            <Text style={styles.priceSub}>suggested ₹320–₹380</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.label}>Preferences</Text>
          <View style={styles.prefWrap}>
            {PREFS.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.prefChip, prefs[p.key] && styles.prefChipActive]}
                onPress={() => togglePref(p.key)}
              >
                <Text style={styles.prefIcon}>{p.icon}</Text>
                <Text style={[styles.prefLabel, prefs[p.key] && styles.prefLabelActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instant Book */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Instant Book</Text>
              <Text style={styles.toggleSub}>Passengers can book without approval</Text>
            </View>
            <Switch
              value={instantBook}
              onValueChange={setInstantBook}
              trackColor={{ false: '#ddd', true: '#1a1a2e' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
          <Text style={styles.publishBtnText}>🚗  Publish Ride</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a1a2e' },
  topbar: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 22 },
  topbarTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  scroll: { backgroundColor: '#f5f5f5', paddingBottom: 32 },
  section: { backgroundColor: '#fff', marginTop: 10, paddingHorizontal: 16, paddingVertical: 14 },
  label: {
    fontSize: 11, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e8e8e8',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#fafafa', marginBottom: 8,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  textInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  swapIcon: { textAlign: 'center', fontSize: 18, color: '#aaa', marginVertical: 2 },
  row2: { flexDirection: 'row', gap: 8 },
  seatsRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  seatBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center',
  },
  seatBtnText: { fontSize: 20, color: '#1a1a2e', fontWeight: '500', lineHeight: 24 },
  seatCount: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', minWidth: 30, textAlign: 'center' },
  seatLabel: { fontSize: 13, color: '#888' },
  priceRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e8e8e8',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  currency: { fontSize: 20, fontWeight: '600', color: '#555', marginRight: 4 },
  priceInput: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', flex: 1 },
  priceSub: { fontSize: 11, color: '#aaa' },
  prefWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prefChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  prefChipActive: { backgroundColor: '#e8edf8', borderColor: '#4a6fa5' },
  prefIcon: { fontSize: 14 },
  prefLabel: { fontSize: 13, color: '#888' },
  prefLabelActive: { color: '#1a3a6b', fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#e8e8e8',
    borderRadius: 10, padding: 14, backgroundColor: '#fafafa',
  },
  toggleLabel: { fontSize: 14, color: '#1a1a2e', fontWeight: '500' },
  toggleSub: { fontSize: 12, color: '#999', marginTop: 2 },
  publishBtn: {
    margin: 16, backgroundColor: '#1a1a2e',
    borderRadius: 12, paddingVertical: 16,
    alignItems: 'center',
  },
  publishBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});