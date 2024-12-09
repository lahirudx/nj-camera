import { Link, useFocusEffect } from "expo-router";
import { FlatList, Pressable, StyleSheet, Image, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { getMediaType, MediaType } from "../utils/media";
import { ResizeMode, Video } from "expo-av";

type Media = {
  name: string;
  uri: string;
  type: MediaType;
};

export default function HomeScreen() {
  const [images, setImages] = useState<Media[]>([]);

  console.log("images", images);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    if (FileSystem.documentDirectory) {
      const res = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      setImages(
        res.map((file) => ({
          name: file,
          uri: FileSystem.documentDirectory + file,
          type: getMediaType(file),
        }))
      );
    } else {
      console.error("Document directory is null");
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={3}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        refreshing={false}
        onRefresh={loadFiles}
        renderItem={({ item }) => (
          <Link href={`/${item.name}`} asChild>
            <Pressable
              style={{
                flex: 1,
                maxWidth: "33.3%",
              }}
            >
              {item.type === "image" && (
                <Image source={{ uri: item.uri }} style={styles.image} />
              )}
              {item.type === "video" && (
                <Video
                  source={{ uri: item.uri }}
                  resizeMode={ResizeMode.COVER}
                  positionMillis={100}
                  style={styles.image}
                />
              )}
            </Pressable>
          </Link>
        )}
      />

      <Link href="/camera" asChild>
        <Pressable style={styles.floatingButton}>
          <MaterialIcons name="photo-camera" size={30} color="white" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    backgroundColor: "royalblue",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  image: {
    aspectRatio: 3 / 4,
    borderRadius: 5,
  },
});
