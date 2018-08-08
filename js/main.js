// Add custom JS here
$(function() {
    $('a[rel=popover]').popover({
            trigger: "manual",
            html: true,
            // animation: false,
            container: '.bd-content',
            placement: 'auto',
            // positionFixed: 'true',
            // preventOverflow: { enabled: false}, hide: { enabled: false},
            content: function() { return '<img class="limit-size" src="' + $(this).data('img') + '" />'; }
        })
        .on("mouseenter", function() {
            var _this = this;
            $(this).popover("show");
            $(".popover").on("mouseleave", function() {
                $(_this).popover('hide');
            });
        }).on("mouseleave", function() {
            var _this = this;
            setTimeout(function() {
                if (!$(".popover:hover").length) {
                    $(_this).popover("hide");
                }
            }, 300);
        });

    $('a[rel=popover]').popover("show");
    $('a[rel=popover]').popover("hide");

    $("#send_msg").click(function() {
        if ($("#agreePolicy").is(":checked")) {
            getGeo(function(data){
                $.extend( data, {
                    'message': $("#m-msg").val(),
                    'name': $("#m-name").val(),
                    'mail': $("#m-mail").val(),
                    'phone': $("#m-phone").val(),
                });
            });
        }
    });
});