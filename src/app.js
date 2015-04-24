var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Accel = require('ui/accel');


// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Server Status',
  subtitle:'Fetching...',
  style:'small',
  scrollable:'True'
  });

// Display the Card
card.show();
Accel.init();

// Construct URL



var GetServerStatus= function(data){
// Make the request
card.subtitle("Fetching...");
  card.body(" ");
  var    domain = data.domain;
var    ipaddress = data.response_ip;
var    statuscode = data.status_code;
     // Show to user
    if(statuscode=="1") {card.subtitle("Site Online!");
      card.body(domain + '\n\n' + ipaddress);
 //   card.body(domain);                     
                         Vibe.vibrate('double');
      } else if(statuscode=="2")  {card.subtitle("Site Offline!");
        card.body(domain + '\n\n' + "The Web site you seek" + '\n' +"cannot be located but" + '\n' + "endless others exist");
                                  Vibe.vibrate('double');
  }else if (statuscode=="3"){card.subtitle("Bad DNS!");
                            card.body("We can't find this domain!" + '\n' + "The excrement has hit the air dispersal device!");
  Vibe.vibrate('double');
                            }
};

var AjaxRequest= function(){
  ajax(
  {
    url:'https://isitup.org/seantodd.no-ip.org.json',
    type:'json'
  },
  function(data) { 
        console.log("Successfully fetched Server Status!");
   // console.log(data.domain + data.response_ip + data.status_code);
    GetServerStatus(data);

  },
  function(error) {
        console.log('Failed fetching server status: ' + error);
    card.subtitle("Dun Goofed!");
    card.body("Failed to fetch Server status!" + '\n' + "You may not have internet acces!");
  }
);};
  
AjaxRequest();

card.on('click', 'select', function() {
  console.log('Select button clicked!');
  Vibe.vibrate('short'); 
AjaxRequest();
});
card.on('accelTap', function(e) {
Vibe.vibrate('short'); 
AjaxRequest();
});
