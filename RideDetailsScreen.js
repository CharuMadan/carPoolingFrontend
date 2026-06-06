import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const RideDetailsScreen = ({ route, navigation }) => {
  const { ride } = route.params;

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ride Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.routeDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeCity}>{ride.from.name}</Text>
              <Text style={styles.routeFull}>{ride.from.full}</Text>
            </View>
            <Text style={styles.routeTime}>{ride.time}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.routeDotEnd]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeCity}>{ride.to.name}</Text>
              <Text style={styles.routeFull}>{ride.to.full}</Text>
            </View>
            <Text style={styles.duration}>{ride.duration}</Text>
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver</Text>
          <View style={styles.driverRow}>
            <Image source={{ uri: ride.driver.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{ride.driver.name}</Text>
              <Text style={styles.driverRating}>⭐ {ride.driver.rating} · {ride.driver.totalRides} rides</Text>
            </View>
            {ride.driver.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Trip Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Info</Text>
          <InfoRow icon="📅" label="Date" value={ride.date} />
          <InfoRow icon="🚗" label="Vehicle" value={`${ride.vehicle.name} · ${ride.vehicle.color} · ${ride.vehicle.number}`} />
          <InfoRow icon="📍" label="Distance" value={ride.distance} />
          <InfoRow icon="🪑" label="Seats Available" value={`${ride.seatsAvailable} of ${ride.totalSeats}`} />
          {ride.stops.length > 0 && (
            <InfoRow icon="🔄" label="Stops" value={ride.stops.join(', ')} />
          )}
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.prefRow}>
            {[
              { icon: ride.preferences.smoking ? '🚬' : '🚭', label: ride.preferences.smoking ? 'Smoking OK' : 'No Smoking' },
              { icon: ride.preferences.pets ? '🐾' : '🚫', label: ride.preferences.pets ? 'Pets OK' : 'No Pets' },
              { icon: ride.preferences.music ? '🎵' : '🔇', label: ride.preferences.music ? 'Music' : 'Quiet' },
              { icon: ride.preferences.ac ? '❄️' : '🌡️', label: ride.preferences.ac ? 'AC' : 'No AC' },
            ].map((p, i) => (
              <View key={i} style={styles.prefChip}>
                <Text>{p.icon}</Text>
                <Text style={styles.prefLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Book Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Per seat</Text>
          <Text style={styles.price}>₹{ride.pricePerSeat}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('BookingConfirm', { ride })}
        >
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.lg, justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: COLORS.textPrimary },
  headerTitle: { fontSize: FONTS.lg, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  routeCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  routeDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.primary, marginHorizontal: 4,
  },
  routeDotEnd: { backgroundColor: COLORS.secondary },
  routeLine: {
    width: 2, height: 30, backgroundColor: COLORS.surfaceBorder,
    marginLeft: 9, marginVertical: 4,
  },
  routeCity: { fontSize: FONTS.md, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  routeFull: { fontSize: FONTS.xs, color: COLORS.textMuted, fontFamily: FONTS.regular },
  routeTime: { fontSize: FONTS.sm, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  duration: { fontSize: FONTS.sm, fontFamily: FONTS.medium, color: COLORS.primary },
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: SPACING.md,
  },
  sectionTitle: { fontSize: FONTS.md, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  driverName: { fontSize: FONTS.md, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  driverRating: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  verifiedBadge: {
    backgroundColor: COLORS.success + '22',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  verifiedText: { fontSize: FONTS.xs, color: COLORS.success, fontFamily: FONTS.medium },
  infoRow: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-start' },
  infoIcon: { fontSize: 18 },
  infoLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, fontFamily: FONTS.regular },
  infoValue: { fontSize: FONTS.sm, color: COLORS.textPrimary, fontFamily: FONTS.medium },
  prefRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prefChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  prefLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder,
  },
  priceLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, fontFamily: FONTS.regular },
  price: { fontSize: FONTS['2xl'], fontFamily: FONTS.bold, color: COLORS.textPrimary },
  bookBtn: {
    paddingHorizontal: SPACING.xl, height: SIZES.btnHeight,
    borderRadius: SIZES.borderRadius, alignItems: 'center', justifyContent: 'center',
  },
  bookBtnText: { color: COLORS.white, fontSize: FONTS.md, fontFamily: FONTS.semiBold },
});

export default RideDetailsScreen;