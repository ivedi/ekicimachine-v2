app.angular
.component('iconCardContainer', {
    templateUrl: 'assets/angular/template/icon-card-container.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        $scope.iconCard = {
            init: function () {
                $scope.iconCard.list = iconCardContainerData.list;
            },
            edit: {
                inProgress: false,
                click: function (index) {
                    $scope.iconCard.edit.index = index;
                    $scope.iconCard.edit.iconClass = iconCardContainerData.list[index].iconClass;
                    $scope.iconCard.edit.animationDelay = iconCardContainerData.list[index].animationDelay;
                    $scope.iconCard.edit.header = new app.edit.input(iconCardContainerData.list[index].header, iconCardContainerData.list[index].header, app.valid.text);
                    $scope.iconCard.edit.text = new app.edit.input(iconCardContainerData.list[index].text, iconCardContainerData.list[index].text, app.valid.text);
                    $('.icon-card-container-modal.modal:first').modal({ show: true, backdrop: false });
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        index: app.valid.integer($scope.iconCard.edit.index, apply, apply),
                        header: $scope.iconCard.edit.header.check(apply),
                        text: $scope.iconCard.edit.text.check(apply)
                    };
                    return OK.index && OK.header && OK.text;
                },
                submit: function () {
                    if (!$scope.iconCard.edit.check() || $scope.iconCard.edit.inProgress) {
                        return;
                    }
                    $scope.iconCard.edit.inProgress = true;
                    var value = iconCardContainerData;
                    value.list[$scope.iconCard.edit.index].header = $scope.iconCard.edit.header.value;
                    value.list[$scope.iconCard.edit.index].text = $scope.iconCard.edit.text.value;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'icon-card-container',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.iconCard.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            iconCardContainerData = response.data.value;
                            $scope.iconCard.init();
                        }
                    }, function (response) {
                        $scope.iconCard.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.iconCard.init();
        /* Animation */
        $(window).scroll(function () {
            $(".animated-area").each(function () {
                if ($(window).height() + $(window).scrollTop() - $(this).offset().top > 0) {
                    $(this).trigger("animate-it");
                }
            });
        });
        $(".animated-area").on("animate-it", function () {
            var cf = $(this);
            cf.find(".animated").each(function () {
                $(this).css("-webkit-animation-duration", "0.9s");
                $(this).css("-moz-animation-duration", "0.9s");
                $(this).css("-ms-animation-duration", "0.9s");
                $(this).css("animation-duration", "0.9s");
                $(this).css("-webkit-animation-delay", $(this).attr("data-animation-delay"));
                $(this).css("-moz-animation-delay", $(this).attr("data-animation-delay"));
                $(this).css("-ms-animation-delay", $(this).attr("data-animation-delay"));
                $(this).css("animation-delay", $(this).attr("data-animation-delay"));
                $(this).addClass($(this).attr("data-animation"));
            });
        });
        /* Animation */
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