import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import { Card, CardItem } from "native-base";
import { Toast } from "native-base";
import vApi from "../../utils/APIFetch";
import ListContainer from "../../components/Common/FlatList.js";
const Video = (props) => {
  const bookId = props.route.params ? props.route.params.bookId : null;
  const bookName = props.route.params ? props.route.params.bookName : null;
  const [videos, setVideos] = useState([]);
  const style = styles(props.colorFile, props.sizeFile);
  const { languageCode, languageName } = props
  const [message, setMessage] = useState("");
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  useEffect(async () => {
    const videosRes = await vApi.get("videos?language=" + languageCode);
    let videoAll = [];
    if (videosRes.success === false) {
      setMessage("No Video for " + languageName);
      return;
    }
    const videos = videosRes[0].books
    for (var book in videos) {
      for (var j = 0; j < videos[book].length; j++) {
        videoAll.push({
          title: videos[book][j].title,
          url: videos[book][j].url,
          description: videos[book][j].description,
          theme: videos[book][j].theme,
          book: book
        });
      }
    }
    var elements = getUniqueListBy(videoAll, "title")
    if (bookId in videos) {
      setVideos(videoAll.filter((ele) => ele.book === bookId));
      setMessage("");
    } else {
      if (bookId) {
        Toast.show({
          text: `Video for ${bookName} is unavailable. You can check other books`,
          duration: 8000,
          position: "top",
        });
      }
      setVideos(elements);
      setMessage("No Video for " + languageName);
    }
  }, [bookId, languageCode]);
  const playVideo = (val) => {
    const videoId = val.url.replace("https://youtu.be/", "");
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


  return (
    <View style={style.container}>
      <ListContainer
        listData={videos}
        listStyle={style.centerEmptySet}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
        containerStyle={style.emptyMessageContainer}
        icon="video-library"
        iconStyle={style.emptyMessageIcon}
        textStyle={style.messageEmpty}
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

export default connect(mapStateToProps, null)(Video);
