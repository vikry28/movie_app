import React from "react";
import { View, Text, Button } from "react-native";

const MovieDetail = ({ navigation }: { navigation: any }): JSX.Element => {
  return (
    <View>
      <Text>Movie Detail Screen</Text>
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default MovieDetail;
