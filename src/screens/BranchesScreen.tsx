import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BranchGeofence } from '../types';
import { calculateDistanceMeters } from '../services/geofenceService';

interface Props {
  branches: BranchGeofence[];
  userLat: number;
  userLon: number;
  onSelectBranchLocation: (lat: number, lon: number) => void;
}

export const BranchesScreen: React.FC<Props> = ({
  branches,
  userLat,
  userLon,
  onSelectBranchLocation
}) => {
  const renderItem = ({ item }: { item: BranchGeofence }) => {
    const dist = calculateDistanceMeters(userLat, userLon, item.latitude, item.longitude);
    const radius = item.geofenceRadiusMeters || 60;
    const isInside = dist <= radius;

    return (
      <View style={[styles.branchCard, isInside && styles.branchCardInside]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.branchName}>{item.branchName}</Text>
            <Text style={styles.addressText}>{item.address || 'Yangon, Myanmar'}</Text>
          </View>
          <View style={[styles.rangeBadge, isInside ? styles.rangeInside : styles.rangeOutside]}>
            <Text style={[styles.rangeBadgeText, isInside ? styles.rangeTextInside : styles.rangeTextOutside]}>
              {isInside ? '● In Range' : `${dist < 1000 ? `${dist}m` : `${(dist / 1000).toFixed(1)}km`}`}
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.coordText}>GPS: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
          <Text style={styles.radiusText}>Geofence Radius: {radius} meters</Text>
        </View>

        <TouchableOpacity
          style={styles.moveBtn}
          onPress={() => onSelectBranchLocation(item.latitude, item.longitude)}
        >
          <Text style={styles.moveBtnText}>📍 ရုံထဲသို့ တည်နေရာရွှေ့မည် (Move GPS)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>အားကစားရုံခွဲများနှင့် Geofence</Text>
        <Text style={styles.branchCount}>{branches.length} Branches</Text>
      </View>

      <FlatList
        data={branches}
        keyExtractor={(item) => item.branchId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  branchCount: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12
  },
  listContainer: {
    paddingBottom: 30,
    gap: 12
  },
  branchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16
  },
  branchCardInside: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.05)'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  branchName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  addressText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginTop: 2
  },
  rangeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  rangeInside: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)'
  },
  rangeOutside: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)'
  },
  rangeBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  rangeTextInside: {
    color: '#22c55e'
  },
  rangeTextOutside: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12
  },
  coordText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
    fontSize: 10
  },
  radiusText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  moveBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  moveBtnText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700'
  }
});
