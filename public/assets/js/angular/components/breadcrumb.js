app.angular
.component('breadcrumb', {
    templateUrl: 'assets/angular/template/breadcrumb.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var ctrl = this;
        $scope.breadcrumb = {
            init: function () {
                $scope.breadcrumb.header = breadcrumbData.pages[ctrl.page].header;
                $scope.breadcrumb.main = breadcrumbData.pages[ctrl.page].main;
                $scope.breadcrumb.sub = breadcrumbData.pages[ctrl.page].sub;
            },
            edit: {
                inProgress: false,
                show: function () {
                    $scope.breadcrumb.edit.init();
                    $('.breadcrumb-edit-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.breadcrumb.edit.header = new app.edit.input(breadcrumbData.pages[ctrl.page].header, breadcrumbData.pages[ctrl.page].header, app.valid.text);
                    $scope.breadcrumb.edit.sub = new app.edit.input(breadcrumbData.pages[ctrl.page].sub.text, breadcrumbData.pages[ctrl.page].sub.text, app.valid.text);
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        header: $scope.breadcrumb.edit.header.check(apply),
                        sub: $scope.breadcrumb.edit.sub.check(apply)
                    };
                    return OK.header && OK.sub;
                },
                submit: function () {
                    if (!$scope.breadcrumb.edit.check() || $scope.breadcrumb.edit.inProgress) {
                        return;
                    }
                    $scope.breadcrumb.edit.inProgress = true;
                    var value = JSON.parse(JSON.stringify(breadcrumbData));
                    value.pages[ctrl.page].header = $scope.breadcrumb.edit.header.value;
                    value.pages[ctrl.page].sub.text = $scope.breadcrumb.edit.sub.value;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'breadcrumb',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.breadcrumb.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            breadcrumbData = response.data.value;
                            $scope.breadcrumb.init();
                        }
                    }, function (response) {
                        $scope.breadcrumb.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        ctrl.$onInit = function () {
            $scope.breadcrumb.init();
        };
    }],
    bindings: {
        page: '<',
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});