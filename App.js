/*
GENERAL COMMENTS: 
* this app is designed to run on mobile phones only, and isn't supporting any other devices.
* If you want to run it locally (e.g. on Simulator) and the design looks "broken", add a random 
comment anywhere in the code, save and run again. It should fix the issues.

IMPROVEMENTS: 
* to the styling: 
** the base design is now classic. I added the button for different skins: classic, neon and clean.
** Neon style is inspired by neon lights, in pink, blue, white and yellow color scheme. Mode buttons 
are in circled, while all other buttons have a line underneth that "cups" the buttons.
** Clean style has calm, pastel colors, ranging from light blue to violet. The text on the screen is 
white, all other text is black. Buttons are square with rounded edges and remind of Apple keyboard. 
The background is set up as a rough, concrete wall in the night.

* to the UI and UX:
** the scientific buttons were added on the left and mode buttons were added on the top. Each skin 
has different icon/button shape with clean style covering the most of touchable space. The operator 
indicator was added on the top of the calculator's screen while degree/radian indicator was added 
on the bottom; they are both aligned to the right. I added indicator for shift button as well.

* to the brain:
** Calculator does all basic operations (+, -, *, /, +-, and C). On the top of the requested functions, 
I added mode buttons and scientific buttons:
*** three top mode buttons: they switch the skins/designs (three designs to swithc between), deg/rad 
mode, and shift which inverts trig functions
*** sci buttons: they compute inverse of x, square of x, and sin, cos, tan, asin, acos, and atan 
functions.

RESOURCES:
CLEAN BACKKGROUND: https://www.freepik.com/free-photo/wall-wallpaper-concrete-colored-painted-textured-concept_3001819.htm#query=walpaper&position=46&from_view=search&track=sph&uuid=fd975a56-121e-4a86-92bb-d03f3432390b Image by rawpixel.com</a> on Freepik
OTHERS: listed in the code.
*/

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

