import React, { Component } from "react";

import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../utils/colorConstants";

const SelectionGrid = ({
  styles,
  onNumPress,
  numbers,
  loader,
  selectedChapterNumber,
  blueText,
  textColor,
}) => (
  <View style={styles.chapterSelectionContainer}>
    {loader && <Spinner visible={true} textContent={"Loading..."} />}
    <FlatList
      numColumns={4}
      data={numbers}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[styles.selectGridNum, { backgroundColor: Color.Transparent }]}
          onPress={() => {
            onNumPress(item, index);
          }}
        >
          <View>
            <Text
              style={[
                styles.chapterNum,
                {
                  fontWeight: item == selectedChapterNumber ? "bold" : "normal",
                  color: item == selectedChapterNumber ? blueText : textColor,
                },
              ]}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListFooterComponent={<View style={{ marginBottom: 84 }} />}
    />
  </View>
);
export default SelectionGrid;
