// ============================================================
//  POOLRIDE — Onboarding Screen (Fixed + Premium)
//  No react-native-svg. Only react-native-linear-gradient.
// ============================================================

import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
//  Dashed line helper (Android-safe — no borderStyle dashed)
// ─────────────────────────────────────────────────────────────
const DashedLine = ({ color = 'rgba(255,255,255,0.45)', count = 7 }) => (
  <View style={{ alignItems: 'center', gap: 4, marginVertical: 6 }}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ width: 3, height: 7, borderRadius: 2, backgroundColor: color }} />
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────
//  Illustrations
// ─────────────────────────────────────────────────────────────

/** Slide 1 — Map route with floating cards */
const Illus1 = () => (
  <View style={il.s1Root}>
    {/* Floating card — ETA (left) */}
    <View style={[il.floatCard, il.floatLeft]}>
      <Text style={il.fcLabel}>ETA</Text>
      <Text style={il.fcVal}>4 min</Text>
    </View>

    {/* Floating card — Fare (right) */}
    <View style={[il.floatCard, il.floatRight]}>
      <Text style={il.fcLabel}>Fare</Text>
      <Text style={il.fcVal}>₹45</Text>
    </View>

    {/* Route column */}
    <View style={il.routeCol}>
      {/* Top pin */}
      <View style={il.pinLarge}>
        <View style={il.pinDotLarge} />
      </View>

      {/* Dashed connector */}
      <DashedLine />

      {/* Bottom pin */}
      <View style={il.pinSmall}>
        <View style={il.pinDotSmall} />
      </View>
    </View>
  </View>
);

/** Slide 2 — Two avatars + coin stack + savings badge */
const Illus2 = () => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
      <View style={[il.avatar, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
        <Text style={il.avatarTxt}>A</Text>
      </View>
      {/* coin stack */}
      <View style={{ alignItems: 'center', gap: 5 }}>
        <View style={[il.coin, il.coinBig]} />
        <View style={il.coin} />
        <View style={il.coin} />
      </View>
      <View style={[il.avatar, { backgroundColor: 'rgba(255,255,255,0.13)' }]}>
        <Text style={il.avatarTxt}>R</Text>
      </View>
    </View>
    <View style={il.badge}>
      <Text style={il.badgeTxt}>Save up to ₹2,400/month 💰</Text>
    </View>
  </View>
);

/** Slide 3 — Leaf shapes + CO₂ badge */
const Illus3 = () => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ width: 130, height: 130, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <View style={[il.leaf, { top: 0,  left: 0,  transform: [{ rotate: '0deg' }]   }]} />
      <View style={[il.leaf, { top: 0,  right: 0, transform: [{ rotate: '90deg' }]  }, { opacity: 0.70 }]} />
      <View style={[il.leaf, { bottom: 5, left: 15, transform: [{ rotate: '-45deg' }] }, { opacity: 0.50 }]} />
      <View style={il.ecoCenterDot} />
    </View>
    <View style={il.badge}>
      <Text style={il.badgeTxt}>-2.4 kg CO₂ per trip 🌿</Text>
    </View>
  </View>
);

const ILLUSTRATIONS = [Illus1, Illus2, Illus3];

// ─────────────────────────────────────────────────────────────
//  Illustration styles
// ─────────────────────────────────────────────────────────────
const il = StyleSheet.create({
  // Slide 1
  s1Root: {
    width: width * 0.70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  routeCol: {
    alignItems: 'center',
  },
  pinLarge: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  pinDotLarge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#1B4EE4',
  },
  pinSmall: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center', justifyContent: 'center',
  },
  pinDotSmall: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  floatCard: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  floatLeft:  { left: -10, top: 10 },
  floatRight: { right: -10, bottom: 20 },
  fcLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600', marginBottom: 2 },
  fcVal:   { fontSize: 15, color: '#fff', fontWeight: '800' },

  // Slide 2
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { fontSize: 24, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  coin:    { width: 46, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.38)' },
  coinBig: { width: 56, height: 14, backgroundColor: 'rgba(255,255,255,0.35)' },
  badge: {
    marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 22, paddingHorizontal: 20, paddingVertical: 10,
  },
  badgeTxt: { fontSize: 13, color: '#fff', fontWeight: '700', letterSpacing: 0.2 },

  // Slide 3
  leaf: {
    position: 'absolute', width: 72, height: 72,
    borderRadius: 36, borderTopRightRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.32)',
  },
  ecoCenterDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.90)',
  },
});

