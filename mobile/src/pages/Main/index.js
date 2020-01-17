import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../../services/api";
import { connect, disconnect } from "../../services/socket";

const Main = ({ navigation }) => {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState("");

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }

    loadInitialPosition();
  }, []);

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    function setWebSocket() {
      const { latitude, longitude } = currentRegion;
      connect(latitude, longitude, techs);
    }

    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });

    /*  console.log("Oi Brasil", response.data.dev);
    console.log("Oi Brasil2", techs); */

    setDevs(response.data.dev);
    setWebSocket();
  }

  function handleRegionChaged(region) {
    console.log(region);
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChaged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map((dev, index) => (
          <Marker
            key={index}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url
              }}
            />
            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(",")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Devs .."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff"
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    flexDirection: "row",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#888",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 3
  },
  loadButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "tomato",
    marginLeft: 15
  }
});

export default Main;
