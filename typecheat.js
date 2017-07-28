// ==UserScript==
// @name         Typecheat
// @namespace    *://typeracer.com/
// @version      2.1
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
    var RANDOM_SPEED = 10;
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
            'padding': '1em',
            'width': 'calc(98% - 2em)',
            'border': '3px inset #f0f0f0',
            'borderTop': 'none',
            'marginBottom': '1em'
        }).append($('<b>').text('Typecheat configuration').css(labelStyle));

        let currentSpeed = localStorage.typecheat_speed ? JSON.parse(localStorage.typecheat_speed) : SPEED_IN_WPM;
        let currentTrand = localStorage.typecheat_trand ? JSON.parse(localStorage.typecheat_trand) : RANDOM_SPEED;
        let currentTypo = localStorage.typecheat_typo ? JSON.parse(localStorage.typecheat_typo) : TYPO_PERCENT;
        let currentLog = localStorage.typecheat_log ? JSON.parse(localStorage.typecheat_log) : SHOW_LOGGING;

        let speedBox = $('<input type="text">').val(currentSpeed).css(inputStyle).insertAfter($('<div>').text('Speed goal').css(textStyleLeft).insertBefore($('<div>').text('WPM (5 CPM)').css(textStyleRight).appendTo($('<label>').css(labelStyle).appendTo(container))));
        let trandBox = $('<input type="text">').val(currentTrand).css(inputStyle).insertAfter($('<div>').text('Speed variance').css(textStyleLeft).insertBefore($('<div>').text('WPM (5 CPM)').css(textStyleRight).appendTo($('<label>').css(labelStyle).appendTo(container))));
        let typoBox = $('<input type="text">').val(currentTypo).css(inputStyle).insertAfter($('<div>').text('Typo chance').css(textStyleLeft).insertBefore($('<div>').text('%').css(textStyleRight).appendTo($('<label>').css(labelStyle).appendTo(container))));
        let logBox = $('<input type="checkbox">').prop('checked', currentLog).css(inputStyle).insertAfter($('<div>').text('Log').css(textStyleLeft).appendTo($('<label>').css(labelStyle).appendTo(container)));
        let typeButton = $('<input type="button">').val('Start typecheating!').css(inputStyle).insertBefore($('<input type="button">').val('x').css(inputStyle).css({'flexGrow': '0', 'marginLeft': '1em'}).click(() => container.remove()).appendTo($('<label>').css(labelStyle).prependTo(container)));

        speedBox.on('input', function() {
            let value = $(this).val();

            localStorage.typecheat_speed = JSON.stringify(currentSpeed = value);
        });

        trandBox.on('input', function() {
            let value = $(this).val();

            localStorage.typecheat_trand = JSON.stringify(currentTrand = value);
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

                    log('Start typing.');

                    if (currentLog === true) {
                        console.groupCollapsed('Spammy typing');
                    }

                    (function tick() {
                        if (currentIndex < challengeText.length) {
                            if (typoToClear === false) {
                                let char = challengeText.charAt(currentIndex);

                                if (Math.random() > currentTypo / 100) {
                                    log('Typing character ' + char);

                                    type(char);
                                    currentIndex ++;
                                } else {
                                    typoToClear = textarea.val();
                                    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

                                    let typoMap = {
                                        'a': 'qwszx',
                                        'b': 'fghvn',
                                        'c': 'sdfxv',
                                        'd': 'wersfxcv',
                                        'e': '234wrsdf',
                                        'f': 'ertdgcvb',
                                        'g': 'rtyfhvbn',
                                        'h': 'tyugjbnm',
                                        'j': 'yuihkbnm',
                                        'i': '789uojkl',
                                        'k': 'uiojlm,.',
                                        'l': 'iopk;,./',
                                        'm': 'n,jkl',
                                        'n': 'bhjkm',
                                        'o': '890ipkl;',
                                        'p': '0-=o[l;\'',
                                        'q': '12was',
                                        'r': '345etdfg',
                                        's': 'qweadzxc',
                                        't': '456ryfgh',
                                        'u': '678yihjk',
                                        'v': 'dfgcb',
                                        'w': '123qeasd',
                                        'x': 'asdzc',
                                        'y': '567tughj',
                                        'z': 'asx',
                                        ' ': 'cvbnm'
                                    };

                                    let chosenLetter = challengeText.charAt(currentIndex);

                                    while (char === chosenLetter) {
                                        if (typoMap.hasOwnProperty(char)) {
                                            let map = typoMap[char];

                                            chosenLetter = map.charAt(Math.round(Math.random() * map.length));
                                        } else {
                                            chosenLetter = alphabet[Math.round(Math.random() * 26)];
                                        }
                                    }

                                    type(chosenLetter);
                                }
                            } else {
                                textarea.val(typoToClear);
                                typoToClear = false;
                            }

                            let interval = Math.round(currentSpeed + ((Math.random() * currentTrand) - (currentTrand / 2)));

                            log('Interval is ' + interval + ' wpm (trand is ' + currentTrand + ' wpm)');
                            log('Interval would be ' + currentSpeed + ' wpm without trand');

                            setTimeout(tick, 12000 / interval);
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
