$(document).ready(function () {

    $("#fadeInBtn").click(function () {
        $(".event-card").fadeIn(1000);
    });

    $("#fadeOutBtn").click(function () {
        $(".event-card").fadeOut(1000);
    });

    $("#registerBtn").click(function () {
        $("#message").text("Successfully registered for Music Fest!");
    });

});