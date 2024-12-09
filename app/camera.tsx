import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Link, router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import path from "path";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);
  const camera = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | null>(null);

  const startRecording = async () => {
    setIsRecording(true);
    const res = await camera?.current?.recordAsync();

    if (res) {
      setVideo(res.uri);
    }
    setIsRecording(false);
  };

  const onPress = () => {
    if (isRecording) {
      camera?.current?.stopRecording();
    } else {
      takePicture();
    }
  };

  const takePicture = async () => {
    const res = await camera?.current?.takePictureAsync();

    if (res) {
      setPicture(res);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const saveFile = async (uri: string) => {
    const filename = path.parse(uri).base;

    await FileSystem.copyAsync({
      from: uri,
      to: FileSystem.documentDirectory + filename,
    });
    setPicture(null);

    router.back();
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="green" />
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image
            source={{ uri: picture.uri }}
            style={{ width: "100%", flex: 1 }}
          />
        )}
        {video && (
          <Video
            source={{ uri: video }}
            style={{ width: "100%", flex: 1 }}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay
            isLooping
          />
        )}
        <View style={{ padding: 10 }}>
          <SafeAreaView>
            <Button
              title="Save"
              onPress={() => saveFile(picture?.uri || video || "")}
            />
          </SafeAreaView>
        </View>
        <MaterialIcons
          onPress={() => {
            setPicture(null);
            setVideo(null);
          }}
          name="close"
          size={35}
          color="white"
          style={{ position: "absolute", top: 50, left: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        mode="video"
        style={styles.camera}
        facing={facing}
        ref={camera}
      >
        <View style={styles.footer}>
          <View />
          <Pressable
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? "crimson" : "white" },
            ]}
            onPress={onPress}
            onLongPress={startRecording}
          />
          <MaterialIcons
            onPress={toggleCameraFacing}
            name="flip-camera-ios"
            size={24}
            color="white"
          />
        </View>
      </CameraView>

      <MaterialIcons
        name="close"
        size={30}
        color="white"
        onPress={router.back}
        style={styles.backButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
  },
  footer: {
    marginTop: "auto",
    backgroundColor: "#00000099",
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
