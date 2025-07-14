import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={'/about'}>About</Link>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1741482528462-12c071712249?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
        }}
        style={{ width: 100, height: 100 }}
      />
      <Image
        source={require('@/assets/images/react-logo.png')}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
  },
});
