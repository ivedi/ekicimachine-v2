app.angular
.component('pageFooter', {
    templateUrl: 'assets/angular/template/page-footer.html?v=0.1.1',
    controller: ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.urlsChanged = function () {
            $scope.footer.init();
        };
        $scope.footer = {
            init: function () {
                $scope.footer.title = pageFooterData.title;
                $scope.footer.urls = pageHeaderData.urls;
            },
            edit: {
                pages: new app.edit.title(function () {
                    return $scope.footer.title.pages;
                }, function (title) {
                    pageFooterData.title.pages = title;
                    return pageFooterData;
                }, 'page-footer', function (response) {
                    pageFooterData = response.data.value;
                    $scope.footer.init();
                }, $http),
                contact: new app.edit.title(function () {
                    return $scope.footer.title.contact;
                }, function (title) {
                    pageFooterData.title.contact = title;
                    return pageFooterData;
                }, 'page-footer', function (response) {
                    pageFooterData = response.data.value;
                    $scope.footer.init();
                }, $http),
                init: function () {
                    $scope.footer.edit.pages.init();
                    $scope.footer.edit.contact.init();
                }
            }
        };
        $scope.footer.init();
        /* Scroll to top button */
        $('.scroll').click(function () {
            $("html, body").animate({ scrollTop: 0 }, 800);
            return false;
        });
        /* Scroll to top button */
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        contactCardEditTitle: '<',
        socialNetworkEditTitle: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<',
        contactCardEmailTextNote: '<',
        contactCardEmailValueNote: '<'
    }
});