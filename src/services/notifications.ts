import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function saveUserPushToken(userId: string, token: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { pushToken: token });
}

export async function schedulePushNotification({
  title,
  body,
  data,
  trigger = null,
}: {
  title: string;
  body: string;
  data?: any;
  trigger?: Notifications.NotificationTriggerInput;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger,
  });
}

export async function sendGameReminder(gameId: string, gameTime: Date) {
  await schedulePushNotification({
    title: 'Game Reminder',
    body: 'Your game starts in 30 minutes!',
    data: { gameId },
    trigger: {
      date: new Date(gameTime.getTime() - 30 * 60000), // 30 minutes before game
    },
  });
}

export async function sendGameStarted(gameId: string) {
  await schedulePushNotification({
    title: 'Game Started',
    body: 'Your game has started. Good luck!',
    data: { gameId },
  });
}

export async function sendGameEnded(
  gameId: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number
) {
  await schedulePushNotification({
    title: 'Game Ended',
    body: `Final Score: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
    data: { gameId },
  });
}

export async function sendQuarterEnd(gameId: string, quarter: number) {
  await schedulePushNotification({
    title: `End of Q${quarter}`,
    body: 'Get ready for the next quarter!',
    data: { gameId },
  });
}

export async function sendTimeoutNotification(gameId: string, team: string) {
  await schedulePushNotification({
    title: 'Timeout',
    body: `${team} has called a timeout`,
    data: { gameId },
  });
}

export async function sendStatMilestone(
  gameId: string,
  playerName: string,
  achievement: string
) {
  await schedulePushNotification({
    title: 'Player Milestone',
    body: `${playerName} ${achievement}`,
    data: { gameId },
  });
} 