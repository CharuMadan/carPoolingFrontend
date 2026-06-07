// ============================================================
//  POOLRIDE — Login Screen (Redesigned: Premium Light Theme)
// ============================================================

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
  StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ── Inline Car SVG Logo ──────────────────────────────────────
const CarIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 22 22" fill="none">
    <Path
      d="M3 14C3 14 5 9 11 9C17 9 19 14 19 14"
      stroke="white" strokeWidth={2} strokeLinecap="round"
    />
    <Circle cx={7} cy={15} r={2.5} fill="white" />
    <Circle cx={15} cy={15} r={2.5} fill="white" />
    <Path
      d="M7 9V6H15V9"
      stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ── Google "G" SVG Icon ──────────────────────────────────────
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </Svg>
);

// ── Stat Card ────────────────────────────────────────────────
const StatCard = ({ value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statNum}>{value}</Text>
    <Text style={styles.statLbl}>{label}</Text>
  </View>
);

// ── Main Screen ──────────────────────────────────────────────
const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSendOTP = () => {
    if (phone.length !== 10) return;

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { phone });
    }, 1000);
  };

  const isValid = phone.length === 10;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B4EE4" translucent={false} />

      {/* Blue hero blob */}
      <LinearGradient
        colors={['#1B4EE4', '#3B6FF5', '#5B8FF7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBlob}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Brand Row ── */}
          <View style={styles.hero}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <CarIcon />
              </View>
              <Text style={styles.brand}>
                Pool<Text style={styles.brandLight}>Ride</Text>
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Welcome back{'\n'}to smarter rides 👋
            </Text>
            <Text style={styles.heroSub}>Login to continue your journey</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>

            <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>

            <View style={styles.inputBox}>
              <View style={styles.ccBox}>
                {/* Indian flag strip */}
                <View style={styles.flag}>
                  <View style={styles.flagOrange} />
                  <View style={styles.flagWhite} />
                  <View style={styles.flagGreen} />
                </View>
                <Text style={styles.ccNum}>+91</Text>
              </View>
              <TextInput
                style={styles.numInput}
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#BABACF"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* OTP Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSendOTP}
                disabled={!isValid || loading}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={isValid ? ['#1B4EE4', '#3B6FF5'] : ['#C8CEDE', '#D8DAE8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.otpBtn}
                >
                  <Text style={[styles.otpBtnText, !isValid && styles.otpBtnTextDisabled]}>
                    {loading ? 'Sending OTP…' : 'Send OTP  →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divTxt}>or continue with</Text>
              <View style={styles.divLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <GoogleIcon />
              <Text style={styles.googleTxt}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerTxt}>New here? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Trust Stats ── */}
          <View style={styles.statsRow}>
            <StatCard value="2L+" label="Rides Done" />
            <StatCard value="50K+" label="Users" />
            <StatCard value="4.8★" label="App Rating" />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const BLUE      = '#1B4EE4';
const BLUE_MID  = '#3B6FF5';
const BG        = '#F5F6FA';
const WHITE     = '#FFFFFF';
const BORDER    = '#E8E8F0';
const MUTED     = '#9494B0';
const DARK_TXT  = '#1A1A35';

const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: BG },

  heroBlob: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 320,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // ── Hero ──
  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: WHITE,
    letterSpacing: -0.3,
  },
  brandLight: {
    fontWeight: '500',
    opacity: 0.75,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: WHITE,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
    marginBottom: 0,
  },

  // ── Card ──
  card: {
    backgroundColor: WHITE,
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: MUTED,
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginBottom: 16,
    height: 54,
    overflow: 'hidden',
  },
  ccBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 7,
    borderRightWidth: 1.5,
    borderRightColor: BORDER,
    height: '100%',
  },
  flag: { width: 22, height: 15, borderRadius: 3, overflow: 'hidden' },
  flagOrange: { flex: 1, backgroundColor: '#FF9933' },
  flagWhite:  { flex: 1, backgroundColor: '#FFFFFF' },
  flagGreen:  { flex: 1, backgroundColor: '#138808' },
  ccNum: { fontSize: 14, fontWeight: '600', color: DARK_TXT },
  numInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 15,
    color: DARK_TXT,
  },

  otpBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  otpBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  otpBtnTextDisabled: { color: '#9494B0' },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  divLine: { flex: 1, height: 1, backgroundColor: '#ECECF5' },
  divTxt:  { fontSize: 12, color: '#B0B0C8', fontWeight: '500' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
    gap: 10,
    marginBottom: 20,
  },
  googleTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK_TXT,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTxt:  { fontSize: 13, color: MUTED },
  footerLink: { fontSize: 13, color: BLUE, fontWeight: '700' },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  statNum: { fontSize: 18, fontWeight: '800', color: BLUE },
  statLbl: { fontSize: 10, color: MUTED, fontWeight: '500', marginTop: 2 },
});

export default LoginScreen;