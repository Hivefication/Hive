
// http://there4development.com/blog/2012/07/29/handlebars-helpers-for-debugging-and-pluralization/
// usage: {{pluralize collection.length 'quiz' 'quizzes'}}
Handlebars.registerHelper('pluralize', function (number, single, plural) {
  return (number <= 1) ? single : plural;
});

// usage: {{fromNow date}}
Handlebars.registerHelper('fromNow', function (date) {
  return moment(date).fromNow();
});

// usage: {{date date}}
Handlebars.registerHelper('date', function (date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});


Template.playerboard.players = function () {
  return Players.find({}, { sort: { score: -1, name: 1 } });
};


Template.player.events({
  'click': function () {
    Session.set('selected_player', this._id);
  }
}); 

Template.player.selected = function () {
  return Session.equals('selected_player', this._id) ? 'active' : '';
};


Template.player_details.events({
  'click .inc': function () {
    Players.update(Session.get("selected_player"), { $inc: { score: 5 } });
  },
  'click .set': function () {
    Players.update(Session.get("selected_player"), { $set: { score: Session.get("random") } });
    Session.set("random", Math.round(100 * Math.random()));
  }
});

Template.player_details.selected_name = function () {
  var player = Players.findOne(Session.get("selected_player"));
  return player && player.name;
};

Template.player_details.random = function () {
  return Session.get("random");
};

Template.player_details.player_badges = function () {
  return Players.findOne({ _id: Session.get('selected_player') }).badges;
};

Template.player_details.player_score = function () {
  return Players.findOne({ _id: Session.get('selected_player') }).score;
};

Template.player_details.player_events = function() {
  return Players.findOne({ _id: Session.get("selected_player") }).events;
};


Template.event.rendered = function () {
  jQuery(this.find('.event-date')).tooltip();
};

Template.event.event_name = function () {
  return EventTypes.findOne({ _id: this.eventTypeId }).name;
};


Template.badge.badge_icon_url = function () {
  return 'http://192.168.219.130:8888/badges/' + this._id + '/icon';
};


Meteor.startup(function () {
  Session.set("random", Math.round(100 * Math.random()));
});