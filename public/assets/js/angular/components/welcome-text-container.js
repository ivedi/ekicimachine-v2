app.angular
.component('welcomeTextContainer', {
    templateUrl: 'assets/angular/template/welcome-text-container.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        $scope.welcomeText = {
            init: function () {
                $scope.welcomeText.list = welcomeTextContainerData.list;
                $scope.welcomeText.edit.init();
            },
            edit: {
                init: function () {
                    $scope.welcomeText.edit.list = [];
                    for (var i = 0; i < welcomeTextContainerData.list.length; i++) {
                        var titleItem = new app.edit.title(function (index) {
                            return welcomeTextContainerData.list[index];
                        }, function (title, index) {
                            welcomeTextContainerData.list[index] = title;
                            return welcomeTextContainerData;
                        }, 'welcome-text-container', function (response) {
                            welcomeTextContainerData = response.data.value;
                            $scope.welcomeText.init();
                        }, $http);
                        titleItem.index = i;
                        $scope.welcomeText.edit.list.push(titleItem);
                    }
                }
            }
        };
        $scope.welcomeText.init();
    }],
    bindings: {
        editable: '<',
        editMsg: '<'
    }
});