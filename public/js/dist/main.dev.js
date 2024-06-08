"use strict";

(function ($) {
  "use strict";
  /*[ Load page ]
  ===========================================================*/

  $(".animsition").animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 1500,
    outDuration: 800,
    linkElement: '.animsition-link',
    loading: true,
    loadingParentElement: 'html',
    loadingClass: 'animsition-loading-1',
    loadingInner: '<div class="loader05"></div>',
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ['animation-duration', '-webkit-animation-duration'],
    overlay: false,
    overlayClass: 'animsition-overlay-slide',
    overlayParentElement: 'html',
    transition: function transition(url) {
      window.location.href = url;
    }
  });
  /*[ Back to top ]
  ===========================================================*/

  var windowH = $(window).height() / 2;
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > windowH) {
      $("#myBtn").css('display', 'flex');
    } else {
      $("#myBtn").css('display', 'none');
    }
  });
  $('#myBtn').on("click", function () {
    $('html, body').animate({
      scrollTop: 0
    }, 300);
  });
  /*==================================================================
  [ Fixed Header ]*/

  var headerDesktop = $('.container-menu-desktop');
  var wrapMenu = $('.wrap-menu-desktop');

  if ($('.top-bar').length > 0) {
    var posWrapHeader = $('.top-bar').height();
  } else {
    var posWrapHeader = 0;
  }

  if ($(window).scrollTop() > posWrapHeader) {
    $(headerDesktop).addClass('fix-menu-desktop');
    $(wrapMenu).css('top', 0);
  } else {
    $(headerDesktop).removeClass('fix-menu-desktop');
    $(wrapMenu).css('top', posWrapHeader - $(this).scrollTop());
  }

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > posWrapHeader) {
      $(headerDesktop).addClass('fix-menu-desktop');
      $(wrapMenu).css('top', 0);
    } else {
      $(headerDesktop).removeClass('fix-menu-desktop');
      $(wrapMenu).css('top', posWrapHeader - $(this).scrollTop());
    }
  });
  /*==================================================================
  [ Menu mobile ]*/

  $('.btn-show-menu-mobile').on('click', function () {
    $(this).toggleClass('is-active');
    $('.menu-mobile').slideToggle();
  });
  var arrowMainMenu = $('.arrow-main-menu-m');

  for (var i = 0; i < arrowMainMenu.length; i++) {
    $(arrowMainMenu[i]).on('click', function () {
      $(this).parent().find('.sub-menu-m').slideToggle();
      $(this).toggleClass('turn-arrow-main-menu-m');
    });
  }

  $(window).resize(function () {
    if ($(window).width() >= 992) {
      if ($('.menu-mobile').css('display') == 'block') {
        $('.menu-mobile').css('display', 'none');
        $('.btn-show-menu-mobile').toggleClass('is-active');
      }

      $('.sub-menu-m').each(function () {
        if ($(this).css('display') == 'block') {
          console.log('hello');
          $(this).css('display', 'none');
          $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
        }
      });
    }
  });
  /*==================================================================
  [ Show / hide modal search ]*/

  $('.js-show-modal-search').on('click', function () {
    $('.modal-search-header').addClass('show-modal-search');
    $(this).css('opacity', '0');
  });
  $('.js-hide-modal-search').on('click', function () {
    $('.modal-search-header').removeClass('show-modal-search');
    $('.js-show-modal-search').css('opacity', '1');
  });
  $('.container-search-header').on('click', function (e) {
    e.stopPropagation();
  });
  /*==================================================================
  [ Filter / Search product ]*/

  $(document).ready(function () {
    // Toggle filter panel visibility on button click
    $('#filterToggleBtn').on('click', function () {
      $('#filterPanel').toggle(); // Toggle visibility of the filter panel
    });
  });
  /*==================================================================
  [ wishlist ]*/

  $('.js-show-wishlist').on('click', function () {
    $('.js-panel-wishlist').addClass('show-header-wishlist');
  });
  $('.js-hide-wishlist').on('click', function () {
    $('.js-panel-wishlist').removeClass('show-header-wishlist');
  });
  /*==================================================================
  [ wishlist ]*/

  $('.js-show-sidebar').on('click', function () {
    $('.js-sidebar').addClass('show-sidebar');
  });
  $('.js-hide-sidebar').on('click', function () {
    $('.js-sidebar').removeClass('show-sidebar');
  });
  /*==================================================================
  [ +/- num product ]*/

  /*==================================================================
  [ Rating ]*/

  $('.wrap-rating').each(function () {
    var item = $(this).find('.item-rating');
    var rated = -1;
    var input = $(this).find('input');
    $(input).val(0);
    $(item).on('mouseenter', function () {
      var index = item.index(this);
      var i = 0;

      for (i = 0; i <= index; i++) {
        $(item[i]).removeClass('zmdi-star-outline');
        $(item[i]).addClass('zmdi-star');
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass('zmdi-star-outline');
        $(item[j]).removeClass('zmdi-star');
      }
    });
    $(item).on('click', function () {
      var index = item.index(this);
      rated = index;
      $(input).val(index + 1);
    });
    $(this).on('mouseleave', function () {
      var i = 0;

      for (i = 0; i <= rated; i++) {
        $(item[i]).removeClass('zmdi-star-outline');
        $(item[i]).addClass('zmdi-star');
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass('zmdi-star-outline');
        $(item[j]).removeClass('zmdi-star');
      }
    });
  });
  /*==================================================================
  [ Show modal1 ]*/

  $('.js-show-modal1').on('click', function (e) {
    e.preventDefault();
    $('.js-modal1').addClass('show-modal1');
  });
  $('.js-hide-modal1').on('click', function () {
    $('.js-modal1').removeClass('show-modal1');
  });
})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
  // Add to Wishlist button click handler
  document.querySelectorAll('button.add-to-cart').forEach(function (button) {
    button.addEventListener('click', function () {
      var productId = this.getAttribute('data-product-id');
      addToCart(productId);
    });
  }); // Remove from Wishlist button click handler

  document.querySelectorAll('button.remove-from-wishlist').forEach(function (button) {
    button.addEventListener('click', function () {
      var productId = this.getAttribute('data-product-id');
      removeFromWishlist(productId);
    });
  });
});

