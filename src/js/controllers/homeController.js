'use strict';

/*globals Howl */

/**
 * @ngdoc controller
 * @name devoxx-2015-mindstorms-demo-front.controller:homeCtrl
 * @description
 * A description of the controller
 */
angular.module('devoxx-2015-mindstorms-demo-front')
    .controller('homeController', [
        '$scope',
        '$interval',
        '$timeout',
        'appSocketFactory',
        'MotorService',
        'DataFactory',
        function($scope, $interval, $timeout, appSocketFactory, MotorService, DataFactory) {

            console.log('homeController');

            /**
             * Sensors stuff
             */

            var CORRECT_MESSAGE = 'Correct !',
                INCORRECT_MESSAGE = 'Incorrect dude !',
                MIN_WIN = 3,
                TIME_ANSWER = 10,
                _intervalTimer = null,
                IMG_FOLDER = 'assets/img/';

            $scope.answered = false;
            $scope.answerResult = false;
            $scope.finalResult = false;
            $scope.timerAnswer = TIME_ANSWER;
            $scope.backgrdUrl = {
                background: 'url(../assets/img/unsplash_5245b69bc5330_1.jpg)'
            };

            appSocketFactory.forward('sensorValue', $scope);

            var sensorListener = function(ev, data) {
                $scope.sensorValues = data;

                console.log('sensorListener');

                if (data.sensor1 === 1 || data.sensor2 === 1) {
                    $scope.answered = true;

                    appSocketFactory.removeAllListeners();

                    if ((data.sensor1 === 1 && $scope.question.answers[0].correct) || (data.sensor2 === 1 && $scope.question.answers[1].correct)) {
                        $scope.result = CORRECT_MESSAGE;
                        $scope.answerResult = true;
                        $scope.score += 1;
                    } else {
                        $scope.result = INCORRECT_MESSAGE;
                    }

                    $timeout(function() {
                        $interval.cancel(_intervalTimer);
                        nextQuestion();
                    }, 2000);
                }
            };

            var updateBackground = function() {
                $scope.backgrdUrl = {
                    background: 'url(../' + IMG_FOLDER + $scope.question.bckgrd + ')'
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

            $scope.startSensorListener = function() {
                appSocketFactory.emit('startReadingSensors', function() {
                    console.log('startReadingSensors action readed by server');
                });
            };

            $scope.stopSensorListener = function() {
                appSocketFactory.emit('stopReadingSensors', function() {
                    console.log('stopReadingSensors action readed by server');
                });
            };

            /**
             * Motor stuff
             */

            $scope.startMotor = function() {
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
                    $scope.questionIndex += 1;
                    $scope.answered = $scope.answerResult = false;
                    appSocketFactory.forward('sensorValue', $scope);
                    if ($scope.questionIndex > questions.length) {
                        finishTest();
                        $scope.finished = true;
                        return;
                    }
                    $scope.question = questions[$scope.questionIndex - 1];
                    updateBackground();
                    $scope.result = '';
                },
                finishTest = function() {
                    appSocketFactory.removeAllListeners();
                    $interval.cancel(_intervalTimer);
                    if ($scope.score >= MIN_WIN) {
                        $scope.finalResult = true;
                        $scope.startMotor();
                        playWinningSound(true);
                    } else {
                        playWinningSound();
                    }
                },
                startTimer = function() {
                    $scope.timerAnswer = TIME_ANSWER;
                    _intervalTimer = $interval(function() {
                        $scope.timerAnswer -= 1;
                        if ($scope.timerAnswer === 0) {
                            $interval.cancel(_intervalTimer);
                            nextQuestion();
                        }
                    }, 1000);
                };

            $scope.startTest = function() {
                $scope.testStarted = true;
                $scope.finished = false;
                $scope.questionIndex = 1;
                $scope.score = 0;

                questions = DataFactory.get();
                $scope.question = questions[$scope.questionIndex - 1];

                $scope.startSensorListener();
                updateBackground();
                startTimer();
            };

        }
    ]);
