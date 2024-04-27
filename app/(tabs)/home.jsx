import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { icons, images } from '../../constants';
import useAppwrite from '../../lib/useAppwrite';
import {
  addLikeToVideo,
  getAllPosts,
  getLatestPosts,
  getLikedVideosForUser,
} from '../../lib/appwrite';
import EmptyState from '../../components/EmptyState';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { data: likedVideos, refetch: refetchLiked } = useAppwrite(() =>
    getLikedVideosForUser(user.$id)
  );

  const [refreshing, setRefreshing] = useState(false);
  const liked = likedVideos.map((item) => item.$id);

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
      if (!liked.includes(videoId)) {
        Alert.alert('Success', 'Video added to bookmarks');
      } else {
        Alert.alert('Removed', 'Video removed from bookmarks');
      }

      await refetchLiked();
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log('error');
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => submit(item.$id)}>
              <Image
                source={
                  liked.includes(item.$id) ? icons.heartRed : icons.heartBlack
                }
                resizeMode="contain"
                style={{ width: 40, height: 40, marginRight: 15 }}
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
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pregular text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl pt-2 font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
