import * as Location from 'expo-location';
import { BranchGeofence } from '../types';

export const calculateDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export interface NearestBranchInfo {
  branch: BranchGeofence | null;
  distanceMeters: number;
  isInside: boolean;
}

export const getNearestBranch = (
  userLat: number,
  userLon: number,
  branches: BranchGeofence[]
): NearestBranchInfo => {
  if (!branches || branches.length === 0) {
    return { branch: null, distanceMeters: 0, isInside: false };
  }

  let minDistance = Infinity;
  let closest: BranchGeofence | null = null;

  for (const b of branches) {
    const dist = calculateDistanceMeters(userLat, userLon, b.latitude, b.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = b;
    }
  }

  const radius = closest?.geofenceRadiusMeters || 60;
  return {
    branch: closest,
    distanceMeters: minDistance,
    isInside: minDistance <= radius
  };
};

export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      return false;
    }

    // Optional Background Permission for automatic background check-in
    try {
      await Location.requestBackgroundPermissionsAsync();
    } catch (e) {
      console.log('Background permission request optional or skipped:', e);
    }

    return true;
  } catch (error) {
    console.warn('Location permission error:', error);
    return false;
  }
};

export const getCurrentDeviceLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  } catch (error) {
    console.warn('Failed to obtain device GPS coordinates:', error);
    return null;
  }
};
