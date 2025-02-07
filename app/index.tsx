import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Sound } from "expo-av/build/Audio";
import { useEffect, useState } from "react";
import { Alert, Share, StatusBar, StyleSheet } from "react-native";
import EventSource from "react-native-sse";

import { SafeAreaView } from "react-native-safe-area-context";

import logo from "@/assets/images/logo.png";
import ActionsBar from './components/actions-bar';
import MusicInfo from './components/music-info';
import RecentSongs from './components/recent-songs';
import Background from './components/background';

const STREAM_URL = "https://stream.zeno.fm/33utvy59nxhvv";
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/33utvy59nxhvv";


interface MusicData {
  currentSong: string,
  currentArtist: string,
  aditionalInfo: string,
  coverUrl: string
}

export default function Index() {

  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  const [recentsSongs, setRecentsSongs] = useState<MusicData[]>([]);

  const [musicData, setMusicData] = useState({
    currentSong: "WebRadio GRM",
    currentArtist: "A sua música toca aqui!",
    aditionalInfo: "",
    coverUrl: logo
  });

  useEffect(() => {
    if (musicData.currentArtist && musicData.currentSong && playing) {

      if (musicData.currentArtist.includes("GRM") || musicData.currentSong.includes("GRM")) {
        setMusicData({ ...musicData, coverUrl: logo })
        return;
      }

      const fetchDeezerData = async () => {
        try {
          const response = await fetch(
            `https://api.deezer.com/search?q=${encodeURIComponent(musicData.currentArtist)} ${encodeURIComponent(musicData.currentSong)}&output=json`
          );

          const data = await response.json();

          const newCoverUrl = data.data?.[0]?.album?.cover_big || logo;

          setMusicData({ ...musicData, coverUrl: newCoverUrl });
        } catch (error) {
          console.error("Erro ao buscar dados no Deezer:", error);
          setMusicData({ ...musicData, coverUrl: logo })
        }
      };

      fetchDeezerData();

      setRecentsSongs((prevSongs) => {
        const isAlreadyAdded = prevSongs.some(
          (song) =>
            song.currentArtist === musicData.currentArtist &&
            song.currentSong === musicData.currentSong
        );

        if (isAlreadyAdded) {
          return prevSongs;
        }

        return [
          { ...musicData },
          ...prevSongs,
        ].slice(0, 6);
      });
    }
  }, [musicData.currentSong, musicData.currentArtist, playing]);

  useEffect(() => {
    const es = new EventSource(METADATA_URL);

    if (playing) {
      const handleEventSourceMessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, song, aditionalInfo] = data.streamTitle.split(' - ');

          const updatedArtist = artist ? artist.trim() : "[Desconhecido]";
          const updatedSong = song ? song.trim() : "[Desconhecido]";
          const updatedAditionalInfo = aditionalInfo ? aditionalInfo.trim() : null;

          setMusicData({
            ...musicData,
            currentArtist: updatedArtist,
            currentSong: updatedSong,
            aditionalInfo: updatedAditionalInfo,
          });
        }
      };

      es.addEventListener("message", handleEventSourceMessage)
      es.addEventListener("error", (error) => console.error('Erro no EventSource:', error))
    } else {
      setMusicData({
        currentSong: "WebRadio GRM",
        currentArtist: "A sua música toca aqui!",
        aditionalInfo: "",
        coverUrl: logo,
      })
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
    } else {
      await sound.playAsync();
    }
    setPlaying(!playing);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background imageSrc={musicData.coverUrl} />

      <MusicInfo
        currentArtist={musicData.currentArtist}
        currentSong={musicData.currentSong}
        aditionalInfo={musicData.aditionalInfo}
        coverUrl={musicData.coverUrl}
      />

      <RecentSongs recentSongs={recentsSongs} />

      <ActionsBar playing={playing} togglePlay={togglePlay} />

      <StatusBar hidden translucent />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
  },
})