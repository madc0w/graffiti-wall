emoji = require("node-emoji");

wallId = new ReactiveVar("general");
emojis = new ReactiveVar([]);

Meteor.startup(function() {
	console.log("client started");

	const _emojis = [];
	const keys = Object.keys(emoji.emoji).sort();
	for (key of keys) {
		_emojis.push({
			key : key,
			emoji : emoji.emoji[key]
		});
	//
	}
	emojis.set(_emojis);

	Tracker.autorun(function() {
		Meteor.subscribe("wall", wallId.get());
		Meteor.subscribe("messages", wallId.get());
	});

	// https://raw.githubusercontent.com/tobia/Pause/master/jquery.pause.min.js
	(function() {
		var e = jQuery,
			f = "jQuery.pause",
			d = 1,
			b = e.fn.animate,
			a = {};
		function c() {
			return new Date().getTime();
		}
		e.fn.animate = function(k, h, j, i) {
			const g = e.speed(h, j, i);
			g.complete = g.old;
			return this.each(function() {
				if (!this[f]) {
					this[f] = d++;
				}
				const l = e.extend({}, g);
				b.apply(e(this), [ k, e.extend({}, l) ]);
				a[this[f]] = {
					run : true,
					prop : k,
					opt : l,
					start : c(),
					done : 0
				};
			});
		};
		e.fn.pause = function() {
			return this.each(function() {
				if (!this[f]) {
					this[f] = d++;
				}
				const g = a[this[f]];
				if (g && g.run) {
					g.done += c() - g.start;
					if (g.done > g.opt.duration) {
						delete a[this[f]];
					} else {
						e(this).stop();
						g.run = false;
					}
				}
			});
		};
		e.fn.resume = function() {
			return this.each(function() {
				if (!this[f]) {
					this[f] = d++;
				}
				var g = a[this[f]];
				if (g && !g.run) {
					g.opt.duration -= g.done;
					g.done = 0;
					g.run = true;
					g.start = c();
					b.apply(e(this), [ g.prop, e.extend({}, g.opt) ]);
				}
			});
		}
	})();
});
