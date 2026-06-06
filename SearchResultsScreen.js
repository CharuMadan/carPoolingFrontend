// ============================================================
//  POOLRIDE — Search Results Screen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { DUMMY_RIDES } from '../../service/Dummydata';

const FILTERS = ['All', 'Cheapest', 'Fastest', 'Top Rated', 'Instant Book'];

const SearchResultsScreen = ({ navigation, route }) => {
  const { from = '', to = '', date = '' } = route.params || {};
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = DUMMY_RIDES.filter(r => {
    if (activeFilter === 'Cheapest') return true;
    if (activeFilter === 'Instant Book') return r.instantBook;
    if (activeFilter === 'Top Rated') return r.driver.rating >= 4.8;
    return true;
  }).sort((a, b) => {
    if (activeFilter === 'Cheapest') return a.pricePerSeat - b.pricePerSeat;
    if (activeFilter === 'Top Rated') return b.driver.rating - a.driver.rating;
    return 0;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <LinearGradient colors={['#1A1A2E', '#0D0D1A']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.route}>{from || 'Delhi'} → {to || 'Anywhere'}</Text>
        <Text style={styles.meta}>{date || 'Today'} · {filtered.length} rides found</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>😕</Text>
            <Text style={styles.emptyText}>No rides found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RideDetails', { ride: item })}
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <View style={styles.driverRow}>
                <Image source={{ uri: item.driver.avatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{item.driver.name}</Text>
                  <Text style={styles.driverRating}>⭐ {item.driver.rating} · {item.vehicle.name}</Text>
                </View>
                {item.driver.isVerified && (
                  <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>
                )}
              </View>
              <View style={styles.price}>
                <Text style={styles.priceAmt}>₹{item.pricePerSeat}</Text>
                <Text style={styles.pricePer}>/seat</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.timeCol}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.city}>{item.from.name}</Text>
              </View>
              <View style={styles.lineWrap}>
                <View style={styles.line} />
                <Text style={styles.duration}>{item.duration}</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.time}>~Arrival</Text>
                <Text style={styles.city}>{item.to.name}</Text>
              </View>
            </View>

            <View style={styles.tags}>
              <Text style={styles.tag}>💺 {item.seatsAvailable} seats left</Text>
              <Text style={styles.tag}>📏 {item.distance}</Text>
              {item.preferences.ac && <Text style={styles.tag}>❄️ AC</Text>}
              {item.instantBook && (
                <View style={styles.instantBadge}>
                  <Text style={styles.instantText}>⚡ Instant</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 54, paddingHorizontal: SIZES.screenPadding, paddingBottom: SPACING.lg },
  back: { marginBottom: SPACING.md },
  backText: { color: COLORS.primary, fontSize: FONTS.md },
  route: { fontSize: FONTS['2xl'], color: COLORS.textPrimary, fontFamily: FONTS.bold },
  meta: { color: COLORS.textSecondary, fontSize: FONTS.sm, marginTop: 4 },
  filterWrap: { backgroundColor: COLORS.surface, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceBorder },
  filterScroll: { paddingHorizontal: SIZES.screenPadding, gap: SPACING.sm },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontSize: FONTS.sm },
  filterTextActive: { color: COLORS.white, fontFamily: FONTS.medium },
  list: { padding: SIZES.screenPadding, gap: SPACING.md },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.lg },
  card: { backgroundColor: COLORS.surfaceElevated, borderRadius: SIZES.borderRadiusLg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.surfaceBorder, ...SHADOWS.small },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  driverName: { color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: FONTS.md },
  driverRating: { color: COLORS.textMuted, fontSize: FONTS.xs },
  verifiedBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center' },
  verifiedText: { color: COLORS.black, fontSize: FONTS.xs, fontFamily: FONTS.bold },
  price: { alignItems: 'flex-end' },
  priceAmt: { color: COLORS.primary, fontSize: FONTS['2xl'], fontFamily: FONTS.bold },
  pricePer: { color: COLORS.textMuted, fontSize: FONTS.xs },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  timeCol: { alignItems: 'center', width: 70 },
  time: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: FONTS.md },
  city: { color: COLORS.textSecondary, fontSize: FONTS.xs, marginTop: 2 },
  lineWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  line: { flex: 1, height: 1, backgroundColor: COLORS.surfaceBorder },
  duration: { color: COLORS.textMuted, fontSize: FONTS.xs, marginHorizontal: SPACING.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tag: { color: COLORS.textSecondary, fontSize: FONTS.xs },
  instantBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: '#1a1a3a', borderWidth: 1, borderColor: COLORS.primary },
  instantText: { color: COLORS.primary, fontSize: FONTS.xs },
});

export default SearchResultsScreen;