// window.addEventListener('resize', load_project);
window.addEventListener('load', load_project);
let media = []
let current_index = 0

function load_project() {
    let url = new URL(window.location)
    let project = new URLSearchParams(url.search).get('project');
    if (project == null) {
        window.location.href = window.location.toString().split("/").slice(0, -1).join("/") + "/projects";
    } else {
        fetch('assets/projects/' + project + '/data_project.json')
            .then((response) => response.json())
            .then((data_project) => {
                media = []
                $("#title_project").html(data_project["title"])
                $("#project_period").html(data_project["period"])
                let project_github = $("#project_github")
                if (data_project.hasOwnProperty('github')){
                    project_github.attr("href", data_project["github"]);
                    project_github.removeClass("d-none")
                }
                $("#description_project").html(data_project["description"].join("</br>"))
                $("#project_tags").html(data_project["tags"].join(" "))
                $("#hero_img_style").html(
                    `.ms-main .ms-page-content .ms-hero.project.single .jarallax-img.project_hero_img #jarallax-container-0 div{
                background-image: url(${data_project["hero_img"]}) !important;}`)
                let content_container = $("#project_content")
                let html_img = ""
                for (let content_array of data_project["content"]) {
                    let type = content_array[0]
                    let content = content_array[1]
                    let size = content_array[2]
                    if (size === "break"){
                        html_img += `<div class="w-100"></div>`
                    } else {
                        html_img += `<div class="col-lg-${size}"><div class="portfolio-image">`
                        if (type === "image"){
                            let index_media = media.length
                            media.push(["image",content])
                            html_img += `<img  onclick="display_modal(${index_media})" src="${content}" alt="image_project">`
                        } else if (type === "text") {
                            html_img += `${content}`
                        } else if (type === "video") {
                            let index_media = media.length
                            media.push(["video",content])
                            html_img +=
                                `<video onclick="display_modal(${index_media})" autoplay="" loop="" muted="">
                                    <source src="${content}" type="video/mp4">
                                </video>`
                        }
                        html_img += `</div></div>`
                    }
                }
                content_container.html(html_img)

                let next_project = data_project["next_project"]
                fetch('assets/projects/' + next_project + '/data_project.json')
                    .then((response) => response.json())
                    .then((data_next_project) => {
                        let next_project_url = window.location.toString().split("?")[0]+"?project="+next_project
                        $("#next_project").html(
                            `<div id="text_next_project" class="ms-spn--text col-md-6">
                                <a id="text_next_project" class="ms-spn--link " href="${next_project_url}">
                                    <div class="ms-spn--head">
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path d="M22,9a1,1,0,0,0,0,1.42l4.6,4.6H3.06a1,1,0,1,0,0,2H26.58L22,21.59A1,1,0,0,0,22,23a1,1,0,0,0,1.41,0l6.36-6.36a.88.88,0,0,0,0-1.27L23.42,9A1,1,0,0,0,22,9Z"></path>
                                            </g>
                                        </svg>
                                        <h3>Next Project</h3>
                                    </div>
                                    <h1>${data_next_project["title"]}</h1>
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="${next_project_url}" class="ms-spn--thumb">
                                    <img src="${data_next_project["preview_img"]}">
                                </a>
                            </div>`)
                    }).catch((error) => {
                    console.log(error.message)
                });
            }).catch((error) => {
                window.location.href = window.location.toString().split("/").slice(0, -1).join("/") + "/projects";
        });
    }
}


function display_modal(index){
    current_index = index
    $("body").append(
        `<div onclick="leave_modal();" id="modal_window" class="d-flex flex-row align-items-center justify-content-between py-2">
            <div onclick="event.stopPropagation()" class="btn_modal text-center">
                <img onclick="load_previous()" src="assets/images/modal/left.png" class="icon_btn_modal" alt="left btn">
            </div>
            <figure class="d-flex flex-column justify-content-center align-items-center figure_modal">
                <div id="media_container" class="text-center">
                    <div class="btn_leave_modal"><img src="assets/images/modal/cross.png" class="icon_btn_modal icon_btn_leave_modal" alt="leave modal"></div>
                </div>
                <figcaption onclick="event.stopPropagation()" id="figure_caption" class="text-center text-white"></figcaption>
            </figure>
            <div onclick="event.stopPropagation()" class="btn_modal text-center">
                <img onclick="load_next()" src="assets/images/modal/right.png" class="icon_btn_modal" alt="left btn">
            </div>
        </div>`)
    load_media()
}

function load_media(){
    let data = media[current_index]
    let type = data[0]
    let url = data[1]
    $("#media_modal").remove()
    if(type === "image"){
        media_html = `<img onclick="event.stopPropagation()" src="${url}" id="media_modal" alt="modal image">`
    } else{
        media_html = `<video onclick="event.stopPropagation()" id="media_modal" autoplay="" loop="" muted="">
                        <source src="${url}" type="video/mp4">
                    </video>`
    }
    $("#media_container").append(media_html);
    let nb_media = media.length
    if(nb_media > 1){
        $("#figure_caption").html((current_index+1)+" of "+nb_media)
    } else {
        $("#figure_caption").html("")
    }
}

function load_previous(){
    let index = current_index-1
    if(index<0){
        current_index = media.length-1
    } else {
        current_index = index
    }
    load_media()
}

function load_next(){
    let index = current_index+1
    if(index>=media.length){
        current_index = 0
    } else {
        current_index = index
    }
    load_media()
}

function leave_modal(){
    $("#modal_window").remove()
    current_index = 0
}