app.angular
.component('contactCard', {
    templateUrl: 'assets/angular/template/contact-card.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var self = this;
        $scope.contactCard = {
            init: function () {
                $scope.contactCard.address = contactCardData.address;
                $scope.contactCard.phone = contactCardData.phone;
                $scope.contactCard.fax = contactCardData.fax;
                $scope.contactCard.email = contactCardData.email;
            },
            edit: {
                inProgress: false,
                click: function () {
                    $scope.contactCard.edit.init();
                    $('.contact-card-modal.modal.' + self.editModalClass + ':first').modal({ show: true, backdrop: false });
                },
                init: function () {
                    $scope.contactCard.edit.address = new app.edit.input(contactCardData.address.text, contactCardData.address.text, app.valid.text);
                    $scope.contactCard.edit.address.iconClass = contactCardData.address.iconClass;
                    $scope.contactCard.edit.phone = new app.edit.input(contactCardData.phone.text, contactCardData.phone.text, app.valid.text);
                    $scope.contactCard.edit.phone.iconClass = contactCardData.phone.iconClass;
                    $scope.contactCard.edit.fax = new app.edit.input(contactCardData.fax.text, contactCardData.fax.text, app.valid.text);
                    $scope.contactCard.edit.fax.iconClass = contactCardData.fax.iconClass;
                    $scope.contactCard.edit.email = {
                        text: new app.edit.input(contactCardData.email.text, contactCardData.email.text, app.valid.text),
                        address: new app.edit.input(contactCardData.email.address, contactCardData.email.address, app.valid.email),
                        iconClass: contactCardData.email.iconClass
                    };
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        address: $scope.contactCard.edit.address.check(apply),
                        phone: $scope.contactCard.edit.phone.check(apply),
                        fax: $scope.contactCard.edit.fax.check(apply),
                        email: {
                            text: $scope.contactCard.edit.email.text.check(apply),
                            address: $scope.contactCard.edit.email.address.check(apply)
                        }
                    };
                    return OK.address && OK.phone && OK.fax && OK.email.text && OK.email.address;
                },
                submit: function () {
                    if (!$scope.contactCard.edit.check() || $scope.contactCard.edit.inProgress) {
                        return;
                    }
                    $scope.contactCard.edit.inProgress = true;
                    var value = contactCardData;
                    value.address.text = $scope.contactCard.edit.address.value;
                    value.address.iconClass = $scope.contactCard.edit.address.iconClass;
                    value.phone.text = $scope.contactCard.edit.phone.value;
                    value.phone.iconClass = $scope.contactCard.edit.phone.iconClass;
                    value.fax.text = $scope.contactCard.edit.fax.value;
                    value.fax.iconClass = $scope.contactCard.edit.fax.iconClass;
                    value.email.text = $scope.contactCard.edit.email.text.value;
                    value.email.address = $scope.contactCard.edit.email.address.value;
                    value.email.iconClass = $scope.contactCard.edit.email.iconClass;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'contact-card',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.contactCard.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            contactCardData = response.data.value;
                            $scope.contactCard.init();
                        }
                    }, function (response) {
                        $scope.contactCard.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
        $scope.contactCard.init();
    }],
    bindings: {
        titleClass: '<',
        title: '<',
        contactContainerClass: '<',
        addressContainerClass: '<',
        socialNetworkIsVisible: '<',
        editable: '<',
        editItem: '<',
        editMsg: '<',
        editTitle: '<',
        editModalClass: '<',
        closeBtnText: '<',
        inProgressText: '<',
        submitBtnText: '<',
        emailTextNote: '<',
        emailValueNote: '<',
        socialNetworkEditTitle: '<',
        socialNetworkEditClass: '<'
    }
});