import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  DUMMY_USER,
  DUMMY_RIDES,
  DUMMY_POPULAR_ROUTES,
} from '../../service/Dummydata';
import {
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#F6F4EF', // warm ivory page background
  white: '#FFFFFF',
  ink: '#1A1814', // primary text / dark accents
  inkLight: '#4A4540', // secondary text
  muted: '#A09890', // placeholder / muted text
  border: '#EBE7E0', // card borders
  divider: '#F0ECE6', // intra-card dividers
  green: '#22C55E', // origin dot / verified / price badge
  greenBg: '#F0FBF4',
  greenBorder: '#D5EFE0',
  greenText: '#16A34A',
  red: '#EF4444', // destination dot
  star: '#F5A623',
  inputBg: '#F6F4EF',
};

const F = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 15,
  xl: 17,
  '2xl': 20,
  '3xl': 28,
};

const R = { sm: 11, md: 16, lg: 18, xl: 22 };

// ─── HomeScreen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Naya (replace karo):
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDrop, setShowFromDrop] = useState(false);
  const [showToDrop, setShowToDrop] = useState(false);

  // City list (apni real list lagao — ya API se lo)
  const CITIES = [
    'Delhi',
    'Mumbai',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Faridabad',
    'Noida',
    'Gurgaon',
    'Chandigarh',
    'Lucknow',
  ];

  const filterCities = text =>
    text.length > 0
      ? CITIES.filter(c => c.toLowerCase().startsWith(text.toLowerCase()))
      : [];

  const onFromChange = text => {
    setFrom(text);
    setFromSuggestions(filterCities(text));
    setShowFromDrop(true);
  };

  const onToChange = text => {
    setTo(text);
    setToSuggestions(filterCities(text));
    setShowToDrop(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // picker band karo
    if (selectedDate) {
      const d = selectedDate;
      const formatted = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      setDate(formatted);
    }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning 👋'
      : hour < 17
      ? 'Good afternoon 👋'
      : 'Good evening 👋';

  const handleSearch = () =>
    navigation.navigate('SearchResults', { from, to, date });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={s.scroll}
        onStartShouldSetResponder={() => {
          setShowFromDrop(false);
          setShowToDrop(false);
          return false;
        }}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{greeting}</Text>
            <Text style={s.userName}>{DUMMY_USER.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={s.avatarCircle}
          >
            <Text style={s.avatarInitial}>
              {DUMMY_USER.name.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Search Card ───────────────────────────────────────── */}
        <View style={s.searchCard}>
          {/* From / To inputs with connector line */}
          <View style={s.inputWrapper}>
            <View style={s.connectorCol}>
              <View style={[s.dot, { backgroundColor: C.green }]} />
              <View style={s.connectorLine} />
              <View style={[s.dot, { backgroundColor: C.red }]} />
            </View>

            <View style={s.inputsCol}>
              <View style={s.fieldBlock}>
                <Text style={s.fieldLabel}>FROM</Text>
                {/* FROM fieldBlock ke andar TextInput replace: */}
                <TextInput
                  style={s.fieldInput}
                  placeholder="City, Area"
                  placeholderTextColor={C.muted}
                  value={from}
                  onChangeText={onFromChange}
                />
                {showFromDrop && fromSuggestions.length > 0 && (
                  <View style={s.dropdown}>
                    {fromSuggestions.map(city => (
                      <TouchableOpacity
                        key={city}
                        style={s.dropdownItem}
                        onPress={() => {
                          setFrom(city);
                          setShowFromDrop(false);
                        }}
                      >
                        <Text style={s.dropdownText}>📍 {city}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={s.inputDivider} />
              <View style={s.fieldBlock}>
                <Text style={s.fieldLabel}>TO</Text>
                {/* TO fieldBlock ke andar TextInput replace: */}
                <TextInput
                  style={s.fieldInput}
                  placeholder="Destination"
                  placeholderTextColor={C.muted}
                  value={to}
                  onChangeText={onToChange}
                />
                {showToDrop && toSuggestions.length > 0 && (
                  <View style={s.dropdown}>
                    {toSuggestions.map(city => (
                      <TouchableOpacity
                        key={city}
                        style={s.dropdownItem}
                        onPress={() => {
                          setTo(city);
                          setShowToDrop(false);
                        }}
                      >
                        <Text style={s.dropdownText}>📍 {city}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Date + Search button */}
          <View style={s.searchBottom}>
            {/* Purana dateBox replace karo is se: */}
            <TouchableOpacity
              style={s.dateBox}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={s.dateIcon}>📅</Text>
              <Text
                style={[s.dateInput, { color: date ? C.inkLight : C.muted }]}
              >
                {date || 'Today'}
              </Text>
            </TouchableOpacity>

            {/* Aur DatePicker ko search card ke baad render karo: */}
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                minimumDate={new Date()}
                onChange={onDateChange}
              />
            )}
            <TouchableOpacity
              style={s.searchBtn}
              onPress={handleSearch}
              activeOpacity={0.85}
            >
              <Text style={s.searchBtnText}>Search →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Stats ───────────────────────────────────────── */}
        <View style={s.statsRow}>
          <StatCard value="24" label="RIDES" icon="🚗" />
          <StatCard value="4.9" label="RATING" icon="⭐" />
          <StatCard value="₹120" label="SAVED" icon="💰" />
        </View>

        {/* ── Popular Routes ────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>⚡ Popular Routes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {DUMMY_POPULAR_ROUTES.map(route => (
              <TouchableOpacity
                key={route.id}
                style={s.routeChip}
                onPress={() =>
                  navigation.navigate('SearchResults', {
                    from: route.from,
                    to: route.to,
                  })
                }
                activeOpacity={0.75}
              >
                <Text style={s.routeChipCities}>
                  {route.from}
                  <Text style={s.routeArrow}> → </Text>
                  {route.to}
                </Text>
                <Text style={s.routeChipMeta}>{route.rides} rides</Text>
                <Text style={s.routeChipPrice}>from ₹{route.minPrice}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Available Rides ───────────────────────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Available Rides</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchResults', {})}
            >
              <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {DUMMY_RIDES.slice(0, 3).map(ride => (
            <RideCard
              key={ride.id}
              ride={ride}
              onPress={() => navigation.navigate('RideDetails', { ride })}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── StatCard ────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, icon }) => (
  <View style={s.statCard}>
    <Text style={s.statIcon}>{icon}</Text>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

// ─── RideCard ────────────────────────────────────────────────────────────────
const RideCard = ({ ride, onPress }) => (
  <TouchableOpacity style={s.rideCard} onPress={onPress} activeOpacity={0.88}>
    {/* Driver row + price */}
    <View style={s.rideTop}>
      <View style={s.driverAvatarCircle}>
        <Text style={s.driverAvatarInitial}>
          {ride.driver.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={s.driverInfo}>
        <Text style={s.driverName}>{ride.driver.name}</Text>
        <View style={s.ratingRow}>
          <Text style={s.starIcon}>★</Text>
          <Text style={s.ratingText}>{ride.driver.rating}</Text>
          <View style={s.ratingDot} />
          <Text style={s.ratingText}>{ride.driver.totalRides} rides</Text>
        </View>
      </View>

      <View style={s.priceCol}>
        <Text style={s.priceValue}>₹{ride.pricePerSeat}</Text>
        <Text style={s.priceSub}>per seat</Text>
      </View>
    </View>

    {/* Divider */}
    <View style={s.cardDivider} />

    {/* Route row */}
    <View style={s.routeRow}>
      <View style={s.routeEnd}>
        <View style={[s.routeDotSm, { backgroundColor: C.green }]} />
        <Text style={s.routeCity}>{ride.from.name}</Text>
      </View>
      <View style={s.dashRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={s.dash} />
        ))}
      </View>
      <View style={[s.routeEnd, { alignItems: 'flex-end' }]}>
        <View style={[s.routeDotSm, { backgroundColor: C.red }]} />
        <Text style={s.routeCity}>{ride.to.name}</Text>
      </View>
    </View>

    {/* Footer chips */}
    <View style={s.rideFooter}>
      <MetaChip label={`📅 ${ride.date}`} />
      <MetaChip label={`🕐 ${ride.time}`} />
      <MetaChip label={`💺 ${ride.seatsAvailable} seats`} />

      {ride.driver.isVerified && (
        <View style={s.verifiedBadge}>
          <Text style={s.verifiedText}>✓ Verified</Text>
        </View>
      )}

      {ride.instantBook && (
        <View style={s.instantBadge}>
          <Text style={s.instantText}>⚡ Instant</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// ─── MetaChip ────────────────────────────────────────────────────────────────
const MetaChip = ({ label }) => (
  <View style={s.metaChip}>
    <Text style={s.metaChipText}>{label}</Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingTop: 8,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: C.bg,
  },
  greeting: {
    fontSize: F.sm,
    color: C.muted,
    fontWeight: '600',
    marginBottom: 3,
  },
  userName: {
    fontSize: F['3xl'],
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: F.lg,
    fontWeight: '800',
    color: C.bg,
    letterSpacing: -0.3,
  },

  /* Search Card */
  searchCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: C.white,
    borderRadius: R.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdown: {
    position: 'absolute',
    top: 52, // fieldBlock ki height ke hisaab se adjust karo
    left: 0,
    right: 0,
    backgroundColor: C.white,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  dropdownText: {
    fontSize: F.md,
    fontWeight: '500',
    color: C.inkLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 0,
  },
  connectorCol: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 0,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  connectorLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: C.border,
    marginVertical: 4,
    minHeight: 22,
  },
  inputsCol: {
    flex: 1,
  },
  fieldBlock: {
    paddingVertical: 6,
    position: 'relative',
  },
  fieldLabel: {
    fontSize: F.xs,
    fontWeight: '700',
    color: '#C0B8B0',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  fieldInput: {
    fontSize: F.md,
    fontWeight: '600',
    color: C.inkLight,
  },
  inputDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginVertical: 2,
  },
  searchBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBg,
    borderRadius: R.sm,
    paddingHorizontal: 14,
    height: 42,
    gap: 7,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateIcon: {
    fontSize: 14,
  },
  dateInput: {
    flex: 1,
    fontSize: F.sm + 1,
    fontWeight: '600',
    color: C.inkLight,
  },
  searchBtn: {
    backgroundColor: C.ink,
    borderRadius: R.sm,
    paddingHorizontal: 20,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    color: C.bg,
    fontSize: F.sm + 1,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 9,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: R.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: F.xl,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: F.xs,
    fontWeight: '600',
    color: '#B0A898',
    letterSpacing: 0.5,
  },

  /* Section */
  section: {
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: F.lg,
    fontWeight: '800',
    color: C.ink,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: F.sm,
    fontWeight: '600',
    color: '#A09270',
    marginBottom: 12,
  },

  /* Route Chips */
  routeChip: {
    backgroundColor: C.white,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: C.border,
    minWidth: 148,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  routeChipCities: {
    fontSize: F.sm + 1,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 5,
  },
  routeArrow: {
    color: '#C0B8B0',
    fontWeight: '500',
  },
  routeChipMeta: {
    fontSize: F.xs + 1,
    color: '#B0A898',
    fontWeight: '500',
    marginBottom: 4,
  },
  routeChipPrice: {
    fontSize: F.sm,
    fontWeight: '700',
    color: C.green,
    backgroundColor: C.greenBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    overflow: 'hidden',
  },

  /* Ride Card */
  rideCard: {
    backgroundColor: C.white,
    borderRadius: R.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rideTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  driverAvatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8E2D8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  driverAvatarInitial: {
    fontSize: F.xl,
    fontWeight: '800',
    color: '#6A6058',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: F.md,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    color: C.star,
    fontSize: F.sm,
  },
  ratingText: {
    fontSize: F.sm,
    fontWeight: '700',
    color: C.ink,
  },
  ratingDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D0C8BE',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: F['2xl'],
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.5,
  },
  priceSub: {
    fontSize: F.xs,
    fontWeight: '600',
    color: '#B0A898',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* Route Row */
  cardDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeDotSm: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeCity: {
    fontSize: F.md,
    fontWeight: '700',
    color: C.ink,
  },
  dashRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  dash: {
    width: 6,
    height: 1.5,
    backgroundColor: C.border,
    borderRadius: 1,
  },

  /* Ride Footer */
  rideFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    backgroundColor: C.inputBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  metaChipText: {
    fontSize: F.xs + 1,
    fontWeight: '500',
    color: C.inkLight,
  },
  verifiedBadge: {
    backgroundColor: C.greenBg,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.greenBorder,
  },
  verifiedText: {
    fontSize: F.xs + 1,
    fontWeight: '700',
    color: C.greenText,
  },
  instantBadge: {
    backgroundColor: '#FFF8EC',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FAEACB',
  },
  instantText: {
    fontSize: F.xs + 1,
    fontWeight: '700',
    color: '#B07D1A',
  },
});

export default HomeScreen;
