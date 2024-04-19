import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { icons } from '../../constants';

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace('/sign-in');
  };
  return (
    <View className="h-full items-center justify-center">
      <Text>Home</Text>
      <TouchableOpacity
        onPress={logout}
        className="flex w-full items-center mb-10"
      >
        <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
