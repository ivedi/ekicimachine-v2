app.angular
.component('categoryCard', {
    templateUrl: 'assets/angular/template/category-card.html?v=0.1.1',
    controller: ['$scope', function ($scope) {
        var self = this;
        $scope.category = {
            selected: null,
            select: function (category) {
                $scope.category.selected = category;
                if (typeof self.onCategorySelected !== 'function') {
                    return;
                }
                self.onCategorySelected(category);
            },
            list: [],
            init: function (list) {
                $scope.category.list = list;
                if ($scope.category.selected === null && list.length > 0) {
                    $scope.category.selected = list[0];
                }
            }
        };
        $scope.$on('categoryListChanged', function (e, data) {
            $scope.category.init(data);
        });
        self.$onInit = function () {
            $scope.category.init(self.list);
        };
    }],
    bindings: {
        header: '<',
        list: '<',
        onCategorySelected: '<',
        lang: '<',
        editable: '<',
        editMsg: '<',
        editHeader: '<',
        showEdit: '<',
        showAdd: '<',
        showRemove: '<'
    }
})