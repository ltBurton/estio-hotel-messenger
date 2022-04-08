import { ChatEngine, sendMessage } from 'react-chat-engine';
import _ from 'lodash'
import ChatFeed from './components/ChatFeed';
import LoginForm from './components/LoginForm';
import './App.css';
import holidayData from './static/holidayData.json';

const projectID = 'e1d642e8-ec61-488e-98c5-f0ab1d9c726f';

const App = () => {
  var firstConnect = false;
  var messageNumber = 0;
  var response = ['', ''];
  return (
    <ChatEngine
      height="100vh"
      projectID={projectID}
      userName="Client"
      userSecret="Admin"
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      onNewMessage={function (chatId, senderData) {
        console.log("senderData", senderData);
        console.log("chatId", chatId);
        console.log("LOOK HERE", messageNumber);
        if (messageNumber == 4) {
          messageNumber = 0;
        }
        if (senderData.sender.first_name == "Client" && senderData.sender.first_name != "Harold") {
          response = botResponse(senderData, messageNumber, response[0]);
          messageNumber = messageNumber + 1;
          sendMessage({ userName: "Harold", projectID: projectID, userSecret: "Admin" }, chatId, response[1]);
        }
      }}
    />
  );
};

function botResponse(clientMessage, msgNumber, currentSelction) {
  var holiday = currentSelction;
  var newHoliday = [];
  var response = { text: '' }
  if (msgNumber == 0) {
    response.text = 'What is your price range? (Min-Max)'
  } else if (msgNumber == 1) {
    response.text = 'What is your ideal location? (Moutains/Urban/Ocean)'
    holidayData.map(function (o, c) {
      var min = clientMessage.text.split('-')[0];
      var max = clientMessage.text.split('-')[1];

      if (o.pricePerNight >= min && o.pricePerNight <= max) {
        newHoliday.push(o);
      }
    })
  } else if (msgNumber == 2) {
    response.text = 'What is your ideal temparture? (20+/10-19/less than 9)'
    holiday.map(function (o, c) {
      var msg = clientMessage.text;
      if (msg.toLowerCase() == "urban" && o.location == "city") {
        newHoliday.push(o)
      } else if (msg.toLowerCase() == "ocean" && o.location == "sea") {
        newHoliday.push(o)
      } else if (msg.toLowerCase() == "mountains" && o.location == "mountain") {
        newHoliday.push(o)
      }
    })
  }
  else if (msgNumber == 3) {
    debugger;
    holiday.map(function (o, c) {
      var msg = clientMessage.text;
      if (msg.toLowerCase() == "20+" && o.tempRating == "hot") {
        newHoliday.push(o)
      } else if ((msg.toLowerCase() == "10-19") && o.tempRating == "mild") {
        newHoliday.push(o)
      } else if (msg.toLowerCase() == "less than 9" && o.tempRating == "cold") {
        newHoliday.push(o)
      }
    })
    if(newHoliday.length ==0) newHoliday = holiday
    response.text = `The holidays most suitable to your needs would be: ${newHoliday.map(function (o) {
      return `\n
        Name and Location: ${o.hotelName} | ${o.city} | ${o.continent}\n
        Overall Star Rating: ${o.starRating}\n
        Overall Temp Rating: ${o.tempRating}\n
        Location: ${o.location}\n
        Price Per Night: ${o.pricePerNight}\n
      `
    })}`
  }
  console.log("Response: ", response);
  console.log("newHoliday: ", newHoliday);
  console.log("holiday: ", holiday);

  if (!_.isEmpty(newHoliday)) {
    return [newHoliday, response]
  } else {
    return [holiday, response]
  }

}
// infinite scroll, logout, more customizations...

export default App;
