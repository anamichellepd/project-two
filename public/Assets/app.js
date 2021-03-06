//we get an error for any require here (Require is undefined)
$(document).ready(function() {
  function runModal() {
    $("#modal3").modal({
      dismissible: false,
    });
    $("#modal3").modal("open");
  }

  $(".progress").hide();
  $("iframe").hide();
  $(".header").hide();
  $("#instructions").hide();

  runModal();

  //DARK MODE SETTINGS
  $(".switch").on("click", function(event) {
    event.preventDefault();
    $(this).text(
      $(this).text() === "Dark mode: ON" ? "Dark mode: OFF" : "Dark mode: ON"
    );

    $("#main").toggleClass("dark-mode");
    $(".nav-wrapper").toggleClass("dark-mode");
    $("footer").toggleClass("dark-mode");

    $(".dest").toggleClass("dark-mode");
    $("#city-input").toggleClass("dark-mode");
    $("#reviews").toggleClass("dark-mode");
    $("#instructions").toggleClass("dark-mode");
    $("#yelpArea").toggleClass("dark-mode");
    $("#videoHeader").toggleClass("dark-mode");
    $("#youTubeArea").toggleClass("dark-mode");
    $(".modal").toggleClass("dark-mode");
  });

  //defining the API to save each restaurant to it
  var API = {
    saveRestaurant: function(Restaurant) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json",
        },
        type: "POST",
        url: "api/restaurants",
        data: JSON.stringify(Restaurant),
      });
    },
    getAllRestaurants: function() {
      return $.ajax({
        headers: {
          "Content-Type": "application/json",
        },
        type: "GET",
        url: "api/restaurants",
      });
    },
    getOneRestaurant: function() {
      return $.ajax({
        headers: {
          "Content-Type": "application/json",
        },
        type: "GET",
        url:
          "yelp.com/biz." +
          restaurant.restaurantName +
          restaurant.restaurantCity +
          "?osq=Restaurants",
      });
    },
    deleteOneRestaurant: function(id) {
      return $.ajax({
        url: "api/restaurants/" + id,
        type: "DELETE",
      });
    },
    signUp: function() {
      return $.ajax({
        type: "POST",
        url: "/api/users",
        data: {
          email: $("#email")
            .val()
            .trim(),
          password: $("#password")
            .val()
            .trim(),
          firstName: $("#firstName")
            .val()
            .trim(),
        },
      });
    },
    logIn: function() {
      return $.ajax({
        type: "GET",
        url: "/api/users",
        // data: {
        //   email: $("#email")
        //     .val()
        //     .trim(),
        //   password: $("#password")
        //     .val()
        //     .trim(),
        // },
        // success: function(firstName) {
        //   alert("Hi " + firstName);
        // },
        error: function() {
          alert("You have entered incorrect login information");
          $("#modal3").modal({
            dismissible: false,
          });
          $("#modal3").modal("open");
        },
      });
    },
  };

  $(".sign-up-btn").on("click", function(event) {
    event.preventDefault();
    API.signUp();
  });

  $(".registered-btn").on("click", function() {
    $("#modal2").modal({
      dismissible: false,
    });
    $("#modal2").modal("open");
  });

  $(".log-in-btn").on("click", function() {
    API.logIn().then(function(result) {
      alert("Hi " + result.firstName);
    });
  });

  // $(".log-out").on("click", function() {

  //   });
  // });

  //Function that adds restaurant to the table
  function renderItineraries(itineraries) {
    $("#itinerary-table tbody").empty();
    for (var i = 0; i < itineraries.length; i++) {
      var urlLink = $("<a>" + itineraries[i].restaurantName + "</a>")
        .attr("href", itineraries[i].restaurantURL)
        .attr("title", "Click this to see restaurant in Yelp")
        .attr("target", "_blank");

      var newRow = $("<tr>").append(
        $("<td>")
          .addClass("restaurant-name-url")
          .attr("data-itinerary", itineraries[i].restaurantName)
          .append(urlLink),
        $("<td>").text(itineraries[i].restaurantPhone),
        $("<td>").text(itineraries[i].restaurantAddress),
        $("<td>")
          .attr("data-itinerary", itineraries[i].restaurantCity)
          .text(itineraries[i].restaurantCity),
        $("<td>").text(itineraries[i].restaurantState),
        $("<td>").text(itineraries[i].restaurantZipCode)
      );
      var deleteIcon = $("<i>")
        .addClass("material-icons")
        .addClass("delete")
        .attr("data-itinerary", itineraries[i].id)
        .attr("title", "Delete this row")
        .text("delete");
      newRow = newRow.append("<br/>").append(deleteIcon);
      $("#itinerary-table").append(newRow);
    }
  }
  //creates a variable that stores and parses information from localStorage
  // var itineraries = JSON.parse(localStorage.getItem("itineraries"));
  var itineraries = [];
  API.getAllRestaurants().then(function(restaurants) {
    itineraries = restaurants;
    //calls renderItineraries function
    renderItineraries(itineraries);
    console.log(itineraries);
  });

  $("#city-input").keydown(function(e) {
    if (e.which === 13) {
      $("#submitBtn").click();
    }
  });

  //when clicking SUBMIT button
  $("#submitBtn").on("click", function(event) {
    event.preventDefault();

    $(".progress").show();
    $("iframe").attr("");
    $("#yelpArea").html("");
    $("#youTubeArea").html("");
    cityName = $("#city-input")
      .val()
      .trim();

    if (cityName === "") {
      $("#modal1").modal();
      $("#modal1").modal("open");
    } else {
      $("iframe").show();
      $(".header").show();
      $("#instructions").show();

      $("html, body").animate(
        { scrollTop: $(".progress").offset().top - 100 },
        "slow"
      );

      //GETTING YELP FOR RESTAURANT
      $.ajax({
        url:
          "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search",
        method: "GET",
        error: function(error) {
          console.log("error", error);
        },
        headers: {
          Authorization:
            "Bearer 777OVHyUQXu4MD9WPwXQ3dub9jGslCwGt185TfYEQF6JoBa7tr7kjVe7OvbcNzwp2mY8k3JkODi2curLYOzJsG5dKxmQD8SzDYABjKEzUGC8i3Bk4vXHaU6P5G5DXnYx",
        },
        dataType: "json",
        data: { term: "restaurant", location: cityName, limit: "5" },
      }).then(function(response) {
        console.log(response);
        var totalresults = response.total;
        if (totalresults > 0) {
          $.each(response.businesses, function(i, item) {
            var restaurantDiv = $("<div>").addClass("restaurant");

            var image = $("<img>");
            image
              .attr("src", item.image_url)
              .attr("name-val", item.name)
              .attr("phone-val", item.display_phone)
              .attr("address-val", item.location.address1)
              .attr("city-val", item.location.city)
              .attr("state-val", item.location.state)
              .attr("zip-val", item.location.zip_code)
              .attr("url-val", item.url)
              .addClass("image")
              .attr("style", "width:200px; height:150px; margin-top:50px");
            var name = $("<p>")
              .addClass("name")
              .html("We found " + item.name.bold());
            var address = $("<p>")
              .addClass("address")
              .attr("style", "margin-top:-15px")
              .html(
                item.location.address1 +
                  " " +
                  item.location.city +
                  " " +
                  item.location.state +
                  " " +
                  item.location.zip_code
              );
            var phone = $("<p>")
              .addClass("phone")
              .attr("style", "margin-top:-15px")
              .html(
                "The phone number for this business is: " + item.display_phone
              );
            var ratingWithReviewCount = $("<p>")
              .addClass("ratingWithReviewCount")
              .attr("style", "margin-top:-15px")
              .html(
                "This business has a rating of " +
                  item.rating +
                  " with " +
                  item.review_county +
                  " reviews."
              );

            // restaurantDiv.append(image);
            restaurantDiv.append(name);
            restaurantDiv.append(address);
            restaurantDiv.append(phone);
            restaurantDiv.append(ratingWithReviewCount);
            restaurantDiv.addClass("waves-effect").addClass("waves-light");
            $("#yelpArea").append(image);
            $("#yelpArea").append(restaurantDiv);
          });
        } else {
          $("#yelpArea").append("<h5>We discovered no results!</h5>");
        }
        $(".progress").hide();
      });

      //GETTING YOUTUBE
      $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/youtube/v3/search",
        data: {
          key: "AIzaSyAoFqKem3-oN5_rJRl9hmjVfPng_NQxn0M", //should be a .env reference but can't connect to app.js, only to server.js
          q: cityName + "restaurant" + "food",
          part: "snippet",
          maxResults: 1,
          type: "video",
          videoEmbeddable: true,
        },

        error: function(response) {
          $("#youTubeArea").append(
            "<h5>Request Failed.</br> We apologize for the inconvenience.</h5>"
          );
        },
      }).then(function(response) {
        console.log(response);
        $("iframe").attr(
          "src",
          "https://www.youtube.com/embed/" + response.items[0].id.videoId
        );
        $("#youTubeArea")
          .append("<h5>" + response.items[0].snippet.title + "</h5>")
          .append("<p>" + response.items[0].snippet.description + "</p>");
      });
    }
  });

  //function to refresh restaurants after changes are made

  //function to add to itinerary on table and API database
  function addToItinerary() {
    $("html, body").animate(
      { scrollTop: $("#itinerary").offset().top - 100 },
      "slow"
    );
    var name = $(this).attr("name-val");
    var phone = $(this).attr("phone-val");
    var address = $(this).attr("address-val");
    var city = $(this).attr("city-val");
    var state = $(this).attr("state-val");
    var zipCode = $(this).attr("zip-val");
    var URL = $(this).attr("url-val");
    var restaurant = {
      restaurantName: name,
      restaurantPhone: phone,
      restaurantAddress: address,
      restaurantCity: city,
      restaurantState: state,
      restaurantZipCode: zipCode,
      restaurantURL: URL,
      // userID: userID
    };

    itineraries.push(restaurant);
    API.saveRestaurant(restaurant).then(function() {
      API.getAllRestaurants().then(function(restaurants) {
        renderItineraries(restaurants);
      });
    });
  }

  //When clicking on RESTAURANT Iimage
  $(document).on("click", ".image", addToItinerary);

  // //When clicking on restaurant NAME from Itinerary table
  // $(document).on("click", ".restaurant-name-url", function() {
  //   var restaurantName = $(this).attr("data-itinerary");
  //   var restaurantCity;
  //   console.log(restaurantCity);

  //   //SEPARATING RESTAURANT NAME WITH DASH
  //   // var splitRestaurantName = restaurantName.split(" ");
  //   // var joinedRestaurantName = splitRestaurantName.join("-");

  //   //SEPARATING CITY NAME WITH DASH
  //   // var splitCityName = restaurantCity.split(" ");
  //   // var joinedCityName = splitCityName.join("-");
  //   // console.log(joinedCityName);

  //   // function checkoutRestaurantTab() {
  //   //   // window.open(
  //   //   //   "https://www.yelp.com/biz/" + joinedRestaurantName + joinedCityName+"?osq=Restaurants",
  //   //   //   "_blank"
  //   //   // );
  //   // }
  //   // checkoutRestaurantTab();
  // });

  //When clicking on DELETE button
  $(document).on("click", ".delete", function() {
    event.preventDefault();
    var restaurantIDNumber = $(this).attr("data-itinerary");

    API.deleteOneRestaurant(restaurantIDNumber).then(function() {
      API.getAllRestaurants().then(function(restaurants) {
        renderItineraries(restaurants);
      });
    });
  });

  // Side Menu
  const sideNav = document.querySelector(".sidenav");
  M.Sidenav.init(sideNav, {});

  // IMAGE Slider
  const slider = document.querySelector(".slider");
  M.Slider.init(slider, {
    indicators: false,
    height: 550,
    transition: 500,
    interval: 6000,
  });
});
