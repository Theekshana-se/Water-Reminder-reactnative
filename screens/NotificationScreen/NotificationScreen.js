import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { fetchUserWakeUpTime, fetchUserBedtime } from '../../lib/appwrite'; // Import Appwrite functions
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationScreen = () => {
  const [wakeUpTime, setWakeUpTime] = useState('Loading...');
  const [bedtime, setBedtime] = useState('Loading...');
  const [interval, setInterval] = useState(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    const loadTimes = async () => {
      try {
        const fetchedWakeUpTime = await fetchUserWakeUpTime();
        const fetchedBedtime = await fetchUserBedtime();
        setWakeUpTime(fetchedWakeUpTime);
        setBedtime(fetchedBedtime);
      } catch (error) {
        console.error('Failed to fetch times:', error);
      }
    };

    loadTimes();

    // Request notification permissions on mount
    requestNotificationPermissions();
  }, []);

  // Request permissions for sending notifications
  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'We need permission to send notifications.');
      return false;
    }

    return true;
  };

  // Schedule notification based on selected interval
  const scheduleNotification = async (interval) => {
    if (isNotificationEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Drink Water Reminder 💧',
          body: `It's time to drink water!`,
          sound: true,
        },
        trigger: {
          seconds: interval * 60, // Convert interval to seconds
          repeats: true,
        },
      });
      Alert.alert('Notification scheduled', `Every ${interval} minutes`);
    }
  };

  // Handle enabling/disabling notifications
  const toggleNotification = () => {
    setIsNotificationEnabled((previousState) => !previousState);
    if (!isNotificationEnabled) {
      Alert.alert('Notifications Enabled', 'You will receive notifications at the selected interval.');
    } else {
      Notifications.cancelAllScheduledNotificationsAsync(); // Cancel any scheduled notifications
      Alert.alert('Notifications Disabled', 'Notifications have been turned off.');
    }
  };

  // Handle selecting a notification interval
  const handleIntervalSelect = (selectedInterval) => {
    setInterval(selectedInterval);
    scheduleNotification(selectedInterval);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reminder</Text>

      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>From</Text>
          <Text style={styles.timeValue}>{wakeUpTime}</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>To</Text>
          <Text style={styles.timeValue}>{bedtime}</Text>
        </View>
      </View>

      <Text style={styles.subheading}>Notification Interval</Text>
      <View style={styles.intervalContainer}>
        {[
          30, 45, 60, 90, 120, 180, 240, 300,2
        ].map((intervalOption) => (
          <TouchableOpacity
            key={intervalOption}
            style={[
              styles.intervalButton,
              interval === intervalOption ? styles.intervalSelected : {},
            ]}
            onPress={() => handleIntervalSelect(intervalOption)}
          >
            <Text>{intervalOption < 60 ? `${intervalOption} minutes` : `${intervalOption / 60} hours`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toggleContainer}>
        <Text>Enable Notifications</Text>
        <Switch value={isNotificationEnabled} onValueChange={toggleNotification} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 16,
    color: '#999',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  intervalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  intervalButton: {
    borderWidth: 1,
    borderColor: '#00aaff',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    minWidth: 80,
  },
  intervalSelected: {
    backgroundColor: '#00aaff',
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});

export default NotificationScreen;
