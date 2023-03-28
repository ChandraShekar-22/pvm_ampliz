!function (a) { "use strict"; a("html, body"); var e = a(".pwdMask > .form-control"), t = a(".pwd-toggle"); a(".lnk-toggler").on("click", function (t) { t.preventDefault(); var e = a(this).data("panel"); a(".authfy-panel.active").removeClass("active"), a(e).addClass("active") }), a(t).on("click", function (t) { t.preventDefault(), a(this).toggleClass("fa-eye-slash fa-eye"), a(this).hasClass("fa-eye") ? a(e).attr("type", "text") : a(e).attr("type", "password") }), a("#forget-lnk").on("click", function () { a(".authfy-login .nav-tabs").find("li").removeClass("active") }), a(window).on("load", function () { a(".square-block").fadeOut(), a("#preload-block").fadeOut("slow", function () { a(this).remove() }) }) }(jQuery);





/**/

jQuery(document).ready(function () {

    var back = jQuery(".prev");
    var next = jQuery(".next");
    var steps = jQuery(".step");

    next.bind("click", function () {
        jQuery.each(steps, function (i) {
            if (!jQuery(steps[i]).hasClass('current') && !jQuery(steps[i]).hasClass('done')) {
                jQuery(steps[i]).addClass('current');
                jQuery(steps[i - 1]).removeClass('current').addClass('done');
                return false;
            }
        })
    });
    back.bind("click", function () {
        jQuery.each(steps, function (i) {
            if (jQuery(steps[i]).hasClass('done') && jQuery(steps[i + 1]).hasClass('current')) {
                jQuery(steps[i + 1]).removeClass('current');
                jQuery(steps[i]).removeClass('done').addClass('current');
                return false;
            }
        })
    });

})

window.addEventListener("message", function (event) {
    if (event.source == window &&
      event.data.sender &&
      event.data.sender === "my-extension" &&
      event.data.message_name &&
      event.data.message_name === "version") {
    //   console.log("Got the message",event);
    }
  });
  