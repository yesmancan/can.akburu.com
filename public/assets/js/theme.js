(function ($) {
  "use strict";
  var theme = {
    /**
     * Theme's components/functions list
     * Comment out or delete the unnecessary component.
     * Some components have dependencies (plugins).
     * Do not forget to remove dependency from src/js/vendor/ and recompile it.
     */
    init: () => {
      theme.stickyHeader();
      theme.dropdownAnimation();
      theme.headerButtons();
      theme.isotope();
      theme.onepageHeaderOffset();
      theme.onepageNavLinks();
      theme.anchorSmoothScroll();
      theme.svgInject();
      theme.backgroundImage();
      theme.backgroundImageMobile();
      theme.backgroundVideo();
      theme.imageHoverOverlay();
      theme.rellax();
      theme.scrollCue();
      theme.showMoreItems();
      theme.owlCarousel();
      theme.heroSlider();
      theme.animatedCaptions();
      theme.lightGallery();
      theme.plyr();
      theme.progressBar();
      theme.pageProgress();
      theme.counterUp();
      theme.bsTooltips();
      theme.bsPopovers();
      theme.bsModal();
      theme.iTooltip();
      theme.contactForm();
      theme.pricingSwitcher();
      theme.codeSnippet();
    },
    /**
     * Sticky Header
     * Enables sticky behavior on navigation on page scroll
     * Requires assets/js/vendor/headhesive.min.js
     */
    stickyHeader: () => {
      if ($(".navbar").length) {
        var options = {
          offset: 350,
          offsetSide: "top",
          classes: {
            clone: "banner--clone fixed ",
            stick: "banner--stick",
            unstick: "banner--unstick",
          },
          onStick: function () {
            $($.SmartMenus.Bootstrap.init);
            var $language_dropdown = $(
              ".navbar:not(.fixed) .language-select .dropdown-menu"
            );
            $language_dropdown.removeClass("show");
          },
          onUnstick: function () {
            var $language_sticky_dropdown = $(
              ".navbar.fixed .language-select .dropdown-menu"
            );
            $language_sticky_dropdown.removeClass("show");
          },
        };
        var banner = new Headhesive(".navbar", options);
      }
    },
    /**
     * Dropdown Animation
     * Adds a custom animation to dropdown menus
     */
    dropdownAnimation: () => {
      $(".navbar .navbar-nav:not(.navbar-nav-other)")
        .bind({
          "show.smapi": function (e, menu) {
            $(menu).removeClass("hide-animation").addClass("show-animation");
          },
          "hide.smapi": function (e, menu) {
            $(menu).removeClass("show-animation").addClass("hide-animation");
          },
        })
        .on(
          "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
          "ul",
          function (e) {
            $(this).removeClass("show-animation hide-animation");
            e.stopPropagation();
          }
        );
    },
    /**
     * Header Buttons
     * Open/close offcanvas menus on click of header buttons
     */
    headerButtons: () => {
      var $header_hamburger = $(".hamburger.animate");
      var $language_select = $(".language-select .dropdown-menu");
      var $navbar_offcanvas = $(".offcanvas-nav");
      var $navbar_offcanvas_toggle = $('[data-toggle="offcanvas-nav"]');
      var $navbar_offcanvas_close = $(".offcanvas-nav-close");
      var $info_offcanvas = $(".offcanvas-info");
      var $info_offcanvas_close = $(".offcanvas-info-close");
      var $info_offcanvas_toggle = $('[data-toggle="offcanvas-info"]');
      $header_hamburger.on("click", function () {
        $header_hamburger.toggleClass("active");
      });
      $navbar_offcanvas_toggle.on("click", function (e) {
        e.stopPropagation();
        $navbar_offcanvas.toggleClass("open");
      });
      $navbar_offcanvas.on("click", function (e) {
        e.stopPropagation();
      });
      $navbar_offcanvas_close.on("click", function (e) {
        $navbar_offcanvas.removeClass("open");
        $header_hamburger.removeClass("active");
      });
      $info_offcanvas_toggle.on("click", function (e) {
        e.stopPropagation();
        $info_offcanvas.toggleClass("open");
      });
      $info_offcanvas.on("click", function (e) {
        e.stopPropagation();
      });
      $(document).on("click", function () {
        $navbar_offcanvas.removeClass("open");
        $info_offcanvas.removeClass("open");
        $header_hamburger.removeClass("active");
      });
      $info_offcanvas_close.on("click", function (e) {
        $info_offcanvas.removeClass("open");
      });
      $(".onepage .navbar li a.scroll").on("click", function () {
        $navbar_offcanvas.removeClass("open");
        $header_hamburger.removeClass("active");
      });
    },
    /**
     * Isotope
     * Enables isotope grid layout and filtering
     * Requires assets/js/vendor/isotope.pkgd.min.js
     * Requires assets/js/vendor/imagesloaded.pkgd.min.js
     */
    isotope: () => {
      // for each container
      $(".grid").each(function (i, gridContainer) {
        var $gridContainer = $(gridContainer);
        // init isotope for container
        var $grid = $gridContainer.find(".isotope").imagesLoaded(function () {
          $grid.isotope({
            itemSelector: ".item",
            layoutMode: "masonry",
            percentPosition: true,
            masonry: {
              columnWidth: $grid.width() / 12,
            },
            transitionDuration: "0.7s",
          });
        });
        $(window).resize(function () {
          $grid.isotope({
            masonry: {
              columnWidth: $grid.width() / 12,
            },
          });
        });
        $(window).on("load", function () {
          $grid.isotope({
            masonry: {
              columnWidth: $grid.width() / 12,
            },
          });
        });
        // initi filters for container
        $gridContainer.find(".isotope-filter").on("click", "a", function () {
          var filterValue = $(this).attr("data-filter");
          $grid.isotope({
            filter: filterValue,
          });
        });
      });
      $(".isotope-filter").each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on("click", "a", function () {
          $buttonGroup.find(".active").removeClass("active");
          $(this).addClass("active");
        });
      });
    },
    /**
     * Onepage Header Offset
     * Adds an offset value to anchor point equal to sticky header height on a onepage
     */
    onepageHeaderOffset: () => {
      var header_height = $(".navbar:not(.banner--clone)").outerHeight();
      var shrinked_header_height = 75;
      var shrinkedStyle = {
        "padding-top": "" + shrinked_header_height + "px",
        "margin-top": "-" + shrinked_header_height + "px",
      };
      $(".onepage section").css(shrinkedStyle);
      var unshrinkedStyle = {
        "padding-top": "" + header_height + "px",
        "margin-top": "-" + header_height + "px",
      };
      $(".onepage section:first-of-type").css(unshrinkedStyle);
    },
    /**
     * Onepage Nav Links
     */
    onepageNavLinks: () => {
      var empty_a = $('.onepage .navbar ul.navbar-nav a[href="#"]');
      empty_a.on("click", function (e) {
        e.preventDefault();
      });
    },
    /**
     * Anchor Smooth Scroll
     * Adds smooth scroll animation to anchor links
     */
    anchorSmoothScroll: () => {
      $(function () {
        setTimeout(function () {
          if (location.hash) {
            window.scrollTo(0, 0);
            var target = location.hash.split("#");
            smoothScrollTo($("#" + target[1]));
          }
        }, 1);
        $('a.scroll[href*="#"]:not([href="#"])').on("click", function () {
          if (
            location.pathname.replace(/^\//, "") ==
              this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
          ) {
            smoothScrollTo($(this.hash));
            return false;
          }
        });

        function smoothScrollTo(target) {
          var target = target.length
            ? target
            : $("[name=" + this.hash.slice(1) + "]");
          if (target.length) {
            $("html,body").animate(
              {
                scrollTop: target.offset().top,
              },
              1500,
              "easeInOutExpo"
            );
          }
        }
      });
    },
    /**
     * SVGInject
     * Replaces an img element with an inline SVG so you can apply colors to your SVGs
     * Requires assets/js/vendor/svg-inject.min.js
     */
    svgInject: () => {
      SVGInject(document.querySelectorAll("img.svg-inject"));
    },
    /**
     * Background Image
     * Adds a background image link via data attribute "data-image-src"
     */
    backgroundImage: () => {
      $(".bg-image").css("background-image", function () {
        var bg = "url(" + $(this).data("image-src") + ")";
        return bg;
      });
    },
    /**
     * backgroundImageMobile
     * Adds .mobile class to background images on mobile devices for styling purposes
     */
    backgroundImageMobile: () => {
      var isMobile =
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i)
          ? true
          : false;
      if (isMobile) {
        $(".image-wrapper").addClass("mobile");
      }
    },
    /**
     * Background Video
     * Turns an HTML5 video into a background, scaling to aspect ratio.
     */
    backgroundVideo: () => {
      $(".video-wrapper video").backgroundVideo({
        $outerWrap: $(".video-wrapper"),
        pauseVideoOnViewLoss: false,
        parallaxOptions: {
          effect: 6,
        },
      });
    },
    /**
     * Image Hover Overlay
     * Adds span.bg inside .overlay for simpler markup and styling purposes
     */
    imageHoverOverlay: () => {
      $(".overlay:not(.caption) > a, .overlay:not(.caption) > span").prepend(
        '<span class="bg"></span>'
      );
    },
    /**
     * Rellax.js
     * Adds parallax animation to shapes and elements
     * Requires assets/js/vendor/rellax.min.js
     */
    rellax: () => {
      if ($(".rellax").length) {
        window.onload = function () {
          var rellax = new Rellax(".rellax", {
            speed: 2,
            center: true,
            breakpoints: [576, 992, 1201],
          });
          $(".projects-overflow").imagesLoaded(function () {
            rellax.refresh();
          });
        };
      }
    },
    /**
     * scrollCue.js
     * Enables showing elements by scrolling
     * Requires assets/js/vendor/scrollCue.min.js
     */
    scrollCue: () => {
      scrollCue.init({
        interval: -400,
        duration: 700,
        percentage: 0.8,
      });
      scrollCue.update();
    },
    /**
     * Show More Items
     * Loads more elements for lists
     * Requires assets/js/vendor/showMoreItems.min.js
     */
    showMoreItems: () => {
      $(".show-more").each(function () {
        var $showmore = $(this);
        $showmore.showMoreItems({
          startNum: $showmore.data("showstart"),
          afterNum: $showmore.data("showafter"),
          moreText: "Show More",
          after: function () {
            theme.isotope();
            theme.rellax();
            theme.scrollCue();
          },
        });
      });
    },
    /**
     * Owl Carousel
     * Creates carousel sliders
     * Requires assets/js/vendor/owl.carousel.min.js
     */
    owlCarousel: () => {
      $(".basic-slider").each(function () {
        var $bslider = $(this);
        $bslider.owlCarousel({
          items: 1,
          nav: $bslider.data("nav"),
          navText: [
            "<i class='uil-arrow-left'></i>",
            "<i class='uil-arrow-right'></i>",
          ],
          dots: true,
          dotsEach: true,
          autoHeight: true,
          loop: true,
          margin: $bslider.data("margin"),
        });
      });
      $(".carousel").each(function () {
        var $carousel = $(this);
        $carousel.owlCarousel({
          autoHeight: false,
          nav: $carousel.data("nav"),
          navText: [
            "<i class='uil-arrow-left'></i>",
            "<i class='uil-arrow-right'></i>",
          ],
          dots: $carousel.data("dots"),
          dotsEach: true,
          loop: $carousel.data("loop"),
          margin: $carousel.data("margin"),
          autoplay: $carousel.data("autoplay"),
          autoplayTimeout: $carousel.data("autoplay-timeout"),
          responsive: $carousel.data("responsive"),
        });
      });
    },
    /**
     * Hero Slider
     * Creates hero sliders with animated captions
     * Requires assets/js/vendor/owl.carousel.min.js
     */
    heroSlider: () => {
      $(".hero-slider").each(function () {
        var $hslider = $(this);
        $hslider.owlCarousel({
          items: 1,
          nav: $(this).data("nav"),
          navText: [
            "<i class='uil-arrow-left'></i>",
            "<i class='uil-arrow-right'></i>",
          ],
          dots: $(this).data("dots"),
          dotsEach: true,
          autoHeight: false,
          loop: true,
          autoplay: $hslider.data("autoplay"),
          autoplayTimeout: 5000,
          onInitialized: function () {
            $hslider.trigger("stop.owl.autoplay");
            setTimeout(function () {
              $hslider.trigger("play.owl.autoplay");
            }, 3000);
          },
          autoplayHoverPause: true,
          margin: 0,
          animateIn: "fadeIn",
          animateOut: "fadeOut",
        });
        $hslider.on("changed.owl.carousel", (e) => {
          $(".owl-item.active")
            .find(".animated-caption")
            .each(function (index, value) {
              $(this)
                .removeClass("animate__animated")
                .removeClass($(this).data("anim"));
            });
          var $currentOwlItem = $(".owl-item").eq(e.item.index);
          $currentOwlItem
            .find(".animated-caption")
            .each(function (index, value) {
              var a = $(this).data("anim-delay");
              var b = $(this).data("anim-duration");
              $(this)
                .addClass("animate__animated")
                .addClass($(this).data("anim"))
                .css({
                  "animation-delay": a + "ms",
                  "animation-duration": b + "ms",
                });
            });
        });
        $hslider.trigger("refresh.owl.carousel");
      });
    },
    /**
     * Animated Captions
     * Enables data attributes "data-anim-delay" and "data-anim-duration" for .animated-caption
     * Requires assets/css/vendor/animate.css
     */
    animatedCaptions: () => {
      var $animatedCaptions = $(".animated-captions");
      $animatedCaptions.find(".animated-caption").each(function () {
        var a = $(this).data("anim-delay");
        var b = $(this).data("anim-duration");
        $(this)
          .addClass("animate__animated")
          .addClass($(this).data("anim"))
          .css({
            "animation-delay": a + "ms",
            "animation-duration": b + "ms",
          });
      });
    },
    /**
     * Lightgallery
     * Enables lightbox functionality
     * Requires assets/js/vendor/lightgallery.min.js
     */
    lightGallery: () => {
      var $lg = $(".light-gallery-wrapper");
      $lg.lightGallery({
        thumbnail: false,
        selector: ".lightbox",
        mode: "lg-fade",
        download: false,
        autoplayControls: false,
        zoom: false,
        fullScreen: false,
        videoMaxWidth: "1000px",
        loop: false,
        counter: false,
        hash: false,
        closable: true,
        mousewheel: true,
        videojs: true,
        videoAutoplay: true,
        share: false,
      });
    },
    /**
     * Plyr
     * Enables media player
     * Requires assets/js/vendor/plyr.js
     */
    plyr: () => {
      var players = Plyr.setup(".player", {
        loadSprite: true,
      });
    },
    /**
     * Progressbar
     * Enables animated progressbars
     * Requires assets/js/vendor/progressbar.min.js
     */
    progressBar: () => {
      var $pline = $(".progressbar.line");
      $pline.each(function (i) {
        var line = new ProgressBar.Line(this, {
          strokeWidth: 3,
          trailWidth: 3,
          duration: 3000,
          easing: "easeInOut",
          text: {
            style: {
              color: "inherit",
              position: "absolute",
              right: "0",
              top: "-30px",
              padding: 0,
              margin: 0,
              transform: null,
            },
            autoStyleContainer: false,
          },
          step: function (state, line, attachment) {
            line.setText(Math.round(line.value() * 100) + " %");
          },
        });
        var value = $(this).attr("data-value") / 100;
        $pline.waypoint(
          function () {
            line.animate(value);
          },
          {
            offset: "100%",
          }
        );
      });
    },
    /**
     * Page Progress
     * Shows page progress on the bottom right corner of the page
     */
    pageProgress: () => {
      if ($(".progress-wrap").length) {
        var progressPath = document.querySelector(".progress-wrap path");
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition =
          "none";
        progressPath.style.strokeDasharray = pathLength + " " + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition =
          "stroke-dashoffset 10ms linear";
        var updateProgress = function () {
          var scroll = $(window).scrollTop();
          var height = $(document).height() - $(window).height();
          var progress = pathLength - (scroll * pathLength) / height;
          progressPath.style.strokeDashoffset = progress;
        };
        updateProgress();
        $(window).scroll(updateProgress);
        var offset = 50;
        var duration = 550;
        jQuery(window).on("scroll", function () {
          if (jQuery(this).scrollTop() > offset) {
            jQuery(".progress-wrap").addClass("active-progress");
          } else {
            jQuery(".progress-wrap").removeClass("active-progress");
          }
        });
        jQuery(".progress-wrap").on("click", function (event) {
          event.preventDefault();
          jQuery("html, body").animate(
            {
              scrollTop: 0,
            },
            duration
          );
          return false;
        });
      }
    },
    /**
     * Counter Up
     * Counts up to a targeted number when the number becomes visible
     * Requires assets/js/vendor/counterup.min.js
     * Requires assets/js/vendor/jquery.waypoints.min.js
     */
    counterUp: () => {
      var counterUp = window.counterUp["default"]; // import counterUp from "counterup2"
      var $counters = $(".counter");
      /* Start counting, do this on DOM ready or with Waypoints. */
      $counters.each(function (ignore, counter) {
        var waypoint = new Waypoint({
          element: $(this),
          handler: function () {
            counterUp(counter, {
              duration: 1000,
              delay: 50,
            });
            this.destroy();
          },
          offset: "bottom-in-view",
        });
      });
    },
    /**
     * Bootstrap Tooltips
     * Enables Bootstrap tooltips
     * Requires Poppers library
     */
    bsTooltips: () => {
      var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    },
    /**
     * Bootstrap Popovers
     * Enables Bootstrap popovers
     * Requires Poppers library
     */
    bsPopovers: () => {
      var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
      );
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
      });
    },
    /**
     * Bootstrap Modal
     * Enables Bootstrap modals and modal popup
     */
    bsModal: () => {
      var scr_size = window.innerWidth;
      var scr_avail = $("body").innerWidth();
      var pad_right = scr_size - scr_avail;
      var myModalEl = document.querySelectorAll(".modal");
      myModalEl.forEach((myModalEl) => {
        myModalEl.addEventListener("show.bs.modal", function (e) {
          $(".navbar.fixed").css("padding-right", pad_right);
          $(".progress-wrap").css("margin-right", pad_right);
        });
        myModalEl.addEventListener("hidden.bs.modal", function (e) {
          $(".navbar.fixed").css("padding-right", "");
          $(".progress-wrap").css("margin-right", "");
        });
      });
      if ($(".modal-popup").length > 0) {
        var myModalPopup = new bootstrap.Modal(
          document.querySelector(".modal-popup")
        );
        var myModalEl2 = document.querySelector(".modal-popup");
        setTimeout(function () {
          myModalPopup.show();
        }, 200);
      }
    },
    /**
     * iTooltip
     * Enables custom tooltip style for image hover docs/elements/hover.html
     * Requires assets/js/vendor/itooltip.min.js
     */
    iTooltip: () => {
      var tooltip = new iTooltip(".itooltip");
      tooltip.init({
        className: "itooltip-inner",
        indentX: 15,
        indentY: 15,
        positionX: "right",
        positionY: "bottom",
      });
    },
    /**
     * Contact Form
     * Contact form validation (Bootstrap) sends messages when validated and shows success/fail messages
     */
    contactForm: () => {
      (function () {
        "use strict";
        window.addEventListener(
          "load",
          function () {
            var forms = document.getElementsByClassName("needs-validation");
            var validation = Array.prototype.filter.call(
              forms,
              function (form) {
                form.addEventListener(
                  "submit",
                  function (event) {
                    if (form.checkValidity() == false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                    // Here you are going to add your ajax call after checking if the form validation is valid
                    if (form.checkValidity() === true) {
                      // To reset the appearance of the form (for instance, in the case of dynamic form submissions using AJAX), remove the .was-validated class from the <form> again after submission. (boostrap doc)
                      form.classList.remove("was-validated");
                      // we recieve the type of the message: success x danger and apply it to the
                      var messageAlert = "alert-success";
                      var messageText = "Başarı ile gönderildi.";
                      // let's compose Bootstrap alert box HTML
                      var alertBox =
                        '<div class="alert ' +
                        messageAlert +
                        ' alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                        messageText +
                        "</div>";
                      // If we have messageAlert and messageText
                      if (messageAlert && messageText) {
                        // inject the alert to .messages div in our form
                        $(".contact-form").find(".messages").html(alertBox);
                        // empty the form
                        // $(".contact-form")[0].reset();
                      }
                    }
                  },
                  false
                );
              }
            );
          },
          false
        );
      })();
    },
    /**
     * Pricing Switcher
     * Enables monthly/yearly switcher seen on pricing tables
     */
    pricingSwitcher: () => {
      $(".pricing-wrapper").each(function (i, container) {
        var $container = $(container);
        $container.find(".pricing-switcher").on("click", function () {
          $container
            .find(".pricing-switcher")
            .toggleClass("pricing-switcher-active");
          $container.find(".price").removeClass("price-hidden");
          $container.find(".price").toggleClass("price-show price-hide");
        });
      });
    },
    /**
     * Clipboard.js
     * Enables clipboard on docs
     * Requires assets/js/vendor/clipboard.min.js
     */
    codeSnippet: () => {
      var btnHtml =
        '<button type="button" class="btn btn-sm btn-white rounded-pill btn-clipboard">Copy</button>';
      document
        .querySelectorAll(".code-wrapper-inner")
        .forEach(function (element) {
          element.insertAdjacentHTML("beforebegin", btnHtml);
        });
      var clipboard = new ClipboardJS(".btn-clipboard", {
        target: function (trigger) {
          return trigger.nextElementSibling;
        },
      });
      clipboard.on("success", (event) => {
        event.trigger.textContent = "Copied!";
        event.clearSelection();
        setTimeout(() => {
          event.trigger.textContent = "Copy Image Code";
        }, 2000);
      });
      var copyIconCode = new ClipboardJS(".btn-copy-icon");
      copyIconCode.on("success", function (event) {
        event.clearSelection();
        event.trigger.textContent = "Copied!";
        window.setTimeout(function () {
          event.trigger.textContent = "Copy";
        }, 2300);
      });
    },
  };
  /**
   * Init theme core
   */
  theme.init();
})(jQuery);
