app.angular
.component('officeMap', {
    templateUrl: 'assets/angular/template/office-map.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var self = this;
        $scope.map = {
            init: function () {
                $scope.map.lang = document.documentElement.lang;
                $scope.map.title = officeMapUniData.title;
                $scope.map.cls = page.map.contentClass;
            },
            google: {
                init: function () {
                    page.map.properties = JSON.parse(JSON.stringify(officeMapUniData.properties));
                    page.map.component.editable = self.editable;
                    page.map.component.init();
                }
            },
            edit: {
                inProgress: false,
                init: function () {
                    $scope.map.edit.title = new app.edit.title(function () {
                        return officeMapUniData.title[$scope.map.lang];
                    }, function (text) {
                        officeMapUniData.title[$scope.map.lang] = text;
                        return officeMapUniData;
                    }, 'office-map-uni', function (response) {
                        officeMapUniData = response.data.value;
                        $scope.map.title = officeMapUniData.title;
                    }, $http);
                },
                map: {
                    init: function () {
                        page.map.google.clear.circle();
                        page.map.google.clear.marker();
                        page.map.google.position.marker();
                        page.map.google.position.map();
                        page.map.google.map.setZoom(page.map.properties.zoom);
                    },
                    cancel: function () {
                        page.map.properties = JSON.parse(JSON.stringify(officeMapUniData.properties));
                        $scope.map.edit.map.init();
                    },
                    submit: function () {
                        if ($scope.map.edit.inProgress) {
                            return;
                        }
                        $scope.map.edit.inProgress = true;
                        app.show.spinner('.' + $scope.map.cls);
                        var value = JSON.parse(JSON.stringify(officeMapUniData));
                        value.properties = JSON.parse(JSON.stringify(page.map.properties));
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'office-map-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.map.edit.inProgress = false;
                            app.hide.spinner('.' + $scope.map.cls);
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                officeMapUniData = response.data.value;
                                $scope.map.edit.map.init();
                            }
                        }, function (response) {
                            $scope.map.edit.inProgress = false;
                            app.hide.spinner('.' + $scope.map.cls);
                            app.show.error();
                            console.log(response);
                        });
                    }
                }
            }
        };
        this.$onInit = function () {
            $scope.map.init();
            $scope.map.google.init();
            $scope.map.edit.init();
        };
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        cancelBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});