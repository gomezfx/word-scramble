angular.module('wordscrambleapp')
  .controller('WordScrambleCtrl', function WordScrambleCtrl($scope, $filter, $rootScope, $timeout, $http) {
    'use strict';

    $scope.wordCount = 0;
    $scope.words = new Array();
    $scope.wordUnscrambled = '';
    $scope.wordScrambled = '';
    $scope.lettersScrambled = new Array();
    $scope.lettersScrambledCopy = ''
    $scope.lettersEntered = new Array();
    $scope.swapCount = 0;
    $scope.swapIndexes = new Array();
    $scope.correct = false;
    $scope.incorrect = false;
    $scope.score = 0;
    $scope.countdown = 60;
    $scope.doneToggled = false;

    $scope.initialize = function() {
      $http.get('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=7&limit=50&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
        .success(function(data, status, headers, config) {
          for (var i = 0; i < data.length; i++) {
            var word = data[i].word.toUpperCase();
            $scope.words.push(word);
          }

          // Intialize some variables
          $scope.wordUnscrambled = $scope.words[$scope.wordCount];
          $scope.wordScrambled = $filter('scramble')($scope.wordUnscrambled);
          $scope.lettersScrambled = $scope.wordScrambled.split('');
          $scope.lettersScrambledCopy = $scope.lettersScrambled.slice();
          $scope.decrementCountdown();
        })
        .error(function(data, status, headers, config) {

        });
    }

    $scope.initialize();

    $scope.decrementCountdown = function() {
      $timeout(function() {
        $scope.countdown--;
        if ($scope.countdown === 0) {
          $scope.done();
        } else {
          $scope.decrementCountdown();
        }
      }, 1000);
    }

    $scope.moveElement = function (arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        var k = newIndex - arr.length;
        while ((k--) + 1) {
          arr.push(undefined);
        }
      }

      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
      return arr;
    };

    $scope.done = function() {
      $scope.doneToggled = true;
    }

    $scope.reset = function() {
      $scope.wordCount = 0;
      $scope.words = new Array();
      $scope.wordUnscrambled = '';
      $scope.wordScrambled = '';
      $scope.lettersScrambled = new Array();
      $scope.lettersScrambledCopy = ''
      $scope.lettersEntered = new Array();
      $scope.swapCount = 0;
      $scope.swapIndexes = new Array();
      $scope.correct = false;
      $scope.incorrect = false;
      $scope.score = 0;
      $scope.countdown = 60;
      $scope.doneToggled = false;

      $scope.initialize();
    }

    $rootScope.$on('keydown', function (evt, obj, key) {
      // Swap letters on keypress
      $scope.$apply(function () {
        if (obj.which === 8 && $scope.lettersEntered.length > 0) {
          $scope.lettersEntered.pop();

          var index = $scope.swapIndexes.pop();
          $scope.swapCount--;
          $scope.moveElement($scope.lettersScrambled, $scope.swapCount, index);
        }

        var index = $scope.lettersScrambled.indexOf(key, $scope.swapCount);
        if (key && index > -1) {
          $scope.lettersEntered.push(key);

          $scope.swapIndexes.push(index);
          $scope.moveElement($scope.lettersScrambled, index, $scope.swapCount)
          $scope.swapCount++;
        }
      });
    });

    $scope.$watch('lettersEntered.length', function(newValue, oldValue) {
      // Check if entered word is correct
      if (newValue === $scope.wordUnscrambled.length && newValue > 0) {
        var joined = $scope.lettersEntered.join("");
        if (joined === $scope.wordUnscrambled) {
          $scope.correct = true;
          $timeout(function() {
            $scope.correct = false;

            // Get new word
            $scope.wordCount++;
            $scope.wordUnscrambled = $scope.words[$scope.wordCount];
            $scope.wordScrambled = $filter('scramble')($scope.wordUnscrambled);
            $scope.lettersScrambled = $scope.wordScrambled.split('');
            $scope.lettersScrambledCopy = $scope.lettersScrambled.slice();
            $scope.lettersEntered = new Array();
            $scope.swapCount = 0;
            $scope.swapIndexes = new Array();
            $scope.score += 100;
          }, 1000);
        } else {
          $scope.incorrect = true;
          $timeout(function() {
            $scope.incorrect = false;
            $scope.lettersEntered = new Array();
            $scope.lettersScrambled = $scope.lettersScrambledCopy.slice();
            $scope.swapCount = 0;
            $scope.swapIndexes = new Array();
          }, 1000);
        }
      }
    });

  });