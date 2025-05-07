import React, { useEffect, useRef, useState } from 'react'
import useSetJodis from './useSetJodis';

const useManualGame = () => {
  const { jodiPoints, setJodiInput } = useSetJodis();
  const [manualInputs, setManualInputs] = useState([]);
  const [points, setPoints] = useState({});
  const inputRefs = useRef({});

  const handleNumberChange = (manualField, numberIndex, value) => {
    const existingJodi = manualInputs.find(
      (jodi) => jodi.manualField === manualField && jodi.numberIndex === numberIndex
    );

    if (existingJodi) {
      // If Jodi already exists, update the points value 
      existingJodi.points = points.manualField === manualField ? points.value : 0;;
      existingJodi.betKey = value;
    } else {
      // If Jodi doesn't exist, create a new Jodi object
      setManualInputs((prevInputs) => [
        ...prevInputs,
        { manualField, numberIndex, betKey: value, points: manualField === points.manualField ? points.value : 0 },
      ]);
    }

    if (value.length === 2) {
      const nextNumberIndex = numberIndex + 1;
      const nextInputRef = inputRefs.current[`${manualField}-${nextNumberIndex}`];
      if (nextInputRef) {
        nextInputRef.focus();
      }
    }
  };

  const handlePointsChange = (manualField, value) => {
    setPoints({ manualField, value });
    setManualInputs((prevInputs) =>
      prevInputs.map((jodi) =>
        jodi.manualField === manualField ? { ...jodi, points: value } : jodi
      )
    );
  };

  const calculateTotalPoints = (manualField) => {
    // Calculate the total points for a specific manual field
    return manualInputs
      .filter((jodi) => jodi.manualField === manualField && jodi.betKey)
      .reduce((total, jodi) => total + Number(jodi.points), 0);
  };

  const calculateTotalPointsAdded = () => {
    // Calculate the total points for a specific manual field
    return manualInputs.filter(jodi => jodi.betKey)
      .reduce((total, jodi) => total + Number(jodi.points), 0);
  };

  return {handleNumberChange, handlePointsChange, calculateTotalPoints, calculateTotalPointsAdded, setPoints, manualInputs, inputRefs,}
}

export default useManualGame