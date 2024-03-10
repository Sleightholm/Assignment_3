import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20, // Adjusted for better spacing
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold", // Corrected typo: 'fountWeight' to 'fontWeight'
    textAlign: "center",
    marginBottom: 20, // Added for spacing below the heading
  },
  flexRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Added to allow items to wrap in a grid
    justifyContent: "center", // Center items in each row
    width: "100%", // Ensure it spans the full width
  },
  input: {
    borderColor: "#4630EB",
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    padding: 8,
    margin: 8, // Adjusted for consistent spacing around
    width: "80%", // Adjust input width
  },
  button: {
    // New style for buttons
    backgroundColor: "#4630EB",
    borderRadius: 4,
    padding: 10,
    margin: 8,
    width: "40%", // Adjust button width for grid
    alignItems: "center", // Center text inside buttons
  },
  buttonText: {
    // Style for text inside buttons
    color: "white",
    fontWeight: "bold",
  },
  itemStyle: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
    backgroundColor: "white",
    padding: 10, // Added padding for content inside
    margin: 8, // Margin to create space between grid items
    width: "40%", // Adjust width for grid layout
    alignItems: "center", // Center content horizontally
  },
  itemText: {
    fontSize: 24,
  },
  listArea: {
    backgroundColor: "lightgrey",
    flex: 1,
    width: "100%",
    padding: 20,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
