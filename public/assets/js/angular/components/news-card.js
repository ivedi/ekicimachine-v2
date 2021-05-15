app.angular
.component('newsCard', {
    templateUrl: 'assets/angular/template/news-card.html?v=0.1.1',
    controller:['$scope', '$timeout', function ($scope, $timeout) {
        var self = this;
        $scope.news = {
            lang: document.documentElement.lang,
            category: {
                list:{
                    change: function (list) {
                        if (self.selectedCategoryIds === undefined) {
                            $scope.news.category.list.selected = [];
                            return;
                        }
                        $scope.news.category.list.selected = list.filter(function (category) {
                            var found = false;
                            var i = self.selectedCategoryIds.length;
                            while (!found && i--) {
                                found = self.selectedCategoryIds[i] === category.id;
                            }
                            return found;
                        });
                    }
                }
            }
        };
        $scope.$on('categoryListChanged', function (e, categoryList) {
            $scope.news.category.list.change(categoryList);
        });
        self.$onInit = function () {
            $scope.news.category.list.change(self.categoryList);
            self.categoryPrepare = function () {
                $timeout(function () {
                    $scope.news.category.list.change(self.categoryList);
                }, 200);
            };
        };
    }],
    bindings: {
        imgIsExist: '<',
        imgUrl: '<',
        header: '<',
        text: '<',
        date: '<',
        selectedCategoryIds: '<',
        categoryList: '<',
        categoryPrepare: '=?',
        editable: '<',
        showEdit: '<',
        showRemove: '<',
        newsItem: '<'
    }
});