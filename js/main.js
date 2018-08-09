// Add custom JS here
$(function() {
    msgInput = $('#m-msg');
    $('a[rel=popover]').popover({
            trigger: 'manual',
            html: true,
            // animation: false,
            container: '.bd-content',
            placement: 'auto',
            // positionFixed: 'true',
            // preventOverflow: { enabled: false}, hide: { enabled: false},
            content: function() { return '<img class="limit-size" src="" + $(this).data("img") + "" />'; }
        })
        .on('mouseenter', function() {
            var _this = this;
            $(this).popover('show');
            $('.popover').on('mouseleave', function() {
                $(_this).popover('hide');
            });
        }).on('mouseleave', function() {
            var _this = this;
            setTimeout(function() {
                if (!$('.popover:hover').length) {
                    $(_this).popover('hide');
                }
            }, 300);
        });

    $('a[rel=popover]').popover('show');
    $('a[rel=popover]').popover('hide');

    $('#send_msg').click(function() {
        if (!msgInput.val()) {
            msgInput.addClass('invalid');
            return;
        }
        getGeo(function(data) {
            $.extend(data, {
                'message': msgInput.val(),
                'name': $('#m-name').val(),
                'mail': $('#m-mail').val(),
                'phone': $('#m-phone').val(),
                'agreePolicy': $('#agreePolicy').is(':checked'),
            });
            send_msg(data);
            $('#msgModal').modal('hide')
        });
    });

    $('#msgModal').on('hidden.bs.modal', function(e) {
        msgInput.removeClass('invalid');
        $(':input').val('');
    })
});