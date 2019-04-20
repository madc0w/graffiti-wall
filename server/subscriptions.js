Meteor.publish("messages", function(wallId) {
	//	this.unblock();
	return Messages.find({
		wallId : wallId
	});
});

Meteor.publish("wall", function(wallId) {
	//	this.unblock();
	return Walls.find({
		id : wallId
	});
});
