app.angular
.component('flagCardContainer', {
    templateUrl: 'assets/angular/template/flag-card-container.html?v=0.1.1',
    controller: ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        var ctrl = this;
        $scope.flag = {
            init: function () {
                $scope.flag.lang = document.documentElement.lang;
                $scope.flag.create.list();
                $scope.flag.create.table();
                $scope.flag.search.init();
            },
            search: {
                inProgress: false,
                text: '',
                init: function () {
                    $scope.flag.search.text = '';
                },
                change: function () {
                    $scope.flag.search.timer.set();
                },
                clear: function () {
                    $scope.flag.list = JSON.parse(JSON.stringify($scope.flag.listUnfiltered));
                },
                filter: function () {
                    var rgx = new RegExp($scope.flag.search.text.toLowerCase(), 'i');
                    $scope.flag.list = $scope.flag.listUnfiltered.filter(function (flag) {
                        return flag.name[$scope.flag.lang].toLowerCase().match(rgx);
                    });
                },
                timer: {
                    interval: 500,
                    set: function () {
                        if ($scope.flag.search.timer.value) {
                            $timeout.cancel($scope.flag.search.timer.value);
                            $scope.flag.search.timer.value = null;
                        }
                        $scope.flag.search.timer.value = $timeout(function () {
                            if ($scope.flag.search.inProgress) {
                                return;
                            }
                            $scope.flag.search.inProgress = true;
                            if ($scope.flag.search.text !== '') {
                                $scope.flag.search.filter();
                            } else {
                                $scope.flag.search.clear();
                            }
                            $scope.flag.create.table();
                            $scope.flag.search.inProgress = false;
                        }, $scope.flag.search.timer.interval);
                    }
                }
            },
            create:{
                list: function () {
                    $scope.flag.list = flagCardContainerUniData.list.filter(function (flag) {
                        return flag.isEnabled && (ctrl.editable || flag.isVisible);
                    });
                    $scope.flag.listUnfiltered = JSON.parse(JSON.stringify($scope.flag.list));
                },
                table: function () {
                    var columnCount = 4;
                    $scope.flag.rows = [];
                    for (var i = 0; i < Math.ceil($scope.flag.list.length / columnCount) ; i++) {
                        var row = [];
                        var j = 0;
                        while (j < columnCount && i * columnCount + j < $scope.flag.list.length) {
                            row.push($scope.flag.list[i * columnCount + j]);
                            j++;
                        }
                        $scope.flag.rows.push(row);
                    }
                }
            },
            edit: {
                inProgress: false,
                submit: function (flag) {
                    if ($scope.flag.edit.inProgress) {
                        return;
                    }
                    $scope.flag.edit.inProgress = true;
                    app.show.spinner('body');
                    var value = JSON.parse(JSON.stringify(flagCardContainerUniData));
                    var found = false;
                    var i = 0;
                    while (!found && i < value.list.length) {
                        if (flag.id === value.list[i].id) {
                            value.list[i].isVisible = !value.list[i].isVisible;
                            found = true;
                        }
                        i++;
                    }
                    if (!found) {
                        app.show.error();
                        $scope.flag.edit.inProgress = false;
                        app.hide.spinner('body');
                        return;
                    }
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'flag-card-container-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.flag.edit.inProgress = false;
                        app.hide.spinner('body');
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            flagCardContainerUniData = response.data.value;
                            $scope.flag.init();
                        }
                    }, function (response) {
                        $scope.flag.edit.inProgress = false;
                        app.hide.spinner('body');
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        
        ctrl.$onInit = function () {
            $scope.flag.init();
        };
    }],
    bindings: {
        editable: '<',
        noResult: '<',
        searchPlaceholder: '<'
    }
});