// window.addEventListener('resize', load_project);
window.addEventListener('load', load_project);

function load_project() {
    let url = new URL(window.location)
    let project = new URLSearchParams(url.search).get('project');
    if (project == null) {
        window.location.href = window.location.toString().split("/").slice(0, -1).join("/") + "/projects";
    } else {
        fetch('assets/projects/' + project + '/data_project.json')
            .then((response) => response.json())
            .then((data_project) => {
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
                            html_img +=
                                `<a href="#">
                                    <img src="${content}" alt="">
                                </a>`
                        } else if (type === "text") {
                            html_img += `${content}`
                        } else if (type === "video") {
                            html_img +=
                                `<video autoplay="" loop="" muted="">
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
            console.log(error.message)
            alert()
            window.location.href = window.location.toString().split("/").slice(0, -1).join("/") + "/projects";
        });
    }
}
