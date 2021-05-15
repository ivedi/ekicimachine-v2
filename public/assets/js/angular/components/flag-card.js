app.angular
.component('flagCard', {
    templateUrl: 'assets/angular/template/flag-card.html?v=0.1.1',
    bindings: {
        code: '<',
        flagClass: '<',
        isVisible: '<',
        isEnable: '<',
        title: '<',
        editable: '<'
    }
});