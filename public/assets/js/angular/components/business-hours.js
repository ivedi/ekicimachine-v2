app.angular
.component('businessHours', {
    templateUrl: 'assets/angular/template/business-hours.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        $scope.businessHours = {
            init: function () {
                $scope.businessHours.title = businessHoursData.title;
                $scope.businessHours.OnTime = businessHoursData.OnTime;
                $scope.businessHours.OffTime = businessHoursData.OffTime;
            },
            edit: {
                inProgress: false,
                title: new app.edit.title(function () {
                    return businessHoursData.title;
                }, function (text) {
                    businessHoursData.title = text;
                    return businessHoursData;
                }, 'business-hours', function (response) {
                    businessHoursData = response.data.value;
                    $scope.businessHours.title = businessHoursData.title;
                }, $http),
                show: function () {
                    $scope.businessHours.edit.init();
                    $('.business-hours-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.businessHours.edit.OnTime = new app.edit.input($scope.businessHours.OnTime.text, $scope.businessHours.OnTime.text, app.valid.text);
                    $scope.businessHours.edit.OffTime = new app.edit.input($scope.businessHours.OffTime.text, $scope.businessHours.OffTime.text, app.valid.text);
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        OnTime: $scope.businessHours.edit.OnTime.check(apply),
                        OffTime: $scope.businessHours.edit.OffTime.check(apply)
                    };
                    return OK.OnTime && OK.OffTime;
                },
                submit: function () {
                    if (!$scope.businessHours.edit.check() || $scope.businessHours.edit.inProgress) {
                        return;
                    }
                    $scope.businessHours.edit.inProgress = true;
                    var value = JSON.parse(JSON.stringify(businessHoursData));
                    value.OnTime.text = $scope.businessHours.edit.OnTime.value;
                    value.OffTime.text = $scope.businessHours.edit.OffTime.value;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'business-hours',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.businessHours.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            businessHoursData = response.data.value;
                            $scope.businessHours.OnTime = businessHoursData.OnTime;
                            $scope.businessHours.OffTime = businessHoursData.OffTime;
                        }
                    }, function (response) {
                        $scope.businessHours.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.businessHours.init();
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        closeBtnText: '<',
        inProgressText: '<',
        submitBtnText: '<'
    }
});