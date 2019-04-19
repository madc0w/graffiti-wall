//import { Template } from "meteor/templating";
//import { ReactiveVar } from "meteor/reactive-var";

const isPostInProgress = new ReactiveVar(false);
const toastText = new ReactiveVar();

Template.main.helpers({
	messages : function() {
		return Messages.find({
			wallId : wallId.get()
		});
	},

	isPostInProgress : function() {
		return isPostInProgress.get();
	},

	toastText : function() {
		return toastText.get();
	},
});

Template.main.events({
	"click #main" : function(e) {
		if (e.target.className != "button" && e.target.id != "add-button" && $(e.target).parents(".container").length == 0) {
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

	"click #post-button" : function(e) {
		isPostInProgress.set(true);
		const text = $("#add-post-input").val();
		Meteor.call("saveMessage", text, wallId.get(), function(err, result) {
			toast(err ? "post_fail" : "post_success");
			$(".container").hide();
			isPostInProgress.set(false);
		});
	},
});

function toast(textKey) {
	toastText.set(TAPi18n.__(textKey));
	const toastDuration = 6000;
	Meteor.setTimeout(function() {
		$("#toast").fadeOut(toastDuration - 2000);
	}, 0);
	Meteor.setTimeout(function() {
		toastText.set(null);
	}, toastDuration);
}

_toast = toast;
