app.angular
.component('socialNetwork', {
    templateUrl: 'assets/angular/template/social-network.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var self = this;
        $scope.socialNetwork = {
            init: function () {
                $scope.socialNetwork.title = socialNetworkData.title;
                $scope.socialNetwork.links = socialNetworkData.links;
            },
            edit: {
                inProgress: false,
                title: new app.edit.title(function () {
                    return socialNetworkData.title;
                }, function (text) {
                    socialNetworkData.title = text;
                    return socialNetworkData;
                }, 'social-network', function (response) {
                    socialNetworkData = response.data.value;
                    console.log(socialNetworkData);
                    $scope.socialNetwork.title = socialNetworkData.title;
                }, $http),
                show: socialNetworkData.edit.show,
                hide: socialNetworkData.edit.hide,
                click: function () {
                    $scope.socialNetwork.edit.init();
                    $('.social-network-modal.modal.' + self.editModalClass + ':first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.socialNetwork.edit.links = [];
                    for (var i = 0; i < socialNetworkData.links.length; i++) {
                        var link = new app.edit.input(socialNetworkData.links[i].address, socialNetworkData.links[i].address, app.valid.url);
                        link.order = socialNetworkData.links[i].order;
                        link.iconClass = socialNetworkData.links[i].iconClass;
                        link.isVisible = socialNetworkData.links[i].isVisible;
                        link.title = socialNetworkData.links[i].title;
                        link.explanation = socialNetworkData.links[i].explanation;
                        $scope.socialNetwork.edit.links.push(link);
                    }
                },
                toggleVisibility: function (link) {
                    link.isVisible = !link.isVisible;
                    if (!link.isVisible) {
                        link.success();
                    } else {
                        link.check(true);
                    }
                },
                check: function () {
                    var OK = true;
                    for (var i = 0; i < $scope.socialNetwork.edit.links.length; i++) {
                        OK = OK & (!$scope.socialNetwork.edit.links[i].isVisible || $scope.socialNetwork.edit.links[i].check($scope.socialNetwork.edit.links[i].isVisible));
                    }
                    return OK;
                },
                submit: function () {
                    if (!$scope.socialNetwork.edit.check() || $scope.socialNetwork.edit.inProgress) {
                        return;
                    }
                    $scope.socialNetwork.edit.inProgress = true;
                    var value = socialNetworkData;
                    value.links = [];
                    for (var i = 0; i < $scope.socialNetwork.edit.links.length; i++) {
                        if (!$scope.socialNetwork.edit.links[i].value.startsWith('http://') && !$scope.socialNetwork.edit.links[i].value.startsWith('https://') && $scope.socialNetwork.edit.links[i].value !== '#') {
                            $scope.socialNetwork.edit.links[i].value = 'http://' + $scope.socialNetwork.edit.links[i].value;
                        }
                        var link = {
                            order: $scope.socialNetwork.edit.links[i].order,
                            address: $scope.socialNetwork.edit.links[i].value,
                            title: $scope.socialNetwork.edit.links[i].title,
                            iconClass: $scope.socialNetwork.edit.links[i].iconClass,
                            isVisible: $scope.socialNetwork.edit.links[i].isVisible,
                            explanation: $scope.socialNetwork.edit.links[i].explanation
                        };
                        value.links.push(link);
                    }
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'social-network',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.socialNetwork.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            socialNetworkData = response.data.value;
                            $scope.socialNetwork.init();
                        }
                    }, function (response) {
                        $scope.socialNetwork.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.socialNetwork.init();
    }],
    bindings: {
        titleIsVisible: '<',
        iconContainerClass: '<',
        editModalClass: '<',
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        closeBtnText: '<',
        inProgressText: '<',
        submitBtnText: '<'
    }
});