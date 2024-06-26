import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  TextInput,
  ImageBackground,
  Alert,
  Image,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import styles from "../Styles/Stylesheet";
import BackgroundImage from "../assets/background.png";
import homeImage from "../assets/home.png";

export default function App() {
  const [db, setDb] = useState(null);
  const [sounds, setSounds] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [newRecordingName, setNewRecordingName] = useState("");
  const [recordUri, setRecordUri] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSound, setEditingSound] = useState(null);

  // Initialize the database
  useEffect(() => {
    const db = SQLite.openDatabase("soundboard.db");
    setDb(db);
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists sounds (id integer primary key not null, name text, filePath text);",
        [],
        () => {
          console.log("Table created");
        },
        (_, error) => {
          console.log(error);
          return false;
        }
      );
    });
    fetchSounds(); // Fetch sounds when the app loads
  }, []);

  // Fetch sounds when the database is ready
  useEffect(() => {
    if (db) {
      fetchSounds();
    }
  }, [db]);

  // Toggle recording
  async function toggleRecording() {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  // Start recording
  async function startRecording() {
    console.log("Requesting permissions..");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log("Starting recording..");
    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
    console.log("Recording started");
  }

  // Stop recording
  async function stopRecording() {
    console.log("Stopping recording..");
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      setRecordUri(uri);
      setIsRecording(false);
      setRecording(undefined);
      setModalVisible(true);
    } else {
      console.log("No active recording found.");
    }
  }

  // Save sound to database
  function saveSoundToDb(name, filePath) {
    if (db) {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO sounds (name, filePath) VALUES (?, ?);",
            [name, filePath],
            (_, result) => {
              // Success callback
              console.log("Sound saved:", result);
            },
            (_, error) => {
              // Error callback
              console.log("Error saving sound:", error);
              return true; // Returning true rolls back the transaction on error
            }
          );
        },
        (error) => {
          console.log("Transaction Error:", error);
        },
        () => {
          console.log("Transaction Success:");
          fetchSounds(); // Refresh sound list
        }
      );
    }
  }

  // Fetch sounds from the database
  function fetchSounds() {
    if (db) {
      db.transaction((tx) => {
        tx.executeSql("select * from sounds", [], (_, { rows: { _array } }) => {
          setSounds(_array);
          console.log("Sounds fetched from DB", _array);
        });
      });
    }
  }

  // Play sound from file path
  async function playSound(filePath) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: filePath });
    await sound.playAsync();
  }

  // Show options for a sound
  function showOptions(id) {
    Alert.alert("Sound Options", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteSound(id),
        style: "destructive",
      },
      { text: "Rename", onPress: () => promptRenameSound(id) },
    ]);
  }

  // Delete sound from database
  function deleteSound(id) {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from sounds where id = ?", [id]);
      },
      null,
      fetchSounds // Refresh the list after deleting
    );
  }

  // Prompt to rename a sound
  function promptRenameSound(id) {
    const sound = sounds.find((sound) => sound.id === id);
    if (sound) {
      setEditingSound(sound);
      setNewRecordingName(sound.name);
      setEditModalVisible(true);
    }
  }

  // Update sound name
  function updateSoundName() {
    if (editingSound && newRecordingName.trim()) {
      db.transaction(
        (tx) => {
          tx.executeSql("update sounds set name = ? where id = ?", [
            newRecordingName,
            editingSound.id,
          ]);
        },
        null,
        () => {
          fetchSounds(); // Refresh the list after updating
          setEditModalVisible(false);
          setEditingSound(null);
          setNewRecordingName("");
        }
      );
    }
  }

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.content}>
        <Text style={styles.title}>Custom Soundboard</Text>
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
        <Pressable
          onPress={toggleRecording}
          style={[
            styles.button,
            isRecording ? styles.buttonRecording : styles.button,
          ]}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </Pressable>
        <ScrollView
          style={styles.listArea}
          contentContainerStyle={styles.flexRow}
        >
          {sounds.map(({ id, name, filePath }) => (
            <Pressable
              key={id}
              onPress={() => playSound(filePath)}
              onLongPress={() => showOptions(id)}
              style={({ pressed }) => [
                styles.button,
                pressed ? styles.buttonRecording : {}, // Dynamically changes style when pressed
              ]}
            >
              <Text style={styles.buttonText}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Name your sound:"
                value={newRecordingName}
                onChangeText={setNewRecordingName}
              />
              <Pressable
                style={[styles.button, styles.button]}
                onPress={() => {
                  if (recordUri) {
                    saveSoundToDb(newRecordingName || "New Sound", recordUri);
                    setModalVisible(!modalVisible);
                    setRecordUri(null);
                  }
                }}
              >
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!editModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Rename your sound:"
                value={newRecordingName}
                onChangeText={setNewRecordingName}
              />
              <Pressable
                style={[styles.button, styles.button]}
                onPress={updateSoundName}
              >
                <Text style={styles.textStyle}>Update</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}
