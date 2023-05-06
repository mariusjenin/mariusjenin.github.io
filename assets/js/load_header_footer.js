$(document).ready(function(){
    $("#header_container").load("html_data/header.html");
    $("#footer_container").load("html_data/footer.html", function() {
        var m_body = $('.ms-footer').height();
        $('.ms-main').css('margin-bottom', m_body);
        $(window).on("resize", function() {
            var m_body = $('.ms-footer').height();
            $('.ms-main').css('margin-bottom', m_body);
        });
    });
});