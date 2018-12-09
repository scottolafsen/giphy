$(document).ready(function () {
    /// Global Arrays
    var topics = ["skiing", "kayaking", "climbing", "mountains", "rivers", "canoeing", "snowboarding", "biking", "running", "swimming", "soccer"];
    var favoriteGifs = [];

    /// Renders Butttons
    function renderButtons() {
        $("#btns").empty();
        for (var i = 0; i < topics.length; i++) {
            var btn = $("<button>");
            btn.addClass("btn btn-danger gifBtn");
            btn.attr("data-name", topics[i]);
            btn.text(topics[i]);
            $("#btns").append(btn);
        }
    }

    /// Add a Button
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var sport = $("#newBtn").val().trim();
        topics.push(sport);
        renderButtons();
        $("#newBtn").val("");
    });

    /// Favorite Button
    $(document).on("click", ".favorite", function (event) {
        event.preventDefault();
        var idNumber = $(this).attr("id");
        if (favoriteGifs.indexOf(idNumber) === -1) {
            favoriteGifs.push(idNumber);
            localStorage.clear();
            localStorage.setItem("favorites", favoriteGifs);
        }
        else { return }
       
    });

    /// Remove favorite Button
    $(document).on("click", ".remove", function (event) {
        event.preventDefault();
        var removeId = $(this).attr("id");
        var indexNum = favoriteGifs.indexOf(removeId)
        favoriteGifs.splice(indexNum, 1);
        localStorage.clear();
        localStorage.setItem("favorites", favoriteGifs);
        displayFavorites();
    });


    /// Animate the GIF
    $(document).on("click", "img", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("still"));
            $(this).attr("data-state", "still");
        }
    });
    renderButtons();

    /// Generates GIFS
    $(document).on("click", ".gifBtn", function () {
        $("#giphys").empty()
        var button = $(this).attr("data-name");
        var articles = 10;
        var APIKey = "ptx8Q3pHYEgxzVeybzhkHdG73rm1zb12";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + button + "&api_key=" + APIKey + "&limit=" + articles;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var results = response.data;
            for (var i = 0; i < results.length; i++) {
                if (results[i].rating !== "r") {
                    var favorite = $("<button>").text("Add to Favorites");
                    favorite.addClass("btn btn-warning favorite");
                    favorite.attr("id", results[i].id);
                    var gifDiv = $("<div class = gif>");
                    var rating = results[i].rating;
                    var title = results[i].title;
                    var p = $("<p>").text("Rating: " + rating);
                    var p2 = $("<p>").text(title);
                    var gifImage = $("<img>");
                    gifImage.attr("src", results[i].images.fixed_height_still.url);
                    gifImage.attr("animate", results[i].images.fixed_height.url);
                    gifImage.attr("still", results[i].images.fixed_height_still.url);
                    gifImage.attr("data-state", "still");
                    gifDiv.append(p2, p);
                    gifDiv.prepend(favorite);
                    gifDiv.append(gifImage);
                    $("#giphys").prepend(gifDiv);
                }
            }
        });
    });

    /// Displaying Favorite Gifs
    $(document).on("click", "#favorite-gif", function () {
        displayFavorites();
    });

    /// Display Favorite Gifs
    var displayFavorites = function () {
        $("#giphys").empty()
        var favString = localStorage.getItem("favorites")
        var APIKey = "ptx8Q3pHYEgxzVeybzhkHdG73rm1zb12";
        var queryURL = "https://api.giphy.com/v1/gifs?ids=" + favString + "&api_key=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var results = response.data;

            for (var i = 0; i < results.length; i++) {
                if (results[i].rating !== "r") {
                    var gifDiv = $("<div class = gif>");
                    var removeGif = $("<button>").text("X");
                    removeGif.addClass("btn btn-danger remove");
                    removeGif.attr("id", results[i].id);
                    var rating = results[i].rating;
                    var title = results[i].title;
                    var p = $("<p>").text("Rating: " + rating);
                    var p2 = $("<p>").text(title);
                    var gifImage = $("<img>");
                    gifImage.attr("src", results[i].images.fixed_height_still.url);
                    gifImage.attr("animate", results[i].images.fixed_height.url);
                    gifImage.attr("still", results[i].images.fixed_height_still.url);
                    gifImage.attr("data-state", "still");
                    gifDiv.append(removeGif, p2, p);
                    gifDiv.append(gifImage);
                    $("#giphys").prepend(gifDiv);
                }
            }
        });
    }



});
