import { Stack } from 'expo-router';
import SafeArea from '@/components/SafeArea';

export default function RootLayout() {
  return (
    <SafeArea>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeArea>
  );
}
