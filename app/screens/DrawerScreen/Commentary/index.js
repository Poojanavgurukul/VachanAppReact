import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { vachanAPIFetch, selectContent } from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import RenderHTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";
import SelectContent from "../../../components/Bible/SelectContent";
import constants from "../../../utils/constants";
import ModalDropdown from "react-native-modal-dropdown";
import { getBookChaptersFromMapping } from "../../../utils/UtilFunctions";
import { useWindowDimensions } from "react-native";

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";
const renderersProps = {
  img: {
    enableExperimentalPercentWidth: true,
  },
};
const DrawerCommentary = (props) => {
  const {
    bookId: pBookId,
    chapterNumber: pChapterNumber,
    bookName: pBookName,
    parallelMetaData: pParallelMetaData,
    parallelLanguage,
    colorFile,
    sizeFile,
    vachanAPIFetch: pVachanAPIFetch,
    availableContents,
    language,
    selectContent: pSelectContent,
    error: pError,
    commentaryContent,
    navigation,
  } = props;
  const [baseUrl, setBaseUrl] = useState("");
  const [totalChapters, setTotalChapters] = useState(
    Array.from(new Array(getBookChaptersFromMapping(pBookId)), (x, i) =>
      (i + 1).toString()
    )
  );
  const scrollRef = useRef(null);
  const scroll = () => {
    scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  };
  const { width } = useWindowDimensions();
  const [chapterNumber, setChapterNumber] = useState(pChapterNumber);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState(pBookName);
  const [bookId, setBookId] = useState(pBookId);
  const [bookNameList, setBookNameList] = useState([]);
  const [dropDownList, setDropDownList] = useState([]);
  const [bookResponse, setBookResponse] = useState([]);
  const [parallelMetaData, setParallelMetaData] = useState(pParallelMetaData);
  const [commentaryLanguage, setParallelLanguage] = useState(parallelLanguage);
  const [selectedBookIndex, setSelectedBookIndex] = useState(-1);
  let _dropdown_1;
  let _dropdown_2;

  const style = styles(colorFile, sizeFile);
  let alertPresent = false;
  const fetchBookName = async () => {
    try {
      const response = await vApi.get("booknames");
      setBookResponse(response);
      updateBookName(response);
    } catch (error) {
      setError(error);
      setBookNameList([]);
      setBookResponse([]);
    }
  };
  const updateBookName = (bookRes) => {
    let res = bookRes == null ? bookResponse : bookRes;
    if (res.length > 0) {
      let bookNameLists = [];
      let dropDownLists = [];
      if (res) {
        for (let i = 0; i <= res.length - 1; i++) {
          let languages = commentaryLanguage.languageName.toLowerCase();
          if (res[i].language.name === languages) {
            let bookLists = res[i].bookNames.sort(function (a, b) {
              return a.book_id - b.book_id;
            });
            for (let j = 0; j <= bookLists.length - 1; j++) {
              let bId = bookLists[j].book_code;
              let bName = bookLists[j].short;
              let bNumber = bookLists[j].book_id;
              if (bId == bookId) {
                setBookName(bName);
                setBookId(bId);
              }
              bookNameLists.push({
                bookName: bName,
                bookId: bId,
                bookNumber: bNumber,
              });
              dropDownLists.push(bName);
            }
          }
        }
        setBookNameList(bookNameLists);
        setDropDownList(dropDownLists);
      } else {
        return;
      }
    }
  };

  const onSelectBook = (index, val) => {
    if (bookNameList.length > 0) {
      let bookId = null;
      bookNameList.forEach((item) => {
        if (item.bookName == val) {
          bookId = item.bookId;
        }
      });
      setBookId(bookId);
      setTotalChapters(
        Array.from(new Array(getBookChaptersFromMapping(bookId)), (x, i) =>
          (i + 1).toString()
        )
      );
      let selectedNumber =
        totalChapters.length < chapterNumber ? "1" : chapterNumber;
      _dropdown_2.select(parseInt(selectedNumber) - 1);
      setChapterNumber(selectedNumber);
      setSelectedBookIndex(index);
      setBookName(val);
      scroll();
      commentaryUpdate();
    }
  };
  const onSelectChapter = (index, value) => {
    setChapterNumber(parseInt(value));
    commentaryUpdate();
    scroll();
  };
  const commentaryUpdate = () => {
    let url =
      "commentaries/" +
      commentaryLanguage.sourceId +
      "/" +
      bookId +
      "/" +
      chapterNumber +
      commentaryKey;
    pVachanAPIFetch(url);
  };
  const fetchCommentary = () => {
    let commentary = [];
    availableContents.forEach((element) => {
      if (element.contentType == "commentary") {
        element.content.forEach((lang) => {
          if (lang.languageName == language) {
            commentary = lang;
          }
        });
      }
    });
    if (Object.keys(commentary).length > 0) {
      setParallelMetaData(commentary.versionModels[0].metaData[0]);
      setParallelLanguage({
        languageName: commentary.languageName,
        versionCode: commentary.versionModels[0].versionCode,
        sourceId: commentary.versionModels[0].sourceId,
      });

      commentaryUpdate();
      pSelectContent({
        parallelLanguage: {
          languageName: commentary.languageName,
          versionCode: commentary.versionModels[0].versionCode,
          sourceId: commentary.versionModels[0].sourceId,
        },
        parallelMetaData: commentary.versionModels[0].metaData[0],
      });
    } else {
      setParallelMetaData(constants.defaultCommentaryMd);
      setParallelLanguage(constants.defaultCommentary);
      commentaryUpdate();
      pSelectContent({
        parallelLanguage: constants.defaultCommentary,
        parallelMetaData: constants.defaultCommentaryMd,
      });
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
        if (commentaryLanguage) {
          commentaryUpdate();
        }
      } else {
        alertPresent = false;
      }
    }
  };

  const updateData = () => {
    errorMessage();
  };

  const tagsStyles = React.useMemo(
    () => ({
      body: {
        fontSize: sizeFile.contentText,
        color: colorFile.textColor,
        fontWeight: "normal",
        lineHeight: sizeFile.lineHeight,
      },
      img: {
        width: "90%",
        objectFit: "contain",
        alignSelf: "center",
      },
    }),
    [sizeFile, colorFile]
  );
  const formatCommentary = (str) => {
    const regex = new RegExp("base_url", "g");
    return { html: str?.replace(regex, baseUrl) };
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
        {item.text != "" && (
          <RenderHTML
            contentWidth={width}
            renderersProps={renderersProps}
            tagsStyles={tagsStyles}
            source={formatCommentary(item.text)}
          />
        )}
      </View>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        {commentaryContent?.bookIntro != "" ? (
          <View style={style.cardItemBackground}>
            <Text style={style.commentaryHeading}>Book Intro</Text>
            {commentaryContent?.bookIntro != "" && (
              <RenderHTML
                contentWidth={width}
                renderersProps={renderersProps}
                tagsStyles={tagsStyles}
                source={formatCommentary(commentaryContent?.bookIntro)}
              />
            )}
          </View>
        ) : null}
      </View>
    );
  };

  const renderFooter = () => {
    var metadata = parallelMetaData;
    return (
      <View style={{ paddingVertical: 20 }}>
        {commentaryContent?.commentaries && metadata && (
          <View style={style.centerContainer}>
            {metadata?.publishingYear !== null &&
              metadata?.publishingYear !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                  <Text>Publishing Year:</Text> {metadata?.publishingYear}
                </Text>
              )}
            {metadata?.license !== null && metadata?.license !== "" && (
              <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                <Text>License:</Text> {metadata?.license}
              </Text>
            )}
            {metadata?.copyrightHolder !== null &&
              metadata?.copyrightHolder !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                  <Text>Copyright Holder:</Text> {metadata?.copyrightHolder}
                </Text>
              )}
          </View>
        )}
      </View>
    );
  };
  useEffect(() => {
    fetchBookName();
    fetchCommentary();
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <SelectContent
            navigation={navigation}
            navStyles={navStyles}
            iconName={"arrow-drop-down"}
            title={commentaryLanguage.languageName}
            displayContent="commentary"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    setParallelLanguage(parallelLanguage);
    setParallelMetaData(pParallelMetaData);
    commentaryUpdate();
    navigation.setOptions({
      headerRight: () => (
        <View style={style.headerView}>
          <SelectContent
            navigation={navigation}
            navStyles={navStyles}
            iconName={"arrow-drop-down"}
            title={commentaryLanguage.languageName}
            displayContent="commentary"
          />
        </View>
      ),
    });
  }, [
    parallelLanguage.sourceId,
    parallelLanguage.languageName,
    commentaryLanguage.sourceId,
    commentaryLanguage.languageName,
  ]);
  useEffect(() => {
    commentaryUpdate();
    updateBookName();
  }, [
    JSON.stringify(commentaryContent),
    commentaryLanguage.sourceId,
    chapterNumber,
    bookId,
  ]);
  useEffect(() => {
    if (selectedBookIndex == -1) {
      dropDownList.forEach((b, index) => {
        if (bookName == b) {
          onSelectBook(index, b);
        }
      });
    } else {
      _dropdown_1.select(selectedBookIndex);
    }
  }, [dropDownList, selectedBookIndex, bookName]);
  useEffect(() => {
    onSelectBook(selectedBookIndex, bookName);
    commentaryUpdate();
  }, [chapterNumber, bookId, commentaryLanguage.sourceId]);

  return (
    <View style={style.container}>
      {pError ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ReloadButton
            styles={style}
            reloadFunction={updateData}
            message={null}
          />
        </View>
      ) : commentaryLanguage == undefined ? null : (
        <View style={{ flex: 1 }}>
          <View style={style.dropdownPosition}>
            <TouchableOpacity
              onPress={() => {
                _dropdown_1 && _dropdown_1.show();
              }}
              style={style.dropdownView}
            >
              <ModalDropdown
                ref={(el) => (_dropdown_1 = el)}
                options={dropDownList}
                onSelect={onSelectBook}
                style={{ paddingRight: 20 }}
                defaultValue={bookName}
                isFullWidth={true}
                dropdownStyle={style.dropdownSize}
                dropdownTextStyle={{ fontSize: 18 }}
                textStyle={style.dropdownText}
              />
              <Icon
                name="arrow-drop-down"
                color={colorFile.iconColor}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                _dropdown_2 && _dropdown_2.show();
              }}
              style={style.dropdownView}
            >
              <ModalDropdown
                ref={(el) => (_dropdown_2 = el)}
                options={totalChapters}
                onSelect={onSelectChapter}
                defaultValue={chapterNumber?.toString()}
                isFullWidth={true}
                dropdownStyle={style.dropdownSize}
                dropdownTextStyle={{ fontSize: 18 }}
                textStyle={style.dropdownText}
              />
              <Icon
                name="arrow-drop-down"
                color={colorFile.iconColor}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={commentaryContent?.commentaries}
            ref={scrollRef}
            // showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, margin: 16 }}
            keyExtractor={(item) => item.verse}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
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
    availableContents: state.contents.contentLanguages,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    chapterNumber: state.updateVersion.chapterNumber,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
  };
};

const navStyles = StyleSheet.create({
  title: {
    color: "#333333",
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue_Color,
    zIndex: 0,
    width: "100%",
  },

  border: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    borderWidth: 0.2,
    borderColor: Color.White,
  },
  headerRightStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Color.Blue_Color,
  },
  touchableStyleRight: {
    alignSelf: "center",
  },
  titleTouchable: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightdownload: {
    alignSelf: "flex-end",
  },
  touchableStyleLeft: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  headerTextStyle: {
    fontSize: 18,
    color: Color.White,
    textAlign: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerCommentary);
