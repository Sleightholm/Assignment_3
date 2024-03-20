import React, { useState } from "react";
import { Pressable, Text, View, ImageBackground, Image } from "react-native";
import { Link } from "expo-router";
import { Audio } from "expo-av";
import styles from "../Styles/Stylesheet";
import BackgroundImage from "../assets/background.png";
import homeImage from "../assets/home.png";

export default function App() {
  const sounds = [
    { name: "PLUH", source: require("../assets/pluh.mp3") },
    { name: "Error", source: require("../assets/error.mp3") },
    { name: "Mario", source: require("../assets/mario.mp3") },
    { name: "Doorbell", source: require("../assets/doorbell.mp3") },
    { name: "Camera", source: require("../assets/camera.mp3") },
    { name: "Hehe", source: require("../assets/hehe.mp3") },
    { name: "Punch", source: require("../assets/punch.mp3") },
    { name: "Boing", source: require("../assets/boing.mp3") },
  ];

  // Plays the sound
  const playSound = async (soundResource) => {
    const { sound } = await Audio.Sound.createAsync(soundResource);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.content}>
        <Text style={styles.title}>Premade Soundboard</Text>
        <Link
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonRecording : {}, // Dynamically changes style when pressed
          ]}
          href={{ pathname: "/" }}
          asChild
        >
          <Pressable>
            <Image source={homeImage} style={{ width: 40, height: 40 }} />
          </Pressable>
        </Link>
        <View style={styles.listArea}>
          <View style={styles.flexRow}>
            {sounds.map((soundResource, index) => (
              <Pressable
                key={index}
                onPress={() => playSound(soundResource.source)}
                style={({ pressed }) => [
                  styles.button,
                  pressed ? styles.buttonRecording : {},
                ]}
              >
                <Text style={styles.buttonText}>{soundResource.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
