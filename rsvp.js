// Submit the RSVP form to FormSubmit via AJAX so the page stays put and we can
// show the thank-you message in place.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('form.rsvp-form');
  if (!form) return;

  // The form's `action` points at the standard endpoint so the no-JS fallback
  // still works as a native POST. For fetch we use FormSubmit's AJAX endpoint
  // (formsubmit.co/ajax/<email>), which returns JSON with proper CORS headers.
  var ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

  var TIMEOUT_MS = 15000;

  // POST the form once, rejecting on non-2xx or timeout.
  function submitOnce() {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    return fetch(ajaxUrl, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
      signal: controller.signal
    }).then(function (response) {
      clearTimeout(timer);
      if (!response.ok) {
        throw new Error('FormSubmit responded with status ' + response.status);
      }
      return response;
    }, function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var submitButton = form.querySelector('#rsvp_submit');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    // Try once, then retry a single time on failure (covers flaky connections).
    submitOnce()
      .catch(function () { return submitOnce(); })
      .then(function () {
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
