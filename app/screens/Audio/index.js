import { Card, CardItem, View } from "native-base";
import React, { useEffect, useState, useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { updateVersionBook, ToggleAudio } from "../../store/action/";
import { style } from "./style";
import ListContainer from "../../components/Common/FlatList";
import { MainContext } from "../../context/MainProvider";

const Audio = (props) => {
  const { bookList } = useContext(MainContext);

  const styles = style(props.colorFile, props.sizeFile);
  const [allAudioBooks, setAllAudioBooks] = useState(bookList);
  const [message, setMessage] = useState("");
  const navigateToBible = (bId, bookName, chapterNum) => {
    props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
    });
    props.ToggleAudio({ audio: true, status: true });
    props.navigation.navigate("Bible");
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    return (
      <Card>
        <CardItem style={styles.cardItemStyle}>
          <TouchableOpacity
            style={styles.audioView}
            onPress={() =>
              navigateToBible(item.bookId, item.bookName, item.numOfChapters)
            }
          >
            <Text style={styles.audioText}>
              {item && item.bookName} {item && item.numOfChapters}
            </Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };

  const audioData = () => {
    try {
      if (bookList) {
        const audioBooks = props.audioList[0].books;
        if (audioBooks != undefined) {
          const allAudioBook = Object.keys(audioBooks)
            .map((i) => {
              return bookList.find((item) => item.bookId === i);
            })
            .sort((a, b) => a.bookNumber - b.bookNumber);
          if (allAudioBook.length === 0) {
            setMessage(`Audio for ${props.language} not available`);
          } else {
            setAllAudioBooks(allAudioBook);
            setMessage("");
          }
        }
      }
    } catch (error) {
      console.log("ERROR ------> ", error);
    }
  };
  useEffect(() => {
    audioData();
  }, []);
  const keyExtractor = (item, index) => index;
  return (
    <View style={styles.container}>
      <ListContainer
        listData={allAudioBooks}
        listStyle={styles.centerEmptySet}
        renderItem={renderItem}
        icon="volume-up"
        keyExtractor={keyExtractor}
        iconStyle={styles.emptyMessageIcon}
        containerStyle={styles.emptyMessageContainer}
        textStyle={styles.messageEmpty}
        message={message}
        onPress={emptyMessageNavigation}
      />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    audioList: state.updateVersion.audioList,
    audio: state.audio.audio,
    status: state.audio.status,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    ToggleAudio: (value) => dispatch(ToggleAudio(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Audio);
