'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PRELOADER
 *
 * preloader will be visible until document load
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * MOBILE NAVBAR
 *
 * show the mobile navbar when click menu button
 * and hidden after click menu close button or overlay
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);



/**
 * HEADER & BACK TOP BTN
 *
 * active header & back top btn when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 0) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);

window.addEventListener("load", revealElementOnScroll);


$(function () {
  let userProfile = localStorage.getItem("user");
  userProfile = userProfile && JSON.parse(userProfile);

  let setting = localStorage.getItem("settings");
  setting = setting && JSON.parse(setting);

  // document.documentElement.style.setProperty("--primary", setting.themeColor);

  const profileImage = $("#profileImage");

  if (userProfile?.image) {
    const imageUrl = userProfile.image.startsWith("https://")
      ? userProfile.image
      : `../uploads/users/${userProfile.image}`;
    // Check if the image URL exists
    $.get(imageUrl)
      .done(function () {
        // Image exists, set the source
        profileImage.attr("src", imageUrl);
      })
      .fail(function () {
        // Image doesn't exist, show the default image
        profileImage.attr("src", `../assets/img/user.jpeg`);
      });
  } else {
    profileImage.attr("src", `../assets/img/user.jpeg`);
  }

  userProfile &&
    $("#profileImage").after(`<span>${userProfile?.name ? userProfile?.name : userProfile?.username}</span>`);

  var sidebarData = [
    {
      link: "/user/dashboard.php",
      iconClass: "fa-solid fa-chart-pie",
      label: "Dashboard",
    },
    {
      link: "/user/booking.php",
      iconClass: "fa-solid fa-cubes",
      label: "Booking",
    },
  ];

  function generateSidebarItems() {
    var sidebarnav = $("#sideNav");
    var currentURL = window.location.href;

    for (var i = 0; i < sidebarData.length; i++) {
      var item = sidebarData[i];

      var li = $("<li></li>").addClass("sidebar-item");
      var a = $("<a></a>")
        .addClass("sidebar-link")
        .attr("href", item.link)
        .attr("aria-expanded", "false")
        .addClass(currentURL.includes(item.link) ? "active" : "");

      var iconSpan = $("<span></span>").append(
        $("<i></i>").addClass(item.iconClass)
      );
      var labelSpan = $("<span></span>").addClass("hide-menu").text(item.label);

      a.append(iconSpan, labelSpan);
      li.append(a);
      sidebarnav.append(li);
    }
  }
  generateSidebarItems();
});

$(document).ready(function () {
  $("#logoutButton").on("click", function () {
    Swal.fire({
      text: "Are you sure to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,Logout !!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "../queries.php",
          method: "post",
          data: {
            logout: true,
          },
          success: function (result) {
            if (result === "success") {
              // Logout was successful
              localStorage.clear();
              toastr.success("Logout successfully!");
              setTimeout(function () {
                window.location.replace("/");
              }, 1000); // Redirect after 1 second
            }
          },
          error: function () {
            // Handle error
            toastr.error("Logout failed. Please try again later.");
          },
        });
      }
    });
  });

  toastr.options = {
    positionClass: "toast-top-right",
    timeOut: 2000,
    progressBar: true,
  };

  $("#changeInputType").on("click", function () {
    var passwordInput = $("#password");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
      $("#eyeToggle").removeClass("fa-eye-slash").addClass("fa-eye");
    } else {
      passwordInput.attr("type", "password");
      $("#eyeToggle").removeClass("fa-eye").addClass("fa-eye-slash");
    }
  });
});
