app.angular
.component('contactForm', {
    templateUrl: 'assets/angular/template/contact-form.html?v=0.1.1',
    controller: ['$scope', '$http', function ($scope, $http) {
        var item = {
            msg: function () {
                this.iconClass = '';
                this.text = '';
                this.init = function () {
                    this.iconClass = '';
                    this.text = '';
                };
            },
            input: function (placeholder, valid, msg) {
                var self = this;
                self.isValid = false;
                self.value = '';
                self.placeholder = placeholder;
                self.cls = '';
                self.msg = new item.msg();
                self.init = function () {
                    self.isValid = false;
                    self.value = '';
                    self.cls = '';
                    self.msg.init();
                };
                self.check = function (apply) {
                    var check = valid(self.value);
                    if (apply || self.isValid !== check) {
                        self.isValid = check;
                        if (self.isValid) {
                            self.success();
                        } else {
                            self.error();
                        }
                    }
                    return self.isValid;
                };
                self.focus = function () {
                    self.msg.init();
                };
                self.change = function () {
                    self.check();
                };
                self.error = function () {
                    self.cls = 'has-error';
                    self.msg.text = msg;
                    self.msg.iconClass = 'fa-warning';
                };
                self.success = function () {
                    self.cls = '';
                    self.msg.text = '';
                    self.msg.iconClass = '';
                };
            },
            toAddress: function (id, name, mail) {
                var self = this;
                self.init = function () {
                    self.name.init();
                    self.mail.init();
                };
                self.check = function () {
                    var apply = true;
                    var OK = {
                        name: self.name.check(apply),
                        mail: self.mail.check(apply)
                    };
                    return OK.name && OK.mail;
                };
                self.id = id;
                self.name = new app.edit.input(name, '', app.valid.text);
                self.mail = new app.edit.input(mail, '', app.valid.email);
            }
        };
        $scope.contactForm = {
            title: contactFormData.title,
            explanation: contactFormData.explanation,
            isInProgress: false,
            name: new item.input(contactFormData.name.placeholder, app.valid.text, contactFormData.name.errorMessage),
            email: new item.input(contactFormData.email.placeholder, app.valid.email, contactFormData.email.errorMessage),
            subject: new item.input(contactFormData.subject.placeholder, app.valid.text, contactFormData.subject.errorMessage),
            message: new item.input(contactFormData.message.placeholder, app.valid.text, contactFormData.message.errorMessage),
            check: function () {
                var apply = true;
                var OK = {
                    name: $scope.contactForm.name.check(apply),
                    email: $scope.contactForm.email.check(apply),
                    subject: $scope.contactForm.subject.check(apply),
                    message: $scope.contactForm.message.check(apply)
                };
                return OK.name && OK.email && OK.subject && OK.message;
            },
            init: function () {
                $scope.contactForm.name.init();
                $scope.contactForm.email.init();
                $scope.contactForm.subject.init();
                $scope.contactForm.message.init();
            },
            submit: {
                text: contactFormData.submit.text,
                trigger: function () {
                    if (!$scope.contactForm.check()) {
                        return;
                    }
                    $scope.contactForm.isInProgress = true;
                    $http({
                        method: 'POST',
                        url: 'service/email.ashx?q=send&d=' + new Date().valueOf(),
                        data: {
                            name: $scope.contactForm.name.value,
                            email: $scope.contactForm.email.value,
                            subject: $scope.contactForm.subject.value,
                            message: $scope.contactForm.message.value
                        }
                    }).then(function (response) {
                        $scope.contactForm.isInProgress = false;
                        if (app.show.result(response.data)) {
                            $scope.contactForm.init();
                        }
                    }, function (response) {
                        $scope.contactForm.isInProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            },
            edit: {
                inProgress: false,
                title: new app.edit.title(function () {
                    return contactFormData.title;
                }, function (text) {
                    contactFormData.title = text;
                    return contactFormData;
                }, 'contact-form', function (response) {
                    contactFormData = response.data.value;
                    $scope.contactForm.title = contactFormData.title;
                }, $http),
                init: function () {
                    $scope.contactForm.edit.explanation = {
                        isVisible: contactFormData.explanation.isVisible,
                        text: new app.edit.input(contactFormData.explanation.text, contactFormData.explanation.text, app.valid.text)
                    };
                    $scope.contactForm.edit.name = {
                        placeholder: new app.edit.input(contactFormData.name.placeholder, contactFormData.name.placeholder, app.valid.text),
                        message: new app.edit.input(contactFormData.name.errorMessage, contactFormData.name.errorMessage, app.valid.text)
                    };
                    $scope.contactForm.edit.email = {
                        placeholder: new app.edit.input(contactFormData.email.placeholder, contactFormData.email.placeholder, app.valid.text),
                        message: new app.edit.input(contactFormData.email.errorMessage, contactFormData.email.errorMessage, app.valid.text)
                    };
                    $scope.contactForm.edit.subject = {
                        placeholder: new app.edit.input(contactFormData.subject.placeholder, contactFormData.subject.placeholder, app.valid.text),
                        message: new app.edit.input(contactFormData.subject.errorMessage, contactFormData.subject.errorMessage, app.valid.text)
                    };
                    $scope.contactForm.edit.message = {
                        placeholder: new app.edit.input(contactFormData.message.placeholder, contactFormData.message.placeholder, app.valid.text),
                        message: new app.edit.input(contactFormData.message.errorMessage, contactFormData.message.errorMessage, app.valid.text)
                    };
                    $scope.contactForm.edit.submitText = {
                        idle: new app.edit.input(contactFormData.submit.text.idle, contactFormData.submit.text.idle, app.valid.text),
                        progress: new app.edit.input(contactFormData.submit.text.progress, contactFormData.submit.text.progress, app.valid.text)
                    };
                },
                show: function () {
                    $scope.contactForm.edit.init();
                    $('.contact-form-modal.modal:first').modal({ show: true, backdrop: false });
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        explanation: $scope.contactForm.edit.explanation.text.check(apply),
                        name: {
                            placeholder: $scope.contactForm.edit.name.placeholder.check(apply),
                            message: $scope.contactForm.edit.name.message.check(apply)
                        },
                        email: {
                            placeholder: $scope.contactForm.edit.email.placeholder.check(apply),
                            message: $scope.contactForm.edit.email.message.check(apply)
                        },
                        subject: {
                            placeholder: $scope.contactForm.edit.subject.placeholder.check(apply),
                            message: $scope.contactForm.edit.subject.message.check(apply)
                        },
                        message: {
                            placeholder: $scope.contactForm.edit.message.placeholder.check(apply),
                            message: $scope.contactForm.edit.message.message.check(apply)
                        },
                        submitText: {
                            idle: $scope.contactForm.edit.submitText.idle.check(apply),
                            progress: $scope.contactForm.edit.submitText.progress.check(apply)
                        }
                    };
                    return OK.explanation &&
                        OK.name.placeholder && OK.name.message &&
                        OK.email.placeholder && OK.email.message &&
                        OK.subject.placeholder && OK.subject.message &&
                        OK.message.placeholder && OK.message.message &&
                        OK.submitText.idle && OK.submitText.progress;
                },
                submit: function () {
                    if (!$scope.contactForm.edit.check() || $scope.contactForm.edit.inProgress) {
                        return;
                    }
                    $scope.contactForm.edit.inProgress = true;
                    var value = JSON.parse(JSON.stringify(contactFormData));
                    value.explanation.isVisible = $scope.contactForm.edit.explanation.isVisible;
                    value.explanation.text = $scope.contactForm.edit.explanation.text.value;
                    value.name.placeholder = $scope.contactForm.edit.name.placeholder.value;
                    value.name.errorMessage = $scope.contactForm.edit.name.message.value;
                    value.email.placeholder = $scope.contactForm.edit.email.placeholder.value;
                    value.email.errorMessage = $scope.contactForm.edit.email.message.value;
                    value.subject.placeholder = $scope.contactForm.edit.subject.placeholder.value;
                    value.subject.errorMessage = $scope.contactForm.edit.subject.message.value;
                    value.message.placeholder = $scope.contactForm.edit.message.placeholder.value;
                    value.message.errorMessage = $scope.contactForm.edit.message.message.value;
                    value.submit.text.idle = $scope.contactForm.edit.submitText.idle.value;
                    value.submit.text.progress = $scope.contactForm.edit.submitText.progress.value;
                    $http({
                        method: 'POST',
                        url: 'service/edit.ashx?d=' + new Date().valueOf(),
                        data: {
                            component: 'contact-form',
                            value: value
                        }
                    }).then(function (response) {
                        $scope.contactForm.edit.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            contactFormData = response.data.value;
                            $scope.contactForm.explanation = contactFormData.explanation;
                            $scope.contactForm.name = new item.input(contactFormData.name.placeholder, app.valid.text, contactFormData.name.errorMessage);
                            $scope.contactForm.email = new item.input(contactFormData.email.placeholder, app.valid.email, contactFormData.email.errorMessage);
                            $scope.contactForm.subject = new item.input(contactFormData.subject.placeholder, app.valid.text, contactFormData.subject.errorMessage);
                            $scope.contactForm.message = new item.input(contactFormData.message.placeholder, app.valid.text, contactFormData.message.errorMessage);
                            $scope.contactForm.submit.text = contactFormData.submit.text;
                        }
                    }, function (response) {
                        $scope.contactForm.edit.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };

        $scope.mail = {
            settings: {
                inProgress: false,
                smtp: {
                    address: new app.edit.input('', '', app.valid.smtp),
                    port: new app.edit.input('', '', app.valid.port)
                },
                from: {
                    address: new app.edit.input('', '', app.valid.email),
                    name: new app.edit.input('', '', app.valid.text),
                    password: new app.edit.input('', '', app.valid.text)
                },
                to: {
                    init: function () {
                        $scope.mail.settings.to.currentId = 0;
                        $scope.mail.settings.to.list = [];
                        $scope.mail.settings.to.maxCount = 10;
                        $scope.mail.settings.to.maxError = undefined;
                        $scope.mail.settings.to.minCount = 1;
                        $scope.mail.settings.to.minError = undefined;
                    },
                    assign: function (toMinCount, toMinError, toMaxCount, toMaxError, list) {
                        $scope.mail.settings.to.minCount = toMinCount;
                        $scope.mail.settings.to.minError = toMinError;
                        $scope.mail.settings.to.maxCount = toMaxCount;
                        $scope.mail.settings.to.maxError = toMaxError;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].id > $scope.mail.settings.to.currentId) {
                                $scope.mail.settings.to.currentId = list[i].id;
                            }
                            var toAddress = new item.toAddress(list[i].id, list[i].name, list[i].mail);
                            $scope.mail.settings.to.list.push(toAddress);
                        }
                    },
                    add: function () {
                        if ($scope.mail.settings.to.list.length >= $scope.mail.settings.to.maxCount) {
                            app.show.error($scope.mail.settings.to.maxError);
                            return;
                        }
                        var toAddress = new item.toAddress(++$scope.mail.settings.to.currentId, '', '');
                        $scope.mail.settings.to.list.splice(0, 0, toAddress);
                    },
                    remove: function (toAddress) {
                        if ($scope.mail.settings.to.list.length <= $scope.mail.settings.to.minCount) {
                            app.show.error($scope.mail.settings.to.minError);
                            return;
                        }
                        $scope.mail.settings.to.list = $scope.mail.settings.to.list.filter(function (to) {
                            return to.id !== toAddress.id;
                        });
                    },
                    check: function () {
                        var apply = true;
                        var OK = true;
                        for (var i = 0; i < $scope.mail.settings.to.list.length; i++) {
                            OK = $scope.mail.settings.to.list[i].check(apply) && OK;
                        }
                        return OK;
                    }
                },
                prefix: new app.edit.input('', '', app.valid.text),
                init: function () {
                    $scope.mail.settings.smtp.address.init();
                    $scope.mail.settings.smtp.port.init();
                    $scope.mail.settings.from.address.init();
                    $scope.mail.settings.from.name.init();
                    $scope.mail.settings.from.password.init();
                    $scope.mail.settings.prefix.init();
                    $scope.mail.settings.to.init();
                },
                assign: function (data) {
                    $scope.mail.settings.smtp.address.value = data.smtpAddress;
                    $scope.mail.settings.smtp.port.value = data.smtpPort;
                    $scope.mail.settings.from.address.value = data.fromAddress;
                    $scope.mail.settings.from.name.value = data.fromName;
                    $scope.mail.settings.from.password.value = data.fromPassword;
                    $scope.mail.settings.prefix.value = data.subjectPrefix;
                    $scope.mail.settings.to.list = [];
                    $scope.mail.settings.to.assign(
                        data.toMinCount !== undefined ? data.toMinCount : $scope.mail.settings.to.minCount,
                        data.toMinError !== undefined ? data.toMinError : $scope.mail.settings.to.minError,
                        data.toMaxCount !== undefined ? data.toMaxCount : $scope.mail.settings.to.maxCount,
                        data.toMaxError !== undefined ? data.toMaxError : $scope.mail.settings.to.maxError,
                        data.list);
                },
                show: function () {
                    $scope.mail.settings.init();
                    var elem = '.mail-settings-modal.modal:first';
                    $(elem).modal({ show: true, backdrop: false });
                    app.show.spinner(elem);
                    $scope.mail.settings.inProgress = true;
                    $http({
                        method: 'GET',
                        url: 'service/email.ashx?q=get&d=' + new Date().valueOf()
                    }).then(function (response) {
                        $scope.mail.settings.inProgress = false;
                        app.hide.spinner(elem);
                        if (app.show.result(response.data, undefined, true) && response.data.hasOwnProperty('value')) {
                            $scope.mail.settings.assign(response.data.value);
                        }
                    }, function (response) {
                        $scope.mail.settings.inProgress = false;
                        app.hide.spinner(elem);
                        app.show.error();
                        console.log(response);
                    });
                },
                check: function () {
                    var apply = true;
                    var OK = {
                        smtp: {
                            address: $scope.mail.settings.smtp.address.check(apply),
                            port: $scope.mail.settings.smtp.port.check(apply)
                        },
                        from: {
                            address: $scope.mail.settings.from.address.check(apply),
                            name: $scope.mail.settings.from.name.check(apply),
                            password: $scope.mail.settings.from.password.check(apply)
                        },
                        to: $scope.mail.settings.to.check(),
                        prefix: $scope.mail.settings.prefix.check(apply)
                    };
                    return OK.smtp.address && OK.smtp.port && OK.from.name && OK.from.address && OK.from.password && OK.to && OK.prefix;
                },
                submit: function () {
                    if (!$scope.mail.settings.check() || $scope.mail.settings.inProgress) {
                        return;
                    }
                    $scope.mail.settings.inProgress = true;
                    $http({
                        method: 'POST',
                        url: 'service/email.ashx?q=update&d=' + new Date().valueOf(),
                        data: {
                            smtpAddress: $scope.mail.settings.smtp.address.value,
                            smtpPort: $scope.mail.settings.smtp.port.value,
                            fromAddress: $scope.mail.settings.from.address.value,
                            fromName: $scope.mail.settings.from.name.value,
                            fromPassword: $scope.mail.settings.from.password.value,
                            subjectPrefix: $scope.mail.settings.prefix.value,
                            currentId: $scope.mail.settings.to.currentId,
                            list: $scope.mail.settings.to.list.map(function (toAddress) {
                                return {
                                    id: toAddress.id,
                                    mail: toAddress.mail.value,
                                    name: toAddress.name.value
                                };
                            })
                        }
                    }).then(function (response) {
                        $scope.mail.settings.inProgress = false;
                        if (app.show.result(response.data) && response.data.hasOwnProperty('value')) {
                            $scope.mail.settings.assign(response.data.value);
                        }
                    }, function (response) {
                        $scope.mail.settings.inProgress = false;
                        app.show.error();
                        console.log(response);
                    });
                }
            }
        };
    }],
    bindings: {
        editable: '<',
        editMsg: '<',
        editTitle: '<',
        editTitleExplanation: '<',
        editTitleNames: '<',
        editTitleMessages: '<',
        editTitleSubmitIdle: '<',
        editTitleSubmitProgress: '<',
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
        closeBtnText: '<',
        submitBtnText: '<',
        inProgressText: '<'
    }
});