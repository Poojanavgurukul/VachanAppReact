import { StyleSheet } from "react-native";
import Color from "../../utils/colorConstants";

export const styles = (colorFile, sizeFile) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorFile.backgroundColor,
    },
    textStyle: {
      color: colorFile.textColor,
      fontSize: sizeFile.contentText,
      textAlign: "justify",
    },
    textContainer: {
      margin: 16,
      padding: 8,
    },
    boldText: {
      fontWeight: "bold",
      color: colorFile.textColor,
      fontSize: sizeFile.titleText,
    },
    linkText: {
      color: Color.Blue_Color,
      textDecorationLine: "underline",
      fontSize: sizeFile.contentText,
    },

    titleText: {
      paddingTop: 6,
      paddingBottom: 5,
      fontSize: sizeFile.titleText,
      color: colorFile.sectionHeading,
    },
    bulletIcon: {
      fontSize: sizeFile.contentText,
      color: colorFile.textColor,
      lineHeight: sizeFile.lineHeight,
    },
    bulletText: {
      flex: 1,
      paddingLeft: 10,
      color: colorFile.textColor,
      fontSize: sizeFile.contentText,
      lineHeight: sizeFile.lineHeight,
    },
    list: {
      flex: 1,
      paddingLeft: 5,
    },
    heading: {
      fontSize: sizeFile.titleText,
      color: colorFile.textColor,
      fontWeight: "bold",
    },
  });
};
