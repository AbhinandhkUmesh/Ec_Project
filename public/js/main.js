
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
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }
    

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    }  
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        }  
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({filter: filterValue});
        });
        
    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine : 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    /*==================================================================
    [ Filter / Search product ]*/
    




    /*==================================================================
    [ wishlist ]*/
    $('.js-show-wishlist').on('click',function(){
        $('.js-panel-wishlist').addClass('show-header-wishlist');
    });

    $('.js-hide-wishlist').on('click',function(){
        $('.js-panel-wishlist').removeClass('show-header-wishlist');
    });

    /*==================================================================
    [ wishlist ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click',function(e){
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click',function(){
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
        displayErrorMessage('Error', 'Failed to add product to wishlist');
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
        displayErrorMessage('Error', 'Failed to remove product from wishlist');
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



    // async function updateWishlistSidebar() {
    //     try {
    //         const response = await fetch('/getwishlist'); // Modify URL if needed
    //         const data = await response.json();
    //         const wishlistContainer = document.getElementById('wishlist-items-container');
    //         if (wishlistContainer) {
    //             wishlistContainer.innerHTML = generateWishlistHTML(data.wishlist);
    //         }
    //     } catch (error) {
    //         console.error('Error updating wishlist sidebar:', error);
    //     }
    // }

    // function generateWishlistHTML(wishlist) {
    //     if (!wishlist || wishlist.length === 0) {
    //         return '<p>Your wishlist is empty</p>';
    //     }

    //     const itemsHTML = wishlist.map(item => {
    //         return `
    //             <div class="wishlist-item">
    //                 <img src="/images/${item.image}" alt="Product Image">
    //                 <p>${item.name}</p>
    //                 <span>$${item.rate}</span>
    //             </div>
    //         `;
    //     }).join('');

    //     return itemsHTML;
    // }

    // // Example: Call updateWishlistSidebar() when the page loads
    // window.addEventListener('DOMContentLoaded', () => {
    //     updateWishlistSidebar();
    // });

