import React, { useEffect, useContext, useState, useMemo } from "react";
import { FlatList, Animated, View, Text, Platform } from "react-native";
import { createResponder } from "react-native-gesture-responder";
import VerseView from "../../screens/Bible/VerseView";
import { getHeading } from "../../utils/UtilFunctions";
import { connect } from "react-redux";
import { changeSizeOnPinch } from "../../utils/BiblePageUtil";
import { LoginData } from "../../context/LoginDataProvider";
import { BibleMainContext } from "../../screens/Bible/index";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const AnimatedVerseList = (props) => {
  const arrLayout = [];

  let _scrollEndTimer, _offsetValue = 0, _scrollValue = 0;

  const [
    {
      chapterContent,
      styles,
      navigation,
      _clampedScrollValue,
      scrollAnim,
      offsetAnim,
      chapterHeader,
    },
  ] = useContext(BibleMainContext);
  const {
    currentVisibleChapter,
    selectedReferenceSet,
    notesList,
    highlightedVerseArray,
    showColorGrid,
    getSelectedReferences,
    bottomHighlightText,
  } = useContext(LoginData);
  const [gestureState, setGestureState] = useState('')
  const [left, setLeft] = useState('')
  const [top, setTop] = useState('')
  const [thumbSize, setThumbSize] = useState('')
  let pinchDiff = null;
  let pinchTime = new Date().getTime();

  const onLayout = (event, index, verseNumber) => {
    arrLayout[index] = {
      height: event.nativeEvent.layout.height,
      verseNumber,
      index,
    };
  };

  const _keyExtractor = (item, index) => {
    return index.toString();
  };

  const _onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > NAVBAR_HEIGHT &&
        _clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? _offsetValue + NAVBAR_HEIGHT
        : _offsetValue - NAVBAR_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const _onScrollEndDrag = () => {
    _scrollEndTimer = setTimeout(_onMomentumScrollEnd(), 250);
  };
  const _onMomentumScrollBegin = () => {
    clearTimeout(_scrollEndTimer);
  };
  changeSizeByOne = (value) => {
    changeSizeOnPinch(value, props.updateFontSize, props.colorFile, styles);
  };

  // const ZoomTextSize = () => {
  //   (gestureResponder = React.useRef(
  //     createResponder({
  //       onStartShouldSetResponder: () => true,
  //       onStartShouldSetResponderCapture: () => true,
  //       onMoveShouldSetResponder: () => true,
  //       onMoveShouldSetResponderCapture: () => true,
  //       onResponderGrant: () => { },
  //       onResponderMove: (evt, gestureState) => {
  //         let thumbS = thumbSize
  //         if (gestureState.pinch && gestureState.previousPinch) {
  //           thumbS *= gestureState.pinch / gestureState.previousPinch;
  //           let currentDate = new Date().getTime();
  //           //  pinchTime = new Date().getTime();
  //           let diff = currentDate - pinchTime;
  //           pinchDiff = null;
  //           if (diff > pinchDiff) {
  //             if (gestureState.pinch - gestureState.previousPinch > 5) {
  //               // large
  //               changeSizeByOne(1);
  //             } else if (gestureState.previousPinch - gestureState.pinch > 5) {
  //               // small
  //               changeSizeByOne(-1);
  //             }
  //           }
  //           pinchDiff = diff;
  //           pinchTime = currentDate;
  //         }
  //         let lf = left
  //         let tp = top
  //         lf += gestureState.moveX - gestureState.previousMoveX;
  //         tp += gestureState.moveY - gestureState.previousMoveY;
  //         setGestureState(...gestureState)
  //         setLeft(lf)
  //         setTop(tp)
  //         setThumbSize(thumbS)
  //       },
  //       onResponderTerminationRequest: () => true,
  //       onResponderRelease: (gestureState) => {
  //         setGestureState(...gestureState)
  //       },
  //       onResponderTerminate: (gestureState) => { },
  //       onResponderSingleTapConfirmed: () => { },
  //       moveThreshold: 2,
  //       debug: false,
  //     })
  //   ).current),
  //     [];
  // };
  // const position = useRef(new Animated.ValueXY()).current;
  // const gestureResponder = useMemo(() => React.useRef(
  //   createResponder({
  //     onStartShouldSetResponderCapture: (evt, gestureState) => true,
  //     onResponderMove: (evt, gestureState) => {
  //       console.log(" Resture handler ")
  //       let thumbS = thumbSize
  //       if (gestureState.pinch && gestureState.previousPinch) {
  //         thumbS *= gestureState.pinch / gestureState.previousPinch;
  //         let currentDate = new Date().getTime();
  //         //  pinchTime = new Date().getTime();
  //         let diff = currentDate - pinchTime;
  //         pinchDiff = null;
  //         if (diff > pinchDiff) {
  //           if (gestureState.pinch - gestureState.previousPinch > 5) {
  //             // large
  //             changeSizeByOne(1);
  //           } else if (gestureState.previousPinch - gestureState.pinch > 5) {
  //             // small
  //             changeSizeByOne(-1);
  //           }
  //         }
  //         pinchDiff = diff;
  //         pinchTime = currentDate;
  //       }
  //       let lf = left
  //       let tp = top
  //       lf += gestureState.moveX - gestureState.previousMoveX;
  //       tp += gestureState.moveY - gestureState.previousMoveY;
  //       setGestureState(...gestureState)
  //       setLeft(lf)
  //       setTop(tp)
  //       setThumbSize(thumbS)
  //     },
  //     onResponderTerminate: (gestureState) => { },
  //   }), []))
  // useEffect(() => {
  //   ZoomTextSize
  // }, [])
  const renderFooter = () => {
    if (chapterContent.length === 0) {
      return null;
    } else {
      return (
        <View
          style={[
            styles.addToSharefooterComponent,
            { marginBottom: showColorGrid && bottomHighlightText ? 32 : 16 },
          ]}
        >
          {
            <View style={styles.footerView}>
              {props.revision !== null && props.revision !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>Copyright:</Text>{" "}
                  {props.revision}
                </Text>
              )}
              {props.license !== null && props.license !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>License:</Text>{" "}
                  {props.license}
                </Text>
              )}
              {props.technologyPartner !== null &&
                props.technologyPartner !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={styles.textListFooter}
                  >
                    <Text style={styles.footerText}>Technology partner:</Text>{" "}
                    {props.technologyPartner}
                  </Text>
                )}
            </View>
          }
        </View>
      );
    }
  };
  return (
    <AnimatedFlatlist
      // {...gestureResponder}
      data={chapterContent}
      // ref={(ref) => (this.verseScroll = ref)}
      contentContainerStyle={
        chapterContent.length === 0
          ? styles.centerEmptySet
          : {
            paddingHorizontal: 16,
            paddingTop: props.visibleParallelView ? 52 : 90,
            paddingBottom: 90,
          }
      }
      scrollEventThrottle={1}
      onMomentumScrollBegin={_onMomentumScrollBegin}
      onMomentumScrollEnd={_onMomentumScrollEnd}
      onScrollEndDrag={_onScrollEndDrag}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollAnim, y: scrollAnim },
            },
          },
        ],
        { useNativeDriver: true }
      )}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <VerseView
          // ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
          verseData={item}
          sectionHeading={getHeading(item.contents)}
          chapterHeader={chapterHeader}
          index={index}
          onLayout={onLayout}
          styles={styles}
          selectedReferences={selectedReferenceSet}
          getSelection={(verseIndex, chapterNumber, verseNumber, text) => {
            props.visibleParallelView == false &&
              getSelectedReferences(
                verseIndex,
                chapterNumber,
                verseNumber,
                text
              );
          }}
          highlightedVerse={highlightedVerseArray}
          notesList={notesList}
          chapterNumber={currentVisibleChapter}
          navigation={navigation}
        />
      )}
      keyExtractor={_keyExtractor}
      ListFooterComponent={renderFooter}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    revision: state.updateVersion.revision,
    license: state.updateVersion.license,
    technologyPartner: state.updateVersion.technologyPartner,
    visibleParallelView: state.selectContent.visibleParallelView,
    colorFile: state.updateStyling.colorFile,
    sizeFile: state.updateStyling.sizeFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateFontSize: (payload) => dispatch(updateFontSize(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AnimatedVerseList);
