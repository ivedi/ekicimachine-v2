app.angular
.component('pageHeader', {
    templateUrl: 'assets/angular/template/page-header.html?v=0.1.1',
    controller: ['$scope', '$window', '$http', '$rootScope', function ($scope, $window, $http, $rootScope) {
        var ctrl = this;
        var locationDataArr = $window.location.pathname.split('/');
        var url = function (text, href) {
            this.href = href;
            this.text = text;
            this.isActive = locationDataArr[locationDataArr.length - 1].replace('.' + document.documentElement.lang, '') === href;
            if (this.isActive) {
                this.cls = 'active';
            }
        };
        $scope.header = {
            init: function () {
                $scope.header.urls.init();
                $scope.header.logout.init();
            },
            urls: {
                init: function () {
                    $scope.header.urls.home = new url(pageHeaderData.urls[0].text, pageHeaderData.urls[0].href);
                    $scope.header.urls.machine = new url(pageHeaderData.urls[1].text, pageHeaderData.urls[1].href);
                    $scope.header.urls.automation = new url(pageHeaderData.urls[2].text, pageHeaderData.urls[2].href);
                    $scope.header.urls.reference = new url(pageHeaderData.urls[3].text, pageHeaderData.urls[3].href);
                    $scope.header.urls.news = new url(pageHeaderData.urls[4].text, pageHeaderData.urls[4].href);
                    $scope.header.urls.contact = new url(pageHeaderData.urls[5].text, pageHeaderData.urls[5].href);
                }
            },
            logout: {
                init: function () {
                    $scope.header.logout.text = pageHeaderData.logout.text;
                    $scope.header.logout.isVisible = ctrl.userLoggedIn;
                },
                submit: function () {
                    app.show.spinner('body');
                    $http({
                        method: 'GET',
                        url: 'service/user.ashx?q=logout&d=' + new Date().valueOf()
                    }).then(function (response) {
                        app.hide.spinner('body');
                        if (app.show.result(response.data, undefined, true)) {
                            $scope.header.logout.isVisible = false;
                            $window.location.reload();
                        }
                    }, function (response) {
                        app.hide.spinner('body');
                        app.show.error();
                        console.log(response);
                    });
                }
            },
            language: {
                change: function (lang) {
                    if (lang !== 'tr' && lang !== 'en' && lang !== 'ar' && lang !== 'ru') {
                        return;
                    }
                    createCookie('lang', lang, 30);
                    var docLang = document.documentElement.lang;
                    if (docLang === lang || (docLang !== 'tr' && lang !== 'tr')) {
                        location.reload();
                    } else if (docLang === 'tr') {
                        switch (locationDataArr[locationDataArr.length - 1]) {
                            case 'makineler': window.location.href = 'machines'; break;
                            case 'otomasyon': window.location.href = 'automation'; break;
                            case 'referanslar': window.location.href = 'references'; break;
                            case 'haberler': window.location.href = 'news'; break;
                            case 'iletisim': window.location.href = 'contact'; break;
                            case 'anasayfa': case '': default: window.location.href = 'home'; break;
                        }
                    } else {//if (lang === 'tr') 
                        switch (locationDataArr[locationDataArr.length - 1]) {
                            case 'machines': window.location.href = 'makineler'; break;
                            case 'automation': window.location.href = 'otomasyon'; break;
                            case 'references': window.location.href = 'referanslar'; break;
                            case 'news': window.location.href = 'haberler'; break;
                            case 'contact': window.location.href = 'iletisim'; break;
                            case 'home': case '': default: window.location.href = 'anasayfa'; break;
                        }
                    }
                }
            },
            edit: {
                inProgress: false,
                click: function () {
                    $scope.header.edit.init();
                    $('.page-header-modal.modal:first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.header.edit.urls = {
                        home: new app.edit.input(pageHeaderData.urls[0].text, pageHeaderData.urls[0].text, app.valid.text),
                        machines: new app.edit.input(pageHeaderData.urls[1].text, pageHeaderData.urls[1].text, app.valid.text),
                        automation: new app.edit.input(pageHeaderData.urls[2].text, pageHeaderData.urls[2].text, app.valid.text),
                        reference: new app.edit.input(pageHeaderData.urls[3].text, pageHeaderData.urls[3].text, app.valid.text),
                        news: new app.edit.input(pageHeaderData.urls[4].text, pageHeaderData.urls[4].text, app.valid.text),
                        contact: new app.edit.input(pageHeaderData.urls[5].text, pageHeaderData.urls[5].text, app.valid.text)
                    };
                    $scope.header.edit.logout = new app.edit.input(pageHeaderData.logout.text, pageHeaderData.logout.text, app.valid.text);
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        home: $scope.header.edit.urls.home.check(apply),
                        machines: $scope.header.edit.urls.machines.check(apply),
                        automation: $scope.header.edit.urls.automation.check(apply),
                        reference: $scope.header.edit.urls.reference.check(apply),
                        news: $scope.header.edit.urls.news.check(apply),
                        contact: $scope.header.edit.urls.contact.check(apply),
                        logout: $scope.header.edit.logout.check(apply)
                    };
                    return OK.home && OK.machines && OK.automation && OK.reference && OK.news && OK.contact && OK.logout;
                },
                submit: function () {
                    if (!$scope.header.edit.check() || $scope.header.edit.inProgress) {
                        return;
                    }
                    $scope.header.edit.inProgress = true;
                    var value = pageHeaderData;
                    value.urls[0].text = $scope.header.edit.urls.home.value;
                    value.urls[1].text = $scope.header.edit.urls.machines.value;
                    value.urls[2].text = $scope.header.edit.urls.automation.value;
                    value.urls[3].text = $scope.header.edit.urls.reference.value;
                    value.urls[4].text = $scope.header.edit.urls.news.value;
                    value.urls[5].text = $scope.header.edit.urls.contact.value;
                    value.logout.text = $scope.header.edit.logout.value;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'page-header',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.header.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            pageHeaderData = response.data.value;
                            $scope.header.init();
                        }
                        if (typeof $rootScope.urlsChanged === 'function') {
                            $rootScope.urlsChanged();
                        }
                    }, function (response) {
                        $scope.header.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        
        ctrl.$onInit = function () {
            $scope.header.init();
        };

        /* Sticky Menu */
        var winwidth = $(window).width();
        if (winwidth > 960) {
            $('#velcro-header').data('size', 'big');
            $(window).scroll(function () {
                if ($(document).scrollTop() > 0) {
                    if ($('#velcro-header').data('size') == 'big') {
                        $('#velcro-header').data('size', 'small');
                        $('#velcro-header').stop().animate({ height: '60px' }, 350);
                        $('#velcro-header .logo').stop().animate({ marginTop: '-10px' }, 350);
                        $('.logo').stop().animate({ marginTop: '10px' }, 350);
                        $('#velcro-header .menu').stop().animate({ top: '0px' }, 350);
                        $('.menu').stop().animate({ top: '-5px' }, 350);
                    }
                }
                else {
                    if ($('#velcro-header').data('size') == 'small') {
                        $('#velcro-header').data('size', 'big');
                        $('#velcro-header').stop().animate({ height: '70px' }, 200);
                        $('#velcro-header .logo').stop().animate({ marginTop: '5px' }, 200);
                        $('.logo').stop().animate({ marginTop: '13px' }, 200);
                        $('#velcro-header .menu').stop().animate({ top: '0px' }, 200);
                        $('.menu').stop().animate({ top: '0px' }, 200);
                    }
                }
            });
        }
        /* Sticky Menu */

        /* Responsive Menu */
        var navigation = responsiveNav("#responsive-menu", {
            animate: true,        // Boolean: Use CSS3 transitions, true or false
            transition: 600,      // Integer: Speed of the transition, in milliseconds
            label: "",        // String: Label for the navigation toggle
            customToggle: "",     // Selector: Specify the ID of a custom toggle
            openPos: "relative",  // String: Position of the opened nav, relative or static
            jsClass: "js",        // String: 'JS enabled' class which is added to <html> el
            init: function () { },   // Function: Init callback
            open: function () { },   // Function: Open callback
            close: function () { }   // Function: Close callback
        });
        /* Responsive Menu */

        /* Menu */
        $('#superfish').superfish({
            delay: 100,                              // one second delay on mouseout
            animation: { opacity: 'show', height: 'show' },   // fade-in and slide-down animation
            speed: 400,                              // animation speed
            speedOut: 0,                                // out animation speed
        });
        /* Menu */
    }],
    bindings: {
        selectedLanguage: '<',
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        userLoggedIn: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});