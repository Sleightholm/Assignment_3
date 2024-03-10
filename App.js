import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Audio } from "expo-av";
import styles from "./Styles/Stylesheet";

export default function App() {
  const [db, setDb] = useState(null);
  const [sounds, setSounds] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [newRecordingName, setNewRecordingName] = useState("");
  const [recordUri, setRecordUri] = useState(null);

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

  useEffect(() => {
    if (db) {
      db.transaction((tx) => {
        tx.executeSql("select * from sounds", [], (_, { rows: { _array } }) => {
          setSounds(_array);
        });
      });
    }
  }, [db]);

  async function toggleRecording() {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

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

  async function stopRecording() {
    console.log("Stopping recording..");
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Get the file path of the recording
      console.log("Recording stopped and stored at", uri);
      setRecordUri(uri); // Store the URI before clearing the recording state
      setIsRecording(false);
      setRecording(undefined);
      setModalVisible(true); // Show the modal
    } else {
      console.log("No active recording found.");
    }
  }

  function saveSoundToDb(name, filePath) {
    if (db) {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "insert into sounds (name, filePath) values (?, ?)",
            [name, filePath],
            // Callback function on successful execution
            (_, result) => {
              console.log("Sound saved to DB", result);
              // After saving a new sound, fetch the updated list of sounds
              fetchSounds();
            },
            // Error callback function
            (_, error) => {
              console.log(error);
              return true;
            }
          );
        },
        (error) => {
          console.log("Transaction error:", error);
        },
        () => {
          console.log("Transaction successful, sound added");
        }
      );
    }
  }

  // Function to fetch sounds from the database and update the state
  function fetchSounds() {
    if (db) {
      db.transaction((tx) => {
        tx.executeSql(
          "select * from sounds",
          [],
          (_, { rows: { _array } }) => {
            setSounds(_array); // Update the state with the fetched sounds
            console.log("Sounds fetched from DB", _array);
          },
          (_, error) => {
            console.log("Failed to fetch sounds", error);
            return true;
          }
        );
      });
    }
  }

  async function playSound(filePath) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: filePath });
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soundboard App</Text>
      <Pressable onPress={toggleRecording} style={styles.button}>
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </Pressable>
      <ScrollView style={styles.listArea}>
        {sounds.map(({ id, name, filePath }) => (
          <Pressable
            key={id}
            onPress={() => playSound(filePath)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Play {name}</Text>
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
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (recordUri) {
                  // Ensure recordUri is not null
                  saveSoundToDb(newRecordingName || "New Sound", recordUri); // Use recordUri here
                  setModalVisible(!modalVisible);
                  setRecordUri(null); // Reset recordUri after saving
                }
              }}
            >
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
