$(document).ready(function () {

  /*Sticky Navigation*/
  $(".js--section-features").waypoint(function (direction) {
    if (direction == "down") {
      $(".main-nav").prepend("<li class='mobile'> <a href='#'>Home</a></li>");
      $(".mobile").click(function () {
        $("html").animate({
          scrollTop: $("#header").offset().top
        }, 1000);
      });
      $("nav").addClass("sticky");
    } else {
      $("li").remove(".mobile");
      $("nav").removeClass("sticky");
    }
  }, {
    offset: "60px"
  });

  /*Header button scroll*/
  $(".js--btn-plans").click(function () {
    $("html").animate({
      scrollTop: $(".js--section-plans").offset().top
    }, 1000);
  });
  $(".js--btn-features").click(function () {
    $("html").animate({
      scrollTop: $(".js--section-features").offset().top
    }, 1000);
  });

  /*Smooth scroll*/
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function () {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });

  /* Mobile Navigation */
  $(".js--mobile-nav-icon").click(function () {
    var nav = $(".main-nav");
    var mobIcon = $(".js--mobile-nav-icon i");
    nav.slideToggle(200);
    if (mobIcon.hasClass("ion-navicon-round")) {
      mobIcon.removeClass("ion-navicon-round");
      mobIcon.addClass("ion-close-round");
    } else {
      mobIcon.removeClass("ion-close-round");
      mobIcon.addClass("ion-navicon-round");
    }


  });


  /* Animation on scroll */
  $(".js--anim1").waypoint(function (direction) {
    $(".js--anim1").addClass("animated fadeIn");
  }, {
    offset: "50%"
  });

  $(".js--anim2").waypoint(function (direction) {
    $(".js--anim2").addClass("animated fadeInUp");
  }, {
    offset: "50%"
  });

  $(".js--anim3").waypoint(function (direction) {
    $(".js--anim3").addClass("animated fadeInUp");
  }, {
    offset: "50%"
  });

  $(".js--anim4").waypoint(function (direction) {
    $(".js--anim4").addClass("animated pulse");
  }, {
    offset: "50%"
  });

});