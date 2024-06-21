import { StyleSheet } from "react-native";

import colors from "@utils/colors";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  appointmentText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  input: {
    fontSize: 15,
    height: 40,
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    borderColor: "#ddd",
    alignSelf: "center",
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
    paddingVertical: 3,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Match modalContent's borderRadius
  },
  titleWithError: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure this container stretches to fill its parent
  },
  errorMessage: {
    color: colors.ERROR,
    paddingRight: 12,
    fontWeight: "400",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    margin: 8,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: 40,
  },
  photoUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    width: "90%",
  },
  photoUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
  },
  photoPreview: {
    marginLeft: 15,
    width: 165,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
