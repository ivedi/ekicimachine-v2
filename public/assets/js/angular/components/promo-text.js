app.angular
.component('promoText', {
    templateUrl: 'assets/angular/template/promo-text.html?v=0.1.1',
    controller: ['$scope', '$timeout', '$http', '$window', function ($scope, $timeout, $http, $window) {
        $scope.promoText = {
            init: function () {
                $scope.promoText.value = promoTextData.texts.join(', ');
            },
            edit: {
                inProgress: false,
                texts: {
                    click: function () {
                        $scope.promoText.edit.texts.init();
                        $('.promo-text-texts-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    init: function () {
                        $scope.promoText.edit.texts.list = [];
                        for (var i = 0; i < promoTextData.texts.length; i++) {
                            $scope.promoText.edit.texts.list.push(new app.edit.input(promoTextData.texts[i], promoTextData.texts[i], app.valid.text));
                        }
                    },
                    check: function () {
                        var OK = true, apply = true;
                        var i = 0;
                        for (var i = 0; i < $scope.promoText.edit.texts.list.length; i++) {
                            OK = OK && $scope.promoText.edit.texts.list[i].check(apply);
                        }
                        return OK;
                    },
                    submit: function () {
                        if (!$scope.promoText.edit.texts.check() || $scope.promoText.edit.inProgress) {
                            return;
                        }
                        $scope.promoText.edit.inProgress = true;
                        var value = promoTextData;
                        for (var i = 0; i < value.texts.length; i++) {
                            value.texts[i] = $scope.promoText.edit.texts.list[i].value;
                        }
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'promo-text',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.promoText.edit.inProgress = false;
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                promoTextData = response.data.value;
                                $scope.promoText.init();
                            }
                        }, function (response) {
                            $scope.promoText.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                },
                images: {
                    width: 1920,
                    height: 1172,
                    click: function () {
                        $scope.promoText.edit.images.init();
                        $('.promo-text-images-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    init: function () {
                        $scope.promoText.edit.images.list = promoTextUniData.images;
                    },
                    upload: {
                        click: function (index) {
                            app.upload.file.id = index;
                            app.upload.file.date = new Date();
                            app.upload.handler.proceed = $scope.promoText.edit.images.upload.handler;
                            app.upload.handler.date = new Date();
                        },
                        handler: function (index, type, data, callback) {
                            if ($scope.promoText.edit.inProgress) {
                                callback();
                                return;
                            }
                            $scope.promoText.edit.inProgress = true;
                            $http({
                                method: 'POST',
                                url: 'service/image.ashx?d=' + new Date().valueOf(),
                                data: {
                                    path: $scope.promoText.edit.images.list[index].src,
                                    type: type,
                                    width: $scope.promoText.edit.images.width,
                                    height: $scope.promoText.edit.images.height,
                                    value: data
                                }
                            }).then(function (response) {
                                $scope.promoText.edit.inProgress = false;
                                if (app.valid.result(response.data)) {
                                    $scope.promoText.edit.images.submit(index, callback);
                                } else {
                                    app.show.error();
                                    callback();
                                }
                            }, function (response) {
                                $scope.promoText.edit.inProgress = true;
                                app.show.error();
                                console.log(response);
                                callback();
                            });
                        }
                    },
                    submit: function (index, callback) {
                        if ($scope.promoText.edit.inProgress) {
                            return;
                        }
                        $scope.promoText.edit.inProgress = true;
                        var value = promoTextUniData;
                        value.images[index].version.minor++;
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'promo-text-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.promoText.edit.inProgress = false;
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                promoTextUniData = response.data.value;
                                $scope.promoText.edit.images.init();
                                initSlideShow();
                            }
                            callback();
                        }, function (response) {
                            callback();
                            $scope.promoText.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                }
            }
        };
        $scope.promoText.init();

        function heroInit() {
            var promotext = jQuery('.promotext'),
                    ww = jQuery(window).width(),
                    wh = jQuery(window).height(),
                    heroHeight = wh;

            promotext.css({
                height: heroHeight + "px",
            });

            var heroContent = jQuery('.promotext .promo-slide'),
                    contentHeight = heroContent.height(),
                    parentHeight = promotext.height(),
                    topMargin = (parentHeight - contentHeight) / 2;

            heroContent.css({
                "margin-top": topMargin + "px"
            });
        }

        $timeout(function () {

            jQuery(window).on("resize", heroInit);
            jQuery(document).on("ready", heroInit);

            var current = 1;
            var height = jQuery('.promo').height();
            var numberDivs = jQuery('.promo').children().length;
            var first = jQuery('.promo h1:nth-child(1)');
            setInterval(function () {
                var number = current * -height;
                first.css('margin-top', number + 'px');
                if (current === numberDivs) {
                    first.css('margin-top', '0px');
                    current = 1;
                } else
                    current++;
            }, 3000);
            heroInit();
            $(".promo-text .rotate").textrotator({
                animation: "flipUp", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
                speed: 3500
            });
        }, 500);
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTextsTitle: '<',
        editImagesTitle: '<',
        editImageMsg: '<',
        editImageNote: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});