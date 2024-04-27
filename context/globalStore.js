import { create } from 'zustand';


const useGlobalStore = create((set) => ({
  likedVideos: [],
  setLikedVideos: (likedVideos) => set({ likedVideos }),
}));

export default useGlobalStore;
