import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { WorkoutTimer } from '../components/WorkoutTimer';
import {
  BranchGeofence,
  ActiveSession,
  MemberProfile,
  GeofenceCheckInResult
} from '../types';
import { submitGeofenceCheckIn, submitGeofenceCheckOut } from '../services/api';
import {
  calculateDistanceMeters,
  getCurrentDeviceLocation,
  requestLocationPermissions
} from '../services/geofenceService';

interface Props {
  member: MemberProfile | null;
  activeSession: ActiveSession | null;
  branches: BranchGeofence[];
  userLat: number;
  userLon: number;
  setUserLocation: (lat: number, lon: number) => void;
  onRefreshData: () => Promise<void>;
}

export const WorkoutScreen: React.FC<Props> = ({
  member,
  activeSession,
  branches,
  userLat,
  userLon,
  setUserLocation,
  onRefreshData
}) => {
  const [loadingAction, setLoadingAction] = useState(false);
  const [celebrationResult, setCelebrationResult] = useState<GeofenceCheckInResult | null>(null);

  // Find nearest branch and compute distance
  let nearestBranch: BranchGeofence | null = null;
  let nearestDistance = Infinity;

  for (const b of branches) {
    const dist = calculateDistanceMeters(userLat, userLon, b.latitude, b.longitude);
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearestBranch = b;
    }
  }

  const radius = nearestBranch?.geofenceRadiusMeters || 60;
  const isInsideGeofence = nearestDistance <= radius;

  // Handlers
  const handleCheckIn = async () => {
    if (!member) return;
    setLoadingAction(true);
    try {
      const res = await submitGeofenceCheckIn(
        member.memberCode,
        userLat,
        userLon,
        nearestBranch?.branchId
      );
      if (res.success) {
        Alert.alert('✅ အောင်မြင်ပါသည်', res.message);
        await onRefreshData();
      } else {
        Alert.alert('❌ သတိပေးချက်', res.message);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Check-in failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCheckOut = async () => {
    if (!member) return;
    setLoadingAction(true);
    try {
      const res = await submitGeofenceCheckOut(
        member.memberCode,
        userLat,
        userLon,
        nearestBranch?.branchId
      );
      if (res.success) {
        setCelebrationResult(res);
        await onRefreshData();
      } else {
        Alert.alert('❌ သတိပေးချက်', res.message);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Check-out failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleFetchDeviceGps = async () => {
    const granted = await requestLocationPermissions();
    if (!granted) {
      Alert.alert('Permission Denied', 'Location permission is required for real GPS.');
      return;
    }
    const loc = await getCurrentDeviceLocation();
    if (loc) {
      setUserLocation(loc.latitude, loc.longitude);
      Alert.alert('GPS Updated', `Lat: ${loc.latitude.toFixed(4)}, Lon: ${loc.longitude.toFixed(4)}`);
    } else {
      Alert.alert('GPS Error', 'Could not get location coordinates.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Geofence Radar Card */}
      <View style={styles.radarCard}>
        <View style={styles.radarHeader}>
          <Text style={styles.radarBadgeText}>📡 GPS GEOFENCE RADAR</Text>
          <View style={[styles.statusBadge, { backgroundColor: isInsideGeofence ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)' }]}>
            <Text style={[styles.statusText, { color: isInsideGeofence ? '#22c55e' : '#eab308' }]}>
              {isInsideGeofence ? '● Geofence အတွင်း' : '○ Geofence ပြင်ပ'}
            </Text>
          </View>
        </View>

        {/* Circular Radar Visualizer */}
        <View style={styles.radarVisualizer}>
          <View style={[styles.radarRing, styles.ring3]} />
          <View style={[styles.radarRing, styles.ring2]} />
          <View style={[styles.radarRing, styles.ring1]} />
          <Text style={{ fontSize: 28 }}>{isInsideGeofence ? '🟢' : '📍'}</Text>
        </View>

        {/* Distance Info */}
        <Text style={styles.nearestBranchName}>{nearestBranch?.branchName || 'Downtown HQ'}</Text>
        <Text style={styles.distanceText}>
          အကွာအဝေး: {nearestDistance < 1000 ? `${nearestDistance} m` : `${(nearestDistance / 1000).toFixed(2)} km`}
          <Text style={styles.radiusSubtext}> (Radius: {radius}m)</Text>
        </Text>

        {/* Coordinate details */}
        <View style={styles.coordBox}>
          <Text style={styles.coordText}>User GPS: {userLat.toFixed(4)}, {userLon.toFixed(4)}</Text>
          <Text style={styles.coordText}>
            Branch GPS: {(nearestBranch?.latitude || 16.7794).toFixed(4)}, {(nearestBranch?.longitude || 96.1557).toFixed(4)}
          </Text>
        </View>

        {/* Location Simulator Quick Buttons */}
        <View style={styles.simButtonsContainer}>
          <Text style={styles.simTitle}>တည်နေရာ စမ်းသပ်ရန် (Simulate GPS):</Text>
          <View style={styles.simRow}>
            <TouchableOpacity
              style={[styles.simBtn, Math.abs(userLat - 16.7794) < 0.001 && styles.simBtnActive]}
              onPress={() => setUserLocation(16.7794, 96.1557)}
            >
              <Text style={styles.simBtnText}>🏢 Downtown (0m)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simBtn, Math.abs(userLat - 16.8276) < 0.001 && styles.simBtnActive]}
              onPress={() => setUserLocation(16.8276, 96.1306)}
            >
              <Text style={styles.simBtnText}>🏢 Hledan (0m)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simBtn, Math.abs(userLat - 16.835) < 0.001 && styles.simBtnActive]}
              onPress={() => setUserLocation(16.835, 96.15)}
            >
              <Text style={styles.simBtnText}>🌳 Inya Lake (6km)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simBtnGps} onPress={handleFetchDeviceGps}>
              <Text style={styles.simBtnGpsText}>📱 Real GPS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Check-In Button (When NOT in active session) */}
        {!activeSession && (
          <TouchableOpacity
            style={[styles.checkInBtn, !isInsideGeofence && styles.checkInBtnDisabled]}
            disabled={!isInsideGeofence || loadingAction}
            onPress={handleCheckIn}
          >
            {loadingAction ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.checkInBtnText}>
                {isInsideGeofence
                  ? '⚡ Gym သို့ အလိုအလျောက် ဝင်မည် (Auto Check-In)'
                  : `Gym သို့ မရောက်သေးပါ (${nearestDistance}m အကွာ)`}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Active Workout Stopwatch Section */}
      {activeSession && (
        <View style={styles.activeSessionWrapper}>
          <WorkoutTimer checkInTime={activeSession.checkInTime} />

          <TouchableOpacity
            style={styles.checkOutBtn}
            disabled={loadingAction}
            onPress={handleCheckOut}
          >
            {loadingAction ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.checkOutBtnText}>🛑 လေ့ကျင့်ခန်း ပြီးဆုံးမည် (Check-Out)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Celebration Modal */}
      <Modal visible={!!celebrationResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.modalTitle}>လေ့ကျင့်ခန်း ပြီးဆုံးပါပြီ!</Text>
            <Text style={styles.modalSubtitle}>Workout completed & logged.</Text>

            <View style={styles.durationBox}>
              <Text style={styles.durationLabel}>စုစုပေါင်း လေ့ကျင့်ချိန်</Text>
              <Text style={styles.durationBigText}>
                {celebrationResult?.formattedDuration || '45 mins'}
              </Text>
              <Text style={styles.durationCalText}>
                🔥 လောင်ကျွမ်း Calorie: {(celebrationResult?.workoutDurationMinutes || 45) * 7} kcal
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCelebrationResult(null)}
            >
              <Text style={styles.modalCloseBtnText}>ကျေးဇူးတင်ပါသည် (Done)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  radarCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 181, 0.25)',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16
  },
  radarBadgeText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  radarVisualizer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 181, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 240, 181, 0.25)'
  },
  ring1: { width: 50, height: 50 },
  ring2: { width: 90, height: 90 },
  ring3: { width: 130, height: 130 },
  nearestBranchName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6
  },
  distanceText: {
    color: '#00f0b5',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4
  },
  radiusSubtext: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11
  },
  coordBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginTop: 12
  },
  coordText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'monospace',
    fontSize: 10
  },
  simButtonsContainer: {
    width: '100%',
    marginTop: 14,
    marginBottom: 8
  },
  simTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginBottom: 6
  },
  simRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  simBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  simBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e'
  },
  simBtnText: {
    color: '#ffffff',
    fontSize: 10
  },
  simBtnGps: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  simBtnGpsText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700'
  },
  checkInBtn: {
    backgroundColor: '#00f0b5',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12
  },
  checkInBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  checkInBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800'
  },
  activeSessionWrapper: {
    width: '100%',
    marginBottom: 16
  },
  checkOutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center'
  },
  checkOutBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  trophyIcon: {
    fontSize: 54,
    marginBottom: 10
  },
  modalTitle: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginBottom: 16
  },
  durationBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 18
  },
  durationLabel: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11
  },
  durationBigText: {
    color: '#eab308',
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginVertical: 4
  },
  durationCalText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700'
  },
  modalCloseBtn: {
    backgroundColor: '#22c55e',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center'
  },
  modalCloseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  }
});
