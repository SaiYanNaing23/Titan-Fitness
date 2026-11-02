import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MemberProfile } from '../types';

interface Props {
  member: MemberProfile | null;
}

export const DigitalCard: React.FC<Props> = ({ member }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.brandLightning}>⚡</Text>
          <Text style={styles.brandText}>TITAN FITNESS</Text>
        </View>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>
            {member?.currentPlanName || 'VIP ALL-ACCESS'}
          </Text>
        </View>
      </View>

      {/* Member Details */}
      <View style={styles.memberSection}>
        <Text style={styles.label}>MEMBER NAME</Text>
        <Text style={styles.memberName}>{member?.fullName || 'Ko Thant Zin'}</Text>
        <Text style={styles.memberCode}>{member?.memberCode || 'MBR-00101'}</Text>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.smallLabel}>HOME BRANCH</Text>
          <Text style={styles.footerValue}>{member?.homeBranchName || 'Downtown HQ'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.smallLabel}>VALID UNTIL</Text>
          <Text style={styles.footerValue}>
            {member?.subscriptionEndDate
              ? new Date(member.subscriptionEndDate).toLocaleDateString()
              : 'Active'}
            <Text style={styles.daysLeft}> ({member?.daysRemaining ?? 30} days left)</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandLightning: {
    fontSize: 18,
    color: '#eab308'
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5
  },
  planBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  planBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '700'
  },
  memberSection: {
    marginBottom: 18
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2
  },
  memberName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  memberCode: {
    color: '#00f0b5',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 2
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12
  },
  smallLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  footerValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  daysLeft: {
    color: '#38bdf8',
    fontSize: 11
  }
});
