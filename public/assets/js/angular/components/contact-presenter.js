app.angular
.component('contactPresenter', {
    templateUrl: 'assets/angular/template/contact-presenter.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var self = this;
        $scope.contact = {
            init: function () {
                $scope.contact.title = contactPresenterData.title;
            },
            edit: {
                title: {
                    contactCard: new app.edit.title(function () {
                        return contactPresenterData.title.contactCard;
                    }, function (text) {
                        contactPresenterData.title.contactCard = text;
                        return contactPresenterData;
                    }, 'contact-presenter', function (response) {
                        contactPresenterData = response.data.value;
                        $scope.contact.title = contactPresenterData.title;
                    }, $http)
                }
            }
        };
        self.$onInit = function () {
            $scope.contact.init();
        };
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTitleContactCard: '<',
        editTitleBusinessHours: '<',
        editTitleSocialNetwork: '<',
        editTitleContactForm: '<',
        editTitleContactFormExplanation: '<',
        editTitleContactFormNames: '<',
        editTitleContactFormMessages: '<',
        editTitleContactFormSubmitIdle: '<',
        editTitleContactFormSubmitProgress: '<',
        mailSettingsTitle: '<',
        mailSettingsSmtpAddressTitle: '<',
        mailSettingsSmtpPortTitle: '<',
        mailSettingsFromAddressTitle: '<',
        mailSettingsFromNameTitle: '<',
        mailSettingsFromPasswordTitle: '<',
        mailSettingsToTitle: '<',
        mailSettingsToAddressPlaceholder: '<',
        mailSettingsToNamePlaceholder: '<',
        mailSettingsSubjectPrefixTitle: '<',
        visibleInPage: '<',
        invisibleInPage: '<',
        emailTextNote: '<',
        emailValueNote: '<',
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});