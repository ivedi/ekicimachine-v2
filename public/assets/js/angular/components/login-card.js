app.angular
.component('loginCard', {
    templateUrl: 'assets/angular/template/login-card.html?v=0.1.1',
    controller: ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.login = {
            init: function () {
                $scope.login.logo = loginCardUniData.logo;
                $scope.login.username = new app.edit.input('', loginCardUniData.username.placeholder[$scope.login.lang.value], app.valid.text);
                $scope.login.username.msg.text = loginCardUniData.username.msg[$scope.login.lang.value];
                $scope.login.password = new app.edit.input('', loginCardUniData.password.placeholder[$scope.login.lang.value], app.valid.text);
                $scope.login.password.msg.text = loginCardUniData.password.msg[$scope.login.lang.value];
                $scope.login.text = loginCardUniData.login[$scope.login.lang.value];
            },
            lang: {
                value: document.documentElement.lang,
                change: function (value) {
                    document.documentElement.lang = value;
                    $scope.login.lang.value = value;
                    $scope.login.init();
                    createCookie('lang', value, 30);
                }
            },
            check: function () {
                var apply = true;
                var OK = {
                    username: $scope.login.username.check(apply),
                    password: $scope.login.password.check(apply)
                };
                return OK.username && OK.password;
            },
            submit: function () {
                if (!$scope.login.check() || $scope.login.inProgress) {
                    return;
                }
                $scope.login.inProgress = true;

                $http({
                    method: 'POST',
                    url: 'service/user.ashx?q=login&d=' + new Date().valueOf(),
                    data: {
                        username: $scope.login.username.value,
                        password: $scope.login.password.value
                    }
                }).then(function (response) {
                    $scope.login.inProgress = false;
                    if (app.show.result(response.data)) {
                        $window.location.reload();
                    }
                }, function (response) {
                    $scope.login.inProgress = false;
                    app.show.error();
                    console.log(response);
                });
            }
        };
        $scope.login.init();
    }]
})