// ==UserScript==
// @name         Typecheat
// @namespace    *://typeracer.com/
// @version      2.0
// @description  Helps you cheat in Typeracer
// @author       LoganDark
// @match        http://play.typeracer.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

(function() {
	'use strict';

	// CONFIG
	// These are default values, if you have changed them using the configuration UI these will not matter
	var SPEED_IN_WPM = 200;
	var TYPO_PERCENT = 3;
	var SHOW_LOGGING = false;
	// END OF CONFIG

	function addToTextarea(textarea) {
		textarea = textarea instanceof $ ? textarea : $(textarea);

		let labelStyle = {
			'display': 'flex',
			'marginBottom': '1em',
			'flexDirection': 'row'
		};

		let textStyleLeft = {
			'marginRight': '1em',
			'lineHeight': '2'
		};

		let textStyleRight = {
			'marginLeft': '1em',
			'lineHeight': '2'
		};

		let inputStyle = {
			'display': 'block',
			'flexGrow': '1',
			'verticalAlign': 'middle',
			'margin': 'auto'
		};

		let container = $('<div class="typecheatbox">').css({
			'marginTop': '-1em',
			//'backgroundColor': '#f0f0f0',
			'backgroundColor': '#fff',
			'padding': '1em',
			'width': 'calc(98% - 2em)',
			'border': '3px inset #f0f0f0',
			'borderTop': 'none',
			'marginBottom': '1em'
		}).append($('<b>').text('Typecheat configuration').css(labelStyle));

		// conversion functions. direction is true if converting TO displayed value, direction is false if converting from

		function convertSpeed(direction, value) {
			if ([true, false].indexOf(direction) > -1) {
				return 12000 / value;
			}

			throw new TypeError('direction must be one of [true, false]');
		}

		function convertTypo(direction, value) {
			if (direction === true) {
				return direction * 100;
			} else if (direction === false) {
				return direction / 100;
			}

			throw new TypeError('direction must be one of [true, false]');
		}

		function convertLog(direction, value) {
			if ([true, false].indexOf(direction) > -1) {
				return value;
			}

			throw new TypeError('direction must be one of [true, false]');
		}

		let currentSpeed = localStorage.typecheat_speed ? JSON.parse(localStorage.typecheat_speed) : SPEED_IN_WPM;
		let currentTypo = localStorage.typecheat_typo ? JSON.parse(localStorage.typecheat_typo) : TYPO_PERCENT;
		let currentLog = localStorage.typecheat_log ? JSON.parse(localStorage.typecheat_log) : SHOW_LOGGING;

		let speedBox = $('<input type="text">').val(currentSpeed).css(inputStyle).insertAfter($('<div>').text('Speed goal').css(textStyleLeft).insertBefore($('<div>').text('WPM (5 CPM)').css(textStyleRight).appendTo($('<label>').css(labelStyle).appendTo(container))));
		let typoBox = $('<input type="text">').val(currentTypo).css(inputStyle).insertAfter($('<div>').text('Typo chance').css(textStyleLeft).insertBefore($('<div>').text('%').css(textStyleRight).appendTo($('<label>').css(labelStyle).appendTo(container))));
		let logBox = $('<input type="checkbox">').prop('checked', currentLog).css(inputStyle).insertAfter($('<div>').text('Log').css(textStyleLeft).appendTo($('<label>').css(labelStyle).appendTo(container)));
		let typeButton = $('<input type="button">').val('Start typecheating!').css(inputStyle).appendTo($('<label>').css(labelStyle).prependTo(container));

		speedBox.on('input', function() {
			let value = $(this).val();

			localStorage.typecheat_speed = JSON.stringify(currentSpeed = value);
		});

		typoBox.on('input', function() {
			let value = $(this).val();

			localStorage.typecheat_typo = JSON.stringify(currentTypo = value);
		});

		logBox.on('click', function() {
			let value = $(this).prop('checked');

			localStorage.typecheat_log = JSON.stringify(currentLog = value);
		});

		let alreadyStarted = false;

		function log(content) {
			if (currentLog === true) {
				console.log(content);
			}
		}

		typeButton.on('click', function() {
			log('Typecheat clicked');

			if (alreadyStarted === false) {
				if (!textarea.prop('disabled')) {
					alreadyStarted = true;

					logBox.prop('disabled', true);

					let elem = $(this);
					let challengeText = $('div > span[unselectable=on]').first().parent().text();
					log('Challenge text is: ' + challengeText);

					let currentIndex = 0;
					let typoToClear = false;
					let typeIntervalID;
					let type = function(letter) {
						textarea.val((_, value) => {
							return value + letter;
						});
					};

					(function tick() {
						let speed = 12000 / currentSpeed;
						let typo = currentTypo / 100;

						if (currentIndex < challengeText.length) {
							if (typoToClear === false) {
								if (Math.random() > typo) {
									let char = challengeText.charAt(currentIndex);

									log('Typing character ' + char);

									type(char);
									currentIndex ++;
								} else {
									typoToClear = textarea.val();
									let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
									let chosenLetter = challengeText.charAt(currentIndex);

									while (challengeText.charAt(currentIndex) === chosenLetter) {
										chosenLetter = alphabet[Math.round(Math.random() * 26)];
									}

									type(chosenLetter);
								}
							} else {
								textarea.val(typoToClear);
								typoToClear = false;
							}

							setTimeout(tick, speed);
						} else {
							clearInterval(typeIntervalID);
							log('Done typing');

							if (currentLog === true) {
								console.groupEnd('Spammy typing');
							}

							alreadyStarted = false;
							logBox.prop('disabled', false);
						}
					})();

					log('Start typing.');

					if (currentLog === true) {
						console.groupCollapsed('Spammy typing');
					}
				} else {
					log('Textarea is somehow disabled - is this a bug?');
				}
			}
		});

		container.append($('<span>').text('If Typecheat is typing in the text box and Typeracer does not recognize it, make sure you are constantly moving your mouse inside the text box.').css(labelStyle).css('marginBottom', '0')).insertAfter(textarea.css('borderBottom', 'none'));
	}

	var intervalID = setInterval(func, 20);

	function func() {
		if (!document.getElementById('typecheat')) {
			let txtInput = $('.txtInput').first();

			if (txtInput.length !== 0 && !txtInput.attr('typecheated')) {
				txtInput.attr('typecheated', 'true');

				addToTextarea(txtInput);
			}
		}
	}
})();
