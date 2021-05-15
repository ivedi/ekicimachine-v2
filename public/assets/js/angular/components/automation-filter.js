app.angular
.component('automationFilter', {
    templateUrl: 'assets/angular/template/automation-filter.html?v=0.1.1',
    controller: ['$scope', '$http', '$window', function ($scope, $http, $window) {
        var ctrl = this;
        $scope.filter = {
            init: function () {
                $scope.filter.lang = document.documentElement.lang;
                $scope.filter.currentID = automationListUniData.categories.currentID;
                $scope.filter.list = automationListUniData.categories.list;
            },
            edit: {
                inProgress: false,
                show: function () {
                    $scope.filter.edit.init();
                    $('.automation-filter-edit-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.filter.edit.list = [];
                    for (var i = 0; i < automationListUniData.categories.list.length; i++) {
                        $scope.filter.edit.list.push(new app.edit.input(automationListUniData.categories.list[i].text[$scope.filter.lang], automationListUniData.categories.list[i].text[$scope.filter.lang], app.valid.text));
                    }
                },
                check: function () {
                    var apply = true;
                    var OK = true;
                    for (var i = 0; i < $scope.filter.edit.list.length; i++) {
                        OK = OK & $scope.filter.edit.list[i].check(apply);
                    }
                    return OK;
                },
                submit: function () {
                    if (!$scope.filter.edit.check() || $scope.filter.edit.inProgress) {
                        return;
                    }
                    $scope.filter.edit.inProgress = true;
                    var value = automationListUniData;
                    for (var i = 0; i < value.categories.list.length; i++) {
                        value.categories.list[i].text[$scope.filter.lang] = $scope.filter.edit.list[i].value;
                    }
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'automation-list-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.filter.edit.inProgress = false;
                        if (app.show.result(response.data, function () {
                            $window.location.reload();
                        }) && response.data.hasOwnProperty('value')) {
                            automationListUniData = response.data.value;
                            $scope.filter.init();
                        }
                    }, function (response) {
                        $scope.filter.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            },
            add: {
                inProgress: false,
                input: {
                    tr: new app.edit.input('', '', app.valid.text),
                    en: new app.edit.input('', '', app.valid.text),
                    ru: new app.edit.input('', '', app.valid.text),
                    ar: new app.edit.input('', '', app.valid.text)
                },
                show: function () {
                    $scope.filter.add.init();
                    $('.automation-filter-add-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.filter.add.input.tr.init();
                    $scope.filter.add.input.en.init();
                    $scope.filter.add.input.ru.init();
                    $scope.filter.add.input.ar.init();
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        tr: $scope.filter.add.input.tr.check(apply),
                        en: $scope.filter.add.input.en.check(apply),
                        ru: $scope.filter.add.input.ru.check(apply),
                        ar: $scope.filter.add.input.ar.check(apply)
                    };
                    return OK.tr && OK.en && OK.ru && OK.ar;
                },
                submit: function () {
                    if (!$scope.filter.add.check() || $scope.filter.add.inProgress) {
                        return;
                    }
                    $scope.filter.add.inProgress = true;
                    var value = JSON.parse(JSON.stringify(automationListUniData));
                    value.categories.currentID++;
                    var category = {
                        id: value.categories.currentID,
                        text: {
                            tr: $scope.filter.add.input.tr.value,
                            en: $scope.filter.add.input.en.value,
                            ru: $scope.filter.add.input.ru.value,
                            ar: $scope.filter.add.input.ar.value
                        },
                        filter: '.cat' + value.categories.currentID,
                        cls: ''
                    };
                    value.categories.list.push(category);
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'automation-list-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.filter.add.inProgress = false;
                        if (app.show.result(response.data, function () {
                            $window.location.reload();
                        }) && response.data.hasOwnProperty('value')) {
                            automationListUniData = response.data.value;
                            $scope.filter.init();
                        }
                    }, function (response) {
                        $scope.filter.add.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            },
            remove: {
                inProgress: false,
                show: function () {
                    $scope.filter.remove.init();
                    $('.automation-filter-remove-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    var removeItem = function (category) {
                        this.category = category;
                        this.isRemoved = false;
                        this.toggle = function () {
                            this.isRemoved = !this.isRemoved;
                        };
                    };
                    $scope.filter.remove.list = [];
                    for (var i = 0; i < automationListUniData.categories.list.length; i++) {
                        $scope.filter.remove.list.push(new removeItem(automationListUniData.categories.list[i]));
                    }
                },
                submit: function () {
                    if ($scope.filter.remove.inProgress) {
                        return;
                    }
                    $scope.filter.remove.inProgress = true;
                    var value = JSON.parse(JSON.stringify(automationListUniData));
                    for (var i = 0; i < automationListUniData.categories.list.length; i++) {
                        if ($scope.filter.remove.list[i].isRemoved) {
                            if (value.categories.list[i].id === $scope.filter.remove.list[i].category.id) {
                                value.list.forEach(function (automation) {
                                    automation.catIDs = automation.catIDs.filter(function (categoryID) {
                                        return categoryID !== value.categories.list[i].id;
                                    });
                                });
                                value.categories.list.splice(i, 1);
                            } else {
                                app.show.error();
                                $scope.filter.remove.inProgress = false;
                                return;
                            }
                        }
                    }
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'automation-list-uni',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.filter.remove.inProgress = false;
                        if (app.show.result(response.data, function () {
                            $window.location.reload();
                        }) && response.data.hasOwnProperty('value')) {
                            automationListUniData = response.data.value;
                            $scope.filter.init();
                            $scope.filter.remove.init();
                        }
                    }, function (response) {
                        $scope.filter.remove.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.filter.init();

        ctrl.$onInit = function () {
            $scope.filter.add.input.tr.placeholder = ctrl.addPlaceholder;
            $scope.filter.add.input.en.placeholder = ctrl.addPlaceholder;
            $scope.filter.add.input.ru.placeholder = ctrl.addPlaceholder;
            $scope.filter.add.input.ar.placeholder = ctrl.addPlaceholder;
        };
    }],
    bindings: {
        textTurkish: '<',
        textEnglish: '<',
        textRussian: '<',
        textArabic: '<',
        filterTextAll: '<',
        filterTextEdit: '<',
        filterTextAdd: '<',
        filterTextRemove: '<',
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        removeTitle: '<',
        removeMsg: '<',
        addTitle: '<',
        addMsg: '<',
        addPlaceholder: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});