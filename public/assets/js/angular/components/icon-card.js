app.angular
.component('iconCard', {
    templateUrl: 'assets/angular/template/icon-card.html?v=0.1.1',
    bindings: {
        animationDelay: '<',
        iconClass: '<',
        header: '<',
        text: '<',
        editable: '<',
        editMsg: '<',
        arrayIndex: '<',
        editHandler: '<'
    }
});