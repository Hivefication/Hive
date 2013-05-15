  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  }); 

  Template.player_details.id = function(){
    return Session.get("selected_player")
  }

  Template.player_details.badges = function(){
    return Players.findOne({_id:Session.get("selected_player")}).badges
  }

  Template.player_details.score = function(){
    return Players.findOne({_id:Session.get("selected_player")}).score
  }

  Template.player_details.eventlist = function(){
    var events = Players.findOne({_id:Session.get("selected_player")}).events;

    for (var i in events){
      if (events[i].eventTypeId){
        events[i].eventtype = EventTypes.findOne({_id:events[i].eventTypeId});
      }
      else{
        events[i].eventtype = {
          name: "Missing Event Type"
        }
      }
    }
    
    return events
  }
