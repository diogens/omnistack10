import React from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";

const Profile = ({ navigation }) => {
  const githubUserName = navigation.getParam("github_username");
  return (
    <WebView
      style={{ flex: 1 }}
      source={{ uri: `https://github.com/${githubUserName}` }}
    ></WebView>
  );
};

export default Profile;
