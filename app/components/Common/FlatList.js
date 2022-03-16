import React from "react";
import { View, Text, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ListContainer = ({
  listData,
  renderItem,
  listStyle,
  iconStyle,
  icon,
  keyExtractor,
  containerStyle,
  textStyle,
  message,
  onPress,
}) => {
  return (
    <View>
      <FlatList
        data={listData}
        contentContainerStyle={listData.length === 0 && listStyle}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <View style={containerStyle}>
            <Icon name={icon} style={iconStyle} />
            <Text style={textStyle} onPress={onPress}>
              {message}
            </Text>
          </View>
        }
      />
    </View>
  );
};
export default ListContainer;
