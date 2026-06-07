import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const BookingSuccessScreen = ({ route, navigation }) => {
  const { ride, seats, total, payMethod } = route.params;

  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(40)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 55, friction: 6, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(confettiAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const bookingId = 'BKG-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top purple band */}
      <LinearGradient
        colors={['#5B4FCF', '#8B7FF5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topBand}
      >
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />

        {/* Success icon */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.successTitle, { opacity: opacityAnim }]}>
          Booking Confirmed!
        </Animated.Text>
        <Animated.Text style={[styles.successSub, { opacity: opacityAnim }]}>
          Your seat has been reserved successfully 🎉
        </Animated.Text>
      </LinearGradient>

      {/* Details card */}
      <Animated.View style={[
        styles.detailCard,
        { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
      ]}>
        {/* Booking ID */}
        <View style={styles.bookingIdRow}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <View style={styles.bookingIdBadge}>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Route */}
        <View style={styles.routeRow}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.routeCity}>{ride.from.name}</Text>
          </View>
          <View style={styles.routeArrowWrap}>
            {[0,1,2,3].map(i => <View key={i} style={styles.dash} />)}
            <Text style={styles.routeArrow}>✈</Text>
          </View>
          <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
            <View style={[styles.routeDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.routeCity}>{ride.to.name}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <InfoCell icon="📅" label="Date" value={ride.date} />
          <InfoCell icon="🕐" label="Time" value={ride.time} />
          <InfoCell icon="💺" label="Seats" value={`${seats} seat${seats > 1 ? 's' : ''}`} />
          <InfoCell icon="💳" label="Payment" value={payMethod} />
        </View>

        <View style={styles.cardDivider} />

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </Animated.View>

      {/* Info banner */}
      <Animated.View style={[styles.infoBanner, { opacity: confettiAnim }]}>
        <Text style={styles.infoBannerIcon}>📍</Text>
        <Text style={styles.infoBannerText}>
          You'll receive driver contact details 30 mins before departure
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.btnGroup, { opacity: confettiAnim }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('RideTracking', { ride })}
          activeOpacity={0.85}
          style={styles.btnPrimaryWrap}
        >
          <LinearGradient
            colors={COLORS.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>🗺 Track My Ride</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.btnSecondary}
          activeOpacity={0.75}
        >
          <Text style={styles.btnSecondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const InfoCell = ({ icon, label, value }) => (
  <View style={styles.infoCell}>
    <Text style={styles.infoCellIcon}>{icon}</Text>
    <Text style={styles.infoCellLabel}>{label}</Text>
    <Text style={styles.infoCellValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Top band */
  topBand: {
    paddingTop: 64,
    paddingBottom: 36,
    paddingHorizontal: SIZES.screenPadding,
    alignItems: 'center',
    overflow: 'hidden',
  },
  decCircle1: {
    position: 'absolute', top: -50, right: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decCircle2: {
    position: 'absolute', bottom: -20, left: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  /* Icon */
  iconWrap: { marginBottom: SPACING.lg },
  iconOuter: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconInner: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: {
    fontSize: 36,
    color: COLORS.success,
    fontWeight: '700',
  },

  successTitle: {
    fontSize: FONTS['3xl'],
    color: COLORS.white,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  successSub: {
    fontSize: FONTS.sm,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: FONTS.regular,
  },

  /* Detail card */
  detailCard: {
    marginHorizontal: SIZES.screenPadding,
    marginTop: -20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.large,
  },

  bookingIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bookingIdLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  bookingIdBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bookingIdValue: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },

  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },

  /* Route */
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routePoint: { alignItems: 'flex-start', gap: 4 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeCity: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  routeArrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    justifyContent: 'center',
  },
  dash: {
    width: 6, height: 1.5,
    backgroundColor: COLORS.surfaceBorder, borderRadius: 1,
  },
  routeArrow: { fontSize: 14, color: COLORS.primary },

  /* Info grid */
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  infoCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.borderRadiusSm,
    padding: SPACING.sm,
    gap: 2,
  },
  infoCellIcon: { fontSize: 16, marginBottom: 2 },
  infoCellLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
  },
  infoCellValue: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
  },

  /* Total */
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  totalValue: {
    fontSize: FONTS['2xl'],
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  /* Info banner */
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginHorizontal: SIZES.screenPadding,
    marginTop: SPACING.md,
    backgroundColor: COLORS.warningBg,
    borderRadius: SIZES.borderRadiusSm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '33',
  },
  infoBannerIcon: { fontSize: 16, marginTop: 1 },
  infoBannerText: {
    flex: 1,
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },

  /* Buttons */
  btnGroup: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  btnPrimaryWrap: { borderRadius: SIZES.borderRadiusMd, overflow: 'hidden' },
  btnPrimary: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.borderRadiusMd,
  },
  btnPrimaryText: {
    color: COLORS.white,
    fontSize: FONTS.md,
    fontFamily: FONTS.bold,
    letterSpacing: 0.3,
  },
  btnSecondary: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.borderRadiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.white,
  },
  btnSecondaryText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontFamily: FONTS.semiBold,
  },
});

export default BookingSuccessScreen;