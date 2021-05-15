app.angular
.component('searchCard', {
    templateUrl: 'assets/angular/template/search-card.html?v=0.1.1',
    controller: ['$scope', '$timeout', function ($scope, $timeout) {
        var self = this;
        $scope.search = {
            value: '',
            change: function () {
                if (typeof self.onValueChanged !== 'function') {
                    return;
                }
                $scope.search.timer.set();
            },
            timer: {
                value: null,
                interval: 500,
                set: function () {
                    if ($scope.search.timer.value) {
                        $timeout.cancel($scope.search.timer.value);
                        $scope.search.timer.value = null;
                    }
                    $scope.search.timer.value = $timeout(function () {
                        self.onValueChanged($scope.search.value);
                    }, $scope.search.timer.interval);
                }
            }
        };
    }],
    bindings: {
        header: '<',
        editHeader: '<',
        onValueChanged: '<',
        editMsg: '<',
        editable: '<'
    }
})