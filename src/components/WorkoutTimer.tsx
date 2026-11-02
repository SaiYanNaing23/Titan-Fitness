import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  checkInTime: string;
}

export const WorkoutTimer: React.FC<Props> = ({ checkInTime }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = new Date(checkInTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffSecs);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [checkInTime]);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timerStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const estimatedCalories = Math.floor((elapsedSeconds / 60) * 7.5);

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>WORKOUT IN PROGRESS</Text>
      </View>

      <Text style={styles.timerDisplay}>{timerStr}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STARTED AT</Text>
          <Text style={styles.statValue}>
            {new Date(checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BURNED CALORIES</Text>
          <Text style={styles.statValue}>{estimatedCalories} kcal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6
  },
  badgeText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  timerDisplay: {
    fontSize: 44,
    fontWeight: '900',
    color: '#eab308',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginVertical: 10
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 8
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    marginBottom: 2
  },
  statValue: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700'
  }
});
