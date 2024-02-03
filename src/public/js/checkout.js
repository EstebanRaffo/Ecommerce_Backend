var stripe = Stripe('pk_test_51ObsjGGhUzvAkPicwPMvbMWeNAsYfufXKKleA6Jt36oEqDyYxmD8PnbTS0V149JnfUcHUwek0pS3OiI5sNMfGH8F00Q4sc6uxQ');
var elements = stripe.elements();

var style = {
    base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    }
};

var card = elements.create('card', { style: style });
card.mount('#card-element');

card.on('load', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    stripe.createToken(card).then(function (result) {
        if (result.error) {
            console.error(result.error.message);
            Swal.fire('Datos incorrectos', result.error.message, 'error');
        } else {
            document.getElementById('token').value = result.token.id;
            form.submit();
        }
    });
});