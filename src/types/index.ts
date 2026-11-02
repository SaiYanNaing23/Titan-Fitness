export interface MemberProfile {
  id: number;
  tenantId: number;
  branchId?: number;
  homeBranchName: string;
  memberCode: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  gender?: string | null;
  photoUrl?: string | null;
  status: number;
  currentPlanName: string;
  subscriptionEndDate?: string | null;
  daysRemaining: number;
  isExpiringSoon?: boolean;
  isOverdue?: boolean;
}

export interface BranchGeofence {
  branchId: number;
  branchName: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  address?: string;
  phoneNumber?: string;
}

export interface ActiveSession {
  id: number;
  branchId: number;
  branchName: string;
  checkInTime: string;
  method: string;
}

export interface CheckInLog {
  id: number;
  checkInTime: string;
  checkOutTime?: string | null;
  branchName: string;
  status: string;
  method: string;
  distanceMeters?: number | null;
  durationMinutes: number;
}

export interface GeofenceCheckInResult {
  success: boolean;
  message: string;
  member?: MemberProfile;
  branchId?: number;
  branchName?: string;
  distanceMeters?: number;
  allowedRadiusMeters?: number;
  insideGeofence?: boolean;
  timestamp?: string;
  isCheckOut?: boolean;
  workoutDurationMinutes?: number;
  formattedDuration?: string;
}
