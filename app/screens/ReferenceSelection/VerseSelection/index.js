import React, { useEffect, useState } from "react";
import { View } from "native-base";
import SelectionGrid from "../../../components/SelectionGrid";
import vApi from "../../../utils/APIFetch";
import { connect } from "react-redux";

import { styles } from "./styles";

const SelectVerse = (props) => {
  const selectedBookId = props.route.params
    ? props.route.params.selectedBookId
    : null;
  const selectedBookName = props.route.params
    ? props.route.params.selectedBookName
    : null;
  const selectedChapterNumber = props.route.params
    ? props.route.params.selectedChapterNumber
    : null;
  const totalChapters = props.route.params
    ? props.route.params.totalChapters
    : null;
  const [versesData, setVersesData] = useState([]);
  const style = styles(props.colorFile, props.sizeFile);
  const { parallelSourceId, sourceId } = props;
  const fectchVerses = async () => {
    let versesArray = [];
    const sId = props.route.params.parallelContent
      ? parallelSourceId
      : sourceId;
    const url =
      "bibles/" +
      sId +
      "/books/" +
      selectedBookId +
      "/chapters/" +
      selectedChapterNumber +
      "/verses";
    let verses = await vApi.get(url);
    verses.map((item) => versesArray.push(item.verse.number));
    setVersesData(versesArray);
  };
  const onNumPress = (item) => {
    if (props.route.params) {
      props.route.params.getReference({
        bookId: selectedBookId,
        bookName: selectedBookName,
        chapterNumber: selectedChapterNumber,
        totalChapters: totalChapters,
        selectedVerse: item ? item : 1,
      });
      props.navigation.navigate("Bible");
    }
  };
  useEffect(() => {
    fectchVerses();
  }, [selectedBookId, selectedChapterNumber]);
  return (
    <View style={{ flex: 1 }}>
      <SelectionGrid
        styles={style}
        onNumPress={(item, index) => {
          onNumPress(item, index);
        }}
        numbers={versesData}
        selectedNumber={props.route.params.selectedVerse}
        blueText={props.colorFile.blueText}
        textColor={props.colorFile.textColor}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    parallelSourceId: state.selectContent.parallelLanguage.sourceId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(SelectVerse);
