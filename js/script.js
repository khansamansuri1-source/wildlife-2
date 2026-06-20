jQuery(document).ready(function ($) {
    'use strict';

    //===== Menu Active =====//
    var pgurl = window.location.href.substr(window.location.href.lastIndexOf("https://html.webgff.com/") + 1);
    $("nav ul li a").each(function () {
	if ($(this).attr("href") == pgurl || $(this).attr("href") == '')
	    $(this).parent('li').addClass("active");
    });

    //===== Top Bar contact Toggle =====//
    $('.topbar-contact > li:first-child').addClass('active');
    $('.topbar-contact > li').on('click', function () {
	$(this).parent().find('li').removeClass('active');
	$(this).addClass('active');
	return false;
    });

    //===== Responsive Header =====//
    $('.menu-btn').on('click', function () {
	$('.responsive-menu').addClass('slidein');
	return false;
    });
    $('.close-btn').on('click', function () {
	$('.responsive-menu').removeClass('slidein');
	return false;
    });
    $('.responsive-menu li.menu-item-has-children > i').on('click', function () {
	$(this).parent().siblings().children('ul').slideUp();
	$(this).parent().siblings().removeClass('active');
	$(this).parent().children('ul').slideToggle();
	$(this).parent().toggleClass('active');
	return false;
    });

    //===== Paackages Script =====//
    $('.location-book > li:first-child').addClass('active');
    $('div.Rooms  ul.location-book li').each(function () {
	var $this = $(this);
	$(this).on('mouseenter', function () {
	    var parent = $($this).parent('ul');
	    $(parent).find('li').each(function () {
		$(this).removeClass('active');
	    });
	    $(this).addClass('active');
	});
    });

    //===== Sticky Header =====// 
    var menu_height = $('header').height();
    var updateLuxuryHeader = function () {
	var scroll = $(window).scrollTop();
	if (scroll >= 40) {
	    $('header, .responsive-header').addClass('luxury-scrolled');
	} else {
	    $('header, .responsive-header').removeClass('luxury-scrolled');
	}
    };
    $(window).scroll(function () {
	var scroll = $(window).scrollTop();
	if (scroll >= 60) {
	    $('.stick').addClass('sticky');
	} else {
	    $('.stick').removeClass('sticky');
	}
	updateLuxuryHeader();
    });
    updateLuxuryHeader();
    if ($('header').hasClass('stick')) {
	$('.theme-layout').css({'padding-top': menu_height});
    }

    //===== Select2 =====//
    if ($.isFunction($.fn.select2)) {
	$('select').select2();
    }

    //===== Scroll Bar =====//
    if ($.isFunction($.fn.perfectScrollbar)) {
	$('.responsive-menu').perfectScrollbar();
    }

    //===== Parallax =====//
    if ($.isFunction($.fn.scrolly)) {
	$('.parallax').scrolly({bgParallax: true});
    }

    //===== Ajax Contact Form =====//
    $('#contactform').submit(function () {
       var action = $(this).attr('action');
       var msg = $('#message');
       $(msg).hide();
       if (!action || action === '#') {
          $(msg).empty();
          $(msg).html('<div class="alert alert-success">Thank you. Your inquiry is ready to be shared with Wildlife Gir Resort. Please call or WhatsApp us for the fastest confirmation.</div>');
          $('#message').slideDown('slow');
          return false;
       }
       var data = 'name=' + $('#name').val() + '&email=' + $('#email').val() + '&phone=' + $('#phone').val() + '&comments=' + $('#comments').val() + '&verify=' + $('#verify').val() + '&captcha=' + $(".g-recaptcha-response").val();
       $.ajax({
           type: 'POST',
           url: action,
           data: data,
           beforeSend: function () {
              $('#submit').attr('disabled', true);
              $('img.loader').fadeIn('slow');
          },
          success: function (data) {
              $('#submit').attr('disabled', false);
              $('img.loader').fadeOut('slow');
              $(msg).empty();
              $(msg).html(data);
              $('#message').slideDown('slow');
              if (data.indexOf('success') > 0) {
                  $('#contactform').slideUp('slow');
              }
          }
      });
       return false;
   });

    //===== Sponsor Carousel =====//
    if ($.isFunction($.fn.owlCarousel)) {
	$('.sponsor-carousel').owlCarousel({
	    autoplay: true,
	    smartSpeed: 600,
	    loop: true,
	    items: 5,
	    dots: false,
	    slideSpeed: 2000,
	    nav: true,
	    margin: 30,
	    responsive: {
		0: {items: 2},
		480: {items: 3},
		768: {items: 4},
		1200: {items: 5}
	    }
	});
    }

    //===== Luxury Testimonial Carousel =====//
    if ($.isFunction($.fn.owlCarousel)) {
	$('.luxury-testimonial-slider').owlCarousel({
	    autoplay: true,
	    autoplayTimeout: 4200,
	    smartSpeed: 900,
	    loop: true,
	    dots: true,
	    nav: true,
	    margin: 20,
	    items: 1,
	    animateIn: 'fadeIn',
	    animateOut: 'fadeOut',
	    responsive: {
		0: {nav: true},
		768: {nav: true}
	    }
	});
    }

    //===== Smooth Anchor Scroll =====//
    $(document).on('click', 'a[href^="#"]', function (event) {
	var href = this.getAttribute('href');
	if (!href || href.length <= 1) {
	    return;
	}
	var target = $(href);
	if (target.length) {
	    event.preventDefault();
	    var targetTop = target[0].getBoundingClientRect().top + window.pageYOffset - 72;
	    if ('scrollBehavior' in document.documentElement.style) {
		window.scrollTo({top: targetTop, behavior: 'smooth'});
	    } else {
		$('html, body').stop().animate({
		    scrollTop: targetTop
		}, 750);
	    }
	}
    });

    //===== AOS Reveal =====//
    if (window.AOS) {
	AOS.init({
	    duration: 780,
	    easing: 'ease-out-cubic',
	    once: true,
	    offset: 90
	});
    } else {
	$('[data-aos]').addClass('aos-animate');
    }

    //===== Gallery Lightbox =====//
    var $lightbox = $('<div class="luxury-lightbox" aria-hidden="true"><button type="button" class="luxury-lightbox-close" aria-label="Close gallery image">&times;</button><img src="" alt="" /></div>');
    $('body').append($lightbox);

    var closeLightbox = function () {
	$lightbox.removeClass('active').attr('aria-hidden', 'true');
	$('body').removeClass('luxury-lightbox-open');
    };

    $('.luxury-gallery-grid .gallery-item, .luxury-masonry-item').attr({
	role: 'button',
	tabindex: '0'
    });

    $('.luxury-gallery-grid .gallery-item, .luxury-masonry-item').on('click keypress', function (event) {
	if (event.type === 'keypress' && event.which !== 13 && event.which !== 32) {
	    return;
	}
	var $img = $(this).find('img').first();
	if (!$img.length) {
	    return;
	}
	event.preventDefault();
	$lightbox.find('img').attr({
	    src: $img.attr('src'),
	    alt: $img.attr('alt') || ''
	});
	$lightbox.addClass('active').attr('aria-hidden', 'false');
	$('body').addClass('luxury-lightbox-open');
    });

    $lightbox.on('click', function (event) {
	if ($(event.target).is('.luxury-lightbox, .luxury-lightbox-close')) {
	    closeLightbox();
	}
    });

    $(document).on('keyup', function (event) {
	if (event.key === 'Escape') {
	    closeLightbox();
	}
    });
});/*========== Document Ready Function Ends Here ==========*/

