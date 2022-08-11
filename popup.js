// javascript for popup HTML 

document.getElementById("search-button").addEventListener('click', function(){
    // to open in extension popup : window.location.href = "/search.html";
    window.open("/search.html", "_blank");
});

chrome.runtime.sendMessage({msg: 'Get Tracked Novels'}, async function(items){
    console.log(items, typeof(items));
    if(typeof(items)=='undefined' || Object.keys(items).length == 0)
        return;
    const element = document.getElementById("tracking");
    for(const sid in items){
        const info = items[sid];
        element.innerHTML += "<p>" + info.title + " : " + info.lastPub + " " + (info.status=='New'?'<b>NEW</b>':'') + "</p>";
    }
    chrome.runtime.sendMessage({msg: 'Update status', data: items}, async function(){
        console.log("Status updated");
    })
})