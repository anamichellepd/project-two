$(document).ready(function () {
    $('iframe').hide();
    $(".rev").hide();
    $("#instructions").hide();
    $("#videoHeader").hide();

    //function that adds itinerary row to the table
    function renderItineraries(itineraries) {
        $('#itinerary-table tbody').empty();
        for (var i = 0; i < itineraries.length; i++) {
            var newRow = $("<tr>").append(
                $("<td>").text(itineraries[i].name),
                $("<td>").text(itineraries[i].phone),
                $("<td>").text(itineraries[i].address),
                $("<td>").text(itineraries[i].city),
                $("<td>").text(itineraries[i].state),
                $("<td>").text(itineraries[i].zipCode));
            var deleteIcon = $("<i>")
                .addClass("material-icons")
                .text("delete");
            newRow = newRow.append('<br/>').append(deleteIcon);
            $("#itinerary-table").append(newRow);
        }
    }
    //creates a variable that stores and parses information from localStorage
    var itineraries = JSON.parse(localStorage.getItem("itineraries"));
    //if statement that says if there is nothing in the variable itineraries,
    //then the the itineraries array will be empty
    if (!itineraries) {
        itineraries = [];
    }
    //calls renderItineraries function
    renderItineraries(itineraries);

    $("#submitBtn").on("click", function (event) {
        event.preventDefault();
        $("#yelpArea").html("");
        $("#youTubeArea").html("");
        cityName = $("#city-input")
            .val()
            .trim();
        if (cityName === "") {
            $('.modal').modal();
        } else if (cityName !== "") {
            $('iframe').show();
            $(".rev").show();
            $("#instructions").show();
            $("#videoHeader").show();
            $.ajax({
                url:
                    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search",
                method: "GET",
                error: function (error) {
                    console.log("error", error);
                },
                headers: {
                    Authorization:
                        "Bearer 777OVHyUQXu4MD9WPwXQ3dub9jGslCwGt185TfYEQF6JoBa7tr7kjVe7OvbcNzwp2mY8k3JkODi2curLYOzJsG5dKxmQD8SzDYABjKEzUGC8i3Bk4vXHaU6P5G5DXnYx"
                },
                dataType: "json",
                data: { term: "restaurant", location: cityName, limit: "5" }
            }).then(function (response) {
                console.log(response);
                var totalresults = response.total;
                if (totalresults > 0) {
                    $.each(response.businesses, function (i, item) {
                        var restaurantDiv = $("<div>")
                            .addClass("restaurant")
                            .attr("name-val", item.name)
                            .attr("phone-val", item.display_phone)
                            .attr("address-val", item.location.address1)
                            .attr("city-val", item.location.city)
                            .attr("state-val", item.location.state)
                            .attr("zip-val", item.location.zip_code);
                        var image = $("<img>");
                        image.attr("src", item.image_url)
                            .addClass("image")
                            .attr("style", "width:200px; height:150px; margin-top:50px");
                        var name = $("<p>")
                            .addClass("name")
                            .html("We found " + item.name.bold());
                        var address = $("<p>")
                            .addClass("address")
                            .attr("style", "margin-top:-15px")
                            .html(item.location.address1 + " " + item.location.city + " " + item.location.state + " " + item.location.zip_code);
                        var phone = $("<p>")
                            .addClass("phone")
                            .attr("style", "margin-top:-15px")
                            .html("The phone number for this business is: " + item.display_phone);
                        var ratingWithReviewCount = $("<p>")
                            .addClass("ratingWithReviewCount")
                            .attr("style", "margin-top:-15px")
                            .html("This business has a rating of " + item.rating + " with " + item.review_county + " reviews.");
                        restaurantDiv.append(image);
                        restaurantDiv.append(name);
                        restaurantDiv.append(address);
                        restaurantDiv.append(phone);
                        restaurantDiv.append(ratingWithReviewCount);
                        restaurantDiv.addClass("waves-effect")
                        .addClass("waves-teal")
                        .addClass("waves-light");
                        $("#yelpArea").append(restaurantDiv);
                    });
                } else {
                    $("#yelpArea").append("<h5>We discovered no results!</h5>");
                };
            });

            $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search',
                data: {
                    key: 'AIzaSyBeqNJkinkCUFPlPWWbW6PUVPEo5jz6Bxc',
                    q: cityName,
                    part: 'snippet',
                    maxResults: 1,
                    type: 'video',
                    chart: 'mostPopular',
                    videoEmbeddable: true,
                },
                error: function (response) {
                    $("#youTubeArea").append("<h5>Request Failed</h5>");
                }
            }).then(function (response) {
                console.log(response);
                $('iframe').attr('src', 'https://www.youtube.com/embed/' + response.items[0].id.videoId);
                $("#youTubeArea").append("<h5>" + response.items[0].snippet.title + "</h5>")
                    .append("<p>" + response.items[0].snippet.description + "</p>");
            });
        };
    });
    //function to add to itinerary on table and localStorage
    function addToItinerary() {
        var name = $(this).attr("name-val");
        var phone = $(this).attr("phone-val");
        var address = $(this).attr("address-val");
        var city = $(this).attr("city-val");
        var state = $(this).attr("state-val");
        var zipCode = $(this).attr("zip-val");
        var itinerary = {
            name: name,
            phone: phone,
            address: address,
            city: city,
            state: state,
            zipCode: zipCode
        }
        itineraries.push(itinerary);
        renderItineraries(itineraries);
        localStorage.setItem("itineraries", JSON.stringify(itineraries));
    };
    //clicking on the restaurant div adds to the itinerary table and storage
    $(document).on("click", ".restaurant", addToItinerary);
    //clicking on the delete button in a row of the table deletes
    //row on table and element in local storage
    $(document).on("click", ".material-icons", function () {
        event.preventDefault();
        var toDoNumber = $(this).attr("data-itinerary");
        itineraries[i].splice(toDoNumber, 1);
        renderItineraries(itineraries);
        localStorage.setItem("itineraries", JSON.stringify(itineraries));
    })
});

// Side Menu
const sideNav = document.querySelector('.sidenav');
M.Sidenav.init(sideNav, {});

// Slider
const slider = document.querySelector('.slider');
M.Slider.init(slider, {
    indicators: false,
    height: 550,
    transition: 500,
    interval: 6000
});