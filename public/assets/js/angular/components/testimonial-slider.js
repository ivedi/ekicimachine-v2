app.angular
.component('testimonialSlider', {
    templateUrl: 'assets/angular/template/testimonial-slider.html?v=0.1.1',
    controller: ['$scope', '$http', '$window', function ($scope, $http, $window) {
        var $ctrl = this;
        $scope.testimonial = {
            init: function () {
                $scope.testimonial.lang = document.documentElement.lang;
                $scope.testimonial.title = testimonialSliderUniData.title;
                $scope.testimonial.list = testimonialSliderUniData.list;
            },
            edit: {
                inProgress: false,
                init: function () {
                    $scope.testimonial.edit.title = new app.edit.title(function () {
                        return testimonialSliderUniData.title[$scope.testimonial.lang];
                    }, function (text) {
                        testimonialSliderUniData.title[$scope.testimonial.lang] = text;
                        return testimonialSliderUniData;
                    }, 'testimonial-slider-uni', function (response) {
                        testimonialSliderUniData = response.data.value;
                        $scope.testimonial.title = testimonialSliderUniData.title;
                    }, $http);
                },
                testimonial: {
                    show: function (value) {
                        var testimonial = JSON.parse(JSON.stringify(value));
                        $scope.testimonial.edit.testimonial.id = testimonial.id;
                        $scope.testimonial.edit.testimonial.testimonial = new app.edit.input(testimonial.testimonial[$scope.testimonial.lang], testimonial.testimonial[$scope.testimonial.lang], app.valid.text);
                        $scope.testimonial.edit.testimonial.annotation = new app.edit.input(testimonial.annotation[$scope.testimonial.lang], testimonial.annotation[$scope.testimonial.lang], app.valid.text);
                        $('.testimonial-edit-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    check: function () {
                        var apply = true;
                        var OK = {
                            testimonial: $scope.testimonial.edit.testimonial.testimonial.check(apply),
                            annotation: $scope.testimonial.edit.testimonial.annotation.check(apply)
                        };
                        return OK.testimonial && OK.annotation;
                    },
                    submit: function () {
                        if (!$scope.testimonial.edit.testimonial.check() || $scope.testimonial.edit.inProgress) {
                            return;
                        }
                        $scope.testimonial.edit.inProgress = true;
                        var value = JSON.parse(JSON.stringify(testimonialSliderUniData));
                        var found = false;
                        var i = value.list.length;
                        while (i-- && !found) {
                            found = value.list[i].id === $scope.testimonial.edit.testimonial.id;
                        }
                        if (found) {
                            i++;
                            value.list[i].testimonial[$scope.testimonial.lang] = $scope.testimonial.edit.testimonial.testimonial.value;
                            value.list[i].annotation[$scope.testimonial.lang] = $scope.testimonial.edit.testimonial.annotation.value;
                        }
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'testimonial-slider-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.testimonial.edit.inProgress = false;
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                testimonialSliderUniData = response.data.value;
                                $scope.testimonial.init();
                            }
                        }, function (response) {
                            $scope.testimonial.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                }
            },
            add: {
                inProgress: false,
                show: function () {
                    $scope.testimonial.add.init();
                    $('.testimonial-add-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.testimonial.add.testimonial = {
                        tr: new app.edit.input('', $ctrl.addPlaceholderTestimonial, app.valid.text),
                        en: new app.edit.input('', $ctrl.addPlaceholderTestimonial, app.valid.text),
                        ru: new app.edit.input('', $ctrl.addPlaceholderTestimonial, app.valid.text),
                        ar: new app.edit.input('', $ctrl.addPlaceholderTestimonial, app.valid.text)
                    };
                    $scope.testimonial.add.annotation = {
                        tr: new app.edit.input('', $ctrl.addPlaceholderAnnotation, app.valid.text),
                        en: new app.edit.input('', $ctrl.addPlaceholderAnnotation, app.valid.text),
                        ru: new app.edit.input('', $ctrl.addPlaceholderAnnotation, app.valid.text),
                        ar: new app.edit.input('', $ctrl.addPlaceholderAnnotation, app.valid.text)
                    };
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        testimonial: {
                            tr: $scope.testimonial.add.testimonial.tr.check(apply),
                            en: $scope.testimonial.add.testimonial.en.check(apply),
                            ru: $scope.testimonial.add.testimonial.ru.check(apply),
                            ar: $scope.testimonial.add.testimonial.ar.check(apply)
                        },
                        annotation: {
                            tr: $scope.testimonial.add.annotation.tr.check(apply),
                            en: $scope.testimonial.add.annotation.en.check(apply),
                            ru: $scope.testimonial.add.annotation.ru.check(apply),
                            ar: $scope.testimonial.add.annotation.ar.check(apply)
                        }
                    };
                    return OK.testimonial.tr && OK.testimonial.en && OK.testimonial.ru && OK.testimonial.ar && OK.annotation.tr && OK.annotation.en && OK.annotation.ru && OK.annotation.ar;
                },
                submit: function () {
                    if (!$scope.testimonial.add.check() || $scope.testimonial.add.inProgress) {
                        return;
                    }
                    $scope.testimonial.add.inProgress = true;

                    var value = JSON.parse(JSON.stringify(testimonialSliderUniData));
                    var testimonial = {
                        id: ++value.currentID,
                        testimonial: {
                            tr: $scope.testimonial.add.testimonial.tr.value,
                            en: $scope.testimonial.add.testimonial.en.value,
                            ru: $scope.testimonial.add.testimonial.ru.value,
                            ar: $scope.testimonial.add.testimonial.ar.value
                        },
                        annotation: {
                            tr: $scope.testimonial.add.annotation.tr.value,
                            en: $scope.testimonial.add.annotation.en.value,
                            ru: $scope.testimonial.add.annotation.ru.value,
                            ar: $scope.testimonial.add.annotation.ar.value
                        }
                    };
                    value.list.push(testimonial);
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'testimonial-slider-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.testimonial.add.inProgress = false;
                        if (app.show.result(response.data, function () {
                            $window.location.reload();
                        }) && response.data.hasOwnProperty('value')) {
                            testimonialSliderUniData = response.data.value;
                            $scope.testimonial.init();
                        }
                    }, function (response) {
                        $scope.testimonial.add.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            },
            remove: {
                inProgress: false,
                show: function (value) {
                    var testimonial = JSON.parse(JSON.stringify(value));
                    $scope.testimonial.remove.id = testimonial.id;
                    $scope.testimonial.remove.testimonial = testimonial.testimonial;
                    $scope.testimonial.remove.annotation = testimonial.annotation;
                    $('.testimonial-remove-modal.modal:first').modal({ show: true, backdrop: false });
                },
                submit: function () {
                    if ($scope.testimonial.remove.inProgress) {
                        return;
                    }
                    $scope.testimonial.remove.inProgress = true;
                    var value = JSON.parse(JSON.stringify(testimonialSliderUniData));
                    value.list = value.list.filter(function (testimonial) {
                        return testimonial.id !== $scope.testimonial.remove.id;
                    });
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'testimonial-slider-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.testimonial.remove.inProgress = false;
                        if (app.show.result(response.data, function () {
                            $window.location.reload();
                        }) && response.data.hasOwnProperty('value')) {
                            testimonialSliderUniData = response.data.value;
                            $scope.testimonial.init();
                        }
                    }, function (response) {
                        $scope.testimonial.remove.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.testimonial.init();
        $scope.testimonial.edit.init();
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        addTitle: '<',
        addMsg: '<',
        addPlaceholderTestimonial: '<',
        addPlaceholderAnnotation: '<',
        removeTitle: '<',
        removeMsg: '<',
        textTurkish: '<',
        textEnglish: '<',
        textRussian: '<',
        textArabic: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        submitRemoveBtnText: '<',
        inProgressText: '<',
        inProgressRemoveText: '<'
    }
});