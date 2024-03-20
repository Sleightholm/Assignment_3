import { StyleSheet, Dimensions } from "react-native";

// Calculate button width based on screen size for a dynamic grid
const numColumns = 2; // Number of columns in the grid
const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 40 * (numColumns + 1)) / numColumns; // 30 is the total horizontal padding/margin

export default StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensures content uses the full width
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
    fontFamily: "monospace",
  },
  flexRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  button: {
    backgroundColor: "#rgba(16,145,49,1)",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: buttonWidth, // Set button width based on screen size for a dynamic grid
    alignItems: "center",
  },
  buttonRecording: {
    backgroundColor: "#FF6347", // Tomato color when recording
  },
  buttonNotRecording: {
    backgroundColor: "rgba(16,145,49,1)", // Green color when not recording
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  listArea: {
    backgroundColor: "#578bc721",
    width: "100%",
    padding: 10,
    margin: 50,
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInput: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: "80%",
    borderRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    width: '100%',
    height: '105%',
    position: 'absolute',
  },
});
