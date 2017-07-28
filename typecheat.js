// ==UserScript==
// @name         Typecheat
// @namespace    *://typeracer.com/
// @version      1.0
// @description  Helps you cheat in Typeracer (I can't help you if you get captcha'd!)
// @author       LoganDark
// @match        http://play.typeracer.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    // CONFIG
    var MAGIC_NUMBER = 60; // milliseconds between each keypress / typo simulation, 42 is the magic number for around ~250 WPM
    var RANDOM_TYPOS = true;
    var TYPOS_CHANCE = 0.03; // 3% chance of typo for every character
    var SHOW_LOGGING = false; // change this to true and show somebody your console to help them find issues
    // END OF CONFIG

    var intervalID = setInterval(func, 20);

    function log(content) {
        if (SHOW_LOGGING === true) {
            console.log(content);
        }
    }

    function func() {
        if (!document.getElementById('typecheat')) {
            let txtInput = $('.txtInput');
            if (txtInput.length !== 0) {
                var alreadyStarted = false;
                txtInput.after($('<button id="typecheat">Typecheat!</button>').click(function() {
                    log('Typecheat clicked');

                    if (alreadyStarted === false) {
                        if (!txtInput.prop('disabled')) {
                            alreadyStarted = true;
                            let elem = $(this);
                            let challengeText = $('div > span[unselectable=on]').first().parent().text();
                            log('Challenge text is: ' + challengeText);

                            let currentIndex = 0;
                            let typoToClear = false;
                            let typeIntervalID;
                            let type = function(letter) {
                                txtInput.val((_, value) => {
                                    return value + letter;
                                });
                            };

                            typeIntervalID = setInterval(function() {
                                if (currentIndex < challengeText.length) {
                                    if (typoToClear === false) {
                                        if (RANDOM_TYPOS === false || Math.random() > TYPOS_CHANCE) {
                                            let char = challengeText.charAt(currentIndex);

                                            log('Typing character ' + char);

                                            type(char);
                                            currentIndex ++;
                                        } else {
                                            typoToClear = txtInput.val();
                                            let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                                            let chosenLetter = challengeText.charAt(currentIndex);
                                            while (challengeText.charAt(currentIndex) === chosenLetter) {
                                                chosenLetter = alphabet[Math.round(Math.random() * 26)];
                                            }
                                            type(chosenLetter);
                                        }
                                    } else {
                                        txtInput.val(typoToClear);
                                        typoToClear = false;
                                    }
                                } else {
                                    clearInterval(typeIntervalID);
                                    log('Done typing');

                                    if (SHOW_LOGGING) {
                                        console.groupEnd('Spammy typing');
                                    }
                                }
                            }, MAGIC_NUMBER);

                            log('Start typing.');

                            if (SHOW_LOGGING) {
                                console.groupCollapsed('Spammy typing');
                            }
                        } else {
                            log('Textarea is somehow disabled - is this a bug?');
                        }
                    }
                }));
            }
        }
    }
})();
