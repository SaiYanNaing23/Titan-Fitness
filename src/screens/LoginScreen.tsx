import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';

interface Props {
  onLoginSuccess: (memberCode: string) => Promise<void>;
  onOpenSettings: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess, onOpenSettings }) => {
  const [memberInput, setMemberInput] = useState('MBR-00101');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (codeToUse?: string) => {
    const code = (codeToUse || memberInput).trim();
    if (!code) {
      setErrorMessage('Please enter your Member ID or Phone number.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      await onLoginSuccess(code);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoMember = (code: string) => {
    setMemberInput(code);
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Setting Gear */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Emblem & Header */}
        <View style={styles.brandContainer}>
          <View style={styles.emblemCircle}>
            <Text style={styles.emblemIcon}>⚡</Text>
          </View>
          <Text style={styles.brandTitle}>TITAN FITNESS</Text>
          <Text style={styles.brandSubtitle}>MEMBER DIGITAL PASS &amp; WORKOUT</Text>
        </View>

        {/* Login Surface Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Member Sign In</Text>
          <Text style={styles.cardSub}>
            Enter your gym Member ID or registered phone number to open your digital pass.
          </Text>

          {!!errorMessage && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>MEMBER ID / PHONE</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🪪</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. MBR-00101 or 09..."
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                value={memberInput}
                onChangeText={(val) => {
                  setMemberInput(val);
                  setErrorMessage('');
                }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            disabled={loading}
            onPress={() => handleLogin()}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.loginBtnText}>Open Digital Pass →</Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Member Chips */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>QUICK DEMO MEMBERS</Text>
            <View style={styles.demoChips}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  memberInput === 'MBR-00101' && styles.chipActive
                ]}
                onPress={() => selectDemoMember('MBR-00101')}
              >
                <Text style={styles.chipText}>MBR-00101 (Ko Thant Zin)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chip,
                  memberInput === 'MBR-00102' && styles.chipActive
                ]}
                onPress={() => selectDemoMember('MBR-00102')}
              >
                <Text style={styles.chipText}>MBR-00102 (Daw Hla Hla)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Secured with Geofence Attendance &amp; QR Pass
          </Text>
          <Text style={styles.footerSubText}>
            Titan Fitness Club • Member Mobile Portal
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 8
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28
  },
  emblemCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 240, 181, 0.12)',
    borderWidth: 2,
    borderColor: '#00f0b5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#00f0b5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  },
  emblemIcon: {
    fontSize: 28
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4
  },
  brandSubtitle: {
    color: '#00f0b5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 22,
    marginBottom: 24
  },
  cardHeader: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  cardSub: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 18
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14
  },
  errorText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600'
  },
  inputContainer: {
    marginBottom: 18
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 12
  },
  loginBtn: {
    backgroundColor: '#00f0b5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f0b5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  loginBtnDisabled: {
    opacity: 0.6
  },
  loginBtnText: {
    color: '#041f17',
    fontSize: 15,
    fontWeight: '800'
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)'
  },
  demoTitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8
  },
  demoChips: {
    flexDirection: 'column',
    gap: 8
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  chipActive: {
    borderColor: '#00f0b5',
    backgroundColor: 'rgba(0, 240, 181, 0.08)'
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600'
  },
  footer: {
    alignItems: 'center'
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2
  },
  footerSubText: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 10
  }
});
