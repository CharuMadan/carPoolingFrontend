// ============================================================
//  POOLRIDE — Register Screen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const isValid = form.name.length > 1 && form.email.includes('@') && form.phone.length === 10;

  const handleRegister = () => {
    if (!isValid) return;
    // 🔧 Replace with API call
    navigation.navigate('OTP', { phone: form.phone, isNew: true });
  };

  return (
    <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join thousands of happy poolers 🚗</Text>
          </View>

          <View style={styles.card}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Arjun Sharma', keyboard: 'default', emoji: '👤' },
              { key: 'email', label: 'Email', placeholder: 'arjun@email.com', keyboard: 'email-address', emoji: '✉️' },
              { key: 'phone', label: 'Phone Number', placeholder: '98765 43210', keyboard: 'phone-pad', emoji: '📱' },
            ].map(({ key, label, placeholder, keyboard, emoji }) => (
              <View key={key} style={styles.fieldWrap}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.emoji}>{emoji}</Text>
                  <TextInput
                    style={styles.input}
                    value={form[key]}
                    onChangeText={(v) => update(key, key === 'phone' ? v.replace(/\D/g, '').slice(0, 10) : v)}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType={keyboard}
                    autoCapitalize={key === 'name' ? 'words' : 'none'}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.btn, !isValid && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={!isValid}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isValid ? COLORS.gradientPrimary : ['#333', '#444']}
                style={styles.btnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>Create Account →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By registering, you agree to our{' '}
              <Text style={{ color: COLORS.primary }}>Terms of Service</Text> and{' '}
              <Text style={{ color: COLORS.primary }}>Privacy Policy</Text>
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: SIZES.screenPadding, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: SPACING.xl },
  backText: { color: COLORS.primary, fontSize: FONTS.md },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONTS['4xl'], color: COLORS.textPrimary, fontFamily: FONTS.extraBold, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONTS.md, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.surfaceElevated, borderRadius: SIZES.borderRadiusLg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.surfaceBorder, ...SHADOWS.medium },
  fieldWrap: { marginBottom: SPACING.lg },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontFamily: FONTS.medium },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: SIZES.borderRadius, borderWidth: 1, borderColor: COLORS.surfaceBorder, paddingHorizontal: SPACING.md },
  emoji: { fontSize: 18, marginRight: SPACING.sm },
  input: { flex: 1, height: SIZES.inputHeight, color: COLORS.textPrimary, fontSize: FONTS.md },
  btn: { borderRadius: SIZES.borderRadius, overflow: 'hidden', marginTop: SPACING.sm, marginBottom: SPACING.md },
  btnDisabled: { opacity: 0.5 },
  btnGradient: { height: SIZES.buttonHeight, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: COLORS.white, fontSize: FONTS.lg, fontFamily: FONTS.bold },
  terms: { fontSize: FONTS.xs, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.md },
  footerLink: { color: COLORS.primary, fontSize: FONTS.md, fontFamily: FONTS.bold },
});

export default RegisterScreen;