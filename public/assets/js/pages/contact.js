var page = {
    map: {
        initialized: false,
        component: {
            isReady: false,
            init: function () {
                page.map.component.isReady = true;
                page.map.init();
            }
        },
        google: {
            isReady: false,
            init: function () {
                page.map.google.isReady = true;
                page.map.init();
            },
            clear: {
                circle: function () {
                    if (page.map.google.circle !== undefined) {
                        page.map.google.circle.setMap(null);
                    }
                },
                marker: function () {
                    if (page.map.google.marker !== undefined) {
                        page.map.google.marker.setMap(null);
                    }
                }
            },
            position: {
                marker: function () {
                    page.map.google.clear.marker();
                    page.map.google.marker = new google.maps.Marker({ position: new google.maps.LatLng(page.map.properties.latitude, page.map.properties.longitude), animation: google.maps.Animation.DROP });
                    page.map.google.marker.setMap(page.map.google.map);
                },
                map: function () {
                    //Center of map
                    page.map.google.map.panTo(new google.maps.LatLng(page.map.properties.latitude, page.map.properties.longitude));
                }
            }
        },
        properties: {
            latitude: 37.0838500,
            longitude: 37.4330000,
            zoom: 16
        },
        contentClass: 'officeLocationMap',
        init: function () {
            if (page.map.initialized || !page.map.component.isReady || !page.map.google.isReady) {
                return;
            }
            var properties = {
                center: new google.maps.LatLng(page.map.properties.latitude, page.map.properties.longitude),
                zoom: page.map.properties.zoom
            };
            page.map.google.map = new google.maps.Map(document.getElementsByClassName(page.map.contentClass)[0], properties);
            page.map.google.marker = new google.maps.Marker({ position: properties.center, animation: google.maps.Animation.DROP });
            page.map.google.marker.setMap(page.map.google.map);

            if (page.map.component.editable) {
                google.maps.event.addListener(page.map.google.map, 'click', function (event) {
                    page.map.properties.latitude = event.latLng.lat();
                    page.map.properties.longitude = event.latLng.lng();

                    page.map.google.clear.circle();
                    page.map.google.circle = new google.maps.Circle({
                        map: page.map.google.map,
                        radius: 20,
                        center: event.latLng,
                        fillColor: '#777',
                        fillOpacity: 0.4,
                        strokeColor: '#0000AA',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        draggable: false,    // Dragable
                        editable: false      // Resizable
                    });
                });
            }
            google.maps.event.addListener(page.map.google.map, 'zoom_changed', function () {
                page.map.properties.zoom = page.map.google.map.getZoom();
            });
            google.maps.event.addListener(page.map.google.marker, 'click', function (event) {
                if (page.map.properties.zoom >= 20) {
                    return;
                }
                page.map.google.map.setZoom(page.map.properties.zoom + 1);
                page.map.google.map.setCenter(page.map.google.marker.getPosition());
            });
            page.map.initialized = true;
        }
    }
};