import React, { useEffect, useState, useContext } from "react";
import { FlatList, Alert, Text, View, useWindowDimensions } from "react-native";
import { connect } from "react-redux";
import { Body, Header, Right, Title, Button } from "native-base";
import {
  vachanAPIFetch,
  parallelVisibleView,
} from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import RenderHTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";
import { LoginData } from "../../../context/LoginDataProvider";
import { MainContext } from "../../../context/MainProvider";

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";

const Commentary = (props) => {
  const { width } = useWindowDimensions();
  const {
    bookName: pBookName,
    bookId,
    parallelMetaData,
    colorFile,
    sizeFile,
    commentaryContent,
    pError,
    parallelLanguage,
    vachanAPIFetch,
    parallelVisibleView,
  } = props;
  const { currentVisibleChapter } = useContext(LoginData);
  const [error, setError] = useState(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [bookNameList, setBookNameList] = useState([]);
  const [bookName, setBookName] = useState(pBookName);
  const { bookList } = useContext(MainContext);
  const style = styles(colorFile, sizeFile);
  let alertPresent = false;
  const fetchBookName = async () => {
    try {
      let response = await vApi.get("booknames");
      setBookNameList(response);
    } catch (error) {
      setError(error);
      setBookNameList([]);
    }
  };
  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (pError || error) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
        if (parallelLanguage) {
          const url =
            "commentaries/" +
            parallelLanguage.sourceId +
            "/" +
            bookId +
            "/" +
            currentVisibleChapter +
            commentaryKey;
          vachanAPIFetch(url);
        }
      } else {
        alertPresent = false;
      }
    }
  };
  const updateData = () => {
    errorMessage();
  };
  const getHTML = (html) => {
    const tagsStyles = {
      body: {
        fontSize: sizeFile.contentText,
        color: colorFile.textColor,
        fontWeight: "normal",
        lineHeight: sizeFile.lineHeight,
      },
      img: {
        width: "40%",
        objectFit: "contain",
        alignSelf: "center",
      },
    };
    const renderersProps = {
      img: {
        enableExperimentalPercentWidth: true,
      },
    };
    const regex = new RegExp("base_url", "g");
    const source = { html: html?.replace(regex, baseUrl) };
    return (
      <RenderHTML
        contentWidth={width}
        renderersProps={renderersProps}
        tagsStyles={tagsStyles}
        source={source}
      />
    );
  };
  useEffect(() => {
    if (parallelMetaData?.baseUrl != undefined) {
      setBaseUrl(parallelMetaData.baseUrl);
    }
  }, [parallelMetaData]);
  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ? (
            <Text style={style.commentaryHeading}>Chapter Intro</Text>
          ) : (
            <Text style={style.commentaryHeading}>
              Verse Number : {item.verse}
            </Text>
          ))}
        {item?.text != "" && getHTML(item.text)}
      </View>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        {commentaryContent && commentaryContent?.bookIntro == "" ? null : (
          <View style={style.cardItemBackground}>
            <Text style={style.commentaryHeading}>Book Intro</Text>
            {commentaryContent?.bookIntro != "" &&
              getHTML(commentaryContent?.bookIntro)}
          </View>
        )}
      </View>
    );
  };
  const renderFooter = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        {commentaryContent?.commentaries && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {parallelMetaData?.publishingYear !== null &&
              parallelMetaData?.publishingYear !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text style={style.footerText}>Publishing Year:</Text>{" "}
                  {parallelMetaData?.publishingYear}
                </Text>
              )}
            {parallelMetaData?.license !== null &&
              parallelMetaData?.license !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text style={style.footerText}>License:</Text>{" "}
                  {parallelMetaData?.license}
                </Text>
              )}
            {parallelMetaData?.copyrightHolder !== null &&
              parallelMetaData?.copyrightHolder !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text style={style.footerText}>Copyright Holder:</Text>{" "}
                  {parallelMetaData?.copyrightHolder}
                </Text>
              )}
          </View>
        )}
      </View>
    );
  };
  const updateBookName = () => {
    if (bookNameList) {
      for (var i = 0; i <= bookNameList.length - 1; i++) {
        let parallelLanguage =
          parallelLanguage && parallelLanguage.languageName.toLowerCase();
        if (bookNameList[i].language.name === parallelLanguage) {
          for (var j = 0; j <= bookNameList[i].bookNames.length - 1; j++) {
            var bId = bookNameList[i].bookNames[j].book_code;
            if (bId == bookId) {
              let bookName = bookNameList[i].bookNames[j].short;
              setBookName(bookName);
            }
          }
        }
      }
    } else {
      return;
    }
  };
  const fetchCommentary = () => {
    if (parallelLanguage) {
      let url =
        "commentaries/" +
        parallelLanguage.sourceId +
        "/" +
        bookId +
        "/" +
        currentVisibleChapter +
        commentaryKey;
      vachanAPIFetch(url);
      updateBookName();
    }
  };

  const closeParallelView = (value) => {
    parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    });
  };
  useEffect(() => {
    fetchCommentary();
    fetchBookName();
  }, []);
  useEffect(() => {
    fetchCommentary();
  }, [
    bookId,
    bookList,
    currentVisibleChapter,
    parallelLanguage.sourceId,
    commentaryContent,
  ]);
  useEffect(() => {
    fetchBookName();
    updateBookName();
  }, [bookNameList]);
  return (
    <View style={style.container}>
      <Header
        style={{
          backgroundColor: Color.Blue_Color,
          height: 40,
          borderLeftWidth: 0.5,
          borderLeftColor: Color.White,
        }}
      >
        <Body>
          <Title style={{ fontSize: 16, alignSelf: "center" }}>
            {parallelLanguage && parallelLanguage.versionCode}
          </Title>
        </Body>
        <Right>
          <Button transparent onPress={() => closeParallelView(false)}>
            <Icon name="cancel" color={Color.White} size={20} />
          </Button>
        </Right>
      </Header>

      {pError ? (
        <View style={style.reloadButtonPos}>
          <ReloadButton
            style={style}
            reloadFunction={updateData}
            message={null}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={[style.commentaryHeading, { margin: 10 }]}>
            {bookName != null && bookName} {} {commentaryContent?.chapter}
          </Text>
          <FlatList
            data={commentaryContent?.commentaries}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, margin: 16 }}
            renderItem={renderItem}
            keyExtractor={(item) => item.text}
            // ListFooterComponent={<View style={style.listFooter}></View>}
            ListHeaderComponent={ListHeaderComponent}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Commentary);
