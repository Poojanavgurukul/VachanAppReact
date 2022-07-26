import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FlowLayout from "../../components/FlowLayout";

import { styles } from "./styles.js";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import Color from "../../utils/colorConstants";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { updateVersionBook } from "../../store/action/";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

const EditNote = (props) => {
  const {
    route,
    uid,
    colorFile,
    sizeFile,
    sourceId,
    navigation,
    updateVersionBook,
  } = props;
  const { params } = route;
  const richText = useRef();
  const noteIndex = params ? params.noteIndex : null;
  const noteObject = params ? params.notesList : null;
  const bcvRef = params ? params.bcvRef : null;
  let bodyData = params ? params.contentBody : "";
  const [contentBody, setContentBody] = useState(bodyData);
  const style = styles(colorFile, sizeFile);
  const saveNote = () => {
    var time = Date.now();
    var firebaseRef = database().ref(
      "users/" + uid + "/notes/" + sourceId + "/" + bcvRef.bookId
    );
    if (contentBody == "") {
      alert(" Note should not be empty");
    } else {
      var edit = database().ref(
        "users/" +
          uid +
          "/notes/" +
          sourceId +
          "/" +
          bcvRef.bookId +
          "/" +
          bcvRef.chapterNumber
      );
      if (noteIndex != -1) {
        let updates = {};
        updates["/" + noteIndex] = {
          createdTime: time,
          modifiedTime: time,
          body: contentBody,
          verses: bcvRef.verses,
        };
        edit.update(updates);
      } else {
        var notesArray = noteObject.concat({
          createdTime: time,
          modifiedTime: time,
          body: contentBody,
          verses: bcvRef.verses,
        });
        let updates = {};
        updates[bcvRef.chapterNumber] = notesArray;
        firebaseRef.update(updates);
      }
      params?.onbackNote();
      navigation.pop();
    }
  };

  const openReference = () => {
    if (
      contentBody !== params.contentBody ||
      bcvRef.verses.length !== params.bcvRef.verses.length
    ) {
      Alert.alert("Save Changes ? ", "Do you want to save the note ", [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
        {
          text: "No",
          onPress: () => {
            updateVersionBook({
              bookId: bcvRef.bookId,
              bookName: bcvRef.bookName,
              chapterNumber: bcvRef.chapterNumber,
              totalChapters: getBookChaptersFromMapping(bcvRef.bookId),
            });
            navigation.navigate("Bible");
          },
        },
        { text: "Yes", onPress: saveNote },
      ]);
      return;
    }
    updateVersionBook({
      bookId: bcvRef.bookId,
      bookName: bcvRef.bookName,
      chapterNumber: bcvRef.chapterNumber,
      totalChapters: getBookChaptersFromMapping(bcvRef.bookId),
    });
    navigation.navigate("Bible");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontSize: 16,
            color: Color.White,
            fontWeight: "700",
            marginRight: 12,
          }}
        >
          Note
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ margin: 8 }} onPress={saveNote}>
          <Text
            style={{
              fontSize: 16,
              color: Color.White,
              fontWeight: "700",
              marginRight: 12,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [contentBody]);
  return (
    <View style={style.containerEditNote}>
      <View style={style.subContainer}>
        {bcvRef && (
          <FlowLayout
            style={style.tapButton}
            dataValue={bcvRef}
            openReference={(index) => openReference(index)}
            styles={style}
          />
        )}
      </View>
      <ScrollView style={style.containerEditNote}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RichEditor
            ref={richText}
            initialContentHTML={contentBody}
            onChange={(descriptionText) => {
              setContentBody(descriptionText);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={[{ color: tintColor }]}>H1</Text>
          ),
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    uid: state.userInfo.uid,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNote);
