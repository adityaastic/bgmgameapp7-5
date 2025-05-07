const ConvertTime = (time24) => {
  // Parse the input time
  const time = time24.split(":");
  let hours = parseInt(time[0]);
  const minutes = parseInt(time[1]);

  // Determine the period (AM or PM)
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12
  if (hours === 0 && period === 'AM') {
    hours = 12; // Midnight should be represented as 12:XX AM, not 0:XX AM
  } else if (hours === 0 && period === 'PM') {
    hours = 12; // Noon should be represented as 12:XX PM, not 0:XX PM
  }

  // Format the result
  let time12 = hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + period;

  return time12;
}
export default ConvertTime;

// Example usage:
// const inputTime24 = "15:30";
// const outputTime12 = useConvertTime(inputTime24);
// console.log("12-hour formatted time:", outputTime12);

export function separateDateAndTime(dateTimeString) {
  if (dateTimeString && dateTimeString.length > 5) {
    // console.log("Date: ", dateTimeString)
     let datePart, timePart;
     if (dateTimeString.includes("T")) {
       [datePart, timePart] = dateTimeString.split("T");
     } else {
       // Assuming the format is 'YYYY-MM-DD HH:MM:SS' if not 'T' is present
       [datePart, timePart] = dateTimeString.split(" ");
     }
     const [year, month, day] = datePart.split("-");
     // Adjusting month from 0-based to 1-based
     const formattedDate = `${day}-${parseInt(month, 10) + 1}-${year}`;
     return { date: formattedDate, time: timePart };
  }
 }

