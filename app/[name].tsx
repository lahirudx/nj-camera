import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Image, View } from "react-native";
import * as FileSystem from "expo-file-system";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getMediaType } from "../utils/media";
import { ResizeMode, Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";

export default function ImageDetailsScreen() {
  const { name } = useLocalSearchParams();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const fullUri = `${FileSystem.documentDirectory}${name}`;
  const type = getMediaType(fullUri);

  const onSave = async () => {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const asset = await MediaLibrary.createAssetAsync(fullUri);
  };

  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: Array.isArray(name) ? name.join(", ") : name,
          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={onDelete}
                name="delete"
                size={26}
                color="crimson"
              />
              <MaterialIcons
                onPress={onSave}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />

      {type === "image" && (
        <Image source={{ uri: fullUri }} style={styles.image} />
      )}
      {type === "video" && (
        <Video
          source={{ uri: fullUri }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          style={styles.image}
          isLooping
          useNativeControls
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
