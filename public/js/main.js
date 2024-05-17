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
        transition: function (url) {
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
        })
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




async function addToWishlist(productId) {
    try {
        const response = await fetch(`/addwishlist/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
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
        const response = await fetch(`/removewishlist/${productId}`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from wishlist');
        }

        toggleWishlistButton(productId, false);
        displayRemoveMessage('Removed', 'Product removed from wishlist!');
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        displayErrorMessage('Error', 'Please Login');
    }
}

function toggleWishlistButton(productId, isInWishlist) {
    const addButton = document.querySelector(`button.add-from-wishlist[data-product-id="${productId}"]`);
    const removeButton = document.querySelector(`button.remove-to-wishlist[data-product-id="${productId}"]`);

    if (addButton && removeButton) {
        addButton.style.display = isInWishlist ? 'none' : 'block';
        removeButton.style.display = isInWishlist ? 'block' : 'none';
    }
}



function displaySuccessMessage(title, message) {
    swal({
        title: title,
        text: message,
        icon: 'success',
    });
}

function displayRemoveMessage(title, message) {
    swal({
        title: title,
        text: message,
        icon: 'error',
    });
}

function displayErrorMessage(title, message) {
    swal({
        title: title,
        text: message,
        icon: 'error',
    });
}


function EmptyWishlistSidebar(title) {
    Swal({
        title: title,
        showClass: {
            popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `
        },
        hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `
        }
    });

}

function propertyNotSelected(title) {
    Swal({
        title: title,
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
    });

}

function Login(title) {
    Swal.fire({
        title:title,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });

}

document.addEventListener('DOMContentLoaded', () => {
    const updateWishlistBtn = document.getElementById('update-wishlist-btn');

    updateWishlistBtn.addEventListener('click', async () => {
        try {
            await updateWishlistSidebar();
        } catch (error) {
            console.error('Error updating wishlist sidebar:', error);
        }
    });
});



async function updateWishlistSidebar() {
    console.log('Updating wishlist sidebar...');
    // Add logic here to fetch updated wishlist data and update UI
    // For testing, you can log messages or perform dummy UI updates
}

