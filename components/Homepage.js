import React, { useState } from "react";
import axios from "axios";
import { Picker } from "@react-native-community/picker";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { currencyArray } from "../currencies.js";

const styles = StyleSheet.create({
  btnText: {
    fontSize: 20,
    color: "#fff",
  },
  container: {
    alignItems: "center",
  },
  errorText: {
    color: "#c4360e",
    marginBottom: 20,
    fontSize: 20,
  },
  activityIndicator: {
    position: "absolute",
    // marginBottom: 20,
    marginTop: 210,
  },

  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    width: 350,
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  picker: {
    height: 50,
    width: 180,
    color: "#fff",
  },

  touchableOpacity: {
    backgroundColor: "#026cb3",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 350,
  },
});

const Homepage = (props) => {
  console.log(currencyArray);
  const [inputVal, setInputVal] = useState(10);
  const [outputVal, setOutputVal] = useState(0);
  const [queryCurrency, setQueryCurrency] = useState("GBP");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const host = "api.frankfurter.app";
  const USD = "USD";
  const handlePress = () => {
    setIsLoading(true);
    axios
      .get(
        `https://${host}/latest?amount=${inputVal}&from=${queryCurrency}&to=${targetCurrency}`
      )
      .then((res) => {
        setIsLoading(false);
        setOutputVal(res.data.rates[targetCurrency]);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setError("Something went wrong!");
      });
  };
  return (
    <View style={styles.container}>
      <View>
        <Picker
          selectedValue={currencyArray[1]}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            console.log({ language: itemValue })
          }
        >
          {currencyArray.map((currency) => (
            <Picker.Item
              key={currency}
              label={`${currency}`}
              value={currency}
            />
          ))}
        </Picker>
        <TextInput
          onChangeText={(text) => setInputVal(parseInt(text))}
          value={`${inputVal}`}
          style={styles.input}
        />
      </View>
      <TextInput
        onChangeText={(text) => setOutputVal(text)}
        value={`${outputVal}`}
        style={{ ...styles.input, backgroundColor: "#a8a8a8" }}
        editable={false}
      />
      {error ? (
        <Text style={styles.errorText}>Something Went Wrong</Text>
      ) : null}
      <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
        <Text style={styles.btnText}>Convert</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#f2f2f2"
          style={styles.activityIndicator}
        ></ActivityIndicator>
      ) : null}
    </View>
  );
};

export default Homepage;
