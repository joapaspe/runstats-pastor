/**
 * Created by jpastor on 14/08/15.
 */
'use strict';


// Selected colors

var selected_colors = [
  "#337ab7",
  "#d9edf7",
  "#b9def0",
  "#f8efc0"
];
// filters
// Utils
var filters = {};

filters.len = function(input) {
  if (input instanceof Object) {
    return Object.keys(input).length;
  }
  else {
    return input.length;
  }
};

function to_HHMMSS(seconds) {
  var hours = Math.floor(seconds/3600);
  var res_sec = seconds%3600;
  var minutes = Math.floor(res_sec/60);
  res_sec = res_sec%60;
  //Fixme use string builder or sprintf library
  return ""+hours+":"+minutes+":"+res_sec;
};

filters.min_per_km = function(input, $filter) {
  // second per meter
  var value = input * 3.6;

  var date = new Date(1970,0,1).setSeconds(value);
  $filter('date')(date,"mm'm' ss's/km'");
};

function get_pace(distance, time) {
  if (distance && distance > 0) {
    return distance/time;
  }
  return null;
}

function short_name(name, max_car) {

  if (name.length < max_car) {
    return name;
  }

  var new_name = [];
  var words = name.split(" ");
  for(var w in words) {
    new_name += words[w][0];
  }

  return new_name;
}

function get_real_best_pace(race) { return get_pace(race.distance, race.real_best);}
function get_best_pace(race) { return get_pace(race.distance, race.real_avg);}
function get_real_avg_pace(race) {return get_pace(race.distance, race.real_best);}
function get_avg_pace(race) {return get_pace(race.distance, race.real_avg);}

function get_options(race, options) {

  var names = [];
  var values = [];
  for(var i in options) {
    var opt = options[i];
    var value = null;


    if ("key" in opt) {
      value = race[opt.key];
    }
    else if("func" in opt) {
      value = opt.func(race);
    }

    if (value === null) {
      value = 0;
    }

    if (opt.filter) {
      value = opt.filter(value);
    }
    if (opt.norm) {
      if (typeof (opt.norm) === "function") {
        value = opt.norm(value);
      }
      else {
        value /= opt.norm;
      }

    }
    names.push(opt.name);
    values.push(value);

  }
  return [names, values];

}
