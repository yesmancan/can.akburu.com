function getSearchQuery(query) {
  const params = location.search.substring(1).split("&");
  for (let i = 0; i < params.length; i++) {
    const element = params[i].split("=");
    if (element[0] === query) return decodeURIComponent(element[1]);
  }

  return "";
}

let trOk = false;
let enOk = false;
function showTr() {
  if (getSearchQuery("lang") == "tr") {
    const langs = document.querySelectorAll(".lang-en");
    if (langs) {
      langs.forEach((x) => x.classList.remove("d-none"));
      trOk = true;
    }
  }
}
function showEn() {
  if (getSearchQuery("lang") == "en") {
    const langs = document.querySelectorAll(".lang-tr");
    if (langs) {
      langs.forEach((x) => x.classList.remove("d-none"));
      enOk = true;
    }
  }
}
function showLanguage() {
  showTr();
  showEn();

  if ((!trOk && !enOk) || (trOk && enOk)) {
    const langs = document.querySelectorAll(".lang-en");
    if (langs) {
      langs.forEach((x) => x.classList.remove("d-none"));
    }
  }
}
function addAllLinkAndQuery() {
  let allLink = [...document.querySelectorAll("a[href]")];
  if (allLink) {
    allLink = allLink.filter(
      (x) => x.href.indexOf("#") == -1 && x.href.indexOf("?lang=") == -1
    );
    for (let i = 0; i < allLink.length; i++) {
      let element = allLink[i];
      element.href = element.href + location.search;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  showLanguage();
  addAllLinkAndQuery();
  const langEn = document.querySelector(".nav-link.d-none.lang-tr");
  const contactLink = document.querySelector(".nav-link.contact-link");
  if (langEn && contactLink.innerText == "Contact Us") {
    window.location.href = window.location.href + "?lang=tr";
  }
});
