/* Flex Slider (Testimonial Customers) */
$(window).load(function () {
    jQuery(document).ready(function () {
        jQuery('.testi-slider.flexslider').flexslider({
            animation: "fade",
            slideshow: true,
            slideshowSpeed: 5000,
        });
      
        jQuery('.next-slider').click(function () {
            jQuery('.flexslider.pf-carousel').flexslider("next");
        });
      
        jQuery('.prev-slider').click(function () {
            jQuery('.flexslider.pf-carousel').flexslider("prev");
        });
    });
});
/* Flex Slider (Testimonial Customers) */

function initSlideShow() {
    var backgrounds = [];
    for (var i = 0; i < promoTextUniData.images.length; i++) {
        backgrounds.push({
            src: promoTextUniData.images[i].src + "?v=" + promoTextUniData.images[i].version.major + "." + promoTextUniData.images[i].version.medio + "." + promoTextUniData.images[i].version.minor,
            fade: promoTextUniData.images[i].fade
        });
    }
    $.vegas('slideshow', {
        backgrounds: backgrounds
    })('overlay', {});
}
initSlideShow();

var images = {
    'Background':     '/assets/images/slide/slide1.jpg'
};
Royal_Preloader.config({
    mode:           'text', // 'number', "text" or "logo"
    text:           'Ekici Makina Sanayi',
    images:         images,
    timeout:        10,
    showInfo:       false,
    showPercentage: false,
    opacity:        1,
    background:     ['#fff'], // ['#000000', '#FF0000', '#0097AA', '#F29500', '#C23916', '#94C849', '#6FA014', '#91009B'],
});