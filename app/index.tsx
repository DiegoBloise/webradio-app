import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { Sound } from "expo-av/build/Audio";
import EventSource from "react-native-sse";

const STREAM_URL = "https://stream.zeno.fm/33utvy59nxhvv";
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/33utvy59nxhvv";

const logo = require("@/assets/images/logo.png");

export default function Index() {

  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  const [musicData, setMusicData] = useState({
    currentSong: null,
    currentArtist: null,
  });

  const [coverUrl, setCoverUrl] = useState();

  useEffect(() => {
    if (musicData.currentArtist && musicData.currentSong) {
      // Criação da função que vai fazer a requisição para o Deezer
      const fetchDeezerData = async () => {
        try {
          const response = await fetch(
            `https://api.deezer.com/search?q=${musicData.currentArtist} ${musicData.currentSong}&output=json`
          );
          const data = await response.json();
          if (data.data && data.data[0] && data.data[0].album) {
            setCoverUrl(data.data[0].album.cover_big); // Atualiza a capa
          }
        } catch (error) {
          console.error('Erro ao buscar dados no Deezer:', error);
        }
      };

      fetchDeezerData();

    }
  }, [musicData.currentSong, musicData.currentArtist]);

  useEffect(() => {
    const es = new EventSource(METADATA_URL);

    const handleEventSourceMessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.streamTitle) {
        const [artist, song] = data.streamTitle.split(' - ');
        setMusicData({
          currentSong: song?.trim(),
          currentArtist: artist?.trim(),
        });
      }
    };

    es.addEventListener("message", handleEventSourceMessage)
    es.addEventListener("error", (error) => console.error('Erro no EventSource:', error))

    return () => {
      es.close();
    };
  }, []);

  useEffect(() => {
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
    <View
      style={styles.container}
    >
      <Image
        style={styles.backgroundImage}
        source={coverUrl}
        placeholder={logo}
        contentFit="cover"
        transition={1000}
        blurRadius={20}
      />

      <Image
        style={styles.image}
        source={coverUrl}
        placeholder={logo}
        contentFit="cover"
        transition={1000}
      />

      <Text style={styles.song}>{musicData.currentSong ? musicData.currentSong : "Carregando"}</Text>
      <Text style={styles.artist}>{musicData.currentArtist ? musicData.currentArtist : "Carregando"}</Text>

      <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>{playing ? "PAUSAR" : "TOCAR"}</Text>
      </TouchableOpacity>
    </View>
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
    padding: 25,
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
    borderRadius: "100%",
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
  cover: {
    width: 300,
    height: 300,
    margin: 50,
  },
})