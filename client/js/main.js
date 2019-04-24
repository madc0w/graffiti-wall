//import { Template } from "meteor/templating";
//import { ReactiveVar } from "meteor/reactive-var";

// https://www.cssscript.com/sleek-html5-javascript-color-picker-iro-js/
import iro from "@jaames/iro";

const fadeDuration = 1200;
const toastDuration = 4000;
const flightTime = 12000;
const flightTimeVariation = 3000;
const numMessages = 3;

const isPostInProgress = new ReactiveVar(false);
const isWallCreationInProgress = new ReactiveVar(false);
const isDisplayEmojis = new ReactiveVar(false);
const isDisplayColorPicker = new ReactiveVar(false);
const toastText = new ReactiveVar();
const wallIdCompletions = new ReactiveVar([]);
const messages = new ReactiveVar({});
const emojiFilter = new ReactiveVar();
const pausedMessages = new ReactiveVar({});
const updateUpvote = new ReactiveVar();
var messageColor = null;
const messageIntervalIds = [];

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

	isDisplayEmojis : function() {
		return isDisplayEmojis.get();
	},

	toastText : function() {
		return toastText.get();
	},

	wallIdCompletions : function() {
		return wallIdCompletions.get();
	},

	isDisplayColorPicker : function() {
		return isDisplayColorPicker.get();
	},
});

Template.main.events({
	"click #main" : function(e) {
		if (e.target.className != "button" && e.target.id != "add-button" && $(e.target).parents(".container").length == 0) {
			if (isDisplayEmojis.get()) {
				$(".container").hide();
			} else {
				$(".container").hide("explode", {
					pieces : 64
				});
			}
			isDisplayEmojis.set(false);
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
		isDisplayEmojis.set(false);
		$(".container").hide();

		$("#add-post-input").val("");
		$("#add-post-input-container").show("explode", {
			pieces : 64
		});
		messageColor = null;
	},

	"click #post-button" : function(e) {
		const text = $("#add-post-input").val();
		if (text.length < 4) {
			toast("message_too_short");
		} else {
			isPostInProgress.set(true);
			Meteor.call("saveMessage", text, messageColor, wallId.get(), function(err, result) {
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
		isDisplayColorPicker.set(false);
		isDisplayEmojis.set(!isDisplayEmojis.get());
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

	// why fail???
	//		Meteor.setTimeout(() => {
	//			$("#wall-id-search-input").focus();
	//		}, 1000);
	},

	"keyup #wall-id-search-input" : function(e) {
		Meteor.call("findWalls", e.target.value, function(err, result) {
			wallIdCompletions.set(result);
		});
	},

	"click .search-walls-result" : function(e) {
		$(".container").hide();
		$(".message").hide();

		for (var id in messages.get()) {
			$("#" + id).remove();
		}
		messages.set([]);
		for (var id of messageIntervalIds) {
			Meteor.clearTimeout(id); //
		}

		wallId.set(this.toString());
	},

	"click #color-button" : function(e) {
		isDisplayEmojis.set(false);
		isDisplayColorPicker.set(!isDisplayColorPicker.get());

		if (isDisplayColorPicker.get()) {
			Meteor.setTimeout(() => {
				const colorWheel = iro.ColorPicker("#color-wheel", {
					width : 200,
				});

				colorWheel.on("color:change", function(color, changes) {
					// when the color has changed, the callback gets passed the color object and an object providing which color channels (out of H, S, V) have changed.
					messageColor = color.rgb;
				});
			}, 0);
		}
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
	}, 200);
});


///////////////////////////////////////////////////////////////////////////////////////////////////

Template.message.helpers({
	emojify : emojify,

	isPaused : function() {
		return pausedMessages.get()[this._id];
	},

	isLiked : function() {
		updateUpvote.get();
		return localStorage.getItem(this._id);
	},

	numUpvotes : function() {
		const message = Messages.findOne({
			_id : this._id
		});
		return message && message.upvotes ? message.upvotes.length : 0;
	},
});

Template.message.events({
	"click .upvote-icon.active" : function(e) {
		const _this = this;
		Meteor.setTimeout(() => {
			$(e.target).hide("puff", null, 400, function() {
				//				console.log("complete");
				localStorage.setItem(_this._id, true);
				updateUpvote.set(new Date());
				$(e.target).show();
				Meteor.call("upvote", _this._id, function(err, result) {
					if (err) {
						toast("upvote_fail");
					} else {
						toast("upvote_success");
					}
				});
			});
		}, 0);
	},

	"click .message" : function(e) {
		const _pausedMessages = pausedMessages.get();
		const id = e.currentTarget.id;
		if (_pausedMessages[id]) {
			$(e.currentTarget).resume();
			delete _pausedMessages[id];
		} else {
			$(e.currentTarget).pause();
			_pausedMessages[id] = true;
		}
		pausedMessages.set(_pausedMessages);
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
	const time = flightTime + ((Math.random() - 0.5) * flightTimeVariation);
	var t = 0;
	const freq = 0.1 + (Math.random() * 0.1);
	const intervalId = Meteor.setInterval(() => {
		element.css("box-shadow", "0px 0px  8px " + (2 + ((Math.sin(t) + 1) * 8)) + "px rgba(100, 200, 255, 0.6)");
		t += freq;
	}, 40);
	messageIntervalIds.push(intervalId);
	element.animate({
		left : final.x + "px",
		top : final.y + "px"
	}, time, null, function() {
		element.remove();
		Meteor.clearInterval(intervalId);
		messageIntervalIds.splice(messageIntervalIds.indexOf(intervalId), 1);
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
