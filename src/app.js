var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Accel = require('ui/accel');
var Settings = require('settings');
var URL;

// Set a configurable with the open callback
Settings.config({

    url: 'https://seantodd.no-ip.org/configurable.html' },

    function(e) {
		    
        console.log('opening configurable');

        // Reset color to red before opening the webview
        Settings.option('hostname', 'http://google.co.uk');
    },

    function(e) {

	console.log('closed configurable');
    }
);

// Set a configurable with just the close callback
Settings.config(
    { url: 'https://seantodd.no-ip.org/configurable.html' },
    function(e) {
        console.log('closed configurable');

        // Show the parsed response
        console.log("Data is: " + JSON.stringify(e.options));

        
        var hostname;
        hostname = JSON.parse(decodeURIComponent(e.response));
        localStorage.clear();
        localStorage.setItem("hostname", JSON.stringify(hostname));
        console.log("Host name: " + localStorage.getItem("hostname"));
        URL = hostname;
        
        // Show the raw response if parsing failed
        if (e.failed) {
            console.log(e.response);
        }
    }
);

console.log("The URL is: " + URL);

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
    var domain = data.domain;
    var ipaddress = data.response_ip;
    var statuscode = data.status_code;

    // Show to user
    if (statuscode=="1") {

        card.subtitle("Site Online!");
        card.body(domain + '\n\n' + ipaddress);
        Vibe.vibrate('double');

    } else if (statuscode=="2") {

        card.subtitle("Site Offline!");
        card.body(domain + '\n\n' + "The Web site you seek" + '\n' +"cannot be located but" + '\n' + "endless others exist");
        Vibe.vibrate('double');
    } else if (statuscode=="3") {

        card.subtitle("Bad DNS!");
        card.body("We can't find this domain!" + '\n' + "The excrement has hit the air dispersal device!");
        Vibe.vibrate('double');
    }
};

var AjaxRequest = function(){

    ajax({
        url:'https://isitup.org/seantodd.no-ip.org.json',
        type:'json'

    // success
    }, function(data) { 

        console.log("Successfully fetched Server Status!");
        GetServerStatus(data);

    // failure
    }, function(error) {

        console.log('Failed fetching server status: ' + error);
        card.subtitle("Dun Goofed!");
        card.body("Failed to fetch Server status!" + '\n' + "You may not have internet acces!");
    });
};


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
