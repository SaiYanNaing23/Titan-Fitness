import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { DigitalCard } from '../components/DigitalCard';
import { MemberProfile, ActiveSession, CheckInLog } from '../types';

interface Props {
  member: MemberProfile | null;
  activeSession: ActiveSession | null;
  history: CheckInLog[];
  onNavigateToWorkout: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const HomeScreen: React.FC<Props> = ({
  member,
  activeSession,
  history,
  onNavigateToWorkout,
  onRefresh,
  refreshing
}) => {
  const totalHours = Math.floor(
    history.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) / 60
  );

  const avgMinutes =
    history.length > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) /
            history.length
        )
      : 45;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00f0b5" />}
    >
      {/* Digital Member Card */}
      <DigitalCard member={member} />

      {/* Turnstile Digital Pass */}
      <View style={styles.qrPassContainer}>
        <View style={styles.qrHeader}>
          <Text style={styles.qrTitle}>DIGITAL TURNSTILE PASS</Text>
          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>● Ready to Scan</Text>
          </View>
        </View>

        {/* QR Code Mockup Frame */}
        <View style={styles.qrBox}>
          <Text style={styles.qrIcon}>📱</Text>
          <Text style={styles.qrSubtext}>Scan at Kiosk</Text>
        </View>
        <Text style={styles.memberCodeText}>{member?.memberCode || 'MBR-00101'}</Text>
        <Text style={styles.qrHint}>
          Turnstile Kiosk Scanner တွင် တိုက်ရိုက်ပြသပြီး ဝင်ရောက်နိုင်ပါသည်
        </Text>
      </View>

      {/* Active Workout Alert Banner */}
      {activeSession ? (
        <TouchableOpacity style={styles.activeWorkoutBanner} onPress={onNavigateToWorkout}>
          <View style={styles.bannerHeader}>
            <View style={styles.pulsingDot} />
            <Text style={styles.bannerTitle}>လက်ရှိ လေ့ကျင့်နေဆဲ (ACTIVE)</Text>
          </View>
          <Text style={styles.bannerSubtitle}>{activeSession.branchName}</Text>
          <Text style={styles.bannerAction}>လေ့ကျင့်ချိန် ကြည့်ရန် / အပြင်ထွက်မည် →</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.gpsBanner} onPress={onNavigateToWorkout}>
          <View style={styles.gpsIconCircle}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.gpsBannerTitle}>GPS Geofence Auto Check-In</Text>
            <Text style={styles.gpsBannerSubtitle}>Gym အနီးရောက်လျှင် Auto Check-In ဝင်ပါ</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      )}

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{history.length}</Text>
          <Text style={styles.statLabel}>စုစုပေါင်းအကြိမ်</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#eab308' }]}>{totalHours} h</Text>
          <Text style={styles.statLabel}>လေ့ကျင့်ချိန်ပေါင်း</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#22c55e' }]}>{avgMinutes}m</Text>
          <Text style={styles.statLabel}>ပျမ်းမျှချိန်</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40
  },
  qrPassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12
  },
  qrTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  readyBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  readyText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700'
  },
  qrBox: {
    width: 140,
    height: 140,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  qrIcon: {
    fontSize: 48
  },
  qrSubtext: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4
  },
  memberCodeText: {
    color: '#00f0b5',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4
  },
  qrHint: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6
  },
  activeWorkoutBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444'
  },
  bannerTitle: {
    color: '#ef4444',
    fontWeight: '800',
    fontSize: 13
  },
  bannerSubtitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  bannerAction: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: '600'
  },
  gpsBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  gpsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 240, 181, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gpsBannerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  gpsBannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    marginTop: 2
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  statNumber: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10
  }
});
