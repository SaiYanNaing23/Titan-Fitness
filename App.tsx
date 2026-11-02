import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { BranchesScreen } from './src/screens/BranchesScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import {
  MemberProfile,
  ActiveSession,
  CheckInLog,
  BranchGeofence
} from './src/types';
import {
  fetchMemberProfileAndSession,
  fetchGeofences,
  API_BASE_URL,
  setApiBaseUrl
} from './src/services/api';

type Tab = 'home' | 'workout' | 'history' | 'branches';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [memberCode, setMemberCode] = useState('MBR-00101');
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [history, setHistory] = useState<CheckInLog[]>([]);
  const [branches, setBranches] = useState<BranchGeofence[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Default coordinates: Downtown HQ (16.7794, 96.1557)
  const [userLat, setUserLat] = useState(16.7794);
  const [userLon, setUserLon] = useState(96.1557);

  // Settings Modal (Switch member / Server URL)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempMemberCode, setTempMemberCode] = useState(memberCode);
  const [tempApiUrl, setTempApiUrl] = useState(API_BASE_URL);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [memberData, geofencesData] = await Promise.all([
        fetchMemberProfileAndSession(memberCode),
        fetchGeofences()
      ]);

      if (memberData.success) {
        setMember(memberData.member);
        setActiveSession(memberData.activeSession);
        setHistory(memberData.history);
      }
      setBranches(geofencesData);
    } catch (err: any) {
      console.warn('Error loading mobile data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [memberCode]);

  const handleSaveSettings = () => {
    setMemberCode(tempMemberCode);
    setApiBaseUrl(tempApiUrl);
    setShowSettingsModal(false);
    Alert.alert('Settings Updated', `Member: ${tempMemberCode}\nAPI: ${tempApiUrl}`);
  };

  const handleSelectBranch = (lat: number, lon: number) => {
    setUserLat(lat);
    setUserLon(lon);
    setCurrentTab('workout');
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <LoginScreen
          onLoginSuccess={async (code) => {
            setMemberCode(code);
            setTempMemberCode(code);
            try {
              const [memberData, geofencesData] = await Promise.all([
                fetchMemberProfileAndSession(code),
                fetchGeofences()
              ]);
              if (memberData.success && memberData.member) {
                setMember(memberData.member);
                setActiveSession(memberData.activeSession);
                setHistory(memberData.history);
                setBranches(geofencesData);
                setIsLoggedIn(true);
              } else {
                Alert.alert('Member Not Found', 'No active membership found for this Member ID or phone number.');
              }
            } catch (err: any) {
              const detail = err instanceof Error ? err.message : String(err);
              Alert.alert('Connection Failed', `Server: ${API_BASE_URL}\n${detail}`);
            }
          }}
          onOpenSettings={() => {
            setTempMemberCode(memberCode);
            setTempApiUrl(API_BASE_URL);
            setShowSettingsModal(true);
          }}
        />

        {/* Settings Modal (Accessible from Login) */}
        <Modal visible={showSettingsModal} transparent animationType="slide">
          <View style={styles.settingsModalOverlay}>
            <View style={styles.settingsModalCard}>
              <Text style={styles.settingsTitle}>⚙️ Mobile App Configuration</Text>
              <Text style={styles.settingsSubtitle}>Switch testing member or API backend URL</Text>

              <Text style={styles.inputLabel}>Member Code or Phone:</Text>
              <TextInput
                style={styles.textInput}
                value={tempMemberCode}
                onChangeText={setTempMemberCode}
                placeholder="e.g. MBR-00101 or 095123456"
                placeholderTextColor="#64748b"
                autoCapitalize="characters"
              />

              <Text style={styles.inputLabel}>Backend API Base URL:</Text>
              <TextInput
                style={styles.textInput}
                value={tempApiUrl}
                onChangeText={setTempApiUrl}
                placeholder="http://192.168.15.96:5254/api/v1/mobile"
                placeholderTextColor="#64748b"
                autoCapitalize="none"
              />
              <Text style={styles.ipHint}>
                * Physical ဖုန်းဖြင့် စမ်းသပ်ပါက ကွန်ပျူတာ၏ WiFi IP ထည့်သွင်းပါ (e.g. http://192.168.120.68:5254/api/v1/mobile)
              </Text>

              <View style={styles.settingsBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowSettingsModal(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveSettings}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {member?.fullName ? member.fullName.charAt(0) : 'T'}
            </Text>
          </View>
          <View>
            <Text style={styles.greetingText}>မင်္ဂလာပါ 🙏</Text>
            <Text style={styles.headerName}>{member?.fullName || 'Ko Thant Zin'}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.statusPill, activeSession && styles.statusPillActive]}
            onPress={() => setCurrentTab('workout')}
          >
            <Text style={[styles.statusPillText, activeSession && styles.statusPillTextActive]}>
              {activeSession ? '🏃 In Workout' : '● Active'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsIconBtn}
            onPress={() => {
              setTempMemberCode(memberCode);
              setTempApiUrl(API_BASE_URL);
              setShowSettingsModal(true);
            }}
          >
            <Text style={{ fontSize: 16 }}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutIconBtn}
            onPress={() => {
              Alert.alert(
                'Log Out',
                'Are you sure you want to log out of your digital member pass?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                      setIsLoggedIn(false);
                      setMember(null);
                      setActiveSession(null);
                    }
                  }
                ]
              );
            }}
          >
            <Text style={{ fontSize: 15 }}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {currentTab === 'home' && (
          <HomeScreen
            member={member}
            activeSession={activeSession}
            history={history}
            onNavigateToWorkout={() => setCurrentTab('workout')}
            onRefresh={loadData}
            refreshing={refreshing}
          />
        )}

        {currentTab === 'workout' && (
          <WorkoutScreen
            member={member}
            activeSession={activeSession}
            branches={branches}
            userLat={userLat}
            userLon={userLon}
            setUserLocation={(lat, lon) => {
              setUserLat(lat);
              setUserLon(lon);
            }}
            onRefreshData={loadData}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            history={history}
            onRefresh={loadData}
            refreshing={refreshing}
          />
        )}

        {currentTab === 'branches' && (
          <BranchesScreen
            branches={branches}
            userLat={userLat}
            userLon={userLon}
            onSelectBranchLocation={handleSelectBranch}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('home')}
        >
          <Text style={[styles.navIcon, currentTab === 'home' && styles.navIconActive]}>
            🪪
          </Text>
          <Text style={[styles.navLabel, currentTab === 'home' && styles.navLabelActive]}>
            ကတ်ပြား
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('workout')}
        >
          <View style={{ position: 'relative' }}>
            <Text style={[styles.navIcon, currentTab === 'workout' && styles.navIconActive]}>
              ⏱
            </Text>
            {activeSession && <View style={styles.navDot} />}
          </View>
          <Text style={[styles.navLabel, currentTab === 'workout' && styles.navLabelActive]}>
            လေ့ကျင့်ခန်း
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('history')}
        >
          <Text style={[styles.navIcon, currentTab === 'history' && styles.navIconActive]}>
            📜
          </Text>
          <Text style={[styles.navLabel, currentTab === 'history' && styles.navLabelActive]}>
            မှတ်တမ်း
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('branches')}
        >
          <Text style={[styles.navIcon, currentTab === 'branches' && styles.navIconActive]}>
            🏢
          </Text>
          <Text style={[styles.navLabel, currentTab === 'branches' && styles.navLabelActive]}>
            ရုံခွဲများ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal (Switch Member or Server URL) */}
      <Modal visible={showSettingsModal} transparent animationType="slide">
        <View style={styles.settingsModalOverlay}>
          <View style={styles.settingsModalCard}>
            <Text style={styles.settingsTitle}>⚙️ Mobile App Configuration</Text>
            <Text style={styles.settingsSubtitle}>Switch testing member or API backend URL</Text>

            <Text style={styles.inputLabel}>Member Code or Phone:</Text>
            <TextInput
              style={styles.textInput}
              value={tempMemberCode}
              onChangeText={setTempMemberCode}
              placeholder="e.g. MBR-00101 or 095123456"
              placeholderTextColor="#64748b"
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Backend API Base URL:</Text>
            <TextInput
              style={styles.textInput}
              value={tempApiUrl}
              onChangeText={setTempApiUrl}
              placeholder="http://192.168.1.xxx:5254/api/v1/mobile"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
            />
            <Text style={styles.ipHint}>
              * Physical ဖုန်းဖြင့် စမ်းသပ်ပါက ကွန်ပျူတာ၏ WiFi IP ထည့်သွင်းပါ (e.g. http://192.168.1.5:5254/api/v1/mobile)
            </Text>

            <View style={styles.settingsBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveSettings}
              >
                <Text style={styles.saveBtnText}>Save & Reload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00f0b5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800'
  },
  greetingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11
  },
  headerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)'
  },
  statusPillActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444'
  },
  statusPillText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700'
  },
  statusPillTextActive: {
    color: '#ef4444'
  },
  settingsIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutIconBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.5
  },
  navIconActive: {
    opacity: 1
  },
  navLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2
  },
  navLabelActive: {
    color: '#00f0b5',
    fontWeight: '700'
  },
  navDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#0f172a'
  },
  settingsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20
  },
  settingsModalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  settingsTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
  },
  settingsSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginBottom: 16
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginBottom: 4,
    marginTop: 8
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontFamily: 'monospace',
    fontSize: 13
  },
  ipHint: {
    color: '#38bdf8',
    fontSize: 10,
    marginTop: 6,
    lineHeight: 14
  },
  settingsBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  cancelBtnText: {
    color: '#ffffff',
    fontSize: 13
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#00f0b5'
  },
  saveBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800'
  }
});
