import React, { useContext } from "react";
import { FlatList, TouchableOpacity, View, Dimensions } from "react-native";
import { LoginData } from "../../context/LoginDataProvider";
const width = Dimensions.get("screen").width;
const HighlightColorGrid = () => {
  const { doHighlight } = useContext(LoginData);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          bottom: 60,
          backgroundColor: "#fff",
          position: "absolute",
          width: width,
        }}
      >
        <FlatList
          data={["#fffe00", "#5dff79", "#56f3ff", "#ffcaf7", "#ffc66f"]}
          numColumns={5}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => doHighlight(item)}>
              <View
                style={{
                  backgroundColor: item,
                  marginHorizontal: width / 25,
                  marginVertical: 8,
                  borderWidth: 1,
                  borderColor: item,
                  borderRadius: 21,
                  height: 42,
                  width: 42,
                }}
              ></View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default HighlightColorGrid;
