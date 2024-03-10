$(document).ready(load_portfolio);

let json_data = [
    {
        "title": "Photonear",
        "period": "Fall 2022 &amp; Winter 2023",
        "cover": "assets/projects/photonear/icon_preview.png",
        "categories": ["engine 3d software"],
        "link": "project?project=photonear"
    },
    {
        "title": "Game Engine",
        "period": "Spring 2022",
        "cover": "assets/projects/game_engine/icon_preview.png",
        "categories": ["engine game 3d software"],
        "link": "project?project=game_engine"
    },
    {
        "title": "Pew Pew",
        "period": "Fall 2022 &amp; Winter 2023",
        "cover": "assets/projects/pew_pew/icon_preview.png",
        "categories": ["game 3d"],
        "link": "project?project=pew_pew"
    },
    {
        "title": "Style Dreamer",
        "period": "Fall 2022 &amp; Winter 2023",
        "cover": "assets/projects/style_dreamer/icon_preview.png",
        "categories": ["3d ai image_processing software"],
        "link": "project?project=style_dreamer"
    },
    {
        "title": "Pipeline Development",
        "period": "Winter 2023 &amp; Spring 2023",
        "cover": "assets/projects/dev_pipeline/icon_preview.png",
        "categories": ["3d software ai"],
        "link": "project?project=dev_pipeline"
    },
    {
        "title": "Swing",
        "period": "Spring 2022",
        "cover": "assets/projects/swing/icon_preview.png",
        "categories": ["game 3d"],
        "link": "project?project=swing"
    },
    {
        "title": "The Avenging Willow",
        "period": "Fall 2022",
        "cover": "assets/projects/avenging_willow/icon_preview.png",
        "categories": ["game 3d"],
        "link": "project?project=avenging_willow"
    },
    {
        "title": "Cartoonizer",
        "period": "Fall 2022 &amp; Winter 2023",
        "cover": "assets/projects/cartoonizer/icon_preview.png",
        "categories": ["image_processing ai"],
        "link": "project?project=cartoonizer"
    },
    {
        "title": "3D Development 2",
        "period": "Fall 2022",
        "cover": "assets/projects/dev_3d_2/icon_preview.png",
        "categories": ["3d"],
        "link": "project?project=dev_3d_2"
    },
    {
        "title": "3D Development",
        "period": "Fall 2021 &amp; Winter 2022",
        "cover": "assets/projects/dev_3d/icon_preview.png",
        "categories": ["3d"],
        "link": "project?project=dev_3d"
    },
    {
        "title": "Animation Development",
        "period": "Fall 2022",
        "cover": "assets/projects/dev_anim/icon_preview.png",
        "categories": ["3d"],
        "link": "project?project=dev_anim"
    },
    {
        "title": "Koi Koi",
        "period": "Winter &amp; Spring 2022",
        "cover": "assets/projects/koi_koi/icon_preview.png",
        "categories": ["game ai"],
        "link": "project?project=koi_koi"
    },
    {
        "title": "Better Spy",
        "period": "Fall 2022",
        "cover": "assets/projects/better_spy/icon_preview.png",
        "categories": ["game 3d ai"],
        "link": "project?project=better_spy"
    },
    {
        "title": "Image Processing Develpment",
        "period": "Winter &amp; Spring 2022",
        "cover": "assets/projects/dev_image_processing/icon_preview.png",
        "categories": ["image_processing 3d"],
        "link": "project?project=dev_image_processing"
    },
    {
        "title": "Image Security Development",
        "period": "Fall 2022",
        "cover": "assets/projects/dev_image_secu/icon_preview.png",
        "categories": ["image_processing 3d ai"],
        "link": "project?project=dev_image_secu"
    },
    {
        "title": "Image Compressing Development",
        "period": "Winter &amp; Spring 2022",
        "cover": "assets/projects/dev_compression/icon_preview.png",
        "categories": ["image_processing 3d"],
        "link": "project?project=dev_compression"
    },
    {
        "title": "Computer Vision Development",
        "period": "Fall 2022",
        "cover": "assets/projects/computer_vision/icon_preview.png",
        "categories": ["software image_processing 3d"],
        "link": "project?project=computer_vision"
    },
    {
        "title": "Superpixel",
        "period": "Winter &amp; Spring 2022",
        "cover": "assets/projects/superpixel/icon_preview.png",
        "categories": ["image_processing"],
        "link": "project?project=superpixel"
    },
    {
        "title": "Spy Simulation",
        "period": "Winter 2022",
        "cover": "assets/projects/spy_simulation/icon_preview.png",
        "categories": ["game ai"],
        "link": "project?project=spy_simulation"
    },
    {
        "title": "Zeldiablo",
        "period": "Spring 2020",
        "cover": "assets/projects/zeldiablo/icon_preview.png",
        "categories": ["game"],
        "link": "project?project=zeldiablo"
    },
    {
        "title": "Metadjioo Flavor Game",
        "period": "Summer 2022",
        "cover": "assets/projects/metadjioo_flavor_game/icon_preview.png",
        "categories": ["web game"],
        "link": "project?project=metadjioo_flavor_game"
    },
    {
        "title": "Miniball",
        "period": "Winter 2021",
        "cover": "assets/projects/miniball/icon_preview.png",
        "categories": ["game ai mobile"],
        "link": "project?project=miniball"
    },
    {
        "title": "Metadjioo Display Stand",
        "period": "Summer 2022",
        "cover": "assets/projects/metadjioo_display_stand/icon_preview.png",
        "categories": ["mobile"],
        "link": "project?project=metadjioo_display_stand"
    },
    {
        "title": "Terminal",
        "period": "Summer 2021",
        "cover": "assets/projects/terminal/icon_preview.png",
        "categories": ["web mobile"],
        "link": "project?project=terminal"
    },
    {
        "title": "Yukim Store",
        "period": "Summer 2022",
        "cover": "assets/projects/yukim_store/icon_preview.png",
        "categories": ["mobile"],
        "link": "project?project=yukim_store"
    },
    {
        "title": "Slurp",
        "period": "Fall 2020",
        "cover": "assets/projects/slurp/icon_preview.png",
        "categories": ["web"],
        "link": "project?project=slurp"
    },
    {
        "title": "Bomberman",
        "period": "Spring 2019",
        "cover": "assets/projects/bomberman/icon_preview.png",
        "categories": ["game web"],
        "link": "project?project=bomberman"
    },
    {
        "title": "Extranet Neftis",
        "period": "Summer 2020",
        "cover": "assets/projects/extranet_neftis/icon_preview.png",
        "categories": ["web"],
        "link": "project?project=extranet_neftis"
    },
    {
        "title": "GDBP",
        "period": "Winter &amp; Spring 2020",
        "cover": "assets/projects/gdbp/icon_preview.png",
        "categories": ["web"],
        "link": "project?project=gdbp"
    },
    {
        "title": "Vroum",
        "period": "Spring 2021",
        "cover": "assets/projects/vroum/icon_preview.png",
        "categories": ["web"],
        "link": "project?project=vroum"
    }
]

function load_portfolio(){
    html_projects = ""
    for (const project_data of Object.values(json_data)) {
        let pjt_name = project_data["title"]
        let pjt_period = project_data["period"]
        let pjt_image_cover = project_data["cover"]
        let pjt_link = project_data["link"]
        let pjt_categories = project_data["categories"]
        html_projects +=
            `<div class="fadein zoom center h-align-middle grid-item-p element-item transition ${pjt_categories} col-6 col-md-4 col-lg-3" data-category="transition">
                <div class="item--inner">
                    <a href="${pjt_link}" aria-label="${pjt_name}">
                        <figure class="ms-p-img">
                            <img decoding="async" src="${pjt_image_cover}" alt="${pjt_name}">
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
}
