// AppNavigator.js - Simplified with useState (no AsyncStorage)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screen Imports
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen.js';
import OTPScreen from '../screens/auth/OTPScreen';

import HomeScreen from '../screens/main/HomeScreen';
import SearchResultsScreen from '../screens/main/SearchResultsScreen';
import RideDetailsScreen from '../screens/main/RideDetailsScreen';
import BookingConfirmScreen from '../screens/main/BookingConfirmScreen';
import BookingSuccessScreen from '../screens/main/BookingSuccessScreen.js';

import MyRidesScreen from '../screens/main/MyRidesScreen.js';
import RideTrackingScreen from '../screens/main/RideTrackingScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen.js';
import ProfileScreen from '../screens/main/ProfileScreen.js';
import { KeyboardAvoidingView } from 'react-native'; 
import { Keyboard } from 'react-native';
import { useEffect } from 'react';
import OfferRideScreen from '../screens/driver/OfferRideScreen';

// ─── Design Tokens (matching HomeScreen) ─────────────────────────────────────
const C = {
  bg:       '#F6F4EF',   // page background
  white:    '#FFFFFF',   // tab bar surface
  ink:      '#1A1814',   // active icon / label / dot
  muted:    '#C5BFB8',   // inactive icon / label
  border:   '#EBE7E0',   // top border
};

// ─── Navigators ──────────────────────────────────────────────────────────────
const RootStack  = createNativeStackNavigator();
const AuthStack  = createNativeStackNavigator();
const MainStack  = createNativeStackNavigator();
const Tab        = createBottomTabNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login"    component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="OTP"      component={OTPScreen} />
  </AuthStack.Navigator>
);

// ─── Tab config ──────────────────────────────────────────────────────────────
const TAB_ITEMS = [
  {
    name: 'Home',
    label: 'Home',
    icon: 'home-outline',
    iconActive: 'home',
    isCenter: false,
  },
  {
    name: 'MyRides',
    label: 'My Rides',
    icon: 'car-outline',
    iconActive: 'car',
    isCenter: false,
  },
  {
    name: 'Offer',
    label: '',
    icon: 'add',
    iconActive: 'add',
    isCenter: true,
  },
  {
    name: 'Notifications',
    label: 'Alerts',
    icon: 'notifications-outline',
    iconActive: 'notifications',
    isCenter: false,
  },
  {
    name: 'Profile',
    label: 'Profile',
    icon: 'person-outline',
    iconActive: 'person',
    isCenter: false,
  },
];

const CustomTabBar = ({ state, navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={s.tabBar}>
      {TAB_ITEMS.map((tab, index) => {
        const route = state.routes[index];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (tab.isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={s.tabCenterWrapper}
              activeOpacity={0.85}
            >
              <View style={s.tabCenterCircle}>
                <Ionicons name="add" size={24} color={C.bg} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={s.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? tab.iconActive : tab.icon}
              size={22}
              color={isFocused ? C.ink : C.muted}
            />
            <Text style={[s.tabLabel, isFocused && s.tabLabelActive]}>
              {tab.label}
            </Text>
            {isFocused && <View style={s.tabDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Tab Navigator ────────────────────────────────────────────────────────────
const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}  >
    <Tab.Screen name="Home"          component={HomeScreen} />
    <Tab.Screen name="MyRides"       component={MyRidesScreen} />
    <Tab.Screen name="Offer"         component={OfferRideScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    {/* Profile tab — add ProfileScreen import when ready */}
    <Tab.Screen name="Profile"       component={ProfileScreen} />
  </Tab.Navigator>
);

// ─── Main Navigator ───────────────────────────────────────────────────────────
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs"           component={TabNavigator} />
    <MainStack.Screen name="SearchResults"  component={SearchResultsScreen} />
    <MainStack.Screen name="RideDetails"    component={RideDetailsScreen} />
    <MainStack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
    <MainStack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    <MainStack.Screen name="RideTracking"   component={RideTrackingScreen} />
  </MainStack.Navigator>
);

// ─── Root App Navigator ───────────────────────────────────────────────────────
const AppNavigator = () => {
  const [appState, setAppState] = useState({
    hasSeenOnboarding: false,
    isLoggedIn: false,
    isSplashVisible: true,
  });

  const completeOnboarding = () =>
    setAppState(prev => ({ ...prev, hasSeenOnboarding: true }));

  const login  = () => setAppState(prev => ({ ...prev, isLoggedIn: true  }));
  const logout = () => setAppState(prev => ({ ...prev, isLoggedIn: false }));

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <RootStack.Screen name="Splash"     component={SplashScreen} />
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="Auth"       component={AuthNavigator} />
        <RootStack.Screen name="Main"       component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// ─── Screen Name Constants ────────────────────────────────────────────────────
export const SCREENS = {
  SPLASH:          'Splash',
  ONBOARDING:      'Onboarding',
  AUTH:            'Auth',
  LOGIN:           'Login',
  REGISTER:        'Register',
  OTP:             'OTP',
  MAIN:            'Main',
  TABS:            'Tabs',
  HOME:            'Home',
  SEARCH_RESULTS:  'SearchResults',
  RIDE_DETAILS:    'RideDetails',
  BOOKING_CONFIRM: 'BookingConfirm',
  BOOKING_SUCCESS: 'BookingSuccess',
  MY_RIDES:        'MyRides',
  RIDE_TRACKING:   'RideTracking',
  OFFER_RIDE:      'Offer',
  NOTIFICATIONS:   'Notifications',
  PROFILE:         'Profile',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  /* Tab bar container */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    height: 72,
    paddingBottom: 10,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: C.border,
    alignItems: 'flex-end',
  },

  /* Regular tab item */
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 3,
    minHeight: 48,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.muted,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: C.ink,
  },

  /* Active indicator dot */
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.ink,
    marginTop: 1,
  },

  /* Centre "+" button */
  tabCenterWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  tabCenterCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.ink,          // solid charcoal — matches UI
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
});