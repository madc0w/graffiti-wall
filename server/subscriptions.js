Meteor.publish("messages", function(wallId) {
	//	this.unblock();
	return Messages.find({
		wallId : wallId
	});
});
