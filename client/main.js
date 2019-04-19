import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import "./main.html";

Template.main.events({
	"click #add-button" : function(e) {
		console.log("click");
	},
});