// aTorkar started writing this code
let field_width = Dimensions.get("window").width;
let field_height = Dimensions.get("window").height;
// aTorkar finished writing this code
// aTorkar started writing this code
export default function App() {
  // RESOURCES: https://legacy.reactjs.org/docs/hooks-state.html
  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState(0);
  const [operatorValue, setOperatorValue] = useState("");
  const [degreeValue, setDegreeValue] = useState("DEG");
  const [skinValue, setSkinValue] = useState("CLASSIC");
  const [shiftValue, setShiftValue] = useState("");
  const [sinValue, setSinValue] = useState("sin");
  const [cosValue, setCosValue] = useState("cos");
  const [tanValue, setTanValue] = useState("sin");

  const skins = ["CLASSIC", "NEON", "CLEAN"];

  const buttonPressed = (value) => {
    /**
     * Handle all button presses.
     */
    if (skins.includes(value)) {
      // Increment through skins and swithch to the next one
      const current_idx = skins.indexOf(skinValue);
      const next_idx = (current_idx + 1) % skins.length;
      setSkinValue(skins[next_idx]);
    }

    // Switch between degrees and radians
    if (value === "DEG" && degreeValue === "DEG") {
      setDegreeValue("RAD");
    } else if (value === "DEG" && degreeValue === "RAD") {
      setDegreeValue("DEG");
    }

    // Swithc between shift on/off
    if (value === "SHIFT" && shiftValue === "") {
      shiftOn();
    } else if (value === "SHIFT" && shiftValue === "SHIFT") {
      shiftOff();
    }

    if (operatorValue != "") {
      calculateEquals();
      setMemoryValue(answerValue);
    }
    if (!isNaN(value) | (value === ".")) {
      setAnswerValue(handleNumber(value));
    } else if (value === "C") {
      clear();
    } else if (["/", "x", "-", "+"].includes(value)) {
      handleOperator(value);
    } else if (["+/-", "%", "x/1", "^2", "sin", "cos", "tan"].includes(value)) {
      handleImmediateOperator(value);
    } else if (value === "=") {
      calculateEquals();
      setMemoryValue(null);
      setReadyToReplace(true);
      setOperatorValue("");
    }
  };

  ///////////////////////////////////////////////////////
  //////////// HANDLE NUMBERS, OPERATORS ////////////////
  ///////////////////////////////////////////////////////

  const handleNumber = (number) => {
    /**
     * Handle any pressed number.
     */
    if (readyToReplace) {
      setReadyToReplace(false);
      // RESOURCES: https://www.w3schools.com/jsref/jsref_tostring_number.asp
      return number.toString();
    } else {
      return answerValue + number.toString();
    }
  };
  // aTorkar finished writing this code
  const clear = () => {
    /**
     * Handle "C" button. Clear answer, memory and operator value and set ready to replace to true.
     */

    setAnswerValue("0");
    setMemoryValue(0);
    setOperatorValue(null);
    setReadyToReplace(true);
  };

  const handleOperator = (operator) => {
    /**
     * Handle any oparator that persists in memory, like +, / or *, but not % or inverse.
     */
    setMemoryValue(parseFloat(answerValue));
    setReadyToReplace(true);
    setOperatorValue(operator);
  };
  // aTorkar started writing this code
  const handleImmediateOperator = (operator) => {
    /**
     * Handle different operators that dosen't persist in memory with the switch statement.
     * 

     */
    setReadyToReplace(true);
    // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
    switch (operator) {
      case "+/-":
        // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
        setAnswerValue(parseFloat(-answerValue));
        break;
      case "%":
        setAnswerValue(parseFloat(answerValue) / 100);
        break;
      case "x/1":
        setAnswerValue(parseFloat(answerValue) ** -1);
        break;
      case "^2":
        setAnswerValue(parseFloat(answerValue) ** 2);
        break;
      case "sin":
        // handle computation of (a)sin for deg or rad
        let sin_val = 0.0;
        if (shiftValue === "") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
            sin_val = Math.sin(parseFloat(answerValue));
          } else {
            sin_val = Math.sin((parseFloat(answerValue) * Math.PI) / 180);
          }
        } else if (shiftValue === "SHIFT") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin
            sin_val = Math.asin(parseFloat(answerValue));
          } else {
            sin_val = Math.asin((parseFloat(answerValue) * Math.PI) / 180);
          }
        }
        setAnswerValue(sin_val);
        break;
      case "cos":
        // handle computation of (a)cos for deg or rad
        let cos_val = 0.0;
        if (shiftValue === "") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
            cos_val = Math.cos(parseFloat(answerValue));
          } else {
            cos_val = Math.cos((parseFloat(answerValue) * Math.PI) / 180);
          }
        } else if (shiftValue === "SHIFT") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos
            cos_val = Math.acos(parseFloat(answerValue));
          } else {
            cos_val = Math.acos((parseFloat(answerValue) * Math.PI) / 180);
          }
        }
        setAnswerValue(cos_val);
        break;
      case "tan":
        // handle computation of (a)tan for deg or rad
        let tan_val = 0.0;
        if (shiftValue === "") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan
            tan_val = Math.tan(parseFloat(answerValue));
          } else {
            tan_val = Math.tan((parseFloat(answerValue) * Math.PI) / 180);
          }
        } else if (shiftValue === "SHIFT") {
          if (degreeValue === "RAD") {
            // RESOURCES: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan
            tan_val = Math.atan(parseFloat(answerValue));
          } else {
            tan_val = Math.atan((parseFloat(answerValue) * Math.PI) / 180);
          }
        }

        setAnswerValue(tan_val);
        break;
    }
  };
  // aTorkar finished writing this code
  const calculateEquals = () => {
    /**
     * Evaluate the complete expression and consider operators that persist in memory
     * e.g. +, /, - etc. but not % or inverse
     */
    const previous = parseFloat(memoryValue);
    const current = parseFloat(answerValue);
    // aTorkar started writing this code
    switch (operatorValue) {
      case "+":
        // RESOURCES: https://www.w3schools.com/jsref/jsref_tostring_number.asp
        setAnswerValue((previous + current).toString());
        break;
      case "-":
        setAnswerValue((previous - current).toString());
        break;
      case "x":
        setAnswerValue((previous * current).toString());
        break;
      case "/":
        setAnswerValue((previous / current).toString());
        break;
    }
  };

  ///////////////////////////////////////////////////////
  ////////////////// HELPER FUNCTIONS ///////////////////
  ///////////////////////////////////////////////////////
  // aTorkar finished writing this code
  const getStyles = () => {
    /**
     * Calls the correct style, corresponding to the skinValue.
     */
    // aTorkar started writing this code
    switch (skinValue) {
      case "CLASSIC":
        return styles;
      case "NEON":
        return neon_styles;
      case "CLEAN":
        return clean_styles;
    }
  };

  const shiftOn = () => {
    /**
     * Changes trig functions values to inverse.
     */
    setShiftValue("SHIFT");
    setSinValue("asin");
    setCosValue("acos");
    setTanValue("atan");
  };

  const shiftOff = () => {
    /**
     * Changes trig functions values to regular.
     */
    setShiftValue("");
    setSinValue("sin");
    setCosValue("cos");
    setTanValue("tan");
  };

  ///////////////////////////////////////////////////////
  ////////////////////// ELEMENTS ///////////////////////
  ///////////////////////////////////////////////////////

  return (
    <SafeAreaView style={getStyles().container}>
      <Image
        source={require("./assets/wallpaper.jpg")}
        style={getStyles().backgroundImage}
      />

      <View style={getStyles().space}>
      </View>

      <View style={getStyles().main}>
        {/* RESOURCES: https://www.coursera.org/learn/uol-cm3050-mobile-development/lecture/WnjVw/3-107-touchable-elements */}
        <Text style={getStyles().operator_text}>Operator: {operatorValue}</Text>
        {/* RESOURCES: https://stackoverflow.com/questions/1127905/how-can-i-format-an-integer-to-a-specific-length-in-javascript */}
        <Text style={getStyles().results_text}>
          {parseFloat(answerValue).toFixed(4)}
        </Text>
      </View>

      <View style={[getStyles().main, getStyles().menu]}>
        <Text style={[getStyles().results_text, getStyles().menu_text]}>
          {degreeValue}
        </Text>
        <Text style={[getStyles().results_text, getStyles().menu_text]}>
          {shiftValue}
        </Text>
      </View>

      <View style={[getStyles().row]}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().switch_button]}
          onPress={() => buttonPressed("CLASSIC")}
        >
          <Text
            style={[getStyles().button_text, getStyles().switch_button_text]}
          >
            {skinValue}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().switch_button]}
          onPress={() => buttonPressed("DEG")}
        >
          <Text
            style={[getStyles().button_text, getStyles().switch_button_text]}
          >
            {degreeValue}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().switch_button]}
          onPress={() => buttonPressed("SHIFT")}
        >
          <Text
            style={[getStyles().button_text, getStyles().switch_button_text]}
          >
            SHIFT
          </Text>
        </TouchableOpacity>
      </View>

      <View style={getStyles().row}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().sci_button]}
          onPress={() => buttonPressed("x/1")}
        >
          <Text style={[getStyles().button_text, getStyles().sci_button_text]}>
            x/1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getStyles().button}
          onPress={() => buttonPressed("C")}
        >
          <Text style={getStyles().button_text}>C</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getStyles().button}
          onPress={() => buttonPressed("+/-")}
        >
          <Text style={getStyles().button_text}>+/-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getStyles().button}
          onPress={() => buttonPressed("%")}
        >
          <Text style={getStyles().button_text}>%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().accent_button]}
          onPress={() => buttonPressed("/")}
        >
          <Text
            style={[getStyles().button_text, getStyles().accent_button_text]}
          >
            /
          </Text>
        </TouchableOpacity>
      </View>

      <View style={getStyles().row}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().sci_button]}
          onPress={() => buttonPressed("^2")}
        >
          <Text style={[getStyles().button_text, getStyles().sci_button_text]}>
            ^2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(7)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            7
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(8)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            8
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(9)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            9
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().accent_button]}
          onPress={() => buttonPressed("x")}
        >
          <Text
            style={[getStyles().button_text, getStyles().accent_button_text]}
          >
            x
          </Text>
        </TouchableOpacity>
      </View>

      <View style={getStyles().row}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().sci_button]}
          onPress={() => buttonPressed("sin")}
        >
          <Text style={[getStyles().button_text, getStyles().sci_button_text]}>
            {sinValue}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(4)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            4
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(5)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            5
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(6)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            6
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().accent_button]}
          onPress={() => buttonPressed("-")}
        >
          <Text
            style={[getStyles().button_text, getStyles().accent_button_text]}
          >
            -
          </Text>
        </TouchableOpacity>
      </View>

      <View style={getStyles().row}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().sci_button]}
          onPress={() => buttonPressed("cos")}
        >
          <Text style={[getStyles().button_text, getStyles().sci_button_text]}>
            {cosValue}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(1)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(2)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(3)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            3
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().accent_button]}
          onPress={() => buttonPressed("+")}
        >
          <Text
            style={[getStyles().button_text, getStyles().accent_button_text]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <View style={getStyles().row}>
        <TouchableOpacity
          style={[getStyles().button, getStyles().sci_button]}
          onPress={() => buttonPressed("tan")}
        >
          <Text style={[getStyles().button_text, getStyles().sci_button_text]}>
            {tanValue}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            getStyles().button,
            getStyles().dark_button,
            getStyles().long_button,
          ]}
          onPress={() => buttonPressed(0)}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            0
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().dark_button]}
          onPress={() => buttonPressed(".")}
        >
          <Text style={[getStyles().button_text, getStyles().dark_button_text]}>
            .
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles().button, getStyles().accent_button]}
          onPress={() => buttonPressed("=")}
        >
          <Text
            style={[getStyles().button_text, getStyles().accent_button_text]}
          >
            =
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
// aTorkar finished writing this code
///////////////////////////////////////////////////////
////////////////// CLASSIC STYLES /////////////////////
///////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  // aTorkar started writing this code
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },

  space: {
    flex: 0.15,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  main: {
    flex: 1,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  operator_text: {
    fontSize: field_width * 0.06,
    color: "white",
    textAlign: "right",
    padding: 5,
    textAlign: "left",
  },

  results_text: {
    fontSize: field_width * 0.1,
    color: "white",
    textAlign: "right",
    padding: 5,
  },

  menu: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  menu_text: {
    fontSize: field_height * 0.025,
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 2,
  },

  button: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: field_width * 0.5,
    margin: 7,
  },

  button_text: {
    color: "#000",
    fontSize: field_width * 0.06,
    fontWeight: "bold",
  },

  dark_button: {
    backgroundColor: "#303030", // grey
  },

  dark_button_text: {
    color: "#fff", // white
  },

  accent_button: {
    backgroundColor: "#1e90ef",
  },

  accent_button_text: {
    color: "#fff",
  },

  long_button: {
    flex: 2,
    aspectRatio: 2,
  },

  sci_button: {
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#00008b",
  },

  sci_button_text: {
    color: "#fff",
  },

  switch_button: {
    aspectRatio: 4,
    backgroundColor: "#ffa500",
  },

  switch_button_text: {
    color: "#000",
  },
});

