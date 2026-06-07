import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// ── Design tokens (mirrored from LoginScreen) ────────────────
const BLUE      = '#1B4EE4';
const BLUE_MID  = '#3B6FF5';
const BLUE_LITE = '#5B8FF7';
const BG        = '#F5F6FA';
const WHITE     = '#FFFFFF';
const BORDER    = '#E8E8F0';
const MUTED     = '#9494B0';
const DARK_TXT  = '#1A1A35';

const OTP_LENGTH = 6;

const OTPScreen = ({ navigation, route }) => {
  const { phone } = route.params || {};
  const [otp, setOtp]         = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]     = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const inputs                = useRef([]);
  const shakeAnim             = useRef(new Animated.Value(0)).current;
  const fadeAnim              = useRef(new Animated.Value(0)).current;
  const slideAnim             = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const shake = () => {
    setError('Incorrect OTP. Please try again.');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (val, idx) => {
    setError('');
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = ({ nativeEvent: { key } }, idx) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        navigation.replace('Main');
      } else {
        shake();
        setOtp(Array(OTP_LENGTH).fill(''));
        inputs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
  };

  const filled = otp.join('').length;
  const isReady = filled === OTP_LENGTH && !loading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Blue gradient header — contains title & subtitle */}
      <LinearGradient
        colors={['#1B4EE4', '#3B6FF5', '#5B8FF7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        {/* Decorative circle */}
        <View style={styles.decCircle} />

        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backBtnInner}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>

        {/* Lock icon */}
        <View style={styles.lockWrap}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>

        {/* Title & subtitle */}
        <Text style={styles.headerTitle}>Verify Number</Text>
        <Text style={styles.headerSubtitle}>
          OTP sent to{' '}
          <Text style={styles.phoneHighlight}>+91 {phone || '98765 43210'}</Text>
        </Text>
      </LinearGradient>

      {/* White card body */}
      <Animated.View style={[
        styles.body,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}>

        {/* Section label */}
        <Text style={styles.sectionLabel}>ENTER 6-DIGIT CODE</Text>

        {/* OTP boxes */}
        <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={r => (inputs.current[idx] = r)}
              style={[
                styles.otpBox,
                digit  && styles.otpBoxFilled,
                error  && styles.otpBoxError,
              ]}
              value={digit}
              onChangeText={v => handleChange(v, idx)}
              onKeyPress={e => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Error */}
        {!!error && (
          <Text style={styles.errorText}>⚠ {error}</Text>
        )}

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(filled / OTP_LENGTH) * 100}%` }]} />
        </View>

        {/* Verify button — outlined style */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={!isReady}
          activeOpacity={0.85}
          style={[styles.btn, !isReady && styles.btnDisabled]}
        >
          <Text style={[styles.btnText, !isReady && styles.btnTextDisabled]}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Resend timer pill */}
        <View style={styles.resendPillWrap}>
          <View style={styles.resendPill}>
            <View style={styles.resendDot} />
            <Text style={styles.resendPillText}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend now'}
            </Text>
          </View>
        </View>

        {/* Didn't receive row */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive it? </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test hint */}
        <Text style={styles.testHintText}>Use 1 2 3 4 5 6 for testing</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Top header — same gradient blob style as LoginScreen ── */
  topHeader: {
    paddingTop: 54,
    paddingHorizontal: 24,
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },

  decCircle: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  backBtn: {
    marginBottom: 20,
  },

  // Same style as LoginScreen logoIcon
  backBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 18,
    color: WHITE,
    fontWeight: '600',
  },

  // Same style as LoginScreen logoIcon
  lockWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  lockEmoji: { fontSize: 22 },

  // Same as LoginScreen heroTitle
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: WHITE,
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  // Same as LoginScreen heroSub
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
  },

  phoneHighlight: {
    color: WHITE,
    fontWeight: '700',
  },

  /* ── White card body — same card style as LoginScreen ── */
  body: {
    flex: 1,
    backgroundColor: WHITE,
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    // Same shadow as LoginScreen card
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },

  // Same as LoginScreen fieldLabel
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: MUTED,
    marginBottom: 12,
  },

  /* ── OTP boxes ── */
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 8,
  },

  // Same background + border radius as LoginScreen inputBox
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 14,
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: BORDER,
    color: DARK_TXT,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
  },

  otpBoxFilled: {
    borderColor: BLUE,
    backgroundColor: WHITE,
    color: DARK_TXT,
  },

  otpBoxError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF0F0',
  },

  errorText: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },

  /* Progress bar */
  progressBar: {
    height: 3,
    backgroundColor: BORDER,
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: BLUE,
    borderRadius: 2,
  },

  /* ── Verify button — outlined, same dimensions as LoginScreen googleBtn ── */
  btn: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  btnDisabled: {
    opacity: 0.5,
  },

  // Same as LoginScreen googleTxt
  btnText: {
    color: DARK_TXT,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  btnTextDisabled: {
    color: MUTED,
  },

  /* ── Resend pill ── */
  resendPillWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },

  resendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // Light tint of BLUE — same logic as LoginScreen statCard border
    backgroundColor: '#EBF0FD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  resendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
  },

  resendPillText: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '600',
  },

  /* Didn't receive row */
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Same as LoginScreen footerTxt
  resendLabel: {
    fontSize: 13,
    color: MUTED,
  },

  // Same as LoginScreen footerLink
  resendBtn: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '700',
  },

  resendBtnDisabled: {
    color: MUTED,
  },

  /* Test hint */
  testHintText: {
    fontSize: 11,
    color: MUTED,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OTPScreen;