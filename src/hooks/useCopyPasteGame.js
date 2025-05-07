import { useState } from "react";

const useCopyPasteGame = () => {
  const [jodis, setJodis] = useState([]);

  function reversePair(pair) {
    // Function to reverse a two-digit number
    return pair.toString().split("").reverse().join("");
  }

  function createPairsAndReverse(inputNumber, points, isPalti) {
    const numberString = inputNumber.toString();
    const result = [];

    for (let i = 0; i < numberString.length - 1; i += 2) {
      const pair = parseInt(numberString.slice(i, i + 2));
      isPalti
        ? result.push(
            { pair: String(pair).padStart(2, "0"), points },
            {
              pair: String(reversePair(pair)).padEnd(2, "0"),
              points,
            }
          )
        : result.push({
            pair: String(pair).padStart(2, "0"),
            points,
          });
    }

    // If the number has an odd length, add the last digit as a single-digit pair twice
    if (isPalti && numberString.length % 2 !== 0) {
      const lastDigit = numberString.slice(-1);
      result.push({ pair: lastDigit + lastDigit, points });
    } else if (numberString.length % 2 !== 0) {
      return "Number length should be even.";
    }

    setJodis(result);
  }

  const deleteJodi = (removeJodi) => {
    setJodis(jodis.filter((jodi) => jodi !== removeJodi));
  };

  const calculatCopyPastePointsTotal = (points) => points * jodis.length;

  return {
    jodis,
    createPairsAndReverse,
    deleteJodi,
    calculatCopyPastePointsTotal,
  };
};

export default useCopyPasteGame;
