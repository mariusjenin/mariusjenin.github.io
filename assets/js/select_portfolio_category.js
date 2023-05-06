$(document).ready(select_filter);

function select_filter() {
    let url = new URL(window.location)
    let filter = new URLSearchParams(url.search).get('filter');
    let btn = $("button.button[data-filter=\"." + filter + "\"]")[0]
    if (btn !== undefined){
        btn.click()
    }
}