import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const BookingConfirmScreen = ({ route, navigation }) => {
  const { ride } = route.params;
  const [seats, setSeats] = useState(1);
  const [payMethod, setPayMethod] = useState('UPI');

  const total = ride.pricePerSeat * seats;
  const payMethods = ['UPI', 'Wallet', 'Card', 'Cash'];

  const handleConfirm = () => {
    navigation.replace('BookingSuccess', { ride, seats, total, payMethod });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Route Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <Text style={styles.route}>{ride.from.name} → {ride.to.name}</Text>
          <Text style={styles.meta}>📅 {ride.date} · ⏰ {ride.time} · 🚗 {ride.vehicle.name}</Text>
        </View>

        {/* Seat Selector */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Number of Seats</Text>
          <View style={styles.seatRow}>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => seats > 1 && setSeats(seats - 1)}
            >
              <Text style={styles.seatBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.seatCount}>{seats}</Text>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => seats < ride.seatsAvailable && setSeats(seats + 1)}
            >
              <Text style={styles.seatBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.seatHint}>{ride.seatsAvailable} seats available</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.payRow}>
            {payMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[styles.payChip, payMethod === method && styles.payChipActive]}
                onPress={() => setPayMethod(method)}
              >
                <Text style={[styles.payChipText, payMethod === method && styles.payChipTextActive]}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>₹{ride.pricePerSeat} × {seats} seat{seats > 1 ? 's' : ''}</Text>
            <Text style={styles.priceValue}>₹{total}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalSmall}>Total Amount</Text>
          <Text style={styles.totalBig}>₹{total}</Text>
        </View>
        <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8}>
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.confirmBtn}>
            <Text style={styles.confirmBtnText}>Confirm Booking</Text>
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
  card: {
    marginHorizontal: SPACING.lg, marginBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: SIZES.cardRadius,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.surfaceBorder, gap: SPACING.sm,
  },
  sectionTitle: { fontSize: FONTS.md, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  route: { fontSize: FONTS.lg, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  meta: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  seatRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl },
  seatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center',
  },
  seatBtnText: { fontSize: 20, color: COLORS.textPrimary, fontFamily: FONTS.bold },
  seatCount: { fontSize: FONTS['2xl'], fontFamily: FONTS.bold, color: COLORS.primary },
  seatHint: { fontSize: FONTS.xs, color: COLORS.textMuted, fontFamily: FONTS.regular },
  payRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  payChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.surfaceBorder,
  },
  payChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  payChipText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  payChipTextActive: { color: COLORS.primary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  priceValue: { fontSize: FONTS.sm, color: COLORS.textPrimary, fontFamily: FONTS.medium },
  divider: { height: 1, backgroundColor: COLORS.surfaceBorder },
  totalLabel: { fontSize: FONTS.md, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  totalValue: { fontSize: FONTS.lg, fontFamily: FONTS.bold, color: COLORS.primary },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, padding: SPACING.lg,
    borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder,
  },
  totalSmall: { fontSize: FONTS.xs, color: COLORS.textMuted, fontFamily: FONTS.regular },
  totalBig: { fontSize: FONTS['2xl'], fontFamily: FONTS.bold, color: COLORS.textPrimary },
  confirmBtn: {
    paddingHorizontal: SPACING.lg, height: SIZES.btnHeight,
    borderRadius: SIZES.borderRadius, alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnText: { color: COLORS.white, fontSize: FONTS.md, fontFamily: FONTS.semiBold },
});

export default BookingConfirmScreen;