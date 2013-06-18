"use strict";

var Clocks = new Meteor.Collection("clocks");

if (Meteor.isClient) {
  Window.Clocks = Clocks;
  var isClocking = false;
  var currentClock = {};
  var lastClockStart = Date.now();
  
  Handlebars.registerHelper("inSeconds", function(ms) {
    return (ms / 1000).toFixed(1);
  });

  Handlebars.registerHelper("inMinutes", function(ms) {
    var secs = ms / 1000 % 60;
    var mins = ((ms / 1000) - secs) / 60;
    secs = Math.ceil(secs);
    secs = (new Array(3 - secs.toString().length)).join('0') + secs;
    return mins + ":" + secs;
  });

  Handlebars.registerHelper("inTime", function(ms) {
    var t = new Date(ms);
    var hours = t.getHours();
    var mins  = t.getMinutes();
    mins = (new Array(3 - mins.toString().length)).join('0') + mins;
    var secs  = t.getSeconds();
    secs = (new Array(3 - secs.toString().length)).join('0') + secs;

    return hours + ":" + mins + ":" + secs;
  });

  Template.clockr.clocks = function () {
    return Clocks.find({}, { sort: [["start", "desc"]] } );
  };

  Template.clockr.isClocking = function() {
    return ( isClocking ) ? "started" : "";
  };

  Template.clockr.isNewDay = function() {
    var difference = this.start - lastClockStart;
    lastClockStart = this.start;
    if( difference > 1800000 )
      return "new_day";
  };

  Template.clockr.events({
    'click #clock' : function () {
      if(isClocking) { // Stop clocking and save to DB
        currentClock.stop = Date.now();
        currentClock.duration = currentClock.stop - currentClock.start;
        Clocks.insert(currentClock);
        console.log("Start: " + currentClock.start +
                    " | Stop: "  + currentClock.stop +
                    " | Durattion: " + currentClock.duration);
        isClocking = false;
        document.getElementById("clock_label").innerText = "Start Clocking!";
      } else { // Start clocking!
        currentClock.start = Date.now();
        console.log("Started @ " + currentClock.start);
        isClocking = true;
        document.getElementById("clock_label").innerText = "STHAP!";
      }
    },

    'click .remove' : function () {
      Clocks.remove(this._id);
    }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
