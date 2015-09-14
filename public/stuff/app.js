$(function () {

    var $link = $("#maglink");
    var $title = $("#title");
    var $submit = $("#submit");
    var $msgbox = $("#msgbox p");

    $msgbox.hide();

    $link.on('change', function (event) {

        var $this = $(this);

        var obj = {};
        var title = '';
        var str = $this.val();

        str = decodeURIComponent(str);
        obj = $.deparam(str);

        title = obj.dn || '';

        title = title.replace(/\./g, ' ');
        title = title.replace(/(\d{4}).*/, '($1)');

        $title.val(title);

    });


    $submit.on('click', function () {

        $msgbox.hide();

        var link = $link.val();
        var title = $title.val();

        if (!link) {
            _error('Link not specified');
            return;
        }

        if (!title) {
            _error('Title not specified');
            return;
        }

        _busy();

        $.ajax({
            url: '/movie',
            type: 'POST',
            dataType: 'json',
            data: {
                link: link,
                title: title
            }
        }).done(function (res) {

            console.log(res);

            if (res.error) {
                _error(res.error.msg);
            } else if (res.ok) {
                _success(res.ok.msg);
            }

        }).fail(function (res) {

            console.error(res);

        }).always(function () {
            _ready();
        });

    });

    function _error(what) {
        $msgbox.text(what)
            .addClass('text-danger')
            .removeClass('text-success')
            .show();
    }

    function _success(what) {
        $msgbox.text(what)
            .addClass('text-success')
            .removeClass('text-danger')
            .show();
    }

    function _busy() {
        $submit.addClass('busy');
        $submit.attr('disabled', true);
    }

    function _ready() {
        $submit.removeClass('busy');
        $submit.attr('disabled', false);
    }


});
