import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, getLikedVideosForUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
          getLikedVideosForUser(res.$id).then((data) => {
            setLikedVideos(data); // Set the fetched liked videos as the initial state
          });
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateLikedVideos = (newLikedVideos) => {
    setLikedVideos(newLikedVideos);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        likedVideos,
        updateLikedVideos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
