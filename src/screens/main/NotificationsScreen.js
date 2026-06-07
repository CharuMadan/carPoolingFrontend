// ============================================================
//  POOLRIDE — Notifications Screen (Redesigned)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { DUMMY_NOTIFICATIONS } from '../../service/Dummydata';

// ── icon config per notification type ──────────────────────
const ICON_MAP = {
  booking_confirmed: { icon: 'checkmark-circle', color: '#16a05a', bg: '#EDFAF3', pill: 'Booking',  pillColor: '#16a05a', pillBg: '#EDFAF3' },
  ride_reminder:     { icon: 'alarm',            color: '#d97706', bg: '#FFF3E8', pill: 'Reminder', pillColor: '#d97706', pillBg: '#FFF3E8' },
  new_review:        { icon: 'star',             color: '#b45309', bg: '#FFFBE6', pill: 'Review',   pillColor: '#b45309', pillBg: '#FFFBE6' },
  promo:             { icon: 'gift',             color: '#7c3aed', bg: '#F4EEFF', pill: 'Promo',    pillColor: '#7c3aed', pillBg: '#F4EEFF' },
};

const ACCENT   = '#C9920A';
const BG       = '#F0EEE9';
const CARD_BG  = '#FFFFFF';
const UNREAD_BG = '#FFFDF6';
const TEXT_PRIMARY   = '#1A1815';
const TEXT_SECONDARY = '#767068';
const TEXT_MUTED     = '#C0BAB2';

// ── helper ─────────────────────────────────────────────────
const getTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ── main component ─────────────────────────────────────────
const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const markRead = (id) =>
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ── notification card ─────────────────────────────────
  const renderItem = ({ item }) => {
    const meta = ICON_MAP[item.type] ?? {
      icon: 'notifications', color: ACCENT, bg: '#FFF7E6',
      pill: 'Alert', pillColor: ACCENT, pillBg: '#FFF7E6',
    };

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        onPress={() => markRead(item.id)}
        activeOpacity={0.75}
      >
        {/* unread left strip */}
        {!item.isRead && <View style={styles.unreadStrip} />}

        {/* icon */}
        <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={22} color={meta.color} />
        </View>

        {/* content */}
        <View style={styles.cardBody}>
          {/* row 1 – title + time */}
          <View style={styles.row}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{getTimeAgo(item.createdAt)}</Text>
          </View>

          {/* body text */}
          <Text style={styles.cardText} numberOfLines={2}>
            {item.body}
          </Text>

          {/* row 3 – pill + unread dot */}
          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: meta.pillBg }]}>
              <Text style={[styles.pillText, { color: meta.pillColor }]}>
                {meta.pill}
              </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── section header helper ─────────────────────────────
  const SectionLabel = ({ label }) => (
    <Text style={styles.sectionLabel}>{label}</Text>
  );

  const readNotifs   = notifications.filter(n =>  n.isRead);
  const unreadNotifs = notifications.filter(n => !n.isRead);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={18} color={TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 90 }} />
        )}
      </View>

      {/* ── SUMMARY BAR ── */}
      {unreadCount > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryIcon}>
              <Ionicons name="notifications" size={18} color={ACCENT} />
            </View>
            <View>
              <Text style={styles.summaryTitle}>You have new alerts</Text>
              <Text style={styles.summarySub}>Tap a card to mark as read</Text>
            </View>
          </View>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        </View>
      )}

      {/* ── LIST / EMPTY ── */}
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={60} color={TEXT_MUTED} />
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySub}>No new notifications</Text>
        </View>
      ) : (
        <FlatList
          data={[
            ...(unreadNotifs.length ? [{ _type: 'label', label: 'New', id: '__new' }] : []),
            ...unreadNotifs,
            ...(readNotifs.length   ? [{ _type: 'label', label: 'Earlier', id: '__earlier' }] : []),
            ...readNotifs,
          ]}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            if (item._type === 'label') {
              return <SectionLabel label={item.label} />;
            }
            return renderItem({ item });
          }}
          ItemSeparatorComponent={() => null}
        />
      )}
    </SafeAreaView>
  );
};

// ── styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.09)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11.5,
    color: ACCENT,
    marginTop: 1,
  },
  markAllBtn: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(201,146,10,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,146,10,0.25)',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: ACCENT,
  },

  /* summary bar */
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 14,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: { fontSize: 13, fontWeight: '500', color: TEXT_PRIMARY },
  summarySub:   { fontSize: 11.5, color: TEXT_MUTED, marginTop: 1 },
  badgeCount: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },

  /* list */
  list: { paddingBottom: 110 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: TEXT_MUTED,
    paddingHorizontal: 22,
    marginTop: 8,
    marginBottom: 8,
  },

  /* card */
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 14,
    marginBottom: 9,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardUnread: {
    backgroundColor: UNREAD_BG,
    borderColor: 'rgba(201,146,10,0.20)',
  },
  unreadStrip: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3.5,
    backgroundColor: ACCENT,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  iconWrap: {
    width: 46, height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  cardBody: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    letterSpacing: -0.1,
  },
  cardTime: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginLeft: 8,
  },
  cardText: {
    fontSize: 12.5,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 7,
  },
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  unreadDot: {
    width: 7, height: 7,
    borderRadius: 3.5,
    backgroundColor: ACCENT,
    marginLeft: 'auto',
  },

  /* empty */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
});

export default NotificationsScreen;