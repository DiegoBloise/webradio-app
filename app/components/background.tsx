import { StyleSheet } from "react-native";
import { Image } from "expo-image";

interface BackgroundProps {
	imageSrc: string;
}

export default function Background({ imageSrc }: BackgroundProps) {
	return (
		<Image
			style={styles.backgroundImage}
			source={imageSrc}
			contentFit="cover"
			transition={1000}
			blurRadius={20}
			allowDownscaling={true}
		/>
	)
}

const styles = StyleSheet.create({
	backgroundImage: {
		position: "absolute",
		zIndex: 0,
		height: "100%",
		width: "100%",
	},
});