// javascript for popup HTML 

document.getElementById("search-button").addEventListener('click', function(){
    // to open in extension popup : window.location.href = "/search.html";
    window.open("/search.html", "_blank");
});