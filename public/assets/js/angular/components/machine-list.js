app.angular
.component('machineList', {
    templateUrl: 'assets/angular/template/machine-list.html?v=0.1.1',
    controller: ['$scope', '$http', '$timeout', '$window', '$sce', function ($scope, $http, $timeout, $window, $sce) {
        var $ctrl = this;
        var machineItem = function (data) {
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
                self.categories = $scope.machine.categories.filter(function (category) {
                    var i = 0;
                    var isSelected = false;
                    while (i < self.catIDs.length && !isSelected) {
                        if (self.catIDs[i] === category.id) {
                            isSelected = true;
                            arr.filter.push(category.filter.replace('.', ''));
                            arr.text.push(category.text[$scope.machine.lang]);
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
        var machineEditItem = function (machineItem) {
            var self = this;
            self.id = machineItem.id;
            self.catIDs = machineItem.catIDs;
            self.animationDelay = machineItem.animationDelay;
            self.src = JSON.parse(JSON.stringify(machineItem.src));
            if (self.src.isYoutube) {
                self.src.video = new app.edit.iframe(app.convert.url.to.iframeString(machineItem.src.path.$$unwrapTrustedValue()), $sce.trustAsResourceUrl, machineItem.src.path);
                self.src.path = $scope.machine.edit.machine.upload.image.path;
                $scope.machine.youtube.video.resizer('.card-iframe-header > iframe');
            } else {
                self.src.video = new app.edit.iframe('', $sce.trustAsResourceUrl);
            }
            self.src.toggleType = function () {
                self.src.isYoutube = !self.src.isYoutube;
                if (self.src.isYoutube) {
                    $scope.machine.youtube.video.resizer('.card-iframe-header > iframe');
                }
            };
            self.select = function ($event) {
                $event.target.select();
            };
            self.text = machineItem.text;
            self.categories = JSON.parse(JSON.stringify($scope.machine.categories));
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
                            arr.text.push(category.text[$scope.machine.lang]);
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
        var machineAddItem = function () {
            var self = this;
            self.catIDs = [];
            self.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
            self.src = {
                isYoutube: false,
                path: $scope.machine.add.upload.image.path,
                change: function () {
                    self.src.path = '/assets/images/mach' + (machineListUniData.currentID + 1) + '.png';
                    return self.src.path;
                },
                video: new app.edit.iframe('', $sce.trustAsResourceUrl),
                toggleType: function () {
                    self.src.isYoutube = !self.src.isYoutube;
                    if (self.src.isYoutube) {
                        $scope.machine.youtube.video.resizer('.card-iframe-header > iframe');
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
                tr: new app.edit.input('', $ctrl.addPlaceholderMachine, app.valid.text),
                en: new app.edit.input('', $ctrl.addPlaceholderMachine, app.valid.text),
                ru: new app.edit.input('', $ctrl.addPlaceholderMachine, app.valid.text),
                ar: new app.edit.input('', $ctrl.addPlaceholderMachine, app.valid.text)
            };
            self.categories = JSON.parse(JSON.stringify($scope.machine.categories));
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
                            arr.text.push(category.text[$scope.machine.lang]);
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
        $scope.machine = {
            init: function () {
                $scope.machine.lang = document.documentElement.lang;
                $scope.machine.title = machineListUniData.title;
                
                $scope.machine.categories = machineListUniData.categories && machineListUniData.categories.hasOwnProperty('list') ? machineListUniData.categories.list : [];
                $scope.machine.list = [];
                machineListUniData.list.forEach(function (item, index) {
                    var machine = new machineItem(item);
                    $scope.machine.list.push(machine);
                });
                $scope.machine.youtube.init();
            },
            youtube: {
                init: function () {
                    if (!$scope.machine.youtube.video.initialized) {
                        angular.element($window).bind('resize', function () {
                            $scope.machine.youtube.video.resizer('.machine.catch-resize > iframe, .card-iframe-header > iframe');
                        });
                        $scope.machine.youtube.video.initialized = true;
                    }
                    $scope.machine.youtube.video.resizer('.machine.catch-resize > iframe');
                },
                video: {
                    aspectRatio: 1.8834,
                    resizer: function (query) {
                        if ($scope.machine.youtube.video.inProgress) {
                            return;
                        }
                        $scope.machine.youtube.video.inProgress = true;
                        $timeout(function () {
                            var resizeElemList = $(query);
                            for (var i = 0; i < resizeElemList.length; i++) {
                                var width = $(resizeElemList[i]).parent().width();
                                $(resizeElemList[i]).width(width);
                                var height = width / $scope.machine.youtube.video.aspectRatio;
                                $(resizeElemList[i]).height(height);
                                $(resizeElemList[i]).parent().height(height + 1);
                            }
                            $scope.machine.youtube.video.inProgress = false;
                        }, 150);
                    }
                }
            },
            edit: {
                inProgress: false,
                init: function () {
                    $scope.machine.edit.title = new app.edit.title(function () {
                        return machineListUniData.title[$scope.machine.lang];
                    }, function (text) {
                        machineListUniData.title[$scope.machine.lang] = text;
                        return machineListUniData;
                    }, 'machine-list-uni', function (response) {
                        machineListUniData = response.data.value;
                        $scope.machine.title = machineListUniData.title;
                    }, $http);
                },
                machine: {
                    show: function (value) {
                        $scope.machine.edit.machine.value = new machineEditItem(value);
                        $scope.machine.edit.machine.title = new app.edit.input($scope.machine.edit.machine.value.text[$scope.machine.lang], $scope.machine.edit.machine.value.text[$scope.machine.lang], app.valid.text);
                        $scope.machine.edit.machine.upload.init();
                        $('.machine-list-edit-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    upload: {
                        isNecessary: false,
                        width: 640,
                        height: 340,
                        image: {
                            path: '/assets/images/add-machine.png',
                            data: function (callback) {
                                var img = new Image();
                                img.onload = function () {
                                    var canvas = document.createElement('canvas');
                                    canvas.width = this.width;
                                    canvas.height = this.height;

                                    var ctx = canvas.getContext('2d');
                                    ctx.drawImage(this, 0, 0);
                                    var dataURL = canvas.toDataURL('image/png');//.replace(/^data:image\/(png|jpg);base64,/, '');
                                    $scope.machine.edit.upload.handler(-1, 'image/png', dataURL, function () { }, undefined);
                                    callback(true);
                                };
                                img.onerror = function () {
                                    callback(false);
                                };
                                img.src = $scope.machine.edit.upload.image.path;
                            }
                        },
                        click: function () {
                            app.upload.file.id = 0;
                            app.upload.file.date = new Date();
                            app.upload.handler.proceed = $scope.machine.edit.machine.upload.handler;
                            app.upload.handler.date = new Date();
                        },
                        init: function () {
                            $scope.machine.edit.machine.upload.isNecessary = false;
                            $scope.machine.edit.machine.upload.type = null;
                            $scope.machine.edit.machine.upload.data = null;
                            $scope.machine.edit.machine.upload.elem = null;
                        },
                        handler: function (id, type, data, callback, elem) {
                            callback();
                            $scope.machine.edit.machine.upload.type = type;
                            $scope.machine.edit.machine.upload.data = data;
                            $scope.machine.edit.machine.upload.elem = elem;
                            $timeout(function () {
                                $scope.machine.edit.machine.upload.isNecessary = true;
                            });
                        },
                        submit: function (callback) {
                            if ($scope.machine.edit.inProgress) {
                                callback(false);
                                return;
                            }
                            if ($scope.machine.edit.machine.value.src.isYoutube) {
                                callback(true);
                                return;
                            }
                            if (!$scope.machine.edit.machine.upload.isNecessary) {
                                if ($scope.machine.edit.machine.value.src.path === $scope.machine.edit.machine.upload.image.path) {
                                    $scope.machine.edit.machine.upload.image.data(function (result) {
                                        if (result) {
                                            $scope.machine.edit.machine.upload.submit(callback);
                                        } else {
                                            callback(false);
                                        }
                                    });
                                    return;
                                }
                                callback(true);
                                return;
                            }
                            var previousSrcPath = $scope.machine.edit.machine.value.src.path;
                            if ($scope.machine.edit.machine.value.src.path === $scope.machine.edit.machine.upload.image.path) {
                                $scope.machine.edit.machine.value.src.path = '/assets/images/mach' + $scope.machine.edit.machine.value.id + '.png';
                            }
                            $scope.machine.edit.inProgress = true;
                            $http({
                                method: 'POST',
                                url: 'service/image.ashx?d=' + new Date().valueOf(),
                                data: {
                                    path: $scope.machine.edit.machine.value.src.path,
                                    type: $scope.machine.edit.machine.upload.type,
                                    width: $scope.machine.edit.machine.upload.width,
                                    height: $scope.machine.edit.machine.upload.height,
                                    value: $scope.machine.edit.machine.upload.data
                                }
                            }).then(function (response) {
                                $scope.machine.edit.inProgress = false;
                                callback(app.show.result(response.data, undefined, true));
                            }, function (response) {
                                $scope.machine.edit.machine.value.src.path = previousSrcPath;
                                $scope.machine.edit.inProgress = false;
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
                        title: $scope.machine.edit.machine.title.check(apply),
                        video: !$scope.machine.edit.machine.value.src.isYoutube || $scope.machine.edit.machine.value.src.video.check(apply)
                    };
                    return OK.title && OK.video;
                },
                submit: function () {
                    if (!$scope.machine.edit.check() || $scope.machine.edit.inProgress) {
                        return;
                    }
                    app.show.spinner($scope.machine.edit.machine.upload.elem);
                    $scope.machine.edit.machine.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.machine.edit.machine.upload.elem);
                            return;
                        }
                        $scope.machine.edit.inProgress = true;
                        var value = machineListUniData;
                        var editedMachine = {
                            id: $scope.machine.edit.machine.value.id,
                            catIDs: $scope.machine.edit.machine.value.catIDs,
                            animationDelay: $scope.machine.edit.machine.value.animationDelay,
                            src: {
                                isYoutube: $scope.machine.edit.machine.value.src.isYoutube,
                                path: $scope.machine.edit.machine.value.src.isYoutube ? app.convert.string.to.iframeSrc($scope.machine.edit.machine.value.src.video.value) : $scope.machine.edit.machine.value.src.path,
                                version: $scope.machine.edit.machine.value.src.version
                            },
                            text: $scope.machine.edit.machine.value.text
                        };
                        editedMachine.text[$scope.machine.lang] = $scope.machine.edit.machine.title.value;
                        if ($scope.machine.edit.machine.upload.isNecessary) {
                            editedMachine.src.version.minor++;
                        }
                        var index = value.list.findIndex(function (machine) {
                            return editedMachine.id === machine.id;
                        });
                        if (index === -1) {
                            $scope.machine.edit.inProgress = false;
                            app.hide.spinner($scope.machine.edit.machine.upload.elem);
                            app.show.error();
                            return;
                        }
                        value.list[index] = editedMachine;
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'machine-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.machine.edit.inProgress = false;
                            app.hide.spinner($scope.machine.edit.machine.upload.elem);
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                machineListUniData = response.data.value;
                                $scope.machine.init();
                            }
                        }, function (response) {
                            $scope.machine.edit.inProgress = false;
                            app.hide.spinner($scope.machine.edit.machine.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            add: {
                inProgress: false,
                show: function () {
                    $scope.machine.add.value = new machineAddItem();
                    $scope.machine.add.upload.init();
                    $('.machine-list-add-modal.modal:first').modal({ show: true, backdrop: false });
                },
                upload: {
                    isNecessary: false,
                    width: 640,
                    height: 340,
                    image: {
                        path: '/assets/images/add-machine.png',
                        data: function (callback) {
                            var img = new Image();
                            img.onload = function () {
                                var canvas = document.createElement('canvas');
                                canvas.width = this.width;
                                canvas.height = this.height;

                                var ctx = canvas.getContext('2d');
                                ctx.drawImage(this, 0, 0);
                                var dataURL = canvas.toDataURL('image/png');//.replace(/^data:image\/(png|jpg);base64,/, '');
                                $scope.machine.add.upload.handler(-1, 'image/png', dataURL, function () { }, undefined);
                                callback(true);
                            };
                            img.onerror = function () {
                                callback(false);
                            };
                            img.src = $scope.machine.add.upload.image.path;
                        }
                    },
                    click: function () {
                        app.upload.file.id = 0;
                        app.upload.file.date = new Date();
                        app.upload.handler.proceed = $scope.machine.add.upload.handler;
                        app.upload.handler.date = new Date();
                    },
                    init: function () {
                        $scope.machine.add.upload.isNecessary = false;
                        $scope.machine.add.upload.type = null;
                        $scope.machine.add.upload.data = null;
                        $scope.machine.add.upload.elem = null;
                    },
                    handler: function (id, type, data, callback, elem) {
                        callback();
                        $scope.machine.add.upload.type = type;
                        $scope.machine.add.upload.data = data;
                        $scope.machine.add.upload.elem = elem;
                        $timeout(function () {
                            $scope.machine.add.upload.isNecessary = true;
                        });
                    },
                    submit: function (callback) {
                        if ($scope.machine.add.inProgress) {
                            callback(false);
                            return;
                        }
                        if ($scope.machine.add.value.src.isYoutube) {
                            callback(true);
                            return;
                        }
                        if (!$scope.machine.add.upload.isNecessary) {
                            $scope.machine.add.upload.image.data(function (result) {
                                if (result) {
                                    $scope.machine.add.upload.submit(callback);
                                }
                                else {
                                    callback(false);
                                }
                            });
                            return;
                        }
                        $scope.machine.add.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/image.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.machine.add.value.src.change(),
                                type: $scope.machine.add.upload.type,
                                width: $scope.machine.add.upload.width,
                                height: $scope.machine.add.upload.height,
                                value: $scope.machine.add.upload.data
                            }
                        }).then(function (response) {
                            $scope.machine.add.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.machine.add.inProgress = false;
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
                            tr: $scope.machine.add.value.text.tr.check(apply),
                            en: $scope.machine.add.value.text.en.check(apply),
                            ru: $scope.machine.add.value.text.ru.check(apply),
                            ar: $scope.machine.add.value.text.ar.check(apply)
                        },
                        video: !$scope.machine.add.value.src.isYoutube || $scope.machine.add.value.src.video.check(apply)
                    };
                    return OK.title.tr && OK.title.en && OK.title.ru && OK.title.ar && OK.video;
                },
                submit: function () {
                    if (!$scope.machine.add.check() || $scope.machine.add.inProgress) {
                        return;
                    }
                    app.show.spinner($scope.machine.add.upload.elem);
                    $scope.machine.add.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.machine.add.upload.elem);
                            return;
                        }
                        $scope.machine.add.inProgress = true;
                        var value = JSON.parse(JSON.stringify(machineListUniData));
                        var machine = {
                            id: ++value.currentID,
                            catIDs: $scope.machine.add.value.catIDs,
                            animationDelay: $scope.machine.add.value.animationDelay,
                            src: {
                                isYoutube: $scope.machine.add.value.src.isYoutube,
                                path: $scope.machine.add.value.src.isYoutube ? app.convert.string.to.iframeSrc($scope.machine.add.value.src.video.value) : $scope.machine.add.value.src.path,
                                version: $scope.machine.add.value.src.version
                            },
                            text: {
                                tr: $scope.machine.add.value.text.tr.value,
                                en: $scope.machine.add.value.text.en.value,
                                ru: $scope.machine.add.value.text.ru.value,
                                ar: $scope.machine.add.value.text.ar.value
                            }
                        };
                        value.list.push(machine);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'machine-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.machine.add.inProgress = false;
                            app.hide.spinner($scope.machine.add.upload.elem);
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                machineListUniData = response.data.value;
                                $scope.machine.init();
                            }
                        }, function (response) {
                            $scope.machine.add.inProgress = false;
                            app.hide.spinner($scope.machine.add.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            remove: {
                inProgress: false,
                show: function (machine) {
                    $scope.machine.remove.machine = machine;
                    if ($scope.machine.remove.machine.src.isYoutube) {
                        $scope.machine.remove.machine.src.video = new app.edit.iframe(app.convert.url.to.iframeString(machine.src.path.$$unwrapTrustedValue()), $sce.trustAsResourceUrl, machine.src.path);
                        $scope.machine.youtube.video.resizer('.card-iframe-header > iframe');
                   }
                    $('.machine-list-remove-modal.modal:first').modal({ show: true, backdrop: false });
                },
                image: {
                    remove: function (callback) {
                        if ($scope.machine.remove.inProgress) {
                            callback(false);
                            return;
                        }
                        if ($scope.machine.remove.machine.src.isYoutube) {
                            callback(true);
                            return;
                        }
                        $scope.machine.remove.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/remove.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.machine.remove.machine.src.path
                            }
                        }).then(function (response) {
                            $scope.machine.remove.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.machine.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    if (!$scope.machine.remove.machine || !app.valid.integer($scope.machine.remove.machine.id, true)) {
                        return false;
                    }
                    var OK = false;
                    var i = machineListUniData.list.length;
                    while (i-- && !OK) {
                        OK = machineListUniData.list[i].id === $scope.machine.remove.machine.id;
                    }
                    return OK;
                },
                submit: function () {
                    if (!$scope.machine.remove.check() || $scope.machine.remove.inProgress) {
                        return;
                    }
                    $scope.machine.remove.image.remove(function (imageResult) {
                        if (!imageResult) {
                            return;
                        }
                        $scope.machine.remove.inProgress = true;
                        var value = JSON.parse(JSON.stringify(machineListUniData));
                        value.list = value.list.filter(function (machine) {
                            return machine.id !== $scope.machine.remove.machine.id;
                        });
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'machine-list-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.machine.remove.inProgress = false;
                            if (app.show.result(response.data, function () {
                                $window.location.reload();
                            }) && response.data.hasOwnProperty('value')) {
                                machineListUniData = response.data.value;
                                $scope.machine.init();
                            }
                        }, function (response) {
                            $scope.machine.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            }
        };
        $scope.machine.init();
        $scope.machine.edit.init();

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
            $('.port-hover.machine-image').each(function () {
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
        machineClass: '<',
        hideTitle: '<',
        textTurkish: '<',
        textEnglish: '<',
        textRussian: '<',
        textArabic: '<',
        textEmbeddedYoutube: '<',
        textNewMachine: '<',
        textNewMachineComment: '<',
        filterTextAll: '<',
        filterTextEdit: '<',
        filterTextAdd: '<',
        filterTextRemove: '<',
        editable: '<',
        editMsg: '<',
        editTitleCategory: '<',
        editTitleMachine: '<',
        editImageMsg: '<',
        editImageNote: '<',
        removeTitleCategory: '<',
        removeTitleMachine: '<',
        removeMsgCategory: '<',
        removeMsgMachine: '<',
        addTitleCategory: '<',
        addTitleMachine: '<',
        addMsg: '<',
        addPlaceholderCategory: '<',
        addPlaceholderMachine: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        submitRemoveBtnText: '<',
        inProgressText: '<',
        inProgressRemoveText: '<'
    }
});