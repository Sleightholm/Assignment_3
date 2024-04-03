import { Text, View, ImageBackground, Pressable } from "react-native";
import { Link } from "expo-router";
import styles from "../Styles/Stylesheet";
import BackgroundImage from "../assets/background.png";

export default function App() {
  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.content}>
        <Text style={styles.title}>SOUNDBOARD</Text>
        <Link
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonRecording : {}, // Dynamically changes style when pressed
          ]}
          href={{ pathname: "/premade" }}
          asChild
        >
          <Pressable>
            <Text style={styles.buttonText}>Premade</Text>
          </Pressable>
        </Link>
        <Link
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonRecording : {}, // Dynamically changes style when pressed
          ]}
          href={{ pathname: "/custom" }}
          asChild
        >
          <Pressable>
            <Text style={styles.buttonText}>Custom</Text>
          </Pressable>
        </Link>
      </View>
    </ImageBackground>
  );
}
