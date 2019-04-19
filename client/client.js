wallId = new ReactiveVar("general");

Meteor.startup(function() {
	console.log("client started");

	Tracker.autorun(function() {
		Meteor.subscribe("messages", wallId.get());
	});
});
