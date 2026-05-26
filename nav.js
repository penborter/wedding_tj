// Close the narrow-screen hamburger menu after a nav link is tapped.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('nav-toggle');
  if (!toggle) return;

  document.querySelectorAll('nav.show #nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.checked = false;
    });
  });
});
