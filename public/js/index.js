$(document).ready(function() {
    $('#fullpage').fullpage({
        autoScrolling: false,
        resize: false,
        css3: true
    });
    // $(".rotate").textrotator({
    //     animation: "dissolve", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
    //     separator: ",", // If you don't want commas to be the separator, you can define a new separator (|, &, * etc.) by yourself using this field.
    //     speed: 2000 // How many milliseconds until the next word show.
    // });
    // $('#subscribe_form').submit(function() {
    //     return false;
    // });
    // $('#subscribe_btn').click(function() {
    //     var email_id = $('#subscribe_email_field').val();
    //     if (email_id) {
    //         $.post('/subscribe', {
    //             email: email_id
    //         });
    //         $('#subscribe_form').fadeOut();
    //         $('#launching_soon').fadeOut(function() {
    //             $('#thank_you').fadeIn();
    //         });
    //     }
    // });
});