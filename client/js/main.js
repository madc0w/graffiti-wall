//import { Template } from "meteor/templating";
//import { ReactiveVar } from "meteor/reactive-var";

const fadeDuration = 1200;
const toastDuration = 4000;
const flightTime = 12000;
const flightTimeVariation = 3000;
const numMessages = 2;

const isPostInProgress = new ReactiveVar(false);
const isWallCreationInProgress = new ReactiveVar(false);
const toastText = new ReactiveVar();
const wallIdCompletions = new ReactiveVar([]);
const messages = new ReactiveVar({});
const emojiFilter = new ReactiveVar();

Template.main.helpers({
	emojis : function() {
		const _emojiFilter = emojiFilter.get() && emojiFilter.get().toLowerCase();
		const _emojis = emojis.get();
		if (_emojiFilter && _emojiFilter.length > 0) {
			const filtered = [];
			for (var _emoji of _emojis) {
				if (_emoji.key.indexOf(_emojiFilter) != -1) {
					filtered.push(_emoji);
				} // 
			}
			return filtered;
		}
		return _emojis;
	},

	smiley : function() {
		return emoji.emojify(":smiley:");
	},

	wallId : function() {
		return wallId.get();
	},

	messages : function() {
		return Object.values(messages.get());
	},

	isPostInProgress : function() {
		return isPostInProgress.get();
	},

	isWallCreationInProgress : function() {
		return isWallCreationInProgress.get();
	},

	toastText : function() {
		return toastText.get();
	},

	wallIdCompletions : function() {
		return wallIdCompletions.get();
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
		emojiFilter.set(null);
		$("#emoji-search-input").val("");
		$("#emojis").hide();
		$(".container").hide();

		$("#add-post-input").val("");
		$("#add-post-input-container").show("explode", {
			pieces : 64
		});
	},

	"click #post-button" : function(e) {
		const text = $("#add-post-input").val();
		if (text.length < 4) {
			toast("message_too_short");
		} else {
			isPostInProgress.set(true);
			Meteor.call("saveMessage", text, wallId.get(), function(err, result) {
				toast(err ? "post_fail" : "post_success");
				$(".container").hide();
				isPostInProgress.set(false);
			});
		}
	},

	"keyup #add-post-input" : function(e) {
		const text = $("#add-post-input").val();
		const el = $("#add-post-input")[0];
		const cursorPos = getCaretPosition(el);
		const emojified = emojify(text);
		$("#add-post-input").val(emojified);
		setCaretPosition(el, cursorPos - (text.length - emojified.length));
	},

	"click #emoji-button" : function(e) {
		$("#emojis").toggle();
	},

	"click .emoji-selection" : function(e) {
		const text = $("#add-post-input").val();
		const el = $("#add-post-input")[0];
		const cursorPos = getCaretPosition(el);
		const newText = text.substring(0, cursorPos) + emoji.get(this.key) + text.substring(cursorPos);
		$("#add-post-input").val(newText);
		setCaretPosition(el, cursorPos + 1);
	},

	"keyup #emoji-search-input" : function(e) {
		emojiFilter.set($("#emoji-search-input").val().trim());
	},

	"click #new-wall-button" : function(e) {
		$(".container").hide();

		$("#wall-id-input").val("");
		$("#new-wall-input-container").show("explode", {
			pieces : 64
		});
	},

	"click #create-wall-button" : function(e) {
		const _wallId = $("#wall-id-input").val();
		if (_wallId.length < 4) {
			toast("wall_name_too_short");
		} else {
			isWallCreationInProgress.set(true);
			Meteor.call("createWall", _wallId, function(err, result) {
				isWallCreationInProgress.set(false);
				if (err) {
					toast("wall_create_fail");
				} else if (result == "existing") {
					toast("wall_create_existing");
				} else {
					toast("wall_create_success");
					wallId.set(_wallId);
					$(".container").hide();
				}
			});
		}
	},

	"click #find-wall" : function(e) {
		$(".container").hide();
		$("#wall-id-search-input").val("");
		$("#search-walls-input-container").show("explode", {
			pieces : 64
		});
	},

	"keyup #wall-id-search-input" : function(e) {
		Meteor.call("findWalls", e.target.value, function(err, result) {
			wallIdCompletions.set(result);
		});
	},

	"click .search-walls-result" : function(e) {
		$(".container").hide();
		wallId.set(this);
	},
});