///////////////////////////////////////////////////////
///////////////////// NEON STYLES /////////////////////
///////////////////////////////////////////////////////

const neon_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  space: {
    flex: 0.15,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  main: {
    flex: 1,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  operator_text: {
    fontSize: field_width * 0.06,
    color: "white",
    textAlign: "right",
    padding: 5,
    textAlign: "left",
  },

  results_text: {
    fontSize: field_width * 0.1,
    color: "#da70d6", // orchid
    textAlign: "right",
    padding: 5,
  },

  menu: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  menu_text: {
    fontSize: field_height * 0.025,
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 3,
  },

  button: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: field_width * 0.5,
    margin: 7,
    borderWidth: 3,
    borderBottomColor: "#ffa500", // yellow
  },

  button_text: {
    color: "#ffa500", // yellow
    fontSize: field_width * 0.06,
    fontWeight: "bold",
  },

  dark_button: {
    backgroundColor: "#000", // black
    borderWidth: 3,
    borderBottomColor: "#da70d6", // orchid
  },

  dark_button_text: {
    color: "#da70d6", // orchid
    textShadowColor: "#da70d6",
  },

  accent_button: {
    backgroundColor: "#000",
    borderWidth: 3,
    borderBottomColor: "#00BFFF", // blue
  },

  accent_button_text: {
    color: "#1e90ff",
  },

  long_button: {
    flex: 2,
    aspectRatio: 2,
  },

  sci_button: {
    borderWidth: 3,
    backgroundColor: "#000",
    borderBottomColor: "#fff",
  },

  sci_button_text: {
    color: "#fff",
  },

  switch_button: {
    aspectRatio: 3,
    borderWidth: 3,
    borderColor: "#ffa500",
  },

  switch_button_text: {
    color: "#ffa500",
  },

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});

