app.angular
.component('automationList', {
    templateUrl: 'assets/angular/template/automation-list.html?v=0.1.1',
    controller: ['$scope', '$http', '$timeout', '$window', '$sce', function ($scope, $http, $timeout, $window, $sce) {
        var $ctrl = this;
        var automationItem = function (data) {
            var self = this;
            self.id = data.id;
            self.catIDs = data.catIDs;
            self.animationDelay = data.animationDelay;
            self.src = JSON.parse(JSON.stringify(data.src));
            self.text = data.text;
            self.init = function () {
                if (self.src.isYoutube) {
                    self.src.path = $sce.trustAsResourceUrl(self.src.path);
                }
                var arr = {
                    filter: [],
                    text: []
                };
                self.categories = $scope.automation.categories.filter(function (category) {
                    var i = 0;
                    var isSelected = false;
                    while (i < self.catIDs.length && !isSelected) {
                        if (self.catIDs[i] === category.id) {
                            isSelected = true;
                            arr.filter.push(category.filter.replace('.', ''));
                            arr.text.push(category.text[$scope.automation.lang]);
                        }
                        i++;
                    }
                    self.categoryText = arr.text.join(', ');
                    self.cls = arr.filter.join(' ');
                    return isSelected;
                });
            };
            self.init();
        };
        var automationEditItem = function (automationItem) {
            var self = this;
            self.id = automationItem.id;
            self.catIDs = automationItem.catIDs;
            self.animationDelay = automationItem.animationDelay;
            self.src = JSON.parse(JSON.stringify(automationItem.src));
            if (self.src.isYoutube) {
                self.src.video = new app.edit.iframe(app.convert.url.to.iframeString(automationItem.src.path.$$unwrapTrustedValue()), $sce.trustAsResourceUrl, automationItem.src.path);
                self.src.path = $scope.automation.edit.automation.upload.image.path;
                $scope.automation.youtube.video.resizer('.card-iframe-header > iframe');
            } else {
                self.src.video = new app.edit.iframe('', $sce.trustAsResourceUrl);
            }
            self.src.toggleType = function () {
                self.src.isYoutube = !self.src.isYoutube;
                if (self.src.isYoutube) {
                    $scope.automation.youtube.video.resizer('.card-iframe-header > iframe');
                }
            };
            self.select = function ($event) {
                $event.target.select();
            };
            self.text = automationItem.text;
            self.categories = JSON.parse(JSON.stringify($scope.automation.categories));
            self.init = function () {
                var arr = {
                    filter: [],
                    text: []
                };
                self.categories.forEach(function (category) {
                    category.isSelected = self.catIDs.findIndex(function (catID) {
                        var isSelected = false;
                        if (category.id === catID) {
                            isSelected = true;
                            arr.filter.push(category.filter.replace('.', ''));
                            arr.text.push(category.text[$scope.automation.lang]);
                        }
                        return isSelected;
                    }) !== -1;
                });
                self.categoryText = arr.text.join(', ');
                self.cls = arr.filter.join(' ');
            };
            self.categorySelect = function (category) {
                if (category.isSelected) {
                    var index = self.catIDs.indexOf(category.id);
                    self.catIDs.splice(self.catIDs.indexOf(category.id), 1);
                } else {
                    self.catIDs.push(category.id);
                }
                self.init();
            };
            self.init();
        };
        var automationAddItem = function () {
            var self = this;
            self.catIDs = [];
            self.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
            self.src = {
                isYoutube: false,
                path: $scope.automation.add.upload.image.path,
                change: function () {
                    self.src.path = '/assets/images/auto' + (automationListUniData.currentID + 1) + '.png';
                    return self.src.path;
                },
                video: new app.edit.iframe('', $sce.trustAsResourceUrl),
                toggleType: function () {
                    self.src.isYoutube = !self.src.isYoutube;
                    if (self.src.isYoutube) {
                        $scope.automation.youtube.video.resizer('.card-iframe-header > iframe');
                    }
                },
                version: {
                    major: 0,
                    medio: 0,
                    minor: 1
                }
            };
            self.select = function ($event) {
                $event.target.select();
            };
            self.text = {
                tr: new app.edit.input('', $ctrl.addPlaceholderAutomation, app.valid.text),
                en: new app.edit.input('', $ctrl.addPlaceholderAutomation, app.valid.text),
                ru: new app.edit.input('', $ctrl.addPlaceholderAutomation, app.valid.text),
                ar: new app.edit.input('', $ctrl.addPlaceholderAutomation, app.valid.text)
            };
            self.categories = JSON.parse(JSON.stringify($scope.automation.categories));
            self.init = function () {
                var arr = {
                    filter: [],
                    text: []
                };
                self.categories.forEach(function (category) {
                    category.isSelected = self.catIDs.findIndex(function (catID) {
                        var isSelected = false;
                        if (category.id === catID) {
                            isSelected = true;
                            arr.filter.push(category.filter.replace('.', ''));
                            arr.text.push(category.text[$scope.automation.lang]);
                        }
                        return isSelected;
                    }) !== -1;
                });
                self.categoryText = arr.text.join(', ');
                self.cls = arr.filter.join(' ');
            };
            self.categorySelect = function (category) {
                if (category.isSelected) {
                    var index = self.catIDs.indexOf(category.id);
                    self.catIDs.splice(self.catIDs.indexOf(category.id), 1);
                } else {
                    self.catIDs.push(category.id);
                }
                self.init();
            };
        };
        $scope.automation = {
            init: function () {
                $scope.automation.lang = document.documentElement.lang;
                $scope.automation.title = automationListUniData.title;

                $scope.automation.categories = automationListUniData.categories && automationListUniData.categories.hasOwnProperty('list') ? automationListUniData.categories.list : [];
                $scope.automation.list = [];
                automationListUniData.list.forEach(function (item, index) {
                    var automation = new automationItem(item);
                    $scope.automation.list.push(automation);
                });
                $scope.automation.youtube.init();
            },
            youtube: {
                init: function () {
                    if (!$scope.automation.youtube.video.initialized) {
                        angular.element($window).bind('resize', function () {
                            $scope.automation.youtube.video.resizer('.automation.catch-resize > iframe, .card-iframe-header > iframe');
                        });
                        $scope.automation.youtube.video.initialized = true;
                    }
                    $scope.automation.youtube.video.resizer('.automation.catch-resize > iframe');
                },
                video: {
                    aspectRatio: 1.8834,
                    resizer: function (query) {
                        if ($scope.automation.youtube.video.inProgress) {
                            return;
                        }
                        $scope.automation.youtube.video.inProgress = true;
                        $timeout(function () {
                            var resizeElemList = $(query);
                            for (var i = 0; i < resizeElemList.length; i++) {
                                var width = $(resizeElemList[i]).parent().width();
                                $(resizeElemList[i]).width(width);
                                var height = width / $scope.automation.youtube.video.aspectRatio;
                                $(resizeElemList[i]).height(height);
                                $(resizeElemList[i]).parent().height(height + 1);
                            }
                            $scope.automation.youtube.video.inProgress = false;
                        }, 150);
                    }
                }
            },
            edit: {
                inProgress: false,
                init: function () {
                    $scope.automation.edit.title = new app.edit.title(function () {
                        return automationListUniData.title[$scope.automation.lang];
                    }, function (text) {
                        automationListUniData.title[$scope.automation.lang] = text;
                        return automationListUniData;
                    }, 'automation-list-uni', function (response) {
                        automationListUniData = response.data.value;
                        $scope.automation.title = automationListUniData.title;
                    }, $http);
                },
                automation: {
                    show: function (value) {
                        $scope.automation.edit.automation.value = new automationEditItem(value);
                        $scope.automation.edit.automation.title = new app.edit.input($scope.automation.edit.automation.value.text[$scope.automation.lang], $scope.automation.edit.automation.value.text[$scope.automation.lang], app.valid.text);
                        $scope.automation.edit.automation.upload.init();
                        $('.automation-list-edit-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    upload: {
                        isNecessary: false,
                        width: 640,
                        height: 340,
                        image: {
                            path: '/assets/images/add-automation.png',
                            data: function (callback) {
                                var img = new Image();
                                img.onload = function () {
                                    var canvas = document.createElement('canvas');
                                    canvas.width = this.width;
                                    canvas.height = this.height;

                                    var ctx = canvas.getContext('2d');
                                    ctx.drawImage(this, 0, 0);
                                    var dataURL = canvas.toDataURL('image/png');//.replace(/^data:image\/(png|jpg);base64,/, '');
                                    $scope.automation.edit.automation.upload.handler(-1, 'image/png', dataURL, function () { }, undefined);
                                    callback(true);
                                };
                                img.onerror = function () {
                                    callback(false);
                                };
                                img.src = $scope.automation.edit.automation.upload.image.path;
                            }
                        },
                        click: function () {
                            app.upload.file.id = 0;
                            app.upload.file.date = new Date();
                            app.upload.handler.proceed = $scope.automation.edit.automation.upload.handler;
                            app.upload.handler.date = new Date();
                        },
                        init: function () {
                            $scope.automation.edit.automation.upload.isNecessary = false;
                            $scope.automation.edit.automation.upload.type = null;
                            $scope.automation.edit.automation.upload.data = null;
                            $scope.automation.edit.automation.upload.elem = null;
                        },
                        handler: function (id, type, data, callback, elem) {
                            callback();
                            $scope.automation.edit.automation.upload.type = type;
                            $scope.automation.edit.automation.upload.data = data;
                            $scope.automation.edit.automation.upload.elem = elem;
                            $timeout(function () {
                                $scope.automation.edit.automation.upload.isNecessary = true;
                            });
                        },
                        submit: function (callback) {
                            if ($scope.automation.edit.inProgress) {
                                callback(false);
                                return;
                            }
                            if ($scope.automation.edit.automation.value.src.isYoutube) {
                                callback(true);
                                return;
                            }
                            if (!$scope.automation.edit.automation.upload.isNecessary) {
                                if ($scope.automation.edit.automation.value.src.path === $scope.automation.edit.automation.upload.image.path) {
                                    $scope.automation.edit.automation.upload.image.data(function (result) {
                                        if (result) {
                                            $scope.automation.edit.automation.upload.submit(callback);
                                        } else {
                                            callback(false);
                                        }
                                    });
                                    return;
                                }
                                callback(true);
                                return;
                            }
                            var previousSrcPath = $scope.automation.edit.automation.value.src.path;
                            if ($scope.automation.edit.automation.value.src.path === $scope.automation.edit.automation.upload.image.path) {
                                $scope.automation.edit.automation.value.src.path = '/assets/images/auto' + $scope.automation.edit.automation.value.id + '.png';
                            }
                            $scope.automation.edit.inProgress = true;
                            $http({
                                method: 'POST',
                                url: 'service/image.ashx?d=' + new Date().valueOf(),
                                data: {
                                    path: $scope.automation.edit.automation.value.src.path,
                                    type: $scope.automation.edit.automation.upload.type,
                                    width: $scope.automation.edit.automation.upload.width,
                                    height: $scope.automation.edit.automation.upload.height,
                                    value: $scope.automation.edit.automation.upload.data
                                }
                            }).then(function (response) {
                                $scope.automation.edit.inProgress = false;
                                callback(app.show.result(response.data, undefined, true));
                            }, function (response) {
                                $scope.automation.edit.automation.value.src.path = previousSrcPath;
                                $scope.automation.edit.inProgress = false;
                                app.show.error();
                                console.log(response);
                                callback(false);
                            });
                        }
                    }
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        title: $scope.automation.edit.automation.title.check(apply),
                        video: !$scope.automation.edit.automation.value.src.isYoutube || $scope.automation.edit.automation.value.src.video.check(apply)
                    };
                    return OK.title && OK.video;
                },
                submit: function () {
                    if (!$scope.automation.edit.check() || $scope.automation.edit.inProgress) {
                        return;
                    }
                    app.show.spinner($scope.automation.edit.automation.upload.elem);
                    $scope.automation.edit.automation.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.automation.edit.automation.upload.elem);
                            return;
                        }
                        $scope.automation.edit.inProgress = true;
                        var value = automationListUniData;
                        var editedAutomation = {
                            id: $scope.automation.edit.automation.value.id,
                            catIDs: $scope.automation.edit.automation.value.catIDs,
                            animationDelay: $scope.automation.edit.automation.value.animationDelay,
                            src: {
                                isYoutube: $scope.automation.edit.automation.value.src.isYoutube,
                                path: $scope.automation.edit.automation.value.src.isYoutube ? app.convert.string.to.iframeSrc($scope.automation.edit.automation.value.src.video.value) : $scope.automation.edit.automation.value.src.path,
                                version: $scope.automation.edit.automation.value.src.version
                            },
                            text: $scope.automation.edit.automation.value.text
                        };
                        editedAutomation.text[$scope.automation.lang] = $scope.automation.edit.automation.title.value;
                        if ($scope.automation.edit.automation.upload.isNecessary) {
                            editedAutomation.src.version.minor++;
                        }
                        var index = value.list.findIndex(function (automation) {
                            return editedAutomation.id === automation.id;
                        });
                        if (index === -1) {
                            $scope.automation.edit.inProgress = false;
                            app.hide.spinner($scope.automation.edit.automation.upload.elem);
                            app.show.error();
                            return;
                        }
                        value.list[index] = editedAutomation;
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'automation-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.automation.edit.inProgress = false;
                            app.hide.spinner($scope.automation.edit.automation.upload.elem);
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                automationListUniData = response.data.value;
                                $scope.automation.init();
                            }
                        }, function (response) {
                            $scope.automation.edit.inProgress = false;
                            app.hide.spinner($scope.automation.edit.automation.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            add: {
                inProgress: false,
                show: function () {
                    $scope.automation.add.value = new automationAddItem();
                    $scope.automation.add.upload.init();
                    $('.automation-list-add-modal.modal:first').modal({ show: true, backdrop: false });
                },
                upload: {
                    isNecessary: false,
                    width: 640,
                    height: 340,
                    image: {
                        path: '/assets/images/add-automation.png',
                        data: function (callback) {
                            var img = new Image();
                            img.onload = function () {
                                var canvas = document.createElement('canvas');
                                canvas.width = this.width;
                                canvas.height = this.height;

                                var ctx = canvas.getContext('2d');
                                ctx.drawImage(this, 0, 0);
                                var dataURL = canvas.toDataURL('image/png');//.replace(/^data:image\/(png|jpg);base64,/, '');
                                $scope.automation.add.upload.handler(-1, 'image/png', dataURL, function () { }, undefined);
                                callback(true);
                            };
                            img.onerror = function () {
                                callback(false);
                            };
                            img.src = $scope.automation.add.upload.image.path;
                        }
                    },
                    click: function () {
                        app.upload.file.id = 0;
                        app.upload.file.date = new Date();
                        app.upload.handler.proceed = $scope.automation.add.upload.handler;
                        app.upload.handler.date = new Date();
                    },
                    init: function () {
                        $scope.automation.add.upload.isNecessary = false;
                        $scope.automation.add.upload.type = null;
                        $scope.automation.add.upload.data = null;
                        $scope.automation.add.upload.elem = null;
                    },
                    handler: function (id, type, data, callback, elem) {
                        callback();
                        $scope.automation.add.upload.type = type;
                        $scope.automation.add.upload.data = data;
                        $scope.automation.add.upload.elem = elem;
                        $timeout(function () {
                            $scope.automation.add.upload.isNecessary = true;
                        });
                    },
                    submit: function (callback) {
                        if ($scope.automation.add.inProgress) {
                            callback(false);
                            return;
                        }
                        if ($scope.automation.add.value.src.isYoutube) {
                            callback(true);
                            return;
                        }
                        if (!$scope.automation.add.upload.isNecessary) {
                            $scope.automation.add.upload.image.data(function (result) {
                                if (result) {
                                    $scope.automation.add.upload.submit(callback);
                                }
                                else {
                                    callback(false);
                                }
                            });
                            return;
                        }
                        $scope.automation.add.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/image.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.automation.add.value.src.change(),
                                type: $scope.automation.add.upload.type,
                                width: $scope.automation.add.upload.width,
                                height: $scope.automation.add.upload.height,
                                value: $scope.automation.add.upload.data
                            }
                        }).then(function (response) {
                            $scope.automation.add.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.automation.add.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        title: {
                            tr: $scope.automation.add.value.text.tr.check(apply),
                            en: $scope.automation.add.value.text.en.check(apply),
                            ru: $scope.automation.add.value.text.ru.check(apply),
                            ar: $scope.automation.add.value.text.ar.check(apply)
                        },
                        video: !$scope.automation.add.value.src.isYoutube || $scope.automation.add.value.src.video.check(apply)
                    };
                    return OK.title.tr && OK.title.en && OK.title.ru && OK.title.ar && OK.video;
                },
                submit: function () {
                    if (!$scope.automation.add.check() || $scope.automation.add.inProgress) {
                        return;
                    }
                    app.show.spinner($scope.automation.add.upload.elem);
                    $scope.automation.add.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.automation.add.upload.elem);
                            return;
                        }
                        $scope.automation.add.inProgress = true;
                        var value = JSON.parse(JSON.stringify(automationListUniData));
                        var automation = {
                            id: ++value.currentID,
                            catIDs: $scope.automation.add.value.catIDs,
                            animationDelay: $scope.automation.add.value.animationDelay,
                            src: {
                                isYoutube: $scope.automation.add.value.src.isYoutube,
                                path: $scope.automation.add.value.src.isYoutube ? app.convert.string.to.iframeSrc($scope.automation.add.value.src.video.value) : $scope.automation.add.value.src.path,
                                version: $scope.automation.add.value.src.version
                            },
                            text: {
                                tr: $scope.automation.add.value.text.tr.value,
                                en: $scope.automation.add.value.text.en.value,
                                ru: $scope.automation.add.value.text.ru.value,
                                ar: $scope.automation.add.value.text.ar.value
                            }
                        };
                        value.list.push(automation);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'automation-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.automation.add.inProgress = false;
                            app.hide.spinner($scope.automation.add.upload.elem);
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                automationListUniData = response.data.value;
                                $scope.automation.init();
                            }
                        }, function (response) {
                            $scope.automation.add.inProgress = false;
                            app.hide.spinner($scope.automation.add.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            remove: {
                inProgress: false,
                show: function (automation) {
                    $scope.automation.remove.automation = automation;
                    if ($scope.automation.remove.automation.src.isYoutube) {
                        $scope.automation.remove.automation.src.video = new app.edit.iframe(app.convert.url.to.iframeString(automation.src.path.$$unwrapTrustedValue()), $sce.trustAsResourceUrl, automation.src.path);
                        $scope.automation.youtube.video.resizer('.card-iframe-header > iframe');
                    }
                    $('.automation-list-remove-modal.modal:first').modal({ show: true, backdrop: false });
                },
                image: {
                    remove: function (callback) {
                        if ($scope.automation.remove.inProgress) {
                            callback(false);
                            return;
                        }
                        if ($scope.automation.remove.automation.src.isYoutube) {
                            callback(true);
                            return;
                        }
                        $scope.automation.remove.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/remove.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.automation.remove.automation.src.path
                            }
                        }).then(function (response) {
                            $scope.automation.remove.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.automation.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    if (!$scope.automation.remove.automation || !app.valid.integer($scope.automation.remove.automation.id, true)) {
                        return false;
                    }
                    var OK = false;
                    var i = automationListUniData.list.length;
                    while (i-- && !OK) {
                        OK = automationListUniData.list[i].id === $scope.automation.remove.automation.id;
                    }
                    return OK;
                },
                submit: function () {
                    if (!$scope.automation.remove.check() || $scope.automation.remove.inProgress) {
                        return;
                    }
                    $scope.automation.remove.image.remove(function (imageResult) {
                        if (!imageResult) {
                            return;
                        }
                        $scope.automation.remove.inProgress = true;
                        var value = JSON.parse(JSON.stringify(automationListUniData));
                        value.list = value.list.filter(function (automation) {
                            return automation.id !== $scope.automation.remove.automation.id;
                        });
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'automation-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.automation.remove.inProgress = false;
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                automationListUniData = response.data.value;
                                $scope.automation.init();
                            }
                        }, function (response) {
                            $scope.automation.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            }
        };
        $scope.automation.init();
        $scope.automation.edit.init();

        function isotope() {
            /* Isotope */
            var $container = $('.portfolio');
            //$container.isotope({ remove: true });
            $container.isotope({
                filter: '*',
                layoutMode: 'sloppyMasonry',
            });
            $('.portfolioFilter a').click(function () {
                $('.portfolioFilter .current').removeClass('current');
                $(this).addClass('current');
                var selector = $(this).attr('data-filter');
                $container.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });
            /* Isotope */

            /* Portfolio Hover */
            $('.port-hover.automation-image').each(function () {
                $(this).hoverdir({
                    hoverDelay: 5
                });
            });
            /* Portfolio Hover */
        }
        $timeout(isotope, 600);
    }],
    bindings: {
        listContainerClass: '<',
        automationClass: '<',
        hideTitle: '<',
        textTurkish: '<',
        textEnglish: '<',
        textRussian: '<',
        textArabic: '<',
        textEmbeddedYoutube: '<',
        textNewAutomation: '<',
        textNewAutomationComment: '<',
        filterTextAll: '<',
        filterTextEdit: '<',
        filterTextAdd: '<',
        filterTextRemove: '<',
        editable: '<',
        editMsg: '<',
        editTitleCategory: '<',
        editTitleAutomation: '<',
        editImageMsg: '<',
        editImageNote: '<',
        removeTitleCategory: '<',
        removeTitleAutomation: '<',
        removeMsgCategory: '<',
        removeMsgAutomation: '<',
        addTitleCategory: '<',
        addTitleAutomation: '<',
        addMsg: '<',
        addPlaceholderCategory: '<',
        addPlaceholderAutomation: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        submitRemoveBtnText: '<',
        inProgressText: '<',
        inProgressRemoveText: '<'
    }
});