// ─────────────────────────────────────────────────────────────
//  Slide data
// ─────────────────────────────────────────────────────────────
const slides = [
  {
    id: '1', num: '01',
    title: 'Find Your Ride',
    subtitle: 'Search rides going your way and book a seat in seconds. Real-time tracking included.',
    accent: '#1B4EE4',
    gradColors: ['#1B4EE4', '#3B6FF5'],
  },
  {
    id: '2', num: '02',
    title: 'Share & Save',
    subtitle: 'Split travel costs with fellow passengers. Save up to 70% on your daily commute.',
    accent: '#00875A',
    gradColors: ['#00875A', '#00C896'],
  },
  {
    id: '3', num: '03',
    title: 'Eco Friendly',
    subtitle: 'Fewer cars, less pollution. Every shared ride reduces carbon emissions for our planet.',
    accent: '#B45309',
    gradColors: ['#B45309', '#F59E0B'],
  },
];

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────
const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goTo = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) goTo(currentIndex + 1);
    else navigation.replace('Auth');
  };

  const slide = slides[currentIndex];
  const IllusComponent = ILLUSTRATIONS[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Hero gradient (top 52%) ── */}
      <LinearGradient
        colors={slide.gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        {/* Subtle arc decorations */}
        <View style={s.arc1} />
        <View style={s.arc2} />

        {/* Skip */}
        <TouchableOpacity
          onPress={() => navigation.replace('Auth')}
          style={s.skipBtn}
        >
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>

        {/* Illustration */}
        <View style={s.illusArea}>
          <IllusComponent />
        </View>

        {/* Curved white bottom */}
        <View style={s.curve} />
      </LinearGradient>

      {/* ── Text content ── */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <Text style={s.slideNum}>{item.num} / {String(slides.length).padStart(2, '0')}</Text>
            <Text style={s.slideTitle}>{item.title}</Text>
            <View style={[s.titleAccent, { backgroundColor: item.accent }]} />
            <Text style={s.slideSub}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* ── Footer ── */}
      <View style={s.footer}>
        {/* Animated dots */}
        <View style={s.dotsRow}>
          {slides.map((_, i) => {
            const dotW = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [7, 26, 7],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  s.dot,
                  {
                    width: dotW,
                    backgroundColor: i === currentIndex ? slide.accent : '#DDDDF0',
                  },
                ]}
              />
            );
          })}
        </View>

        {/* CTA button */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.88} style={s.btnWrap}>
          <LinearGradient
            colors={slide.gradColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.btn}
          >
            <Text style={s.btnTxt}>
              {isLast ? 'Get Started  →' : 'Next  →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────
const HERO_H = height * 0.48;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // hero
  hero: {
    height: HERO_H,
    overflow: 'hidden',
    position: 'relative',
  },
  arc1: {
    position: 'absolute',
    width: width * 1.0, height: width * 1.0,
    borderRadius: width * 0.5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    top: -width * 0.42, right: -width * 0.28,
  },
  arc2: {
    position: 'absolute',
    width: width * 0.70, height: width * 0.70,
    borderRadius: width * 0.35,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    bottom: -width * 0.20, left: -width * 0.18,
  },

  skipBtn: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
  },
  skipTxt: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.90)' },

  illusArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 40,
  },

  // curved white separator
  curve: {
    position: 'absolute',
    bottom: -2, left: -30, right: -30,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
  },

  // slide text
  slide: {
    width,
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 8,
  },
  slideNum: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2.5,
    color: '#B0B0C8', textTransform: 'uppercase', marginBottom: 10,
  },
  slideTitle: {
    fontSize: 32, fontWeight: '900',
    color: '#1A1A35', letterSpacing: -1, lineHeight: 36,
    marginBottom: 10,
  },
  titleAccent: {
    width: 36, height: 3.5, borderRadius: 2, marginBottom: 14,
  },
  slideSub: {
    fontSize: 15, color: '#7070A0',
    lineHeight: 24, fontWeight: '400',
  },

  // footer
  footer: {
    flex: 1, paddingHorizontal: 28, paddingBottom: 40,
    justifyContent: 'flex-end', gap: 18,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 7, borderRadius: 4 },

  btnWrap: { borderRadius: 16, overflow: 'hidden' },
  btn: {
    height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1B4EE4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12,
  },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});

export default OnboardingScreen;