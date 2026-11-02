import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { CheckInLog } from '../types';

interface Props {
  history: CheckInLog[];
  onRefresh: () => void;
  refreshing: boolean;
}

export const HistoryScreen: React.FC<Props> = ({ history, onRefresh, refreshing }) => {
  const renderItem = ({ item }: { item: CheckInLog }) => {
    const isGps = item.method === 'GeofenceAuto';
    const checkInDate = new Date(item.checkInTime);
    const dateFormatted = checkInDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    });

    const checkInTimeFormatted = checkInDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const checkOutTimeFormatted = item.checkOutTime
      ? new Date(item.checkOutTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : null;

    const mins = item.durationMinutes || 0;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const durationText = hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;

    return (
      <View style={styles.historyCard}>
        <View style={styles.cardTopRow}>
          <View>
            <Text style={styles.branchName}>{item.branchName || 'Downtown HQ'}</Text>
            <Text style={styles.dateText}>{dateFormatted}</Text>
          </View>
          <View style={[styles.methodBadge, isGps ? styles.gpsBadge : styles.scanBadge]}>
            <Text style={[styles.methodText, isGps ? styles.gpsText : styles.scanText]}>
              {isGps ? '📍 GPS Auto' : '📱 Kiosk Scan'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottomRow}>
          <Text style={styles.timeRange}>
            {checkInTimeFormatted} {checkOutTimeFormatted ? `→ ${checkOutTimeFormatted}` : '(In Workout)'}
          </Text>

          {item.checkOutTime ? (
            <View style={styles.durationBadge}>
              <Text style={styles.durationBadgeText}>⏱ {durationText}</Text>
            </View>
          ) : (
            <View style={styles.inWorkoutBadge}>
              <Text style={styles.inWorkoutText}>In Workout</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>လေ့ကျင့်မှု မှတ်တမ်းများ</Text>
        <Text style={styles.historyCount}>{history.length} ကြိမ်</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>📋</Text>
          <Text style={styles.emptyText}>လေ့ကျင့်မှု မှတ်တမ်း မရှိသေးပါ</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00f0b5" />}
        />
      )}
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
  historyCount: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12
  },
  listContainer: {
    paddingBottom: 30,
    gap: 10
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  branchName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginTop: 2
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1
  },
  gpsBadge: {
    backgroundColor: 'rgba(0, 240, 181, 0.1)',
    borderColor: 'rgba(0, 240, 181, 0.3)'
  },
  scanBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  methodText: {
    fontSize: 10,
    fontWeight: '700'
  },
  gpsText: {
    color: '#00f0b5'
  },
  scanText: {
    color: 'rgba(255, 255, 255, 0.6)'
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8
  },
  timeRange: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11
  },
  durationBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  durationBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800'
  },
  inWorkoutBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  inWorkoutText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14
  }
});
