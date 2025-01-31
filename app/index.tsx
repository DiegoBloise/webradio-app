import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAudioPlayer } from 'expo-audio'
import { useEffect, useState } from "react";
import { Image } from 'expo-image';

const STREAM_URL = "https://stream.zeno.fm/33utvy59nxhvv";
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/33utvy59nxhvv";

const logo = require("@/assets/images/logo.png");

export default function Index() {

  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer(STREAM_URL);
  const [coverArt, setCoverArt] = useState(null);


  const [musicData, setMusicData] = useState({
    currentSong: 'Loading...',
    currentArtist: 'Loading...',
    coverUrl: "",
  });

  useEffect(() => {
    const eventSource = new EventSource(METADATA_URL);

    const handleEventSourceMessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.streamTitle) {
        const [artist, song] = data.streamTitle.split(' - ');
        setMusicData({
          currentSong: song.trim(),
          currentArtist: artist.trim(),
          coverUrl: logo,
        });
      }
    };

    eventSource.onmessage = handleEventSourceMessage;
    eventSource.onerror = (error) => console.error('Erro no EventSource:', error);

    return () => {
      eventSource.close();
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
    setPlaying(!playing);
  };

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
      />

      {coverArt && <Image source={{ uri: musicData.coverUrl }} style={styles.cover} />}

      {/* <Image source={{ uri: musicData.coverUrl }} /> */}

      <Text style={styles.song}>{musicData.currentSong}</Text>
      <Text style={styles.artist}>{musicData.currentArtist}</Text>

      <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFF" }}>{playing ? "Pausar" : "Tocar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    padding: 25,
    backgroundColor: "#2f1d70",
    borderRadius: 100,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  song: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
  },
  artist: {
    fontSize: 16,
    color: "gray",
  },
  cover: {
    width: 150,
    height: 150,
    margin: 20,
  },
})