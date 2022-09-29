import { Toast } from "native-base";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Card, CardItem } from "native-base";
import { styles } from "./styles";
import ListContainer from "../../components/Common/FlatList";
import { connect } from "react-redux";
import { GIT_BASE_API } from "../../utils/APIConstant";

const IslVideo = (props) => {
  const bookId = props.route.params ? props.route.params.bookId : null;
  const bookName = props.route.params ? props.route.params.bookName : null;
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const style = styles(props.colorFile, props.sizeFile);

  const fetchVideo = () => {
    fetch(`${GIT_BASE_API}video/signbible/ISL.json`)
      .then((res) => res.json())
      .then((response) => {
        Object.values(response.books);
        let videoBook = [];
        let found = false;
        for (let key in response.books) {
          var videoAll = [];
          if (response.books.hasOwnProperty(key)) {
            if (key == bookId) {
              let objBook = response.books[key];
              Object.values(objBook).map((el) => {
                el.map((item) => {
                  videoBook.push({
                    title: item.title,
                    url: item.url,
                    description: item.description,
                    theme: item.title,
                  });
                });
                found = true;
              });
            } else {
              for (var l = 0; l < Object.values(response.books).length; l++) {
                let resBook = Object.values(response.books)[l];
                Object.values(resBook).map((el) => {
                  el.forEach((item) => {
                    videoAll.push({
                      title: item.title,
                      url: item.url,
                      description: item.description,
                      theme: item.title,
                    });
                  });
                });
              }
            }
          }
        }
        if (found) {
          setVideos(videoBook);
          setMessage("");
        } else {
          if (bookId) {
            Toast.show({
              text:
                "Video for " +
                bookName +
                " is unavailable. You can check other books",
              duration: 8000,
              position: "top",
            });
          }
          setVideos(videoAll);
          setMessage("");
        }
      });
  };
  const playVideo = (val) => {
    const videoId = val.url;
    props.navigation.navigate("PlayVideo", {
      url: videoId,
      title: val.title,
      description: val.description,
      theme: val.theme,
    });
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    return (
      <Card>
        <CardItem style={style.cardItemStyle}>
          <TouchableOpacity
            style={style.videoView}
            onPress={() => playVideo(item)}
          >
            <Text style={style.videoText}>{item.title}</Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };
  useEffect(() => {
    fetchVideo();
  }, [bookId]);
  return (
    <View style={style.container}>
      <ListContainer
        listData={videos}
        listStyle={style.centerEmptySet}
        renderItem={renderItem}
        containerStyle={style.emptyMessageContainer}
        icon="video-library"
        iconStyle={style.emptyMessageIcon}
        textStyle={style.messageEmpty}
        keyExtractor={(item, index) => index}
        message={message}
        onPress={emptyMessageNavigation}
      />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
export default connect(mapStateToProps, null)(IslVideo);
