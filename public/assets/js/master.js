/* Tooltip  */
jQuery(function ($) {
    $('.tooltip_s').tooltip();
});
/* Tooltip  */

$(document).ready(function () {

    setTimeout(function () {
        $(".hide-1sec").show();
    }, 1000);

});

var app = {
    angular: angular.module('ekiciMachine', []),
    valid: {
        text: function (value) {
            return typeof value != 'undefined' && value != null && value !== '';
        },
        email: function (value) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        },
        iframe: function (value) {
            return app.convert.string.to.iframeSrc(value);
        },
        url: function (value) {
            if (value === '#') {
                return true;
            }
            var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            if (re.test(value)) {
                return true;
            }
            re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            return re.test(value);
        },
        smtp: function (value) {
            var re = /^((smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
            return re.test(value);
        },
        port: function (value) {
            var onlyPositives = true;
            value = parseInt(value);
            if (!app.valid.integer(value, onlyPositives)) {
                return false;
            }
            var max = 65535;
            return value <= max;
        },
        integer: function (value, onlyPositives, includeZero) {
            return !isNaN(value) && value === parseInt(value, 10) && (!onlyPositives || (!includeZero && value > 0) || (includeZero && value >= 0));
        },
        date: function (value) {
            return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
        },
        upload: function (file, handler) {
            return app.valid.integer(file.id, true, true) && app.valid.date(file.date) && typeof handler.proceed === 'function' && app.valid.date(handler.date) && file.date <= handler.date;
        },
        result: function (value) {
            return value.hasOwnProperty('result') && value.result.hasOwnProperty('code') && value.result.hasOwnProperty('text');
        }
    },
    show: {
        spinner: function (elem) {
            $(elem).block({
                message: '<i class="fa fa-spinner fa-2x spin"></i>',
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });
        },
        error: function (msg, callback) {
            if (typeof msg === 'undefined') {
                msg = app.show.text.msg.error[document.documentElement.lang];
            }
            if (msg === app.show.text.title.error[document.documentElement.lang]) {
                msg = '';
            }
            swal({
                title: app.show.text.title.error[document.documentElement.lang],
                text: msg,
                confirmButtonColor: "#EF5350",
                confirmButtonText: app.show.text.btnOK[document.documentElement.lang],
                type: "error"
            }, callback);
        },
        success: function (msg, callback) {
            if (typeof msg === 'undefined') {
                msg = app.show.text.msg.success[document.documentElement.lang];
            }
            if (msg === app.show.text.title.success[document.documentElement.lang]) {
                msg = '';
            }
            swal({
                title: app.show.text.title.success[document.documentElement.lang],
                text: msg,
                confirmButtonColor: "#66BB6A",
                confirmButtonText: app.show.text.btnOK[document.documentElement.lang],
                type: "success"
            }, callback);
        },
        result: function (data, callback, showErrorOnly) {
            if (!app.valid.result(data)) {
                app.show.error();
                return false;
            }
            if (data.result.code !== 1) {
                app.show.error(data.result.text);
                return false;
            }
            if (!showErrorOnly) {
                app.show.success(data.result.text, callback);
            }
            return true;
        },
        text: {
            msg: {
                error: {
                    en: 'Something went wrong!',
                    tr: 'Bir şeyler ters gitti!',
                    ar: 'هناك خطأ ما',
                    ru: 'Что-то пошло не так'
                },
                success: {
                    en: 'Done!',
                    tr: 'Tamamlandı!',
                    ar: 'فعله',
                    ru: 'Готово'
                }
            },
            title: {
                error: {
                    en: 'Oops...',
                    tr: 'Hay aksi...',
                    ar: 'لسوء الحظ ...',
                    ru: 'К сожалению ...'
                },
                success: {
                    en: 'Completed Successfully',
                    tr: 'İşlem başarılı!',
                    ar: 'تم بنجاح',
                    ru: 'Завершено успешно'
                }
            },
            btnOK: {
                en: 'OK',
                tr: 'Tamam',
                ar: 'حسنا',
                ru: 'ОК'
            }
        }
    },
    hide: {
        spinner: function (elem) {
            $(elem).unblock();
        }
    },
    edit: {
        input: function (value, placeholder, checker) {
            var self = this;
            self.placeholder = placeholder;
            self.msg = {};
            self.init = function () {
                self.isValid = true;
                self.value = value;
                self.success();
            };
            self.check = function (apply) {
                var check = checker(self.value);
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
            self.change = function () {
                self.check();
            };
            self.error = function () {
                self.cls = 'has-error';
                self.msg.isVisible = true;
            };
            self.success = function () {
                self.cls = '';
                self.msg.isVisible = false;
            };
            self.init();
        },
        title: function (titleGetter, titleSetter, component, next, $http) {
            var self = this;
            self.inProgress = false;
            self.isVisible = false;
            self.init = function () {
                var title = titleGetter(self.index);
                self.title = new app.edit.input(title, title, app.valid.text);
            };
            self.show = function () {
                self.init();
                self.isVisible = true;
            };
            self.cancel = function () {
                self.isVisible = false;
            };
            self.check = function () {
                var apply = true;
                return self.title.check(apply);
            };
            self.submit = function () {
                if (!self.check() || self.inProgress) {
                    return;
                }
                self.inProgress = true;
                var value = titleSetter(self.title.value, self.index);
                $http({
                    method: 'POST',
                    url: 'service/edit.ashx?d=' + new Date().valueOf(),
                    data: {
                        component: component,
                        value: value
                    }
                }).then(function (response) {
                    self.inProgress = false;
                    if (app.show.result(response.data) && response.data.hasOwnProperty('value') && typeof next === 'function') {
                        next(response);
                        self.isVisible = false;
                    }
                }, function (response) {
                    self.inProgress = false;
                    app.show.error();
                    console.log(response);
                });
            };
        },
        iframe: function (value, trustedUrlConverter, trustedIframeSrc) {
            var self = this;
            self.msg = {};
            self.init = function () {
                self.isValid = true;
                self.value = value;
                self.iframeSrc = trustedIframeSrc;
                self.success();
            };
            self.check = function (apply) {
                self.iframeSrc = app.convert.string.to.iframeSrc(self.value);
                var check = self.iframeSrc !== null;
                if (apply || self.isValid !== check) {
                    self.isValid = check;
                    if (self.isValid) {
                        self.success();
                    } else {
                        self.error();
                    }
                }
                self.iframeSrc = trustedUrlConverter(self.iframeSrc);
                return self.isValid;
            };
            self.change = function () {
                self.check();
            };
            self.error = function () {
                self.cls = 'has-error';
                self.msg.isVisible = true;
            };
            self.success = function () {
                self.cls = '';
                self.msg.isVisible = false;
            };
            self.init();
        }
    },
    upload: {
        file: {
            id: null,
            date: null
        },
        change: function (event) {
            var f = event.files[0];
            var elem = $(event).parent().parent().parent();
            app.show.spinner(elem);
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
                    if (app.valid.upload(app.upload.file, app.upload.handler)) {
                        app.upload.handler.proceed(app.upload.file.id, file.type, e.target.result, function () {
                            app.hide.spinner(elem);
                        }, elem);
                    } else {
                        app.hide.spinner(elem);
                    }
                };
            })(f);

            try {
                reader.readAsDataURL(f);
            } catch (e) {
                console.log(e);
                app.hide.spinner(elem);
            }
        },
        handler: {
            proceed: null,
            date: null
        }
    },
    convert: {
        date: {
            to: {
                string: function (date) {
                    var month = (1 + date.getMonth()).toString();
                    if (month.length === 1) {
                        month = '0' + month;
                    }
                    var day = date.getDate().toString();
                    if (day.length === 1) {
                        day = '0' + day;
                    }
                    return day + '.' + month + '.' + date.getFullYear();
                }
            }
        },
        string: {
            to: {
                iframeSrc: function (string) {
                    if (!app.valid.text(string)) {
                        return null;
                    }
                    var div = document.createElement('div');
                    div.innerHTML = string;
                    if (!div.firstChild || div.firstChild.tagName !== 'IFRAME' || !app.valid.url(div.firstChild.getAttribute('src')) || div.firstChild.getAttribute('src') === '#') {
                        return null;
                    }
                    return div.firstChild.getAttribute('src');
                }
            }
        },
        url: {
            to: {
                iframeString: function (url) {
                    if (!app.valid.url(url)) {
                        return null;
                    }
                    return '<iframe src="' + url + '" frameborder="0" allowfullscreen></iframe>';
                }
            }
        }
    }
};