Template.main.onCreated(function() {
	Meteor.setInterval(() => {
		const _messages = messages.get();
		if (Object.keys(_messages).length < numMessages) {
			const message = selectMessage();
			if (message) {
				_messages[message._id] = message;
				messages.set(_messages);
			}
		}
	}, 400);
});


///////////////////////////////////////////////////////////////////////////////////////////////////

const pausedMessages = {};

Template.message.helpers({
	emojify : emojify,
});

Template.message.events({
	"click .message" : function(e) {
		if (pausedMessages[e.target.id]) {
			$(e.target).resume();
			delete pausedMessages[e.target.id];
		} else {
			$(e.target).pause();
			pausedMessages[e.target.id] = true;
		}
	},
});

Template.message.onRendered(function() {
	const id = this.data._id;
	const element = $("#" + id);
	const init = {};
	const final = {};
	if (Math.random() < 0.5) {
		init.y = Math.random() * innerHeight;
		final.y = Math.random() * innerHeight;
		const edge = -element.width() - 40;
		if (Math.random() < 0.5) {
			init.x = edge;
			final.x = innerWidth;
		} else {
			init.x = innerWidth;
			final.x = edge;
		}
	} else {
		init.x = Math.random() * innerWidth;
		final.x = Math.random() * innerWidth;
		const edge = -element.height() - 40;
		if (Math.random() < 0.5) {
			init.y = edge;
			final.y = innerHeight;
		} else {
			init.y = innerHeight;
			final.y = edge;
		}
	}
	element.offset({
		left : init.x,
		top : init.y
	});
	element.animate({
		left : final.x + "px",
		top : final.y + "px"
	}, flightTime + ((Math.random() - 0.5) * flightTimeVariation), null, function() {
		element.remove();
		const _messages = messages.get();
		delete _messages[id];
		messages.set(_messages);
	});
});

///////////////////////////////////////////////////////////////////////////////////////////////////

function toast(textKey) {
	toastText.set(TAPi18n.__(textKey));
	Meteor.setTimeout(function() {
		Meteor.setTimeout(function() {
			$("#toast").fadeOut(fadeDuration);
		}, 0);
	}, toastDuration - fadeDuration);
	Meteor.setTimeout(function() {
		toastText.set(null);
	}, toastDuration);
}

function selectMessage() {
	const allMessages = Messages.find({
		wallId : wallId.get()
	}).fetch();
	if (allMessages.length > 0) {
		return allMessages[Math.floor(Math.random() * allMessages.length)];
	}
	return null;
}

function emojify(text) {
	text = text.replace(":)", ":smiley:");
	text = text.replace(":D", ":grin:");
	return emoji.emojify(text);
}


/*
** Returns the caret (cursor) position of the specified text field (oField).
** Return value range is 0-oField.value.length.
*  from https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
*/
function getCaretPosition(oField) {
	var iCaretPos;

	// IE Support
	if (document.selection) {

		// Set focus on the element
		oField.focus();

		// To get cursor position, get empty selection range
		var oSel = document.selection.createRange();

		// Move selection start to 0 position
		oSel.moveStart("character", -oField.value.length);

		// The caret position is selection length
		iCaretPos = oSel.text.length;
	} else if (oField.selectionStart || oField.selectionStart == "0") {
		// Firefox support
		iCaretPos = oField.selectionDirection == "backward" ? oField.selectionStart : oField.selectionEnd;
	}
	// Return results
	return iCaretPos;
}

// https://stackoverflow.com/questions/512528/set-keyboard-caret-position-in-html-textbox
function setCaretPosition(elem, caretPos) {
	if (elem.createTextRange) {
		const range = elem.createTextRange();
		range.move("character", caretPos);
		range.select();
	} else if (elem.selectionStart) {
		elem.focus();
		elem.setSelectionRange(caretPos, caretPos);
	} else {
		elem.focus();
	}
}
