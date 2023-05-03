
window.addEventListener('resize', load_portfolio);
window.addEventListener('load', load_portfolio);

function load_portfolio(){
    fetch('assets/projects/projects.json')
        .then((response) => response.json())
        .then((json) => {
            html_projects = ""
            height = Math.ceil(Object.keys(json).length / 3) * 440
            for (const project_data of Object.values(json)) {
                let pjt_name = project_data["name"]
                let pjt_period = project_data["period"]
                let pjt_image_cover = project_data["image_cover"]
                let pjt_link = project_data["link"]
                html_projects +=
                    `<div class="fadein zoom center h-align-middle grid-item-p element-item transition creative photo style col-md-4" data-category="transition">
                        <div class="item--inner">
                            <a href="${pjt_link}" aria-label="Freezing Birthday">
                                <figure class="ms-p-img">
                                    <img decoding="async" src="${pjt_image_cover}" alt="Freezing Birthday">
                                </figure>
                                <div class="ms-p-content">
                                    <h3>${pjt_name}</h3>
                                    <h4 class="ms-p-cat">${pjt_period}</h4>
                                </div>
                            </a>
                        </div>
                    </div>`
            }
            portfolio_content = $("#portfolio_content")
            portfolio_content.html(html_projects)
            portfolio_content.height(height+"px")

        });
}