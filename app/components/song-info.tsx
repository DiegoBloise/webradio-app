import { Image } from 'expo-image';
import { StyleSheet, Text, View } from "react-native";

interface SongInfoProps {
	currentSong: string,
	currentArtist: string,
	aditionalInfo?: string,
	coverUrl: string
}

export default function SongInfo({ currentSong, currentArtist, aditionalInfo, coverUrl }: SongInfoProps) {

	return (
		<View style={styles.container}>
			<Image
				style={styles.artImage}
				source={coverUrl}
				contentFit="cover"
				transition={1000}
			/>
			<View style={{ marginTop: 20 }}>
				<Text style={styles.song}>{currentSong || "Carregando"}</Text>
				<Text style={styles.artist}>{currentArtist || "Carregando"}</Text>
				{aditionalInfo && <Text style={styles.aditionalInfo}>{aditionalInfo || "Carregando"}</Text>}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
	},
	artImage: {
		marginTop: 50,
		width: 280,
		height: 280,
		borderRadius: 200,
		borderColor: "white",
		borderWidth: 2,
		shadowColor: "black",
		shadowOffset: { width: 5, height: 5 },
		shadowRadius: 20
	},
	song: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 38,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	},
	artist: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 22,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	},
	aditionalInfo: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		fontStyle: "italic",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 10
	},
})