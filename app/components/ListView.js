import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { styles } from "../screens/About/styles";

function ListView(props) {
  const { data, colorFile, sizeFile } = props;
  const style = styles(colorFile, sizeFile);
  return (
    <SafeAreaView style={style.list}>
      {data.map((item) => (
        <View style={{ flexDirection: "row" }} key={item}>
          <Text style={style.bulletIcon}>{"\u2022"}</Text>
          <Text style={style.bulletText}>{item}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
export default connect(mapStateToProps, null)(ListView);
