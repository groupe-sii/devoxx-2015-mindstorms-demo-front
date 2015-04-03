'use strict';

/*globals Howl */

/**
 * @ngdoc controller
 * @name devoxx-2015-mindstorms-demo-front.controller:homeCtrl
 * @description
 * A description of the controller
 */
angular.module('devoxx-2015-mindstorms-demo-front')
    .controller('HomeController', [
        '$scope',
        '$interval',
        '$timeout',
        'appSocketFactory',
        'MotorService',
        'DataFactory',
        function($scope, $interval, $timeout, appSocketFactory, MotorService, DataFactory) {

            console.log('HomeController');

            /**
             * Sensors stuff
             */

            var vm = this,
                CORRECT_MESSAGE = 'Correct !',
                INCORRECT_MESSAGE = 'Incorrect dude !',
                MIN_WIN = 3,
                TIME_ANSWER = 10,
                _intervalTimer = null,
                IMG_FOLDER = 'assets/img/';

            vm.answered = false;
            vm.answerResult = false;
            vm.finalResult = false;
            vm.timerAnswer = TIME_ANSWER;
            vm.question = {};
            vm.backgrdUrl = {
                background: 'url(../assets/img/unsplash_5245b69bc5330_1.jpg)'
            };

            appSocketFactory.forward('sensorValue', $scope);

            var sensorListener = function(ev, data) {
                vm.sensorValues = data;

                console.log('sensorListener');

                if (data.sensor1 === 1 || data.sensor2 === 1) {
                    vm.answered = true;

                    appSocketFactory.removeAllListeners();

                    if ((data.sensor1 === 1 && vm.question.answers[0].correct) || (data.sensor2 === 1 && vm.question.answers[1].correct)) {
                        vm.result = CORRECT_MESSAGE;
                        vm.answerResult = true;
                        vm.score += 1;
                    } else {
                        vm.result = INCORRECT_MESSAGE;
                    }

                    $timeout(function() {
                        $interval.cancel(_intervalTimer);
                        nextQuestion();
                    }, 2000);
                }
            };

            var updateBackground = function() {
                vm.backgrdUrl = {
                    background: 'url(../' + IMG_FOLDER + vm.question.bckgrd + ')'
                };
            };

            var playWinningSound = function(winner) {
                var urlSound = (winner) ? 'assets/sounds/winning.mp3' : 'assets/sounds/fail.mp3',
                    sound = new Howl({
                        urls: [urlSound]
                    });
                sound.play();
            };

            $scope.$on('socket:sensorValue', sensorListener);

            vm.startSensorListener = function() {
                appSocketFactory.emit('startReadingSensors', function() {
                    console.log('startReadingSensors action readed by server');
                });
            };

            vm.stopSensorListener = function() {
                appSocketFactory.emit('stopReadingSensors', function() {
                    console.log('stopReadingSensors action readed by server');
                });
            };

            /**
             * Motor stuff
             */

            vm.startMotor = function() {
                MotorService.startMotor().then(function() {
                    console.log('motor started');
                });
            };

            /**
             * Quiz stuff
             */

            var questions = null,
                nextQuestion = function() {
                    startTimer();
                    vm.questionIndex += 1;
                    vm.answered = vm.answerResult = false;
                    appSocketFactory.forward('sensorValue', $scope);
                    if (vm.questionIndex > questions.length) {
                        finishTest();
                        vm.finished = true;
                        return;
                    }
                    vm.question = questions[vm.questionIndex - 1];
                    updateBackground();
                    vm.result = '';
                },
                finishTest = function() {
                    appSocketFactory.removeAllListeners();
                    $interval.cancel(_intervalTimer);
                    if (vm.score >= MIN_WIN) {
                        vm.finalResult = true;
                        vm.startMotor();
                        playWinningSound(true);
                    } else {
                        playWinningSound();
                    }
                },
                startTimer = function() {
                    vm.timerAnswer = TIME_ANSWER;
                    _intervalTimer = $interval(function() {
                        vm.timerAnswer -= 1;
                        if (vm.timerAnswer === 0) {
                            $interval.cancel(_intervalTimer);
                            nextQuestion();
                        }
                    }, 1000);
                };

            vm.startTest = function() {
                vm.testStarted = true;
                vm.finished = false;
                vm.questionIndex = 1;
                vm.score = 0;

                questions = DataFactory.get();
                vm.question = questions[vm.questionIndex - 1];

                vm.startSensorListener();
                updateBackground();
                startTimer();
            };

        }
    ]);
