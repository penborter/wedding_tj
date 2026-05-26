// Submit the RSVP form to FormSubmit via AJAX so the page stays put and we can
// show the thank-you message in place.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('form.rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var submitButton = form.querySelector('#rsvp_submit');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (response) {
        // We don't need the response body — a 2xx means FormSubmit accepted it.
        if (!response.ok) {
          throw new Error('FormSubmit responded with status ' + response.status);
        }

        var elements = form.querySelector('.form-elements');
        if (elements) elements.style.display = 'none';

        var thankYou = form.querySelector('.thankyou_message');
        if (thankYou) thankYou.style.display = 'block';

        var welcome = document.querySelector('p.welcome');
        if (welcome) welcome.style.display = 'none';
      })
      .catch(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'RSVP!';
        }
        alert('Sorry, something went wrong sending your RSVP. Please try again, or reach out to us directly.');
      });
  });
});
