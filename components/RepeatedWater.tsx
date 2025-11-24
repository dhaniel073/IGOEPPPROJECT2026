import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

function RepeatedWatermark({ text }: { text: string }) {
  const rows = 10;
  const cols = 5;
  const watermarkElements = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      watermarkElements.push(
        <Text
          key={`${i}-${j}`}
          style={[
            styles.watermarkText,
            {
              top: (height / rows) * i,
              left: (width / cols) * j,
            },
          ]}
        >
          {text}
        </Text>
      );
    }
  }

  return <View style={styles.watermarkContainer}>{watermarkElements}</View>;
}

const styles = StyleSheet.create({
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none", // doesn't block touches
  },
  watermarkText: {
    position: "absolute",
    fontSize: 25,
    color: "gray",
    opacity: 0.09,
    transform: [{ rotate: "-25deg" }],
    fontWeight: "bold",
  },
});

export default RepeatedWatermark
