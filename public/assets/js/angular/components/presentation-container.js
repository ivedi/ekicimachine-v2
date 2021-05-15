app.angular
.component('presentationContainer', {
    templateUrl: 'assets/angular/template/presentation-container.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        $scope.presentation = {
            init: function () {
                $scope.presentation.list = presentationContainerData.list;
            },
            edit: {
                inProgress: false,
                show: function (index, value) {
                    var presentation = JSON.parse(JSON.stringify(value));
                    $scope.presentation.edit.index = index;
                    $scope.presentation.edit.title = new app.edit.input(presentation.title, presentation.title, app.valid.text);
                    $scope.presentation.edit.iconClass = presentation.iconClass;
                    $scope.presentation.edit.content = new app.edit.input(presentation.content, presentation.content, app.valid.text);

                    $('.presentation-edit-modal.modal:first').modal({ show: true, backdrop: false });
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        index: app.valid.integer($scope.presentation.edit.index, true, true) && presentationContainerData.list.length > $scope.presentation.edit.index,
                        title: $scope.presentation.edit.title.check(apply),
                        content: $scope.presentation.edit.content.check(apply)
                    };
                    return OK.index && OK.title && OK.content;
                },
                submit: function () {
                    if (!$scope.presentation.edit.check() || $scope.presentation.edit.inProgress) {
                        return;
                    }
                    $scope.presentation.edit.inProgress = true;
                    var value = JSON.parse(JSON.stringify(presentationContainerData));
                    value.list[$scope.presentation.edit.index].title = $scope.presentation.edit.title.value;
                    value.list[$scope.presentation.edit.index].content = $scope.presentation.edit.content.value;

                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'presentation-container',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.presentation.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            presentationContainerData = response.data.value;
                            $scope.presentation.init();
                        }
                    }, function (response) {
                        $scope.presentation.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.presentation.init();
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});