function addToWishlist(productId) {
  var response;
  return regeneratorRuntime.async(function addToWishlist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("/addwishlist/".concat(productId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Failed to add product to wishlist');

        case 6:
          toggleWishlistButton(productId, true);
          displaySuccessMessage('Added', 'Product added to wishlist!');
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Error adding product to wishlist:', _context.t0);
          displayErrorMessage('Error', 'Please Login');

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function removeFromWishlist(productId) {
  var response;
  return regeneratorRuntime.async(function removeFromWishlist$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("/removewishlist/".concat(productId), {
            method: 'PUT'
          }));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error('Failed to remove product from wishlist');

        case 6:
          toggleWishlistButton(productId, false);
          displayRemoveMessage('Removed', 'Product removed from wishlist!');
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error removing product from wishlist:', _context2.t0);
          displayErrorMessage('Error', 'Please Login');

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function toggleWishlistButton(productId, isInWishlist) {
  var addButton = document.querySelector("button.add-to-cart[data-product-id=\"".concat(productId, "\"]"));
  var removeButton = document.querySelector("button.remove-from-wishlist[data-product-id=\"".concat(productId, "\"]"));

  if (addButton && removeButton) {
    addButton.style.display = isInWishlist ? 'none' : 'block';
    removeButton.style.display = isInWishlist ? 'block' : 'none';
  }
}

function displaySuccessMessage(title, message) {
  swal({
    title: title,
    text: message,
    icon: 'success'
  });
}

function displayRemoveMessage(title, message) {
  swal({
    title: title,
    text: message,
    icon: 'error'
  });
}

function displayErrorMessage(title, message) {
  swal({
    title: title,
    text: message,
    icon: 'error'
  });
}

function EmptyWishlistSidebar(title) {
  Swal({
    title: title,
    showClass: {
      popup: "\n        animate__animated\n        animate__fadeInUp\n        animate__faster\n      "
    },
    hideClass: {
      popup: "\n        animate__animated\n        animate__fadeOutDown\n        animate__faster\n      "
    }
  });
}

function propertyNotSelected(title) {
  Swal({
    title: title,
    showClass: {
      popup: "\n            animate__animated\n            animate__fadeInUp\n            animate__faster\n          "
    },
    hideClass: {
      popup: "\n            animate__animated\n            animate__fadeOutDown\n            animate__faster\n          "
    }
  });
}

function Login(title) {
  Swal.fire({
    title: title,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(function (result) {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var updateWishlistBtn = document.getElementById('update-wishlist-btn');
  updateWishlistBtn.addEventListener('click', function _callee() {
    return regeneratorRuntime.async(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(updateWishlistSidebar());

          case 3:
            _context3.next = 8;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3["catch"](0);
            console.error('Error updating wishlist sidebar:', _context3.t0);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 5]]);
  });
});

function updateWishlistSidebar() {
  return regeneratorRuntime.async(function updateWishlistSidebar$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('Updating wishlist sidebar...'); // Add logic here to fetch updated wishlist data and update UI
          // For testing, you can log messages or perform dummy UI updates

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
} // ======================================================