///////////////////////////////////////////////////////
//////////////////// CLEAN STLYES /////////////////////
///////////////////////////////////////////////////////

const clean_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  space: {
    flex: 0.15,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  
  main: {
    flex: 1,
    alignSelf: "stretch",
    height: 100,
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  operator_text: {
    fontSize: field_width * 0.06,
    color: "white",
    textAlign: "right",
    padding: 5,
    textAlign: "left",
  },

  results_text: {
    fontSize: field_width * 0.1,
    color: "white",
    textAlign: "right",
    padding: 5,
  },

  menu: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  menu_text: {
    fontSize: field_height * 0.025,
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  button: {
    flex: 1,
    backgroundColor: "#00ced1",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    margin: 3,
    opacity: 0.65,
  },

  button_text: {
    color: "#000",
    fontSize: field_width * 0.06,
    fontWeight: "bold",
  },

  dark_button: {
    backgroundColor: "#1e90ff",
  },

  dark_button_text: {
    color: "#000",
  },

  accent_button: {
    backgroundColor: "#7b68cc",
  },

  accent_button_text: {
    color: "#000",
  },

  long_button: {
    flex: 2.08,
    aspectRatio: 2,
  },

  sci_button: {
    backgroundColor: "#7b68cc",
  },

  sci_button_text: {
    color: "#000",
  },

  switch_button: {
    aspectRatio: 4,
    backgroundColor: "#da70d6",
  },

  switch_button_text: {
    color: "#000",
  },

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
});
// aTorkar finished writing this code