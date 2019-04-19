import { Meteor } from "meteor/meteor";

const collections = [ Messages ];

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
});
