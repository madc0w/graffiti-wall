//import { Template } from "meteor/templating";
//import { ReactiveVar } from "meteor/reactive-var";

Template.main.events({
	"click #main" : function(e) {
		if (e.target.className != "button" && e.target.id != "add-button") {
			$(".container").hide("explode", {
				pieces : 64
			});
		}
	},

	"click #add-button" : function(e) {
		//		$("#add-options").toggle("puff", {
		//			percent : 200
		//		});
		$("#add-options").toggle("explode", {
			pieces : 64
		});
	//		$("#add-options").toggle("bounce", {
	//			times : 3,
	//			distance : 100
	//		}, 600);
	},

	"click #new-post-button" : function(e) {
		$(".container").hide();

		$("#add-post-input-container").show("explode", {
			pieces : 64
		});
	},
});
