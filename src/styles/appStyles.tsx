import { ImageBackground } from "react-native";
import { Positions } from "react-native-calendars/src/expandableCalendar";
import { getRightStyles } from "react-native-paper/lib/typescript/components/List/utils";

// appStyles.js

const appStyles = {
  header: {
    backgroundColor: '#E1EFE6',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#ffffff',
    zIndex: 1,
    elevation: 4,
  },

  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  Btn: {
    position: 'relative',
  },
  primaryBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#4CB050',
    borderRadius: 40,
    color: 'white',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  secondaryBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#DE7A2D',
    borderRadius: 40,
    color: 'white',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 40,
  },
  callBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#1E4620',
    borderRadius: 40,
    color: 'white',
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    paddingLeft: 45,
    paddingRight: 10,
  },

  stopBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#1E4620',
    borderRadius: 40,
    color: 'white',
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    paddingLeft: 45,
    paddingRight: 10,
  },
  callBtnIcon: {
    position: 'absolute',
    width: 45,
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    left: -5,
    top: -5,
    minHeight: 45,
    minWidth: 45,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green',
    textAlign: 'center',
  },
  logoimage: {
    // textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    resizeMode: 'cover', // or 'stretch' or 'contain'
    height: 220,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contentText: {
    flex: 1,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconLogo: {
    width: 40,
    height: 40,
  },
  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  iconimage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },

  activeText: {
    color: '#ffffff',
    backgroundColor: '#4CB050',
  },
  imguploadBtn: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  otpInput: {
    width: '17%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    textAlign: 'center',
    fontSize: 24,
    color: '#747474',
  },
  cartabsBtn: {
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#E1EFE6',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: '48%',
    fontWeight: '500',
  },
  textIcon: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tagBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginRight: 10,
  },
  label: {
    marginLeft: 4, // Add spacing between the radio button and the label
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tabContentContainer: {
    padding: 15,
  },
  tabContainerItem: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  activetabContainerItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CB050',
  },
  tabContainerText: {
    color: '#000000',
  },
  activeTabContainerText: {
    color: '#4CB050',
  },
  closebutton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
  customTab: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1EFE6',
    backgroundColor: '#E1EFE6',
  },
  customTabContant: {
    paddingTop: 20,
  },
  tabItem: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // minWidth: '50%',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: '#4CB050',
    borderRightColor: '#4CB050',
  },
  tabText: {
    color: '#000000',
  },
  activeTabText: {
    color: '#4CB050',
  },
  chatFix: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    right: 20,
  },
  logoimageCenter: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtn: {
    textAlign: 'center',
    padding: 8,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    color: '#000000',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },

  formOutline: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderColor: '#cccccc',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
    minWidth: 45,
  },

  messagesContainer: {
    flex: 1,
    marginBottom: 8,
  },

  message: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  user1MessageContainer: {
    flexDirection: 'row-reverse', // Align user1 messages to the right
  },
  user2MessageContainer: {
    flexDirection: 'row', // Align user2 messages to the left
  },
  messageContent: {
    maxWidth: '80%', // Limit message width to 80% of the container
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  user1MessageContent: {
    backgroundColor: '#555', // User 1 message background color
    borderTopRightRadius: 0, // Adjust border radius for user1 messages
    color: '#fff',
  },
  user2MessageContent: {
    backgroundColor: '#4CB050', // User 2 message background color
    borderTopLeftRadius: 0, // Adjust border radius for user2 messages
  },
  messageText: {
    fontSize: 15, // Set the default font size for message text
  },
  user1MessageText: {
    color: '#fff', // Set text color to black for user1 messages
  },
  user2MessageText: {
    color: '#fff', // Set text color to white for user2 messages
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    paddingTop: 5,
  },
  user1TimeText: {
    color: '#ddd', // Set text color to black for user1 messages
  },
  user2TimeText: {
    color: '#ddd', // Set text color to white for user2 messages
    alignSelf: 'flex-start',
  },
  // ... (other styles remain the same)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // Position relative for absolute positioning of the button
    elevation: 4,
  },
  input: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingRight: 72,
  },
  sendButton: {
    position: 'absolute', // Position the button absolutely
    right: 100, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15

  },

  recordingButton: {
    position: 'absolute', // Position the button absolutely
    right: 55, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15
  },

  fileButton: {
    position: 'absolute', // Position the button absolutely
    right: 5, // Adjust the right position as needed
    backgroundColor: '#4CB050', // Button background color
    paddingHorizontal: 15,
    paddingVertical: 15
  },

  formInput: {
    backgroundColor: '#ECECEC',
    padding: 15,
  },

  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 10, // Adjust the padding to center the icon vertically
  },
  uploadProfile: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative', // Added position relative to allow absolute positioning of the icon
  },
  profileimg: {
    width: '100%',
    height: '100%',
  },

  icon: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#00000040',
    left: 0,
    right: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 6,
  },
  additionalStyle: {
    paddingLeft: 80,
  },
  timerText: {
    paddingLeft: 15,
    marginLeft: 10,
  },
  footer: {
    position: 'relative',
    backgroundColor: '#4CB050',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    color: '#ffffff',
    zIndex: 1,
    elevation: 5,
  },
  table: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  tableflex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',


  },

  flexcell: {
    width: "20%",
    flex: 0,
  },

  flexcell5: {
    width: "16%",
    flex: 0,
  },


  cell: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
    marginBottom: 10,
  },

  inputNo: {
    height: 37,
    width: '100%',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
    textAlign: 'center',
  },

  nestedScrollView: {
    maxHeight: 490, // Example height, adjust as needed
  },
  innerContent: {
    // Styles for inner content

  },
  footerFix: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    display: 'flex',

    justifyContent: 'space-between',
  },
  headerCell: {
    textAlign: 'center',
    color: '#000000',
    borderWidth: 1,
    padding: 10,
    borderColor: '#cccccc',
    fontSize: 15,
  },
  innerRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  innerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#cccccc',
  },

  innermanualCell: {
    padding: 12,
  },

  inputData: {
    height: 40,
    width: '100%',
    textAlign: 'center',
  },

  inputmanual: {

    width: '100%',
    textAlign: 'center',
  },

  // BY Umang

  disabledBtn: {
    opacity: 0.75
  },

  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },

  optional: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    right: 10,
  },

};

export default appStyles;
