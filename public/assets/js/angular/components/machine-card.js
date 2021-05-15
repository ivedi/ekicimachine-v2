app.angular
.component('machineCard', {
    templateUrl: 'assets/angular/template/machine-card.html',
    controller: ['$scope', function ($scope) {
        console.log(this);
        $('.port-hover').each(function () {
            $(this).hoverdir({
                hoverDelay: 5
            });
        });
    }],
    bindings: {
        animationDelay: '<',
        imgSrc: '<',
        title: '<',
        categoriesText: '<',
        categoriesCls: '<'
    }
});