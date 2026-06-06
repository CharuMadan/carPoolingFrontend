// ============================================================
//  POOLRIDE — Profile Screen (Redesigned)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// ── constants ───────────────────────────────────────────────
const BG           = '#F0EEE9';
const CARD_BG      = '#FFFFFF';
const TEXT_PRIMARY = '#1A1815';
const TEXT_SEC     = '#A09890';
const TEXT_MUTED   = '#C0BAB2';
const ACCENT       = '#C9920A';

// ── setting row config ──────────────────────────────────────
const ACCOUNT_ITEMS = [
  {
    id: 'edit_profile',
    icon: 'person-outline',
    label: 'Edit Profile',
    sub: 'Name, photo, bio',
    iconColor: '#C9920A', iconBg: '#FFF7E6',
    screen: 'EditProfile',
  },
  {
    id: 'change_password',
    icon: 'lock-closed-outline',
    label: 'Change Password',
    sub: 'Update your password',
    iconColor: '#4f46e5', iconBg: '#EEF2FF',
    screen: 'ChangePassword',
  },
  {
    id: 'payment',
    icon: 'card-outline',
    label: 'Payment Methods',
    sub: 'UPI, cards & wallets',
    iconColor: '#16a05a', iconBg: '#EDFAF3',
    screen: 'PaymentMethods',
  },
];

const SUPPORT_ITEMS = [
  {
    id: 'help',
    icon: 'help-circle-outline',
    label: 'Help & Support',
    sub: 'FAQs, contact us',
    iconColor: '#C9920A', iconBg: '#FFF7E6',
    screen: 'HelpSupport',
  },
  {
    id: 'privacy',
    icon: 'shield-outline',
    label: 'Privacy Policy',
    sub: null,
    iconColor: '#767068', iconBg: '#F5F4F2',
    screen: 'PrivacyPolicy',
  },
  {
    id: 'terms',
    icon: 'document-text-outline',
    label: 'Terms of Service',
    sub: null,
    iconColor: '#767068', iconBg: '#F5F4F2',
    screen: 'Terms',
  },
];

// ── sub-components ──────────────────────────────────────────

const SectionLabel = ({ label }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const SettingRow = ({ item, isLast, onPress }) => (
  <TouchableOpacity
    style={[styles.settingRow, isLast && styles.settingRowLast]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
      <Ionicons name={item.icon} size={18} color={item.iconColor} />
    </View>
    <View style={styles.settingInfo}>
      <Text style={styles.settingLabel}>{item.label}</Text>
      {item.sub && <Text style={styles.settingSub}>{item.sub}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color={TEXT_MUTED} />
  </TouchableOpacity>
);

// ── main component ──────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const [notifEnabled, setNotifEnabled] = useState(true);

  // Replace with real user data from your auth/store
  const user = {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@gmail.com',
    phone: '+91 98765 43210',
    initials: 'RK',
    verified: true,
  };

  const handleLogout = () => {
    // TODO: clear auth token, navigate to Login
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── PROFILE HERO ── */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.initials}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={10} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{user.name}</Text>
            <Text style={styles.heroEmail}>{user.email}</Text>
            <Text style={styles.heroPhone}>{user.phone}</Text>
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={11} color="#16a05a" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── ACCOUNT ── */}
        <SectionLabel label="Account" />
        <View style={styles.group}>
          {ACCOUNT_ITEMS.map((item, i) => (
            <SettingRow
              key={item.id}
              item={item}
              isLast={i === ACCOUNT_ITEMS.length - 1}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>

        {/* ── PREFERENCES ── */}
        <SectionLabel label="Preferences" />
        <View style={styles.group}>
          {/* notifications toggle */}
          <View style={[styles.settingRow]}>
            <View style={[styles.settingIcon, { backgroundColor: '#F4EEFF' }]}>
              <Ionicons name="notifications-outline" size={18} color="#7c3aed" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingSub}>Ride alerts, promos</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#E8E5DF', true: ACCENT }}
              thumbColor="#fff"
              ios_backgroundColor="#E8E5DF"
            />
          </View>

          {/* language */}
          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Language')}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#F5F4F2' }]}>
              <Ionicons name="globe-outline" size={18} color="#767068" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingSub}>English</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        {/* ── SUPPORT ── */}
        <SectionLabel label="Support" />
        <View style={styles.group}>
          {SUPPORT_ITEMS.map((item, i) => (
            <SettingRow
              key={item.id}
              item={item}
              isLast={i === SUPPORT_ITEMS.length - 1}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>

        {/* ── LOGOUT ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>PoolRide v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 110 },

  /* hero */
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    margin: 18,
    marginBottom: 0,
    backgroundColor: CARD_BG,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#f0e0b0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    shadowColor: ACCENT,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#8a6010' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: ACCENT,
    borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY, letterSpacing: -0.3 },
  heroEmail: { fontSize: 12.5, color: TEXT_SEC, marginTop: 2 },
  heroPhone: { fontSize: 12.5, color: TEXT_SEC, marginTop: 1 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EDFAF3',
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 20, marginTop: 6,
    alignSelf: 'flex-start',
  },
  verifiedText: { fontSize: 10.5, fontWeight: '600', color: '#16a05a' },

  /* section label */
  sectionLabel: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 0.9, textTransform: 'uppercase',
    color: TEXT_MUTED,
    paddingHorizontal: 22,
    marginTop: 20, marginBottom: 8,
  },

  /* group */
  group: {
    marginHorizontal: 14,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  /* setting row */
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 13,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingRowLast: { borderBottomWidth: 0 },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '500', color: TEXT_PRIMARY },
  settingSub: { fontSize: 11.5, color: TEXT_SEC, marginTop: 1 },

  /* logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    marginHorizontal: 14, marginTop: 14,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(220,38,38,0.18)',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  logoutText: { fontSize: 14.5, fontWeight: '600', color: '#dc2626' },

  /* version */
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 14,
  },
});

export default ProfileScreen;