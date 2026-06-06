// ============================================================
//  POOLRIDE — Ride Tracking Screen
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Image, Linking, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { DUMMY_RIDES } from '../../service/Dummydata';

const STATUSES = [
  { key: 'confirmed', label: 'Booking Confirmed', icon: 'checkmark-circle', done: true },
  { key: 'driver_assigned', label: 'Driver Assigned', icon: 'person-circle', done: true },
  { key: 'on_the_way', label: 'Driver on the Way', icon: 'car', done: false },
  { key: 'arrived', label: 'Driver Arrived', icon: 'location', done: false },
  { key: 'in_ride', label: 'In Ride', icon: 'navigate', done: false },
  { key: 'completed', label: 'Ride Completed', icon: 'flag', done: false },
];

const RideTrackingScreen = ({ navigation, route }) => {
  const { rideId } = route.params || {};
  const ride = DUMMY_RIDES.find(r => r.id === rideId) || DUMMY_RIDES[0];
  const [currentStatus, setCurrentStatus] = useState(1); // index of active step

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Ride</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <LinearGradient colors={['#0D1B2A', '#1A2A3A']} style={styles.mapGrad}>
            <View style={styles.mapPinFrom}>
              <Ionicons name="radio-button-on" size={20} color={COLORS.primary} />
              <Text style={styles.mapPinLabel}>{ride.from.name}</Text>
            </View>
            <View style={styles.mapLine} />
            <View style={styles.mapCarIcon}>
              <Text style={{ fontSize: 32 }}>🚗</Text>
            </View>
            <View style={styles.mapLine} />
            <View style={styles.mapPinTo}>
              <Ionicons name="location" size={20} color={COLORS.secondary} />
              <Text style={styles.mapPinLabel}>{ride.to.name}</Text>
            </View>
            <Text style={styles.mapNote}>Live map coming soon</Text>
          </LinearGradient>
        </View>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <Image source={{ uri: ride.driver.avatar }} style={styles.driverAvatar} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
            <Text style={styles.driverRating}>⭐ {ride.driver.rating} · {ride.vehicle.name}</Text>
            <Text style={styles.vehicleNumber}>{ride.vehicle.number}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Linking.openURL(`tel:${'+919876543210'}`)}
            >
              <Ionicons name="call" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ride Status</Text>
          {STATUSES.map((step, index) => {
            const isDone = index <= currentStatus;
            const isActive = index === currentStatus;
            return (
              <View key={step.key} style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusCircle, isDone && styles.statusCircleDone, isActive && styles.statusCircleActive]}>
                    <Ionicons
                      name={isDone ? 'checkmark' : step.icon}
                      size={14}
                      color={isDone ? COLORS.white : COLORS.textMuted}
                    />
                  </View>
                  {index < STATUSES.length - 1 && (
                    <View style={[styles.statusConnector, isDone && styles.statusConnectorDone]} />
                  )}
                </View>
                <View style={styles.statusContent}>
                  <Text style={[styles.statusLabel, isDone && styles.statusLabelDone, isActive && styles.statusLabelActive]}>
                    {step.label}
                  </Text>
                  {isActive && <Text style={styles.statusSub}>In progress...</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Ride Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.infoText}>Departure: {ride.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="navigate-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.infoText}>Distance: {ride.distance}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="hourglass-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.infoText}>Duration: {ride.duration}</Text>
          </View>
        </View>

        {/* SOS */}
        <TouchableOpacity style={styles.sosBtn} activeOpacity={0.85}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.sosBtnText}>SOS Emergency</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.screenPadding, paddingTop: 54, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.lg, color: COLORS.textPrimary, fontFamily: FONTS.bold },
  mapPlaceholder: { marginHorizontal: SIZES.screenPadding, borderRadius: SIZES.borderRadiusLg, overflow: 'hidden', marginBottom: SPACING.md },
  mapGrad: { height: 200, alignItems: 'center', justifyContent: 'center', gap: 8, padding: SPACING.lg },
  mapPinFrom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapPinTo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapPinLabel: { color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: FONTS.sm },
  mapLine: { width: 2, height: 20, backgroundColor: COLORS.surfaceBorder },
  mapCarIcon: { marginVertical: 2 },
  mapNote: { position: 'absolute', bottom: 8, color: COLORS.textMuted, fontSize: FONTS.xs },
  driverCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SIZES.screenPadding, backgroundColor: COLORS.surfaceElevated, borderRadius: SIZES.borderRadiusLg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.surfaceBorder, ...SHADOWS.small, marginBottom: SPACING.md },
  driverAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: SPACING.md },
  driverDetails: { flex: 1 },
  driverName: { color: COLORS.textPrimary, fontFamily: FONTS.semiBold, fontSize: FONTS.md },
  driverRating: { color: COLORS.textSecondary, fontSize: FONTS.xs },
  vehicleNumber: { color: COLORS.textMuted, fontSize: FONTS.xs, marginTop: 2 },
  driverActions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary },
  section: { paddingHorizontal: SIZES.screenPadding, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.md, color: COLORS.textPrimary, fontFamily: FONTS.bold, marginBottom: SPACING.md },
  statusRow: { flexDirection: 'row', marginBottom: 0 },
  statusLeft: { alignItems: 'center', width: 32, marginRight: SPACING.md },
  statusCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  statusCircleDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  statusCircleActive: { borderColor: COLORS.primary, borderWidth: 2 },
  statusConnector: { width: 2, flex: 1, minHeight: 24, backgroundColor: COLORS.surfaceBorder, marginVertical: 2 },
  statusConnectorDone: { backgroundColor: COLORS.primary },
  statusContent: { flex: 1, paddingBottom: SPACING.md },
  statusLabel: { color: COLORS.textMuted, fontSize: FONTS.sm },
  statusLabelDone: { color: COLORS.textPrimary },
  statusLabelActive: { color: COLORS.primary, fontFamily: FONTS.medium },
  statusSub: { color: COLORS.textMuted, fontSize: FONTS.xs, marginTop: 2 },
  infoCard: { marginHorizontal: SIZES.screenPadding, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadius, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.surfaceBorder, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  infoText: { color: COLORS.textSecondary, fontSize: FONTS.sm },
  sosBtn: { marginHorizontal: SIZES.screenPadding, backgroundColor: '#C62828', borderRadius: SIZES.borderRadius, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md, gap: SPACING.sm },
  sosBtnText: { color: '#fff', fontSize: FONTS.md, fontFamily: FONTS.bold },
});

export default RideTrackingScreen;