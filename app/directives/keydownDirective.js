angular.module('wordscrambleapp')
  .directive('keydown', function ($document, $rootScope) {
    return {
        restrict: 'A',
        link: function () {
            console.log('linked');
            $document.bind('keydown', function (e) {
              if (e.which === 8) {
                e.preventDefault();
              }             
              $rootScope.$broadcast('keydown', e, String.fromCharCode(e.which));
            });
        }
    }
  });