"use strict";

(function ($) {
  "use strict"; // [ Load page ]

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
  }); // [ Back to top and Fixed Header ]

  $(window).on('scroll', _.debounce(function () {
    var windowH = $(window).height() / 2;
    $("#myBtn").css('display', $(this).scrollTop() > windowH ? 'flex' : 'none');
    var posWrapHeader = $('.top-bar').length > 0 ? $('.top-bar').height() : 0;
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if ($(this).scrollTop() > posWrapHeader) {
      headerDesktop.addClass('fix-menu-desktop');
      wrapMenu.css('top', 0);
    } else {
      headerDesktop.removeClass('fix-menu-desktop');
      wrapMenu.css('top', posWrapHeader - $(this).scrollTop());
    }
  }, 100));
  $('#myBtn').on("click", function () {
    $('html, body').animate({
      scrollTop: 0
    }, 300);
  }); // [ Menu mobile ]

  $('.btn-show-menu-mobile').on('click', function () {
    $(this).toggleClass('is-active');
    $('.menu-mobile').slideToggle();
  });
  $('.arrow-main-menu-m').on('click', function () {
    $(this).parent().find('.sub-menu-m').slideToggle();
    $(this).toggleClass('turn-arrow-main-menu-m');
  });
  $(window).resize(function () {
    if ($(window).width() >= 992) {
      if ($('.menu-mobile').is(':visible')) {
        $('.menu-mobile').hide();
        $('.btn-show-menu-mobile').removeClass('is-active');
      }

      $('.sub-menu-m').each(function () {
        if ($(this).is(':visible')) {
          $(this).hide();
          $('.arrow-main-menu-m').removeClass('turn-arrow-main-menu-m');
        }
      });
    }
  }); // [ Filter / Search product ]

  $(document).ready(function () {
    $('#filterToggleBtn').on('click', function () {
      $('#filterPanel').toggle();
    });
  }); // [ Wishlist ]

  $('.js-show-wishlist').on('click', function () {
    $('.js-panel-wishlist').addClass('show-header-wishlist');
  });
  $('.js-hide-wishlist').on('click', function () {
    $('.js-panel-wishlist').removeClass('show-header-wishlist');
  });
  $('.js-show-sidebar').on('click', function () {
    $('.js-sidebar').addClass('show-sidebar');
  });
  $('.js-hide-sidebar').on('click', function () {
    $('.js-sidebar').removeClass('show-sidebar');
  }); // [ Rating ]

  $('.wrap-rating').each(function () {
    var item = $(this).find('.item-rating');
    var rated = -1;
    var input = $(this).find('input');
    input.val(0);
    item.on('mouseenter', function () {
      var index = item.index(this);
      item.each(function (i) {
        $(this).toggleClass('zmdi-star', i <= index);
        $(this).toggleClass('zmdi-star-outline', i > index);
      });
    });
    item.on('click', function () {
      var index = item.index(this);
      rated = index;
      input.val(index + 1);
    });
    $(this).on('mouseleave', function () {
      item.each(function (i) {
        $(this).toggleClass('zmdi-star', i <= rated);
        $(this).toggleClass('zmdi-star-outline', i > rated);
      });
    });
  }); // [ Show modal1 ]

  $('.js-show-modal1').on('click', function (e) {
    e.preventDefault();
    $('.js-modal1').addClass('show-modal1');
  });
  $('.js-hide-modal1').on('click', function () {
    $('.js-modal1').removeClass('show-modal1');
  }); // Handle wishlist actions

  document.addEventListener('DOMContentLoaded', function () {
    var updateWishlistBtn = document.getElementById('update-wishlist-btn');

    if (updateWishlistBtn) {
      updateWishlistBtn.addEventListener('click', function _callee() {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return regeneratorRuntime.awrap(updateWishlistSidebar());

              case 3:
                _context.next = 8;
                break;

              case 5:
                _context.prev = 5;
                _context.t0 = _context["catch"](0);
                console.error('Error updating wishlist sidebar:', _context.t0);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[0, 5]]);
      });
    }
  });

  function updateWishlistSidebar() {
    var response, data;
    return regeneratorRuntime.async(function updateWishlistSidebar$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetch('/wishlist-data'));

          case 3:
            response = _context2.sent;

            if (response.ok) {
              _context2.next = 6;
              break;
            }

            throw new Error('Failed to fetch wishlist data');

          case 6:
            _context2.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            data = _context2.sent;
            // Update the UI with the fetched data
            console.log('Wishlist data updated:', data);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            console.error('Error updating wishlist sidebar:', _context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }

  function addToWishlist(productId) {
    var response;
    return regeneratorRuntime.async(function addToWishlist$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(fetch("/addwishlist/".concat(productId), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              }
            }));

          case 3:
            response = _context3.sent;

            if (response.ok) {
              _context3.next = 6;
              break;
            }

            throw new Error('Failed to add product to wishlist');

          case 6:
            toggleWishlistButton(productId, true);
            displaySuccessMessage('Added', 'Product added to wishlist!');
            _context3.next = 14;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            console.error('Error adding product to wishlist:', _context3.t0);
            displayErrorMessage('Error', 'Please Login');

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }

  function removeFromWishlist(productId) {
    var response;
    return regeneratorRuntime.async(function removeFromWishlist$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(fetch("/removewishlist/".concat(productId), {
              method: 'PUT'
            }));

          case 3:
            response = _context4.sent;

            if (response.ok) {
              _context4.next = 6;
              break;
            }

            throw new Error('Failed to remove product from wishlist');

          case 6:
            toggleWishlistButton(productId, false);
            displaySuccessMessage('Removed', 'Product removed from wishlist!');
            _context4.next = 14;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error('Error removing product from wishlist:', _context4.t0);
            displayErrorMessage('Error', 'Please Login');

          case 14:
          case "end":
            return _context4.stop();
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

  function displaySuccessMessage(title, text) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
      }
    });
  }

  function displayErrorMessage(title, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error'
    });
  }

  function emptyWishlist(title) {
    Swal.fire({
      title: title,
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
      }
    });
  }

  function propertyNotSelected(title) {
    Swal.fire({
      title: title,
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
      }
    });
  }

  function login(title) {
    Swal.fire({
      title: title,
      text: "You need to be logged in to add items to the cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
      cancelButtonText: "Cancel"
    }).then(function (result) {
      if (result.isConfirmed) {
        window.location.href = '/login'; // Adjust the URL as needed
      }
    });
  }
})(jQuery);