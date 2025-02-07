import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Sound } from "expo-av/build/Audio";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import EventSource from "react-native-sse";

import { SafeAreaView } from "react-native-safe-area-context";

import logo from "@/assets/images/logo.png";
import ActionsBar from './components/actions-bar';
import Background from './components/background';
import SongInfo from './components/song-info';
import RecentSongsList from './components/recent-songs-container';

const STREAM_URL = "https://stream.zeno.fm/33utvy59nxhvv";
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/33utvy59nxhvv";


interface SongData {
  currentSong: string,
  currentArtist: string,
  aditionalInfo: string,
  coverUrl: string
}

export default function Index() {

  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  const [recentsSongs, setRecentsSongs] = useState<SongData[]>([]);

  const [songData, setSongData] = useState({
    currentSong: "WebRadio GRM",
    currentArtist: "A sua música toca aqui!",
    aditionalInfo: "",
    coverUrl: logo
  });

  useEffect(() => {
    if (songData.currentArtist && songData.currentSong && playing) {

      if (songData.currentArtist.includes("GRM") || songData.currentSong.includes("GRM")) {
        setSongData({ ...songData, coverUrl: logo })
        return;
      }

      const fetchDeezerData = async () => {
        try {
          const response = await fetch(
            `https://api.deezer.com/search?q=${encodeURIComponent(songData.currentArtist)} ${encodeURIComponent(songData.currentSong)}&output=json`
          );

          const data = await response.json();

          const newCoverUrl = data.data?.[0]?.album?.cover_big || logo;

          setSongData({ ...songData, coverUrl: newCoverUrl });
        } catch (error) {
          console.error("Erro ao buscar dados no Deezer:", error);
          setSongData({ ...songData, coverUrl: logo })
        }
      };

      fetchDeezerData();

      setRecentsSongs((prevSongs) => {
        const isAlreadyAdded = prevSongs.some(
          (song) =>
            song.currentArtist === songData.currentArtist &&
            song.currentSong === songData.currentSong
        );

        if (isAlreadyAdded) {
          return prevSongs;
        }

        return [
          { ...songData },
          ...prevSongs,
        ].slice(0, 6);
      });
    }
  }, [songData.currentSong, songData.currentArtist]);

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

          setSongData({
            ...songData,
            currentArtist: updatedArtist,
            currentSong: updatedSong,
            aditionalInfo: updatedAditionalInfo,
          });
        }
      };

      es.addEventListener("message", handleEventSourceMessage)
      es.addEventListener("error", (error) => console.error('Erro no EventSource:', error))
    } else {
      setSongData({
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
      <Background imageSrc={songData.coverUrl} />

      <SongInfo
        currentArtist={songData.currentArtist}
        currentSong={songData.currentSong}
        aditionalInfo={songData.aditionalInfo}
        coverUrl={songData.coverUrl}
      />

      <RecentSongsList recentSongs={recentsSongs} />

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