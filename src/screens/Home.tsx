/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationProp } from "@react-navigation/native";

type HomeProps = {
  navigation: NavigationProp<any>;
};

const Home = ({ navigation }: HomeProps): JSX.Element => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Movie Detail"
        onPress={() => navigation.navigate("MovieDetail")}
      />
    </View>
  );
};

export default Home;
