/**
 * NodeList.prototype.forEach() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
 */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// Mobile filter
const sidebarToggleBtn = document.querySelector(".menu-icon-wrapper");
const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.querySelector(".sidebar");

sidebarToggleBtn.onclick = () => {
    menuIcon.classList.toggle("menu-icon-active");
    sidebar.classList.toggle("sidebar_mobile-active");
};

// Show 3 more cards
const btnShowMoreCards = document.querySelector(".btn-more");
const hiddenCards = document.querySelectorAll(".card-link_hidden");

btnShowMoreCards.addEventListener("click", () => {
    hiddenCards.forEach((card) => {
        card.classList.remove("card-link_hidden");
    });
});

// Show/hide widgets
const widgets = document.querySelectorAll(".widget");

widgets.forEach((widget) => {
    widget.addEventListener("click", (e) => {
        if (e.target.classList.contains("widget__title")) {
            e.target.classList.toggle("widget__title_active");
            e.target.nextElementSibling.classList.toggle("widget__body_hidden");
        }
    });
});

/* Location Buttons */

const checkBoxAny = document.querySelector("#location-05");
const topLocationCheckboxes = document.querySelectorAll(
    "[data-location-param]"
);

/* Any button click */
checkBoxAny.addEventListener("change", () => {
    if (checkBoxAny.checked) {
        topLocationCheckboxes.forEach((item) => {
            item.checked = false;
        });
    }
});

/* Top buttons click */
topLocationCheckboxes.forEach((item) => {
    item.addEventListener("change", () => {
        if (checkBoxAny.checked) {
            checkBoxAny.checked = false;
        }
    });
});

/* Show more checkboxes in filter */
const showMoreOptionsBtn = document.querySelector(".widget__btn-show-hidden");
const hiddenCheckboxes = document.querySelectorAll(".checkbox_hidden");

showMoreOptionsBtn.onclick = () => {
    if (showMoreOptionsBtn.dataset.options == "hidden") {
        hiddenCheckboxes.forEach((item) => {
            item.style.display = "block";
        });
        showMoreOptionsBtn.innerText = "Hide additional options";
        showMoreOptionsBtn.dataset.options = "visible";
    } else if (showMoreOptionsBtn.dataset.options == "visible") {
        hiddenCheckboxes.forEach((item) => {
            item.style.display = "none";
        });
        showMoreOptionsBtn.innerText = "Show more options";
        showMoreOptionsBtn.dataset.options = "hidden";
    }
};
