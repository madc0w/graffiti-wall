emoji = require("node-emoji");

wallId = new ReactiveVar("general");
emojis = new ReactiveVar([]);

Meteor.startup(function() {
	console.log("client started");

	const _emojis = [];
	const keys = Object.keys(emoji.emoji).sort();
	for (key of keys) {
		_emojis.push({
			key : key,
			emoji : emoji.emoji[key]
		});
	//
	}
	emojis.set(_emojis);

	Tracker.autorun(function() {
		Meteor.subscribe("wall", wallId.get());
		Meteor.subscribe("messages", wallId.get());
	});
});
