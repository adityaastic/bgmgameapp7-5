import { useState } from "react";

const useCrossingGame = () => {
  const [crossingFirstInput, setCrossingFirstInput] = useState(null);
  const [crossingSecondInput, setCrossingSecondInput] =
    useState(crossingFirstInput);
  const [crossingPoints, setCrossingPoints] = useState(null);
  const [crossingJodis, setCrossingJodis] = useState(null);

  const buildCrossingJodi = (number1, number2) => {
    // Convert numbers to strings
    const strNumber1 = number1.toString();
    const strNumber2 = number2.toString();

    // Initialize an array to store pairs
    const pairs = [];

    // Iterate through each digit in number1
    for (let i = 0; i < strNumber1.length; i++) {
      const digit1 = parseInt(strNumber1[i], 10);

      // Iterate through each digit in number2
      for (let j = 0; j < strNumber2.length; j++) {
        const digit2 = parseInt(strNumber2[j], 10);

        // Create a pair and add it to the array
        const pair = digit1 * 10 + digit2;
        !pairs.includes(pair) &&
          pairs.push(String(pair).padStart(2, "0"));
      }
    }

    return pairs;
  };

  const deleteCrossingJodi = (jodi) => {
    setCrossingJodis(
      crossingJodis.filter((crossingJodi) => crossingJodi !== jodi)
    );
  };

  const calculateCrossingPointsTotal = () =>
    crossingJodis?.length * crossingPoints || 0;

  return {
    crossingFirstInput,
    crossingSecondInput,
    setCrossingFirstInput,
    setCrossingSecondInput,
    deleteCrossingJodi,
    crossingPoints,
    setCrossingPoints,
    crossingJodis,
    setCrossingJodis,
    buildCrossingJodi,
    calculateCrossingPointsTotal,
  };
};

export default useCrossingGame;
