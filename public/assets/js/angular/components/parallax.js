app.angular
.component('parallax', {
    templateUrl: 'assets/angular/template/parallax.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        $scope.parallax = {
            init: function () {
                $scope.parallax.img = parallaxUniData.img;
                $scope.parallax.list = parallaxData.list;
                $scope.parallax.edit.init();
            },
            edit: {
                inProgress: false,
                init: function () {
                    $scope.parallax.edit.list = [];
                    for (var i = 0; i < parallaxData.list.length; i++) {
                        var parallaxItem = new app.edit.title(function (index) {
                            return parallaxData.list[index];
                        }, function (text, index) {
                            parallaxData.list[index] = text;
                            return parallaxData;
                        }, 'parallax', function (response) {
                            parallaxData = response.data.value;
                            $scope.parallax.init();
                        }, $http);
                        parallaxItem.index = i;
                        $scope.parallax.edit.list.push(parallaxItem);
                    }
                },
                image: {
                    width: 356,
                    height: 470,
                    show: function () {
                        $('.parallax-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    upload: {
                        click: function () {
                            app.upload.file.id = 0;
                            app.upload.file.date = new Date();
                            app.upload.handler.proceed = $scope.parallax.edit.image.upload.handler;
                            app.upload.handler.date = new Date();
                        },
                        handler: function (index, type, data, callback) {
                            if ($scope.parallax.edit.inProgress) {
                                callback();
                                return;
                            }
                            $scope.parallax.edit.inProgress = true;
                            $http({
                                method: 'POST',
                                url: 'service/image.ashx?d=' + new Date().valueOf(),
                                data: {
                                    path: $scope.parallax.img.src,
                                    type: type,
                                    width: $scope.parallax.edit.image.width,
                                    height: $scope.parallax.edit.image.height,
                                    value: data
                                }
                            }).then(function (response) {
                                $scope.parallax.edit.inProgress = false;
                                if (app.valid.result(response.data)) {
                                    $scope.parallax.edit.image.submit(callback);
                                } else {
                                    app.show.error();
                                    callback();
                                }
                            }, function (response) {
                                $scope.parallax.edit.inProgress = true;
                                app.show.error();
                                console.log(response);
                                callback();
                            });
                        }
                    },
                    submit: function (callback) {
                        if ($scope.parallax.edit.inProgress) {
                            callback();
                            return;
                        }
                        $scope.parallax.edit.inProgress = true;
                        var value = parallaxUniData;
                        value.img.version.minor++;
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'parallax-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.parallax.edit.inProgress = false;
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                parallaxUniData = response.data.value;
                                $scope.parallax.img = parallaxUniData.img;
                            }
                            callback();
                        }, function (response) {
                            callback();
                            $scope.parallax.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                }
            }
        };
        $scope.parallax.init();
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
        editImageMsg: '<',
        editImageNote: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});