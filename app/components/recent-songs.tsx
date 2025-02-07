import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Image } from 'expo-image'

interface RecentSongsProps {
	recentSongs: {
		currentSong: string,
		currentArtist: string,
		aditionalInfo: string,
		coverUrl: string
	}[];
}

export default function RecentSongs({ recentSongs }: RecentSongsProps) {

	if (recentSongs.length <= 1) return null;

	return (
		<View style={styles.recentContainer}>
			<Text style={styles.recentsTitle}>Músicas Recentes</Text>
			<ScrollView horizontal>
				{recentSongs.slice(1).map((song, index) => (
					<View key={`${song.currentArtist}-${index}`} style={styles.songInfoContainer}>
						<Image
							style={styles.artImage}
							source={song.coverUrl}
							contentFit="cover"
							transition={1000}
						/>
						<View style={{ flexDirection: "column", marginLeft: 20 }}>
							<Text style={styles.song}>{song.currentSong || "Carregando"}</Text>
							<Text style={styles.artist}>{song.currentArtist || "Carregando"}</Text>
							{song.aditionalInfo && <Text style={styles.aditionalInfo}>{song.aditionalInfo || "Carregando"}</Text>}
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	recentContainer: {
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
	},
	songInfoContainer: {
		flexDirection: "row",
		marginRight: 20,
		paddingRight: 20
	},
	artImage: {
		width: 130,
		height: 130,
		borderRadius: 10,
		borderColor: "white",
		borderWidth: 1,
		shadowColor: "black",
		shadowOffset: { width: 5, height: 5 },
		shadowRadius: 20
	},
	song: {
		fontWeight: "bold",
		fontSize: 22,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	},
	artist: {
		fontWeight: "bold",
		fontSize: 16,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	},
	aditionalInfo: {
		fontWeight: "bold",
		fontSize: 14,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	}
})