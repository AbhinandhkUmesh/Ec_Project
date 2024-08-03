(function ($) {
    "use strict";

    // [ Load page ]
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
        transition: function (url) {
            window.location.href = url;
        }
    });

    // [ Back to top and Fixed Header ]
    $(window).on('scroll', _.debounce(function () {
        const windowH = $(window).height() / 2;
        $("#myBtn").css('display', $(this).scrollTop() > windowH ? 'flex' : 'none');

        const posWrapHeader = $('.top-bar').length > 0 ? $('.top-bar').height() : 0;
        const headerDesktop = $('.container-menu-desktop');
        const wrapMenu = $('.wrap-menu-desktop');

        if ($(this).scrollTop() > posWrapHeader) {
            headerDesktop.addClass('fix-menu-desktop');
            wrapMenu.css('top', 0);
        } else {
            headerDesktop.removeClass('fix-menu-desktop');
            wrapMenu.css('top', posWrapHeader - $(this).scrollTop());
        }
    }, 100));

    $('#myBtn').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 300);
    });

    // [ Menu mobile ]
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
    });

    // [ Filter / Search product ]
    $(document).ready(function () {
        $('#filterToggleBtn').on('click', function () {
            $('#filterPanel').toggle();
        });
    });

    // [ Wishlist ]
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
    });

    // [ Rating ]
    $('.wrap-rating').each(function () {
        const item = $(this).find('.item-rating');
        let rated = -1;
        const input = $(this).find('input');
        input.val(0);

        item.on('mouseenter', function () {
            const index = item.index(this);
            item.each(function (i) {
                $(this).toggleClass('zmdi-star', i <= index);
                $(this).toggleClass('zmdi-star-outline', i > index);
            });
        });

        item.on('click', function () {
            const index = item.index(this);
            rated = index;
            input.val(index + 1);
        });

        $(this).on('mouseleave', function () {
            item.each(function (i) {
                $(this).toggleClass('zmdi-star', i <= rated);
                $(this).toggleClass('zmdi-star-outline', i > rated);
            });
        });
    });

    // [ Show modal1 ]
    $('.js-show-modal1').on('click', function (e) {
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click', function () {
        $('.js-modal1').removeClass('show-modal1');
    });

    // Handle wishlist actions
    document.addEventListener('DOMContentLoaded', () => {
        const updateWishlistBtn = document.getElementById('update-wishlist-btn');

        if (updateWishlistBtn) {
            updateWishlistBtn.addEventListener('click', async () => {
                try {
                    await updateWishlistSidebar();
                } catch (error) {
                    console.error('Error updating wishlist sidebar:', error);
                }
            });
        }
    });

    async function updateWishlistSidebar() {
        try {
            const response = await fetch('/wishlist-data');
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist data');
            }
            const data = await response.json();
            // Update the UI with the fetched data
            console.log('Wishlist data updated:', data);
        } catch (error) {
            console.error('Error updating wishlist sidebar:', error);
        }
    }

    async function addToWishlist(productId) {
        try {
            const response = await fetch(`/addwishlist/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to add product to wishlist');
            }

            toggleWishlistButton(productId, true);
            displaySuccessMessage('Added', 'Product added to wishlist!');
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
            displayErrorMessage('Error', 'Please Login');
        }
    }

    async function removeFromWishlist(productId) {
        try {
            const response = await fetch(`/removewishlist/${productId}`, { method: 'PUT' });

            if (!response.ok) {
                throw new Error('Failed to remove product from wishlist');
            }

            toggleWishlistButton(productId, false);
            displaySuccessMessage('Removed', 'Product removed from wishlist!');
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            displayErrorMessage('Error', 'Please Login');
        }
    }

    function toggleWishlistButton(productId, isInWishlist) {
        const addButton = document.querySelector(`button.add-to-cart[data-product-id="${productId}"]`);
        const removeButton = document.querySelector(`button.remove-from-wishlist[data-product-id="${productId}"]`);

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
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login'; // Adjust the URL as needed
            }
        });
    }

})(jQuery);
