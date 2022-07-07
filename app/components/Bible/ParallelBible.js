import React, { useEffect, useState, useContext, useRef } from "react";
import { Text, View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Spinner from "react-native-loading-spinner-overlay";
import {
  selectContent,
  parallelVisibleView,
  updateVersionBook,
} from "../../store/action";
import { styles } from "./styles";
import { connect } from "react-redux";
import {
  getBookChaptersFromMapping,
  getResultText,
  getHeading,
  titleCase,
  showAlert,
} from "../../utils/UtilFunctions";
import { Header, Button, Right, Title } from "native-base";
import Color from "../../utils/colorConstants";
import ReloadButton from "../ReloadButton";
import vApi from "../../utils/APIFetch";
import { BibleMainContext } from "../../screens/Bible/Bible";
import { LoginData } from "../../context/LoginDataProvider";
import { MainContext } from "../../context/MainProvider";
const ParallelBible = (props) => {
  const [{ navigation, bookNames }] = useContext(BibleMainContext); //navigation function values are coming from context
  const { currentVisibleChapter } = useContext(LoginData); //current visible chapter
  const { bookList } = useContext(MainContext);
  const [bookNameList, setBooksList] = useState([]); // current language  booknames list
  const [shortBookName, setShortBookName] = useState(""); //short bookname
  const [message, setMessage] = useState(""); //error messages
  const [chapterContent, setChapterContent] = useState(null);
  const [chapterHeading, setChapterHeading] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    parallelLanguage,
    bookId,
    bookName,
    totalChapters,
    colorFile,
    sizeFile,
    language,
    parallelMetaData,
    updateVersionBook,
    parallelVisibleView,
    visibleParallelView,
  } = props;
  const style = styles(colorFile, sizeFile); // external css file
  const scrollViewRef = useRef(); // scroll reference
  const getBookName = (bookName) => {
    return bookName?.length > 10 ? bookName?.slice(0, 9) + "..." : bookName;
  };
  //get book details from booklist or set error msges
  const updateBook = async () => {
    if (bookNameList?.length > 0) {
      const book = bookNameList?.find((a) => a?.book_code === bookId);
      if (book) {
        setMessage("");
        setShortBookName(getBookName(book?.short));
        fetchBibleChapter(currentVisibleChapter, bookId);
      } else {
        setMessage("This will be available soon");
        setShortBookName("Select Book");
        const msg = ` The book you were reading is not available in ${titleCase(
          parallelLanguage?.languageName
        )} `;
        showAlert(msg);
      }
    }
  };
  useEffect(() => {
    updateBook();
  }, [bookId, bookNameList]);
  useEffect(() => {
    fetchBibleChapter(currentVisibleChapter, bookId);
  }, [bookId, shortBookName, currentVisibleChapter, parallelLanguage]);
  // below function is to fetch the data according to parallel bible
  const fetchBibleChapter = async (chapter, bookId) => {
    try {
      if (parallelLanguage && message.length === 0) {
        setLoading(true);
        // updateBook();
        const url = `bibles/${parallelLanguage.sourceId}/books/${bookId}/chapter/${chapter}`;
        const response = await vApi.get(url); // fetching the response according to updated value in the url
        const content = response?.chapterContent?.contents;
        setChapterContent(content);
        setChapterHeading(getHeading(content));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getBook = (bkId) => {
    if (bookNames) {
      const lan = bookNames.find(
        (ele) => ele?.language?.name === language.toLowerCase()
      );
      const book = lan?.bookNames?.find((a) => a?.book_code === bkId);
      return book?.short;
    }
  };
  //in the below we updating the props values
  const getRef = async (item) => {
    try {
      //set left bible reference
      updateVersionBook({
        bookId: item.bookId,
        bookName: getBook(item.bookId),
        chapterNumber: item.chapterNumber,
        totalChapters: getBookChaptersFromMapping(item.bookId),
      });
    } catch (error) {
      setMessage("");
    }
  };
  const changeBCV = () => {
    //here we are going to referenceSelection tab with updated values
    if (parallelLanguage) {
      navigation.navigate("ReferenceSelection", {
        getReference: getRef,
        parallelContent: true,
        bookId: bookId,
        bookName: bookName,
        chapterNumber: currentVisibleChapter,
        totalChapters: totalChapters,
        language: parallelLanguage.languageName,
        version: parallelLanguage.versionCode,
        sourceId: parallelLanguage.sourceId,
        downloaded: false,
      });
    }
  };
  useEffect(() => {
    fetchBibleChapter(currentVisibleChapter, bookId);
    updateBook();
  }, [shortBookName]);
  useEffect(() => {
    if (bookNames) {
      const parallelLang = parallelLanguage?.languageName?.toLowerCase();
      const lan = bookNames.find((ele) => ele?.language?.name === parallelLang);
      setBooksList(lan?.bookNames);
    }
  }, [bookNames]);
  // below useeffect on changing the dependency value those will run

  const closeParallelView = (value) => {
    if (bookName === undefined) {
      updateVersionBook({
        bookId: bookList[0]?.bookId,
        bookName: bookList[0]?.bookName,
        chapterNumber: "1",
        totalChapters: bookList[0]?.numOfChapters,
      });
    }
    parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    });
  };
  return (
    <View style={style.container}>
      <Header
        style={{
          backgroundColor: Color.Blue_Color,
          height: 40,
          borderLeftWidth: 0.2,
          borderLeftColor: Color.White,
        }}
      >
        <Button transparent onPress={changeBCV}>
          {shortBookName ? (
            <Title style={{ fontSize: 16 }}>
              {shortBookName}{" "}
              {shortBookName !== "Select Book" ? currentVisibleChapter : ""}{" "}
            </Title>
          ) : null}
          <Icon name="arrow-drop-down" color={Color.White} size={20} />
        </Button>
        <Right style={{ position: "absolute", right: 4 }}>
          <Button transparent onPress={() => closeParallelView(false)}>
            <Icon name="cancel" color={Color.White} size={20} />
          </Button>
        </Right>
      </Header>
      {loading && <Spinner visible={true} textContent={"Loading..."} />}
      {!chapterContent && message !== "" ? (
        <View style={style.centerReloadButton}>
          <ReloadButton
            styles={style}
            reloadFunction={() =>
              fetchBibleChapter(currentVisibleChapter, bookId)
            }
            message={message}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={style.scrollVContainer}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {chapterContent &&
              chapterContent.map((verse, index) => (
                <View style={{ marginHorizontal: 16 }} key={index}>
                  {(verse.verseNumber == 1 &&
                    typeof verse.verseNumber != "undefined") == 1 ? (
                    <Text letterSpacing={24} style={style.verseWrapperText}>
                      {typeof verse.verseText == "undefined" ? null : (
                        <Text>
                          {chapterHeading != null ? (
                            <Text style={style.sectionHeading}>
                              {chapterHeading} {"\n"}
                            </Text>
                          ) : null}
                          <Text>
                            <Text style={style.verseChapterNumber}>
                              {currentVisibleChapter}{" "}
                            </Text>
                            <Text style={style.textString}>
                              {getResultText(verse.verseText)}
                            </Text>
                          </Text>
                          {getHeading(verse.contents) ? (
                            <Text style={style.sectionHeading}>
                              {"\n"}
                              {getHeading(verse.contents)}
                            </Text>
                          ) : null}
                        </Text>
                      )}
                    </Text>
                  ) : typeof verse.verseNumber != "undefined" ? (
                    <Text>
                      {typeof verse.verseText == "undefined" ? null : (
                        <Text letterSpacing={24} style={style.verseWrapperText}>
                          <Text>
                            <Text style={style.verseNumber}>
                              {verse.verseNumber}
                            </Text>
                            <Text style={style.textString}>
                              {getResultText(verse.verseText)}
                            </Text>
                          </Text>
                          {getHeading(verse.contents) ? (
                            <Text style={style.sectionHeading}>
                              {"\n"}
                              {getHeading(verse.contents)}
                            </Text>
                          ) : null}
                        </Text>
                      )}
                    </Text>
                  ) : null}
                </View>
              ))}
            <View style={style.addToSharefooterComponent}>
              {parallelMetaData != null && chapterContent && (
                <View style={style.footerView}>
                  {parallelMetaData.revision !== null &&
                    parallelMetaData.revision !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>Copyright:</Text>{" "}
                        {parallelMetaData.revision}
                      </Text>
                    )}
                  {parallelMetaData.license !== null &&
                    parallelMetaData.license !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>License:</Text>{" "}
                        {parallelMetaData.license}
                      </Text>
                    )}
                  {parallelMetaData.technologyPartner !== null &&
                    parallelMetaData.technologyPartner !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>
                          Technology partner:
                        </Text>{" "}
                        {parallelMetaData.technologyPartner}
                      </Text>
                    )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    totalChapters: state.updateVersion.totalChapters,
    bookId: state.updateVersion.bookId,
    chapterNumber: state.updateVersion.chapterNumber,
    bookName: state.updateVersion.bookName,
    language: state.updateVersion.language,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
    visibleParallelView: state.selectContent.visibleParallelView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParallelBible);
