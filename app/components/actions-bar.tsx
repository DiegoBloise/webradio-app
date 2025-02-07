import Ionicons from "@expo/vector-icons/Ionicons";
import { Sound } from "expo-av/build/Audio";
import { Linking, TouchableOpacity, View, StyleSheet, Alert, Share } from "react-native";

interface ActionsBarProps {
	playing: boolean;
	togglePlay: () => void;
}

export default function ActionsBar({ playing, togglePlay }: ActionsBarProps) {

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
		<View style={{ flexDirection: "row" }}>
			<TouchableOpacity onPress={() => {
				Linking.openURL("https://playergrmmais.blogspot.com/");
			}} style={styles.button}>
				<Ionicons name="globe-sharp" size={34} color="black" />
			</TouchableOpacity>

			<TouchableOpacity onPress={togglePlay} style={styles.button}>
				{
					playing ?
						<Ionicons name="pause" size={34} color="black" /> :
						<Ionicons name="play" size={34} color="black" />
				}
			</TouchableOpacity>

			<TouchableOpacity onPress={onShare} style={styles.button}>
				<Ionicons name="share-social-sharp" size={34} color="black" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		padding: 15,
		width: 80,
		height: 80,
		backgroundColor: "#FFF",
		borderRadius: 200,
		margin: 25,
		shadowColor: "black",
		shadowOffset: { width: 5, height: 5 },
		shadowRadius: 20,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		flex: 1
	},
})