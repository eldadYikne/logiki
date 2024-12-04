import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { getCurrentDate } from "../utils";

interface Props {
  item: {
    name: string;
    owner: string;
  };
  signature: string;
}

const ImproveSignature: React.FC<Props> = ({ item, signature }) => {
  return (
    <View>
      <View>
        <Text>יחידת חפ״ק מאו״ג 162 </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}> פריט</Text>
          <Text style={styles.cell}>תאריך</Text>
          <Text style={styles.cell}>שם חותם</Text>
          <Text style={styles.cell}>חתימה</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{getCurrentDate()}</Text>
          <Text style={styles.cell}>{item.owner}</Text>
          <Image style={styles.signature} src={signature} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    padding: 5,
    borderRightColor: "#000",
    borderRightWidth: 1,
    fontSize: 12,
  },
  signature: {
    width: 100,
    height: 50,
  },
});

export default ImproveSignature;
