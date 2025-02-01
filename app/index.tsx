import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Share, Alert } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { Sound } from "expo-av/build/Audio";
import EventSource from "react-native-sse";

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "expo-router";


const STREAM_URL = "https://stream.zeno.fm/33utvy59nxhvv";
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/33utvy59nxhvv";

const logo = require("@/assets/images/logo.png");

export default function Index() {

  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  const [musicData, setMusicData] = useState({
    currentSong: "WebRadio GRM",
    currentArtist: "A sua música toca aqui!",
    aditionalInfo: "",
  });

  const [coverUrl, setCoverUrl] = useState(logo);

  useEffect(() => {
    if (musicData.currentArtist && musicData.currentSong && playing) {
      const fetchDeezerData = async () => {
        try {
          const response = await fetch(
            `https://api.deezer.com/search?q=${musicData.currentArtist} ${musicData.currentSong}&output=json`
          );
          const data = await response.json();
          if (data.data && data.data[0] && data.data[0].album) {
            setCoverUrl(data.data[0].album.cover_big);
          } else {
            setCoverUrl(logo);
          }
        } catch (error) {
          console.error('Erro ao buscar dados no Deezer:', error);
        }
      };

      fetchDeezerData();

    }
  }, [musicData.currentSong, musicData.currentArtist, playing]);

  useEffect(() => {
    const es = new EventSource(METADATA_URL);

    if (playing) {
      const handleEventSourceMessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, song, aditionalInfo] = data.streamTitle.split(' - ');

          console.log(data.streamTitle);

          const updatedArtist = artist ? artist.trim() : "[Desconhecido]";
          const updatedSong = song ? song.trim() : "[Desconhecido]";
          const updatedAditionalInfo = aditionalInfo ? aditionalInfo.trim() : null;

          setMusicData({
            currentArtist: updatedArtist,
            currentSong: updatedSong,
            aditionalInfo: updatedAditionalInfo,
          });
        }
      };

      es.addEventListener("message", handleEventSourceMessage)
      es.addEventListener("error", (error) => console.error('Erro no EventSource:', error))
    }

    return () => {
      es.close();
    };
  }, [playing]);

  useEffect(() => {

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });

    const loadAudio = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: STREAM_URL });
      setSound(sound);
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!sound) return;
    if (playing) {
      await sound.pauseAsync();
      setCoverUrl(logo);
      setMusicData({
        currentSong: "WebRadio GRM",
        currentArtist: "A sua música toca aqui!",
        aditionalInfo: "",
      })
    } else {
      await sound.playAsync();
    }
    setPlaying(!playing);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'WebRadio GRM | A sua música toda aqui!\n\nAs Melhores Músicas das Décadas de 70, 80, 90 e 2000\n\nBaixe o app da rádio em: https://playergrmmais.blogspot.com/',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      style={styles.container}
    >
      <Image
        style={styles.backgroundImage}
        source={coverUrl}
        contentFit="cover"
        transition={1000}
        blurRadius={20}
        allowDownscaling={true}
      />

      <Image
        style={styles.image}
        source={coverUrl}
        contentFit="cover"
        transition={1000}
      />

      <Text style={styles.song}>{musicData.currentSong ? musicData.currentSong : "Carregando"}</Text>
      <Text style={styles.artist}>{musicData.currentArtist ? musicData.currentArtist : "Carregando"}</Text>
      {musicData.aditionalInfo && <Text style={styles.aditionalInfo}>{musicData.aditionalInfo ? musicData.aditionalInfo : "Carregando"}</Text>}

      <View style={{ flexDirection: "row" }}>
        <Link style={styles.playButton} href="https://playergrmmais.blogspot.com/">
          <Ionicons name="globe-sharp" size={35} color="black" />
        </Link>

        <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
          {playing ? <Ionicons name="pause" size={35} color="black" /> :
            <Ionicons name="play" size={35} color="black" />
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={styles.playButton}>
          <Ionicons name="share-social-sharp" size={35} color="black" />
        </TouchableOpacity>
      </View>

      <StatusBar hidden translucent />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  playButton: {
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 100,
    margin: 25,
    shadowColor: "black",
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 20
  },
  backgroundImage: {
    position: "absolute",
    zIndex: 0,
    height: "100%",
    width: "100%",
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 200,
    borderColor: "white",
    borderWidth: 2,
    shadowColor: "black",
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 20
  },
  song: {
    fontWeight: "bold",
    fontSize: 38,
    fontStyle: "italic",
    color: "white",
    marginTop: 10,
    textShadowColor: "black",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  artist: {
    fontWeight: "bold",
    fontSize: 22,
    fontStyle: "italic",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  aditionalInfo: {
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  cover: {
    width: 300,
    height: 300,
    margin: 50,
  },
})