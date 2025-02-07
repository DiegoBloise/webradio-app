import { ScrollView, StyleSheet, Text, View } from "react-native";
import RecentSong from "./recent-song";

interface RecentSongsListProps {
	recentSongs: {
		currentSong: string,
		currentArtist: string,
		aditionalInfo: string,
		coverUrl: string
	}[];
}

export default function RecentSongsList({ recentSongs }: RecentSongsListProps) {

	if (recentSongs.length <= 1) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.recentsTitle}>Músicas Recentes</Text>
			<ScrollView horizontal>
				{recentSongs.slice(1).map((song, index) => (
					<RecentSong
						key={`${song.currentArtist}-${index}`}
						currentArtist={song.currentArtist}
						currentSong={song.currentSong}
						aditionalInfo={song.aditionalInfo}
						coverUrl={song.coverUrl}
					/>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 60,
		marginLeft: 40,
		width: "100%"
	},
	recentsTitle: {
		fontWeight: "bold",
		fontSize: 26,
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10,
		marginBottom: 20,
	}
})