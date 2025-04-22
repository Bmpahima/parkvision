import { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import {  LIVE_STREAM_URL } from "@env";

import { COLORS } from "../../constants/styles"
import { LinearGradient } from "expo-linear-gradient";

const LiveStreamScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const windowWidth = Dimensions.get("window").width;

  let socket = null;  

  useEffect(() => {
    const connectWebSocket = () => {
      socket = new WebSocket(LIVE_STREAM_URL);
      
      socket.onopen = () => { 
        console.log("WebSocket connected.");
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); 
          if (data.frame) {
            const uri = "data:image/jpeg;base64," + data.frame;
            setImageUri(uri);
          }
        } catch (e) {
          console.log("Error parsing frame:", e);
        }
      };
      

      socket.onerror = (error) => { 
        console.log("WebSocket error:", error);
        setIsConnected(false);
      };

      socket.onclose = () => { 
        console.log("WebSocket disconnected.");
        setIsConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      // סגירת ה־WebSocket כשתצא מהקומפוננטה
      if (socket) {
        socket.close();
        console.log("[INFO] WebSocket connection closed.");
      }
    };
  }, []);


  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
        <View style={styles.header}>
          
          {isConnected ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>Live</Text>
            </View>
          ) : (
            <Text style={styles.disconnectedText}>Disconnected</Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={toggleFullscreen}
          style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.video,
                isFullscreen
                  ? { width: "100%", height: "100%" }
                  : { width: windowWidth - 32, height: ((windowWidth - 32) * 9) / 16 },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Waiting for live stream...</Text>
            </View>
          )}
        </TouchableOpacity>

        {!isFullscreen && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Tap the video to toggle fullscreen mode</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary950,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary950
  },
  fullscreenContainer: {
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 6,
  },
  statusText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  disconnectedText: {
    color: "#9CA3AF",
    fontWeight: "600",
  },
  videoContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: 0,
  },
  video: {
    borderRadius: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    aspectRatio: 16 / 9,
  },
  loadingText: {
    marginTop: 12,
    color: "#E2E8F0",
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  infoText: {
    color: "#E2E8F0",
    fontSize: 14,
  },
})

export default LiveStreamScreen

