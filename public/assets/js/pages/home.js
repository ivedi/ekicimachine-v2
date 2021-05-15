//#region sticky-menu
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
//#endregion sticky-menu
//#region responsive-menu
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
//#endregion responsive-menu
//#region menu
$('#superfish').superfish({
  delay: 100,                              // one second delay on mouseout
  animation: { opacity: 'show', height: 'show' },   // fade-in and slide-down animation
  speed: 400,                              // animation speed
  speedOut: 0,                                // out animation speed
});
//#endregion menu