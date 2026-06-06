// ============================================================
//  POOLRIDE — Splash Screen (Premium Redesign)
//  Zero extra deps — only react-native-linear-gradient
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
  StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────
//  Mini car mark — pure Views, no SVG
// ─────────────────────────────────────────────
const CarMark = () => (
  <View style={mark.wrap}>
    {/* car body */}
    <View style={mark.body}>
      <View style={mark.roof} />
    </View>
    {/* wheels */}
    <View style={mark.wheels}>
      <View style={mark.wheel} />
      <View style={mark.wheel} />
    </View>
  </View>
);

const mark = StyleSheet.create({
  wrap:   { alignItems: 'center' },
  body:   { width: 34, height: 14, backgroundColor: '#1B4EE4', borderRadius: 5, position: 'relative' },
  roof:   { position: 'absolute', top: -10, left: 7, width: 20, height: 12, backgroundColor: '#1B4EE4', borderRadius: 4, opacity: 0.65 },
  wheels: { flexDirection: 'row', gap: 12, marginTop: 3 },
  wheel:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0A1560' },
});

// ─────────────────────────────────────────────
//  Progress Bar
// ─────────────────────────────────────────────
const ProgressBar = () => {
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(prog, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = prog.interpolate({
    inputRange:  [0, 0.6, 0.85, 1],
    outputRange: ['0%', '65%', '88%', '100%'],
  });

  return (
    <View style={pb.track}>
      <Animated.View style={[pb.fill, { width: barWidth }]} />
    </View>
  );
};

const pb = StyleSheet.create({
  track: { width: 120, height: 2, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 2 },
});

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
const SplashScreen = ({ navigation, route }) => {
  // ── animation refs ──
  const logoScale   = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(20)).current;
  const badgeOp     = useRef(new Animated.Value(0)).current;
  const arc1Scale   = useRef(new Animated.Value(0.8)).current;
  const arc2Scale   = useRef(new Animated.Value(0.8)).current;

  const params = route?.params || {};

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      // arcs bloom
      Animated.parallel([
        Animated.spring(arc1Scale, { toValue: 1, tension: 35, friction: 8, useNativeDriver: true }),
        Animated.spring(arc2Scale, { toValue: 1, tension: 28, friction: 7, delay: 80, useNativeDriver: true }),
      ]),
      // logo pops in
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, tension: 70, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      // wordmark slides up
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.spring(textY,       { toValue: 0, tension: 55, friction: 9, useNativeDriver: true }),
      ]),
      // badge fades in
      Animated.timing(badgeOp, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      const { hasSeenOnboarding = false, isLoggedIn = false } = params;
      if (!hasSeenOnboarding) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace(isLoggedIn ? 'Main' : 'Auth');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0A1560', '#1B3BD4', '#1259E0']}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={s.root}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Mesh grid overlay ── */}
      <View style={s.meshH} pointerEvents="none" />
      <View style={s.meshV} pointerEvents="none" />

      {/* ── Decorative arcs ── */}
      <Animated.View style={[s.arc1, { transform: [{ scale: arc1Scale }] }]} />
      <Animated.View style={[s.arc2, { transform: [{ scale: arc2Scale }] }]} />
      <View style={s.arc3} />

      {/* ── Radial glow blobs ── */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      {/* ── Center content ── */}
      <View style={s.center}>

        {/* Logo mark */}
        <Animated.View style={[s.logoWrap, {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }]}>
          <View style={s.logoPulse} />
          <View style={s.logoOuter}>
            <View style={s.logoInner}>
              <CarMark />
            </View>
          </View>
        </Animated.View>

        {/* Wordmark + tagline */}
        <Animated.View style={{
          alignItems: 'center',
          opacity: textOpacity,
          transform: [{ translateY: textY }],
          marginTop: 28,
          marginBottom: 40,
        }}>
          <Text style={s.wordmark}>
            Pool<Text style={s.wordmarkLight}>Ride</Text>
          </Text>
          <Text style={s.tagline}>SHARE THE ROAD</Text>
        </Animated.View>

        {/* Progress bar */}
        <ProgressBar />
      </View>

      {/* ── Bottom badge ── */}
      <Animated.View style={[s.badge, { opacity: badgeOp }]}>
        <View style={s.badgeDot} />
        <Text style={s.badgeTxt}>Trusted by 50,000+ commuters</Text>
      </Animated.View>

      {/* Version */}
      <Animated.Text style={[s.version, { opacity: badgeOp }]}>
        v1.0.0
      </Animated.Text>
    </LinearGradient>
  );
};

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // mesh
  meshH: {
    position: 'absolute', inset: 0,
    borderWidth: 0,
    // horizontal lines via borderBottomWidth repeat trick isn't available in RN,
    // so we use a repeating pattern of thin views instead — handled via blob opacity
  },
  meshV: { position: 'absolute' },

  // arcs
  arc1: {
    position: 'absolute',
    width: width * 1.1, height: width * 1.1,
    borderRadius: width * 0.55,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    top: -width * 0.25, right: -width * 0.28,
  },
  arc2: {
    position: 'absolute',
    width: width * 0.85, height: width * 0.85,
    borderRadius: width * 0.425,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    bottom: -width * 0.18, left: -width * 0.22,
  },
  arc3: {
    position: 'absolute',
    width: width * 0.5, height: width * 0.5,
    borderRadius: width * 0.25,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    top: height * 0.08, right: -width * 0.12,
  },

  // glow blobs
  blob1: {
    position: 'absolute',
    width: width * 1.2, height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(100,130,255,0.18)',
    top: -width * 0.35, left: -width * 0.25,
  },
  blob2: {
    position: 'absolute',
    width: width * 0.9, height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(30,70,220,0.22)',
    bottom: -width * 0.25, right: -width * 0.22,
  },

  // center
  center: { alignItems: 'center', zIndex: 2 },

  // logo
  logoWrap: { alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  logoPulse: {
    position: 'absolute',
    width: 110, height: 110,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  logoOuter: {
    width: 92, height: 92,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 68, height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // wordmark
  wordmark: {
    fontSize: 46,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 52,
  },
  wordmarkLight: {
    color: 'rgba(255,255,255,0.40)',
    fontWeight: '300',
  },
  tagline: {
    marginTop: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3.5,
    fontWeight: '600',
  },

  // badge
  badge: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  badgeTxt: { fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3, fontWeight: '500' },

  version: {
    position: 'absolute',
    bottom: 20,
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;