app.angular
.component('pagination', {
    templateUrl: 'assets/angular/template/pagination.html?v=0.1.1',
    controller: ['$scope', function ($scope) {
        var self = this;
        var pageBtn = function (index) {
            this.index = index;
            this.text = index + 1;
            this.cls = $scope.pagination.selectedIndex === index ? 'current' : '';
            this.onClick = function () {
                $scope.pagination.pageChange(index);
            };
        };
        $scope.pagination = {
            totalPageCount: self.totalPageCount,
            startIndex: self.startIndex,
            selectedIndex: self.selectedIndex,
            maxBtnCount: self.maxBtnCount,
            list: [],
            init: function (totalPageCount, startIndex, selectedIndex, isPrevBtnVisible, isNextBtnVisible, maxBtnCount) {
                if (totalPageCount < maxBtnCount) {
                    maxBtnCount = totalPageCount;
                }
                $scope.pagination.totalPageCount = totalPageCount;
                $scope.pagination.startIndex = startIndex;
                $scope.pagination.selectedIndex = selectedIndex;
                $scope.pagination.isPrevBtnVisible = isPrevBtnVisible && startIndex > 0;
                $scope.pagination.isNextBtnVisible = isNextBtnVisible && selectedIndex + 1 < totalPageCount;
                $scope.pagination.maxBtnCount = maxBtnCount;
                $scope.pagination.list = [];
                for (var i = $scope.pagination.startIndex; i < $scope.pagination.maxBtnCount; i++) {
                    $scope.pagination.list.push(new pageBtn(i));
                }
            },
            pageChange: function (index) {
                var listHalfCount = parseInt($scope.pagination.maxBtnCount / 2);
                $scope.pagination.startIndex = index - listHalfCount;
                if ($scope.pagination.startIndex <= 0) {
                    $scope.pagination.startIndex = 0;
                } else if ($scope.pagination.startIndex + $scope.pagination.maxBtnCount > $scope.pagination.totalPageCount) {
                    $scope.pagination.startIndex = $scope.pagination.totalPageCount - $scope.pagination.maxBtnCount;
                }
                $scope.pagination.selectedIndex = index;
                for (var i = 0; i < $scope.pagination.list.length; i++) {
                    $scope.pagination.list[i] = new pageBtn($scope.pagination.startIndex + i);
                }
                $scope.pagination.isPrevBtnVisible = index > 0;
                $scope.pagination.prevBtnCls = index > 0 ? '' : 'hide';
                $scope.pagination.isNextBtnVisible = $scope.pagination.totalPageCount > index + 1;
                $scope.pagination.nextBtnCls = $scope.pagination.totalPageCount > index + 1 ? '' : 'hide';
                if (typeof self.onPageChange === 'function') {
                    self.onPageChange(index);
                }
            },
            prevBtnCls: '',
            isPrevBtnVisible: false,
            pagePrev: function () {
                var index = $scope.pagination.selectedIndex - 1;
                $scope.pagination.pageChange(index);
                $scope.pagination.isPrevBtnVisible = index > 0;
            },
            nextBtnCls: '',
            isNextBtnVisible: false,
            pageNext: function () {
                var index = $scope.pagination.selectedIndex + 1;
                $scope.pagination.pageChange(index);
                $scope.pagination.isNextBtnVisible = $scope.pagination.totalPageCount >= index;
            }
        };
        $scope.$on('paginate', function (e, data) {
            $scope.pagination.init(data.totalCount, data.index.start, data.index.selected, data.btn.isPrevVisible, data.btn.isNextVisible, data.btn.maxCount);
            $scope.$emit('paginateResponse', true);
        });
    }],
    bindings: {
        totalPageCount: '=',
        startIndex: '=',
        selectedIndex: '=',
        isPrevBtnVisible: '=',
        isNextBtnVisible: '=',
        maxBtnCount: '=',
        onPageChange: '<'
    }
});