app.angular
.component('newsCardPresenter', {
    templateUrl: 'assets/angular/template/news-card-presenter.html?v=0.1.2',
    controller: ['$scope', '$http', '$timeout', '$q', function ($scope, $http, $timeout, $q) {
        var categoryRemoveItem = function (category) {
            var self = this;
            self.toggle = function () {
                self.isRemoved = !self.isRemoved;
            };
            self.init = function () {
                self.id = category.id;
                self.text = category.text;
                self.itemCount = category.itemCount;
            };
            self.init();
        };
        var newsCategoryEditItem = function (category, ids, onToggle) {
            var self = this;
            self.toggle = function () {
                self.isSelected = !self.isSelected;
                if (typeof onToggle === 'function') {
                    onToggle();
                }
            };
            self.init = function () {
                self.id = category.id;
                self.text = category.text[$scope.news.lang];
                var i = ids.length;
                while (!self.isSelected && i--) {
                    self.isSelected = ids[i] === self.id;
                }
            };
            self.init();
        };
        $scope.news = {
            lang: document.documentElement.lang,
            list: newsCardPresenterUniData.list,
            firstColumnCls: 'col-lg-6',
            firstLoad: true,
            items:{
                first: {
                    isExist: false,
                    value: null
                },
                second: {
                    isExist: false,
                    value: null
                },
                third: {
                    isExist: false,
                    value: null
                },
                last: {
                    isExist: false,
                    value: null
                },
                init: function () {
                    var itemStartIndex = $scope.news.page.index.selected * 4;
                    var remainingListCount = $scope.news.list.length - itemStartIndex;
                    if (remainingListCount >= 4) {
                        $scope.news.firstColumnCls = 'col-lg-6';
                        $scope.news.items.first.isExist = true;
                        $scope.news.items.first.value = $scope.news.list[itemStartIndex];
                        $scope.news.items.second.isExist = true;
                        $scope.news.items.second.value = $scope.news.list[itemStartIndex + 1];
                        $scope.news.items.third.isExist = true;
                        $scope.news.items.third.value = $scope.news.list[itemStartIndex + 2];
                        $scope.news.items.last.isExist = true;
                        $scope.news.items.last.value = $scope.news.list[itemStartIndex + 3];
                    } else if (remainingListCount === 3) {
                        $scope.news.firstColumnCls = 'col-lg-6';
                        $scope.news.items.first.isExist = true;
                        $scope.news.items.first.value = $scope.news.list[itemStartIndex];
                        $scope.news.items.second.isExist = true;
                        $scope.news.items.second.value = $scope.news.list[itemStartIndex + 1];
                        $scope.news.items.third.isExist = true;
                        $scope.news.items.third.value = $scope.news.list[itemStartIndex + 2];
                        $scope.news.items.last.isExist = false;
                        $scope.news.items.last.value = null;
                    } else if (remainingListCount === 2) {
                        $scope.news.firstColumnCls = $scope.news.firstLoad ? 'col-lg-12' : 'col-lg-6';
                        $scope.news.items.first.isExist = true;
                        $scope.news.items.first.value = $scope.news.list[itemStartIndex];
                        $scope.news.items.second.isExist = true;
                        $scope.news.items.second.value = $scope.news.list[itemStartIndex + 1];
                        $scope.news.items.third.isExist = false;
                        $scope.news.items.third.value = null;
                        $scope.news.items.last.isExist = false;
                        $scope.news.items.last.value = null;
                    } else if (remainingListCount === 1) {
                        $scope.news.firstColumnCls = $scope.news.firstLoad ? 'col-lg-12' : 'col-lg-6';
                        $scope.news.items.first.isExist = true;
                        $scope.news.items.first.value = $scope.news.list[itemStartIndex];
                        $scope.news.items.second.isExist = false;
                        $scope.news.items.second.value = null;
                        $scope.news.items.third.isExist = false;
                        $scope.news.items.third.value = null;
                        $scope.news.items.last.isExist = false;
                        $scope.news.items.last.value = null;
                    } else {
                        $scope.news.firstColumnCls = $scope.news.firstLoad ? 'col-lg-12' : 'col-lg-6';
                        $scope.news.items.first.isExist = false;
                        $scope.news.items.first.value = null;
                        $scope.news.items.second.isExist = false;
                        $scope.news.items.second.value = null;
                        $scope.news.items.third.isExist = false;
                        $scope.news.items.third.value = null;
                        $scope.news.items.last.isExist = false;
                        $scope.news.items.last.value = null;
                    }
                    $timeout(function () {
                        $scope.$broadcast('categoryListChanged', $scope.news.category.list);
                    });
                }
            },
            page: {
                totalCount: 0,
                index: {
                    start: 0,
                    selected: 0
                },
                btn: {
                    isPrevVisible: true,
                    isNextVisible: true,
                    maxCount: 5
                },
                change: function (index) {
                    $scope.news.page.index.selected = index;
                    $scope.news.items.init();
                },
                paginate: {
                    init: function () {
                        $scope.$on('paginateResponse', function (e, data) {
                            $scope.news.page.paginate.isDone = data;
                        });
                        $scope.news.page.paginate.trigger();
                    },
                    errorCount:{
                        value: 0,
                        max: 3
                    },
                    isDone: false,
                    trigger: function () {
                        $scope.$broadcast('paginate', $scope.news.page);
                        $timeout(function () {
                            if (!$scope.news.page.paginate.isDone) {
                                if ($scope.news.page.paginate.errorCount.max <= ++$scope.news.page.paginate.errorCount.value) {
                                    $scope.news.page.paginate.isDone = true;
                                    return;
                                }
                                $scope.news.page.paginate.trigger();
                            }
                        }, 500);
                    }
                }
            },
            nonews:{
                init:function () {
                    $scope.news.nonews.first = newsCardPresenterUniData.noResult.first[$scope.news.lang];
                    $scope.news.nonews.last = newsCardPresenterUniData.noResult.last[$scope.news.lang];
                }
            },
            search: {
                init: function () {
                    $scope.news.search.header = newsCardPresenterUniData.search.header[$scope.news.lang];
                    $scope.news.search.edit.init();
                },
                value: '',
                change: function (value) {
                    $scope.news.search.value = value;
                    $scope.news.search.asyncSearch();
                },
                asyncSearch: function () {
                    app.show.spinner('body');
                    $q(function (resolve, reject) {
                        if ($scope.news.search.value === '') {
                            $scope.news.list = $scope.news.category.filter($scope.news.category.selected);
                            $scope.news.init();
                            app.hide.spinner('body');
                            resolve('OK');
                            return;
                        }
                        var rgx = new RegExp($scope.news.search.value.toLowerCase(), 'i');
                        var newsPresenter = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        $scope.news.list = newsPresenter.list.filter(function (news) {
                            return ($scope.news.category.selected === null || $scope.news.category.existInArray($scope.news.category.selected, news.categories)) && (news.header[$scope.news.lang].toLowerCase().match(rgx) || news.text[$scope.news.lang].toLowerCase().match(rgx) || news.date.text.match(rgx));
                        });
                        $scope.news.init();
                        app.hide.spinner('body');
                        resolve('OK');
                    }).then(function (result) {
                    }, function (error) {
                        app.show.error(newsCardPresenterUniData.search.error[$scope.news.lang] + '\n' + error);
                        console.log(error);
                    });
                },
                edit: {
                    init: function () {
                        $scope.news.search.edit.title = new app.edit.title(function () {
                            return newsCardPresenterUniData.search.header[$scope.news.lang];
                        }, function (text) {
                            newsCardPresenterUniData.search.header[$scope.news.lang] = text;
                            return newsCardPresenterUniData;
                        }, 'news-card-presenter-uni', function (response) {
                            newsCardPresenterUniData = response.data.value;
                            $scope.news.search.header = newsCardPresenterUniData.search.header[$scope.news.lang];
                        }, $http);
                    }
                }
            },
            category: {
                init: function () {
                    $scope.news.category.header = newsCardPresenterUniData.category.header[$scope.news.lang];
                    $scope.news.category.edit.init();
                },
                list: newsCardPresenterUniData.category.list,
                selected: null,
                select: function (category) {
                    $scope.news.category.selected = category;
                    $scope.news.search.asyncSearch();
                },
                filter: function (category) {
                    if (category === null || category.id === 1) {
                        return newsCardPresenterUniData.list;
                    }
                    return newsCardPresenterUniData.list.filter(function (news) {
                        return $scope.news.category.existInArray($scope.news.category.selected, news.categories);
                    });
                },
                calculateCount: function (news) {
                    for (var i = 0; i < news.category.list.length; i++) {
                        news.category.list[i].itemCount = 0;
                    }
                    for (var i = 0; i < news.list.length; i++) {
                        for (var j = 0; j < news.list[i].categories.length; j++) {
                            var found = false;
                            var l = news.category.list.length;
                            while (!found && l--) {
                                if (news.category.list[l].id === news.list[i].categories[j]) {
                                    news.category.list[l].itemCount++;
                                    found = true;
                                }
                            }
                        }
                    }
                    var found = false;
                    var i = news.category.list.length;
                    while (!found && i--) {
                        if (news.category.list[i].id === 1) {
                            news.category.list[i].itemCount = news.list.length;
                            found = true;
                        }
                    }
                    return news;
                },
                existInArray: function (category, categories) {
                    if (category === null) {
                        return false;
                    }
                    var isExist = category.id === 1;//category all's id is 1
                    var i = 0;
                    while (!isExist && i < categories.length) {
                        isExist = categories[i] === category.id;
                        i++;
                    }
                    return isExist;
                },
                edit: {
                    inProgress: false,
                    init: function () {
                        $scope.news.category.edit.title = new app.edit.title(function () {
                            return newsCardPresenterUniData.category.header[$scope.news.lang];
                        }, function (text) {
                            newsCardPresenterUniData.category.header[$scope.news.lang] = text;
                            return newsCardPresenterUniData;
                        }, 'news-card-presenter-uni', function (response) {
                            newsCardPresenterUniData = response.data.value;
                            $scope.news.category.header = newsCardPresenterUniData.category.header[$scope.news.lang];
                        }, $http);
                    },
                    show: function () {
                        var categories = newsCardPresenterUniData.category.list;;
                        $scope.news.category.edit.list = [];
                        for (var i = 0; i < categories.length; i++) {
                            if (categories[i].id !== 1) {
                                var category = new app.edit.input(categories[i].text[$scope.news.lang], categories[i].text[$scope.news.lang], app.valid.text);
                                category.id = categories[i].id;
                                $scope.news.category.edit.list.push(category);
                            }
                        }
                        $('.news-category-edit-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    check: function () {
                        var apply = true;
                        var OK = true;
                        for (var i = 0; i < $scope.news.category.edit.list.length; i++) {
                            OK = $scope.news.category.edit.list[i].check(apply) && OK;
                        }
                        return OK;
                    },
                    submit: function () {
                        if (!$scope.news.category.edit.check() || $scope.news.category.edit.inProgress) {
                            return;
                        }
                        $scope.news.category.edit.inProgress = true;
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        for (var i = 0; i < value.category.list.length; i++) {
                            var j = 0;
                            var found = false;
                            while (!found && j < $scope.news.category.edit.list.length) {
                                if (value.category.list[i].id === $scope.news.category.edit.list[j].id) {
                                    found = true;
                                    value.category.list[i].text[$scope.news.lang] = $scope.news.category.edit.list[j].value;
                                }
                                j++;
                            }
                        }
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.category.edit.inProgress = false;
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.init();
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.$broadcast('categoryListChanged', $scope.news.category.list);
                            }
                        }, function (response) {
                            $scope.news.category.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                },
                add: {
                    inProgress: false,
                    tr: new app.edit.input('', '', app.valid.text),
                    en: new app.edit.input('', '', app.valid.text),
                    ru: new app.edit.input('', '', app.valid.text),
                    ar: new app.edit.input('', '', app.valid.text),
                    init: function () {
                        $scope.news.category.add.tr.init();
                        $scope.news.category.add.en.init();
                        $scope.news.category.add.ru.init();
                        $scope.news.category.add.ar.init();
                    },
                    show: function () {
                        $scope.news.category.add.init();
                        $('.news-category-add-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    check: function () {
                        var apply = true;
                        var OK = {
                            tr: $scope.news.category.add.tr.check(apply),
                            en: $scope.news.category.add.en.check(apply),
                            ru: $scope.news.category.add.ru.check(apply),
                            ar: $scope.news.category.add.ar.check(apply)
                        };
                        return OK.tr && OK.en && OK.ru && OK.ar;
                    },
                    submit: function () {
                        if (!$scope.news.category.add.check() || $scope.news.category.add.inProgress) {
                            return;
                        }
                        $scope.news.category.add.inProgress = true;
                        var category = {
                            id: ++newsCardPresenterUniData.category.currentID,
                            text: {
                                tr: $scope.news.category.add.tr.value,
                                en: $scope.news.category.add.en.value,
                                ru: $scope.news.category.add.ru.value,
                                ar: $scope.news.category.add.ar.value
                            },
                            itemCount: 0
                        };
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        value.category.list.push(category);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.category.add.inProgress = false;
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.init();
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.$broadcast('categoryListChanged', $scope.news.category.list);
                            }
                        }, function (response) {
                            $scope.news.category.add.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                },
                remove: {
                    inProgress: false,
                    init: function () {
                        $scope.news.category.remove.list = [];
                        for (var i = 0; i < newsCardPresenterUniData.category.list.length; i++) {
                            if (newsCardPresenterUniData.category.list[i].id !== 1) {
                                $scope.news.category.remove.list.push(new categoryRemoveItem(newsCardPresenterUniData.category.list[i]));
                            }
                        }
                    },
                    show: function () {
                        $scope.news.category.remove.init();
                        $('.news-category-remove-modal.modal:first').modal({ show: true, backdrop: false });
                    },
                    submit: function () {
                        if ($scope.news.category.remove.inProgress) {
                            return;
                        }
                        $scope.news.category.remove.inProgress = false;
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        for (var i = 0; i < $scope.news.category.remove.list.length; i++) {
                            if ($scope.news.category.remove.list[i].isRemoved) {
                                value.category.list = value.category.list.filter(function (category) {
                                    return category.id !== $scope.news.category.remove.list[i].id;
                                });
                            }
                        }
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.category.remove.inProgress = false;
                            $('.news-category-remove-modal.modal:first').modal('hide');
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.init();
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.$broadcast('categoryListChanged', $scope.news.category.list);
                            }
                        }, function (response) {
                            $scope.news.category.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    }
                }
            },
            init: function () {
                $scope.news.page.totalCount = Math.ceil($scope.news.list.length / 4);
                $scope.news.page.index.start = 0;
                $scope.news.page.index.selected = 0;
                $scope.news.items.init();
                $scope.news.page.paginate.init();
                $scope.news.firstLoad = false;
            },
            edit: {
                inProgress: false,
                show: function (news) {
                    $scope.news.edit.id = news.value.id;
                    $scope.news.edit.img = JSON.parse(JSON.stringify(news.value.img));
                    $scope.news.edit.header = new app.edit.input(news.value.header[$scope.news.lang], news.value.header[$scope.news.lang], app.valid.text);
                    $scope.news.edit.text = new app.edit.input(news.value.text[$scope.news.lang], news.value.text[$scope.news.lang], app.valid.text);
                    $scope.news.edit.date = news.value.date.text;
                    $scope.news.edit.category.init(news.value.categories);
                    $scope.news.edit.upload.init();
                    $('.news-edit-modal.modal:first').modal({ show: true, backdrop: false });
                },
                toggle: function () {
                    $scope.news.edit.img.isExist = !$scope.news.edit.img.isExist;
                },
                category: {
                    init: function (ids) {
                        $scope.news.edit.category.list = [];
                        for (var i = 0; i < $scope.news.category.list.length; i++) {
                            if ($scope.news.category.list[i].id !== 1) {
                                $scope.news.edit.category.list.push(new newsCategoryEditItem($scope.news.category.list[i], ids, $scope.news.edit.category.createText));
                            }
                        }
                        $scope.news.edit.category.createText();
                    },
                    createText: function () {
                        $scope.news.edit.category.text = $scope.news.edit.category.list.filter(function (category) {
                            return category.isSelected;
                        }).map(function (category) {
                            return category.text;
                        }).join(', ');
                    }
                },
                upload: {
                    isNecessary: false,
                    width: 1170,
                    height: 650,
                    click: function () {
                        app.upload.file.id = $scope.news.edit.id;
                        app.upload.file.date = new Date();
                        app.upload.handler.proceed = $scope.news.edit.upload.handler;
                        app.upload.handler.date = new Date();
                    },
                    init: function () {
                        $scope.news.edit.upload.isNecessary = false;
                        $scope.news.edit.upload.type = null;
                        $scope.news.edit.upload.data = null;
                        $scope.news.edit.upload.elem = null;
                    },
                    handler: function (id, type, data, callback, elem) {
                        callback();
                        $scope.news.edit.upload.type = type;
                        $scope.news.edit.upload.data = data;
                        $scope.news.edit.upload.elem = elem;
                        $timeout(function () {
                            $scope.news.edit.upload.isNecessary = true;
                        });
                    },
                    submit: function (callback) {
                        if ($scope.news.edit.inProgress) {
                            return;
                        }
                        if (!$scope.news.edit.upload.isNecessary) {
                            callback(true);
                            return;
                        }
                        $scope.news.edit.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/image.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.news.edit.img.url,
                                type: $scope.news.edit.upload.type,
                                width: $scope.news.edit.upload.width,
                                height: $scope.news.edit.upload.height,
                                value: $scope.news.edit.upload.data
                            }
                        }).then(function (response) {
                            $scope.news.edit.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.news.edit.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        header: $scope.news.edit.header.check(apply),
                        text: $scope.news.edit.text.check(apply)
                    };
                    return OK.header && OK.text;
                },
                submit: function () {
                    if (!$scope.news.edit.check() || $scope.news.edit.inProgress) {
                        return;
                    }
                    
                    app.show.spinner($scope.news.edit.upload.elem);
                    $scope.news.edit.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.news.edit.upload.elem);
                            return;
                        }
                        $scope.news.edit.inProgress = true;
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        var found = false;
                        var i = value.list.length;
                        while (!found && i--) {
                            if (value.list[i].id === $scope.news.edit.id) {
                                value.list[i].img = $scope.news.edit.img;
                                value.list[i].header[$scope.news.lang] = $scope.news.edit.header.value;
                                value.list[i].text[$scope.news.lang] = $scope.news.edit.text.value;
                                value.list[i].categories = $scope.news.edit.category.list.filter(function (category) {
                                    return category.isSelected;
                                }).map(function (category) {
                                    return category.id;
                                });

                                if ($scope.news.edit.upload.isNecessary) {
                                    value.list[i].img.version.minor++;
                                }
                                found = true;
                            }
                        }
                        if (!found) {
                            $scope.news.edit.inProgress = false;
                            app.hide.spinner($scope.news.edit.upload.elem);
                            app.show.error();
                            return;
                        }
                        value = $scope.news.category.calculateCount(value);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.edit.inProgress = false;
                            app.hide.spinner($scope.news.edit.upload.elem);
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.news.init();
                            }
                        }, function (response) {
                            $scope.news.edit.inProgress = false;
                            app.hide.spinner($scope.news.edit.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            add: {
                inProgress: false,
                show: function () {
                    $scope.news.add.init();
                    $('.news-add-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.news.add.img = {
                        isExist: true,
                        url: $scope.news.add.upload.image.path,
                        version: { major: 0, medio: 0, minor: 1 }
                    };
                    $scope.news.add.header = {
                        tr: new app.edit.input('', '', app.valid.text),
                        en: new app.edit.input('', '', app.valid.text),
                        ru: new app.edit.input('', '', app.valid.text),
                        ar: new app.edit.input('', '', app.valid.text)
                    };
                    $scope.news.add.text = {
                        tr: new app.edit.input('', '', app.valid.text),
                        en: new app.edit.input('', '', app.valid.text),
                        ru: new app.edit.input('', '', app.valid.text),
                        ar: new app.edit.input('', '', app.valid.text)
                    };
                    $scope.news.add.date = {
                        value: new Date()
                    };
                    $scope.news.add.date.text = app.convert.date.to.string($scope.news.add.date.value);
                    $scope.news.add.category.init([]);
                    $scope.news.add.upload.init();
                },
                toggle: function () {
                    $scope.news.add.img.isExist = !$scope.news.add.img.isExist;
                },
                category: {
                    init: function (ids) {
                        $scope.news.add.category.list = [];
                        for (var i = 0; i < $scope.news.category.list.length; i++) {
                            if ($scope.news.category.list[i].id !== 1) {
                                $scope.news.add.category.list.push(new newsCategoryEditItem($scope.news.category.list[i], ids, $scope.news.add.category.createText));
                            }
                        }
                        $scope.news.add.category.createText();
                    },
                    createText: function () {
                        $scope.news.add.category.text = $scope.news.add.category.list.filter(function (category) {
                            return category.isSelected;
                        }).map(function (category) {
                            return category.text;
                        }).join(', ');
                    }
                },
                upload: {
                    isNecessary: false,
                    width: 1170,
                    height: 650,
                    image: {
                        path: '/assets/images/add-news.png',
                        data: function (callback) {
                            var img = new Image();
                            img.onload = function () {
                                var canvas = document.createElement('canvas');
                                canvas.width = this.width;
                                canvas.height = this.height;

                                var ctx = canvas.getContext('2d');
                                ctx.drawImage(this, 0, 0);
                                var dataURL = canvas.toDataURL('image/png');//.replace(/^data:image\/(png|jpg);base64,/, '');
                                $scope.news.add.upload.handler(-1, 'image/png', dataURL, function () { }, undefined);
                                callback(true);
                            };
                            img.onerror = function () {
                                callback(false);
                            };
                            img.src = $scope.news.add.upload.image.path;
                        }
                    },
                    click: function () {
                        app.upload.file.id = 0;
                        app.upload.file.date = new Date();
                        app.upload.handler.proceed = $scope.news.add.upload.handler;
                        app.upload.handler.date = new Date();
                    },
                    init: function () {
                        $scope.news.add.upload.isNecessary = false;
                        $scope.news.add.upload.type = null;
                        $scope.news.add.upload.data = null;
                        $scope.news.add.upload.elem = null;
                    },
                    handler: function (id, type, data, callback, elem) {
                        callback();
                        $scope.news.add.upload.type = type;
                        $scope.news.add.upload.data = data;
                        $scope.news.add.upload.elem = elem;
                        $timeout(function () {
                            $scope.news.add.upload.isNecessary = true;
                        });
                    },
                    submit: function (callback) {
                        if ($scope.news.add.inProgress) {
                            return;
                        }
                        if (!$scope.news.add.upload.isNecessary) {
                            $scope.news.add.upload.image.data(function (result) {
                                if (result) {
                                    $scope.news.add.upload.submit(callback);
                                }
                                else {
                                    callback(false);
                                }
                            });
                            return;
                        }
                        $scope.news.add.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/image.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: '/assets/images/news' + (newsCardPresenterUniData.currentID + 1) + '.png',
                                type: $scope.news.add.upload.type,
                                width: $scope.news.add.upload.width,
                                height: $scope.news.add.upload.height,
                                value: $scope.news.add.upload.data
                            }
                        }).then(function (response) {
                            $scope.news.add.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.news.add.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        header: {
                            tr: $scope.news.add.header.tr.check(apply),
                            en: $scope.news.add.header.en.check(apply),
                            ru: $scope.news.add.header.ru.check(apply),
                            ar: $scope.news.add.header.ar.check(apply)
                        },
                        text: {
                            tr: $scope.news.add.text.tr.check(apply),
                            en: $scope.news.add.text.en.check(apply),
                            ru: $scope.news.add.text.ru.check(apply),
                            ar: $scope.news.add.text.ar.check(apply)
                        }
                    };
                    return OK.header.tr && OK.header.en && OK.header.ru && OK.header.ar && OK.text.tr && OK.text.en && OK.text.ru && OK.text.ar;
                },
                submit: function () {
                    if (!$scope.news.add.check() || $scope.news.add.inProgress) {
                        return;
                    }

                    app.show.spinner($scope.news.add.upload.elem);
                    $scope.news.add.upload.submit(function (uploadResult) {
                        if (!uploadResult) {
                            app.hide.spinner($scope.news.add.upload.elem);
                            return;
                        }
                        $scope.news.add.inProgress = true;
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        var news = {
                            id: ++value.currentID,
                            img: $scope.news.add.img,
                            header: {
                                tr: $scope.news.add.header.tr.value,
                                en: $scope.news.add.header.en.value,
                                ru: $scope.news.add.header.ru.value,
                                ar: $scope.news.add.header.ar.value
                            },
                            text: {
                                tr: $scope.news.add.text.tr.value,
                                en: $scope.news.add.text.en.value,
                                ru: $scope.news.add.text.ru.value,
                                ar: $scope.news.add.text.ar.value
                            },
                            date: $scope.news.add.date,
                            categories: $scope.news.add.category.list.filter(function (category) {
                                return category.isSelected;
                            }).map(function (category) {
                                return category.id;
                            })
                        };
                        news.img.url = '/assets/images/news' + news.id + '.png';
                        var index = 0;
                        value.list.splice(index, 0, news);
                        value = $scope.news.category.calculateCount(value);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.add.inProgress = false;
                            app.hide.spinner($scope.news.add.upload.elem);
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.news.init();
                                $('.news-add-modal.modal:first').modal('hide');
                            }
                        }, function (response) {
                            $scope.news.add.inProgress = false;
                            app.hide.spinner($scope.news.add.upload.elem);
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            },
            remove: {
                inProgress: false,
                show: function (news) {
                    $scope.news.remove.news = news.value;
                    $scope.news.remove.categoryPrepare();
                    $('.news-remove-modal.modal:first').modal({ show: true, backdrop: false });
                },
                image: {
                    remove: function (callback) {
                        if ($scope.news.remove.inProgress) {
                            callback(false);
                            return;
                        }
                        $scope.news.remove.inProgress = true;
                        $http({
                            method: 'POST',
                            url: 'service/remove.ashx?d=' + new Date().valueOf(),
                            data: {
                                path: $scope.news.remove.news.img.url
                            }
                        }).then(function (response) {
                            $scope.news.remove.inProgress = false;
                            callback(app.show.result(response.data, undefined, true));
                        }, function (response) {
                            $scope.news.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                            callback(false);
                        });
                    }
                },
                check: function () {
                    if (!$scope.news.remove.news || !app.valid.integer($scope.news.remove.news.id, true)) {
                        return false;
                    }
                    var OK = false;
                    var i = newsCardPresenterUniData.list.length;
                    while (i-- && !OK) {
                        OK = newsCardPresenterUniData.list[i].id === $scope.news.remove.news.id;
                    }
                    return OK;
                },
                submit: function () {
                    if (!$scope.news.remove.check() || $scope.news.remove.inProgress) {
                        return;
                    }
                    $scope.news.remove.image.remove(function (imageResult) {
                        if (!imageResult) {
                            return;
                        }
                        $scope.news.remove.inProgress = true;
                        var value = JSON.parse(JSON.stringify(newsCardPresenterUniData));
                        value.list = value.list.filter(function (news) {
                            return news.id !== $scope.news.remove.news.id;
                        });
                        value = $scope.news.category.calculateCount(value);
                        $http({
                            method: 'POST',
                            url: 'service/edit.ashx?d=' + new Date().valueOf(),
                            data: {
                                component: 'news-card-presenter-uni',
                                value: value
                            }
                        }).then(function (response) {
                            $scope.news.remove.inProgress = false;
                            if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                                newsCardPresenterUniData = response.data.value;
                                $scope.news.list = newsCardPresenterUniData.list;
                                $scope.news.category.list = newsCardPresenterUniData.category.list;
                                $scope.news.init();
                                $('.news-remove-modal.modal:first').modal('hide');
                            }
                        }, function (response) {
                            $scope.news.remove.inProgress = false;
                            app.show.error();
                            console.log(response);
                        });
                    });
                }
            }
        };
        $scope.news.init();

        this.$onInit = function () {
            $scope.news.nonews.init();
            $scope.news.search.init();
            $scope.news.category.init();
        };
    }],
    bindings: {
        editMsg: '<',
        editable: '<',
        editTitleNews: '<',
        editTitleCategory: '<',
        editImgMsg: '<',
        editImgNote: '<',
        editImgBtnTxtVisible: '<',
        editImgBtnTxtInvisible: '<',
        addTitleNews: '<',
        addTitleCategory: '<',
        addPlaceholderCategory: '<',
        addPlaceholderNewsHeader: '<',
        addPlaceholderNewsText: '<',
        removeTitleNews: '<',
        removeTitleCategory: '<',
        removeMsgNews: '<',
        removeMsgCategory: '<',
        textTurkish: '<',
        textEnglish: '<',
        textRussian: '<',
        textArabic: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        submitBtnTextRemove: '<',
        inProgressText: '<',
        inProgressTextRemove: '<'
    }
});