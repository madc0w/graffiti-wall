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
			text : text.trim(),
			date : now,
			wallId : wallId,
			upvotes : 0,
			flags : 0,
		});
		Walls.update({
			id : wallId
		}, {
			$set : {
				lastActive : now,
			}
		});
	},

	createWall : function(wallId) {
		wallId = wallId.trim();
		const now = new Date();
		if (Walls.findOne({
				id : wallId
			})) {
			return "existing";
		} else {
			Walls.insert({
				id : wallId,
				creationDate : now,
				lastActive : now,
			});
			return null;
		}
	},

	findWalls : function(wallIdPart) {
		const wallIds = [];
		if (wallIdPart.length > 0) {
			Walls.find({
				id : {
					$regex : wallIdPart.toLowerCase()
				}
			}, {
				sort : {
					lastActive : -1
				},
				fields : {
					id : true
				}
			}).forEach(function(wall) {
				wallIds.push(wall.id);
			});
		}
		return wallIds;
	},
});
