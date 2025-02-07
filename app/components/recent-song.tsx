import { Image } from 'expo-image';
import { StyleSheet, Text, View } from "react-native";

interface RecentSongProps {
	currentSong: string,
	currentArtist: string,
	aditionalInfo: string,
	coverUrl: string
}

export default function RecentSong({ currentSong, currentArtist, aditionalInfo, coverUrl }: RecentSongProps) {
	return (
		<View style={styles.container}>
			<Image
				style={styles.artImage}
				source={coverUrl}
				contentFit="cover"
				transition={1000}
			/>
			<View style={{ flexDirection: "column", marginLeft: 20 }}>
				<Text style={styles.song}>{currentSong || "Carregando"}</Text>
				<Text style={styles.artist}>{currentArtist || "Carregando"}</Text>
				{aditionalInfo && <Text style={styles.aditionalInfo}>{aditionalInfo || "Carregando"}</Text>}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
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