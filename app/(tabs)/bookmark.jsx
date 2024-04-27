import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';

import useAppwrite from '../../lib/useAppwrite';
import { addLikeToVideo, getLikedVideosForUser } from '../../lib/appwrite'; // Updated import
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import { useState } from 'react';
import { icons } from '../../constants';

const LikedVideos = () => {
  const { user } = useGlobalContext();
  const { data: likedVideos, refetch } = useAppwrite(() =>
    getLikedVideosForUser(user.$id)
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const submit = async (videoId) => {
    try {
      await addLikeToVideo({
        videoId: videoId,
        userId: user.$id,
      });
      Alert.alert('Success', 'Video removed from your bookmarks');
      await refetch();
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={likedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => submit(item.$id)}>
              <Image
                source={icons.deleted}
                resizeMode="contain"
                style={{ width: 30, height: 30, marginRight: 20 }}
                className="absolute right-0"
              />
            </TouchableOpacity>
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.creator.username}
              avatar={item.creator.avatar}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Liked Videos"
            subtitle="You haven't liked any videos yet"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <View className="flex justify-center items-center">
              <Text className=" font-psemibold text-xl text-gray-100">
                Your saved videos
              </Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default LikedVideos;