// Native anchor fallback for the legacy template stack.
(function () {
    'use strict';

    function applyImageFallback(image) {
	if (!image || image.getAttribute('data-fallback-applied') === 'true') {
	    return;
	}
	image.setAttribute('data-fallback-applied', 'true');
	image.className += (image.className ? ' ' : '') + 'luxury-image-fallback';
	image.src = image.getAttribute('data-fallback-src') || 'images/resource/featured-img1.jpg';
    }

    function bindImageFallbacks() {
	var images = document.querySelectorAll('img');
	for (var i = 0; i < images.length; i++) {
	    images[i].addEventListener('error', function () {
		applyImageFallback(this);
	    });
	    if (images[i].complete && images[i].naturalWidth === 0) {
		applyImageFallback(images[i]);
	    }
	}
    }

    if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bindImageFallbacks);
    } else {
	bindImageFallbacks();
    }

    document.addEventListener('click', function (event) {
	var trigger = event.target.closest ? event.target.closest('a[href^="#"]') : null;
	if (!trigger) {
	    return;
	}

	var href = trigger.getAttribute('href');
	if (!href || href.length <= 1) {
	    return;
	}

	var target;
	try {
	    target = document.querySelector(href);
	} catch (error) {
	    target = null;
	}

	if (!target) {
	    return;
	}

	event.preventDefault();
	var targetTop = target.getBoundingClientRect().top + window.pageYOffset - 72;
	window.scrollTo({top: targetTop, behavior: 'smooth'});
    }, true);
}());
