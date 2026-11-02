import { BranchGeofence, GeofenceCheckInResult, MemberProfile, ActiveSession, CheckInLog } from '../types';

// Default to backend API port 5254
// When testing on Android Emulator: use 'http://10.0.2.2:5254'
// When testing on Physical device: use your laptop's WiFi IP e.g. 'http://192.168.1.xxx:5254'
// When testing on iOS Simulator / Web: use 'http://localhost:5254'
export let API_BASE_URL = 'http://192.168.120.68:5254/api/v1/mobile';

export const setApiBaseUrl = (newUrl: string) => {
  API_BASE_URL = newUrl.replace(/\/+$/, '');
};

export interface MemberApiResponse {
  success: boolean;
  member: MemberProfile;
  activeSession: ActiveSession | null;
  history: CheckInLog[];
  message?: string;
}

export const fetchMemberProfileAndSession = async (memberCodeOrPhone: string): Promise<MemberApiResponse> => {
  const url = `${API_BASE_URL}/members/${encodeURIComponent(memberCodeOrPhone)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch member details: HTTP ${response.status}`);
  }
  return await response.json();
};

export const fetchGeofences = async (): Promise<BranchGeofence[]> => {
  const url = `${API_BASE_URL}/geofences`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch geofences: HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.data || [];
};

export const submitGeofenceCheckIn = async (
  memberCodeOrPhone: string,
  latitude: number,
  longitude: number,
  targetBranchId?: number
): Promise<GeofenceCheckInResult> => {
  const url = `${API_BASE_URL}/geofence/check-in`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberCodeOrPhone,
      latitude,
      longitude,
      targetBranchId
    })
  });
  return await response.json();
};

export const submitGeofenceCheckOut = async (
  memberCodeOrPhone: string,
  latitude: number,
  longitude: number,
  targetBranchId?: number
): Promise<GeofenceCheckInResult> => {
  const url = `${API_BASE_URL}/geofence/check-out`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberCodeOrPhone,
      latitude,
      longitude,
      targetBranchId
    })
  });
  return await response.json();
};
