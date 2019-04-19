//import { Meteor } from "meteor/meteor";

const collections = [ Messages, Walls ];

Meteor.startup(() => {
	console.log("SERVER started");

	for (var i in collections) {
		const collection = collections[i];
		// deny every kind of write operation from client
		const deny = () => {
			return true;
		};
		collection.deny({
			insert : deny,
			update : deny,
			remove : deny,
		});
	}

	if (!Walls.findOne({
			id : "general"
		})) {
		Walls.insert({
			id : "general",
			lastActive : new Date(),
		});
	}
});


Meteor.methods({
	saveMessage : function(text, wallId) {
		const now = new Date();
		Messages.insert({
			text : text,
			date : now,
			wallId : wallId,
			upvotes : 0,
			flags : 0,
		});
	},
});
