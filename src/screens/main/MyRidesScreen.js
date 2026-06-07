// ============================================================
//  POOLRIDE — My Rides Screen (Redesigned)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { DUMMY_MY_BOOKINGS } from '../../service/Dummydata';

// ── constants ───────────────────────────────────────────────
const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const BG           = '#F0EEE9';
const CARD_BG      = '#FFFFFF';
const CARD_FOOTER  = '#FAFAF8';
const TEXT_PRIMARY = '#1A1815';
const TEXT_SEC     = '#767068';
const TEXT_MUTED   = '#C0BAB2';
const ACCENT       = '#C9920A';
const TAB_BG       = '#E8E5DF';

const STATUS_META = {
  confirmed: { label: 'Confirmed', color: '#16a05a', bg: '#EDFAF3' },
  completed: { label: 'Completed', color: '#4f46e5', bg: '#EEF2FF' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#FEF2F2' },
};

// ── main component ──────────────────────────────────────────
const MyRidesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filtered = DUMMY_MY_BOOKINGS.filter((b) => {
    if (activeTab === 'Upcoming')  return b.status === 'confirmed';
    if (activeTab === 'Completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  // ── card ─────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const meta = STATUS_META[item.status] ?? STATUS_META.confirmed;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.78}
        onPress={() => navigation.navigate('RideDetails', { ride: item.ride })}
      >
        {/* ── top section ── */}
        <View style={styles.cardTop}>

          {/* row 1 — route + badge */}
          <View style={styles.cardRow1}>
            <View style={styles.routeWrap}>
              <Text style={styles.city}>{item.ride.from.name}</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={12} color={ACCENT} />
              </View>
              <Text style={styles.city}>{item.ride.to.name}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: meta.bg }]}>
              <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
            </View>
          </View>

          {/* dashed route line */}
          <View style={styles.routeLine}>
            <View style={styles.dotStart} />
            <View style={styles.dashedLine} />
            <View style={styles.dotEnd} />
          </View>

          {/* row 2 — date + time */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={TEXT_MUTED} />
              <Text style={styles.metaText}>{item.ride.date}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={TEXT_MUTED} />
              <Text style={styles.metaText}>{item.ride.time}</Text>
            </View>
          </View>
        </View>

        {/* ── footer ── */}
        <View style={styles.cardFooter}>
          {/* seats */}
          <View style={styles.seatsWrap}>
            <View style={styles.seatIcon}>
              <Ionicons name="person-outline" size={12} color={ACCENT} />
            </View>
            <Text style={styles.seatsText}>
              {item.seats} seat{item.seats > 1 ? 's' : ''} booked
            </Text>
          </View>

          {/* amount */}
          <View style={styles.amountWrap}>
            <Text style={styles.amountSymbol}>₹</Text>
            <Text style={styles.amountVal}>{item.totalAmount}</Text>
          </View>

          {/* view button */}
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('RideDetails', { ride: item.ride })}
          >
            <Text style={styles.viewBtnText}>View →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // ── empty state ──────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="car-outline" size={36} color={ACCENT} />
      </View>
      <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} rides</Text>
      <Text style={styles.emptySub}>Your {activeTab.toLowerCase()} rides will appear here</Text>
    </View>
  );

  // ── render ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
        <Text style={styles.headerSub}>Track all your journeys</Text>
      </View>

      {/* tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
};

// ── styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  /* header */
  header: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 6 },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 12.5, color: ACCENT, marginTop: 2 },

  /* tabs */
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 16,
    backgroundColor: TAB_BG,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: CARD_BG,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '500', color: TEXT_MUTED },
  tabTextActive: { color: TEXT_PRIMARY, fontWeight: '600' },

  /* list */
  list: { paddingHorizontal: 14, paddingBottom: 110, gap: 10 },

  /* card */
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardTop: { padding: 14 },

  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routeWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  city: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  arrowCircle: {
    width: 26, height: 26,
    borderRadius: 13,
    backgroundColor: '#F0EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },

  /* dashed route line */
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  dotStart: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
  dashedLine: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D0CCC5',
    borderRadius: 1,
  },
  dotEnd: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: TEXT_PRIMARY,
  },

  /* meta row */
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12.5, color: TEXT_SEC },
  metaDot: {
    width: 3, height: 3,
    borderRadius: 1.5,
    backgroundColor: TEXT_MUTED,
  },

  /* card footer */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: CARD_FOOTER,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  seatsWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seatIcon: {
    width: 22, height: 22,
    borderRadius: 6,
    backgroundColor: '#F0EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatsText: { fontSize: 12.5, color: TEXT_SEC, fontWeight: '500' },

  amountWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  amountSymbol: { fontSize: 13, fontWeight: '600', color: ACCENT },
  amountVal: {
    fontSize: 20, fontWeight: '700',
    color: TEXT_PRIMARY, letterSpacing: -0.5,
  },

  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(201,146,10,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,146,10,0.25)',
  },
  viewBtnText: { fontSize: 12, fontWeight: '600', color: ACCENT },

  /* empty state */
  empty: { alignItems: 'center', marginTop: 80, gap: 10 },
  emptyIconWrap: {
    width: 72, height: 72,
    borderRadius: 20,
    backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY },
  emptySub: { fontSize: 13, color: TEXT_MUTED, textAlign: 'center' },
});

export default MyRidesScreen;