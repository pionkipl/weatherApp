let helper = document.querySelector(".helper");

window.addEventListener("resize", resize);

function resize() {
  let w = window.innerWidth;
  if (w >= 1800) {
    helper.innerText = "big-desktop";
  } else if (w > 1000 && w <= 1200) {
    helper.innerText = "tab-land";
  } else if (w > 767 && w <= 1000) {
    helper.innerText = "tab-port";
  } else if (w > 600 && w <= 767) {
    helper.innerText = "phone-big";
  } else if (w <= 600) {
    helper.innerText = "phone";
  } else {
    helper.innerText = "desktop";
  }
}

resize();
