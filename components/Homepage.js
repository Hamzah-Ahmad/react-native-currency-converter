import React, { useState, useEffect } from "react";
import axios from "axios";
import { Picker } from "@react-native-community/picker";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { currencyArray } from "../currencies.js";

const styles = StyleSheet.create({
  appLoadingIndicator: {
    position: "absolute",
    marginTop: 150,
    marginLeft: 150,
  },
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
  loadingIndicator: {
    position: "absolute",
    marginTop: 340,
    marginLeft: 150,
  },
  picker: {
    width: 120,
  },
  pickerTouchable: {
    width: 120,
    backgroundColor: "white",
    opacity: 0.7,
    marginBottom: 10,
    padding: 0,
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
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
    marginTop: 20,
  },
});

const Homepage = (props) => {
  const [inputVal, setInputVal] = useState(10);
  const [outputVal, setOutputVal] = useState(0);
  const [queryCurrency, setQueryCurrency] = useState("GBP");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingApp, setLoadingApp] = useState(false);
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

  const changeTargetCurrency = async (val) => {
    setTargetCurrency(val);
    try {
      await AsyncStorage.setItem("TARGET_CURRENCY", val);
    } catch (e) {
      console.error("Failed to save target currency.");
    }
  };

  const changeQueryCurrency = async (val) => {
    setQueryCurrency(val);
    try {
      await AsyncStorage.setItem("QUERY_CURRENCY", val);
    } catch (e) {
      console.error("Failed to save query currency.");
    }
  };
  const load = async () => {
    setLoadingApp(true);
    try {
      const targetCurrency = await AsyncStorage.getItem("TARGET_CURRENCY");

      if (targetCurrency !== null) {
        setTargetCurrency(targetCurrency);
      } else {
        console.log("Cant find target currency");
        setTargetCurrency(currencyArray[1]);
      }
      const queryCurrency = await AsyncStorage.getItem("QUERY_CURRENCY");

      if (queryCurrency !== null) {
        setQueryCurrency(queryCurrency);
      } else {
        setQueryCurrency(currencyArray[0]);
      }
      setLoadingApp(false);
    } catch (e) {
      console.error("Failed to load target currency.");
    }
  };

  const reverseCurrencies = () => {
    let query = queryCurrency;
    let target = targetCurrency;
    changeQueryCurrency(target);
    changeTargetCurrency(query);
    setOutputVal(0);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      {!loadingApp ? (
        <View>
          <View>
            <View style={styles.pickerTouchable}>
              <Picker
                selectedValue={queryCurrency}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  console.log("On Value Change ran");
                  changeQueryCurrency(itemValue);
                }}
              >
                {currencyArray.map((currency) => (
                  <Picker.Item
                    key={currency}
                    label={`${currency}`}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              onChangeText={(text) => setInputVal(parseInt(text))}
              value={`${inputVal}`}
              style={styles.input}
            />
          </View>
          <View>
            <View style={styles.pickerTouchable}>
              <Picker
                selectedValue={targetCurrency}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  console.log("On Value Change ran");
                  changeTargetCurrency(itemValue);
                  setOutputVal(0);
                }}
              >
                {currencyArray.map((currency) => (
                  <Picker.Item
                    key={currency}
                    label={`${currency}`}
                    value={currency}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              onChangeText={(text) => setOutputVal(text)}
              value={`${outputVal}`}
              style={{ ...styles.input, backgroundColor: "#a8a8a8" }}
              editable={false}
            />
          </View>
          {error ? (
            <Text style={styles.errorText}>Something Went Wrong</Text>
          ) : null}
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={handlePress}
          >
            <Text style={styles.btnText}>Convert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={reverseCurrencies}
          >
            <Text style={styles.btnText}>Reverse</Text>
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#f2f2f2"
              style={styles.loadingIndicator}
            ></ActivityIndicator>
          ) : null}
        </View>
      ) : (
        <View>
          <ActivityIndicator
            size="large"
            color="#f2f2f2"
            style={styles.appLoadingIndicator}
          ></ActivityIndicator>
        </View>
      )}
    </View>
  );
};

export default Homepage;
