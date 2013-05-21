Meteor.startup(function () {
  if (Players.find().count() === 0) {
    var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    for (var i = 0; i < names.length; i++) {
      Players.insert({
        name: names[i],
        score: 0,
        events: [],
        badges: [],
        rewards: []
      });
    }
  }
});
