import { Text, View, ImageBackground } from "react-native";
import { Link } from "expo-router";
import styles from "../Styles/Stylesheet";
import BackgroundImage from "../assets/background.png";

export default function App() {
  return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <View style={styles.content}>
        <Text style={styles.title}>SOUNDBOARD</Text>
          <View style={styles.button}>
            <Link href={"/premade"}>
              <View>
                <Text style={styles.buttonText}>Premade</Text>
              </View>
            </Link>
          </View>
          <View style={styles.button}>
            <Link href={"/custom"}>
              <View>
                <Text style={styles.buttonText}>Custom</Text>
              </View>
            </Link>
          </View>
        </View>
      </ImageBackground>
  );
}
