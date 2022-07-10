let ids = [
    "metadjioo_flavor_game",
    "metadjioo_display_stand",
    "yukim_store",
    "swing",
    "game_engine",
    "superpixel",
    "image_proc_dev",
    "compression_dev",
    "3d_dev",
    "koikoi",
    "spy_simulation",
    "terminal",
    "vroum",
    "miniball",
    "extranet_neftis",
    "zeldiablo",
    "gdbp",
    "bomberman",
]

let content = {
    "metadjioo_flavor_game": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This game has been created during my internship in Summer 2022 for the company <a href="https://www.linkedin.com/company/metadjioo/about/" target="_blank"><b>Metadjioo</b></a> which promotes and sells wine worldwide.
    </div>
    <div class="mb-5">
        I came up with the idea of this social game that involves a bottle of wine purchased from Metadjioo and my employer loved it. The players specify which 
        tastes they feel in the wine and a score is given to each player at the end of the round. All players can then discuss the experience they have lived.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>HTML</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>CSS</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/metadjioo_web" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "metadjioo_display_stand": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created during my internship in Summer 2022 for the company 
        <a href="https://www.linkedin.com/company/metadjioo/about/" target="_blank"><b>Metadjioo</b></a> 
        which promotes and sells wine worldwide with a futuristic approach and a strong interest in new technologies.
    </div>
    <div class="mb-3">
        The objective was to create an interactive display stand. A visitor can watch quality videos filmed 
        by the Metadjioo team about the wines displayed in front of him. He can also consult the technical data sheets of these bottles.
    </div>
    <div class="mb-5">
       The application provides this interaction by managing both the Android touch screen and a curved presentation screen. 
       It will also allow the stand manager to choose which wine to present, with which videos and in which languages.
    </div>
    <div class="mb-5">
        Flexible screens attached to bottles also had to be managed to present videos to future customers in an innovative way.
    </div>
     <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Android</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Java</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Bash</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/metadjioo_ds" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "yukim_store": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
       The objective was to create an interactive application for local merchants to offer items for 
       sale. Users of the application can fill shopping carts and order from individual merchants.
       Some products are offered to customers according to their interests.
    </div>
     <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Android</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Java</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/yukim_store" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "swing": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree. We were a team of 4 students on this project.
        I was in charge of the game mechanics, the game dynamics and the difficulty management.
    </div>
    <div class="mb-5">
        This game is inspired by the game
        <a href="https://en.wikipedia.org/wiki/Swing_(video_game)" target="_blank"><b>Swing</b></a>
        created in 1997 by Software 2000. This is an arcade type game where the goal is to reach the highest score possible. 
        To achieve this, you have to line up balls of the same colour and stack them to merge the balls. The main mechanic is 
        that the columns are not static. They are balances ruled by the weight of the balls.
    </div>
    <div class="mb-5">
        It's a lot of fun to discover the twenty or so special balls that spice up this game. 
        Their occurrence is controlled so that the difficulty evolves and you can discover each special ball as you go along.
        A general leaderboard of all players is present in our game. Don't hesitate to make your way to the podium!
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C#</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Unity</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="projects/swing/swing_windows_64.zip" download class="mx-2" target="_blank"><b>Download and test this game<i class="ml-3 fa-solid fa-circle-down"></i></b></a>
        </div>
    </div>
</div>
    `,
    "game_engine": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
       The objective was to create a game engine and a simulation showing its possibilities.
    </div>
    <div class="mb-5">
        This game engine includes a graphics engine, a physics engine and interaction possibilities. 
        This game engine includes : A scene graph, a management of LOD (Level of details), shadows with shadow maps, 
        Phong's illumination model, different types of light and materials and different bounding boxes for collisions.
    </div>
     <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C++</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>OpenGL</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>GLSL</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/game_engine" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "superpixel": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
        The objective was to create a tool to transform any image into a superpixel image. 
        A superpixel is a set of pixels clustered according to a distance factor (here spatial distance and colour distance).
    </div>
    <div class="mb-5">
        This transformation may have an aesthetic purpose but I focused on its compression potential 
        and which parameters were more efficient to achieve an ideal compression ratio with the least loss of quality.
    </div>
     <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C++</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>C</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/superpixel" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "image_proc_dev": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This section contains several smaller projects concerning image processing.
        These projects have been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
        One of the most important objectives of image processing is image segmentation: to understand an image 
        in a computerised way and to know how to segment it according to the deduced meaning.
        Several of these projects cover this topic.
    </div>
     <div class="d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C++</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>C</b></div>
    </div>
</div>
    `,
    "compression_dev": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This section contains several smaller projects concerning image processing for compression.
        These projects have been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
        These projects deal with several methods used to improve image compression. Some of these methods include loss of information and others do not.
    </div>
     <div class="d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C++</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>C</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>OpenGL</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>GLSL</b></div>
    </div>
</div>
    `,
    "3d_dev": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This section contains several smaller projects concerning 3D.
        These projects have been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
        These projects deal with different topics such as scene graphs, animation, shadow maps, physics 
        in computer applications, raytracing and 3D with OpenGL in general.
    </div>
     <div class="d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C++</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>C</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>OpenGL</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>GLSL</b></div>
    </div>
</div>
    `,
    "koikoi": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree. We were a team of 2 students on this project.
        I was in charge of the AI of the opponent.
    </div>
    <div class="mb-5">
        This game is inspired by the real traditional Japanese game
        <a href="https://fr.wikipedia.org/wiki/Koi-Koi" target="_blank"><b>Koi Koi</b></a>
        played with Japanese Hanafuda cards. The theme of these cards is the seasons and flowers 
        (Hanafuda literally means "Flower Game"). The objective was to recreate this game that 
        I especially like and to create an AI for the opponent.
    </div>
    <div class="mb-5">
        The opponent's AI was particularly complicated to create and it is still not perfect. The algorithm used was first 
        "Minimax" and then "Alpha Beta Pruning" to gain speed. However, this is a card game where you don't know your 
        opponent's cards, nor the order of the cards in the deck. So the AI anticipates all possible combinations to 
        choose the most likely one to succeed.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>C#</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Unity</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="projects/koikoi/koikoi_windows_64.zip" download class="mx-2" target="_blank"><b>Download and test this game<i class="ml-3 fa-solid fa-circle-down"></i></b></a>
        </div>
    </div>
</div>
    `,
    "spy_simulation": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my first year of my Master's degree.
    </div>
    <div class="mb-5">
        The objective of this simulation is to test an AI in a context. 
        A spy will have to escape from several floors of a building equipped with scanning laser cameras. His goal is to remain undetected.
    </div>
    <div class="mb-5">
        The spy is a Symbolic AI who respects certain rules of movement and knows the positions and moves of all the cameras.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Python</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/spy_simulation" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "terminal": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This game has been created during my internship in Summer 2021 for the 
        <a href="https://www.loria.fr/fr/" target="_blank"><b>Loria</b></a>.
        I was responsible for developing an application for the
        <a href="https://terminal-interreg.eu/en/a-lighthouse-project-on-mobility-in-the-greater-region-2/" target="_blank"><b>Terminal</b></a> project.
        The objective of this project is to make driverless shuttle trips between Germany, Belgium, Luxembourg and the Grand-Est region in France.
    </div>
    <div class="mb-5">
        The application had to be a platform for reserving trips for users and for live visualisation of the trip and the position of the shuttle.
        A web administration interface was required to create new trips and to calculate the exact routes of the shuttles between each stop.
        I had to create the whole server hosting the API and the administration website.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Android</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Java</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Php</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>HTML</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>CSS</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/terminal_mobile" class="mx-2" target="_blank"><b>Github of the app<i class="ml-3 fa-solid fa-link"></i></b></a>
            <a href="https://github.com/mariusjenin/terminal_web" class="mx-2" target="_blank"><b>Github of the website<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "vroum": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my last year of my bachelor. We were a team of 12 students on the project. 
        I was the project leader of this one but not all the students were working so I assigned their tasks to myself.
    </div>
    <div class="mb-5">
        The objective was to create a carpooling platform. Drivers could accept carpoolers in their vehicles in exchange 
        for a financial contribution. These drivers can create trips on the site and carpoolers can search for and apply for them. 
        The site has a built-in notification system to avoid missing trips and it also has a friends list system to arrange private trips.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Php</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>HTML</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>CSS</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/vroum_carpooling" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "miniball": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my last year of my bachelor.
    </div>
    <div class="mb-5">
        The objective was to create a little game simulating a air hockey. For this I used an external 2D physics engine.
        The design of the resources was imposed, so I could not improve the aesthetics of the game.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Android</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Java</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Box2D</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/miniball" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "extranet_neftis": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This game has been created during my internship in Summer 2022 for the company 
        <a href="https://www.neftis.com/" target="_blank"><b>Neftis</b></a> 
        which creates website for companies.
    </div>
    <div class="mb-5">
        The objective was to improve their extranet. This site was used as an ERP and also 
        as a Task Manager. I was able to add a lot of features to their tool. I was also in charge 
        of programming an application to connect with the Microsoft API.
    </div>
    <div class="d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Php</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>HTML</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>CSS</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Microsoft Azure</b></div>
    </div>
</div>
    `,
    "zeldiablo": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my second year of DUT
    </div>
    <div class="mb-5">
        The objective was to create a dungeon game with a character fighting monsters. 
        The character has to get through all the floors of the dungeon while staying alive. 
        The character has several attacks and fights enemies with various abilities.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Java</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/zeldiablo" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "gdbp": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created while I was completing my second year of DUT. We were a team of 3 students on the project.
    </div>
    <div class="mb-5">
        The objective was to create a platform allowing readers to list their library online. To do so, they just have to 
        enter the unique code of the book (or scan the barcode of it) to add it to their library. Readers can give 
        their opinion on a book and give it a rating for all to see.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Php</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>HTML</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>CSS</b></div>
        <div class="mx-4 my-2 code_lang_card_project"><b>SQL</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="https://github.com/mariusjenin/gdbp" class="mx-2" target="_blank"><b>Github of this project<i class="ml-3 fa-solid fa-link"></i></b></a>
        </div>
    </div>
</div>
    `,
    "bomberman": `
<div class='m-5 card_project'>
    <div class="mb-5">
        This project has been created in 2019 with a friend of mine.
    </div>
    <div class="mb-5">
        The objective was to recreate <a href="https://fr.wikipedia.org/wiki/Bomberman" target="_blank"><b>Bomberman</b></a>
        with the little technical knowledge we had at that time.
    </div>
    <div class="mb-5 d-flex flex-row justify-content-center align-items-center">
        <div class="mx-4 my-2 code_lang_card_project"><b>Javascript</b></div>
    </div>
    <div class="mt-2">
        <div class="final_link_card_project">
            <a href="projects/bomberman/game" class="mx-2" target="_blank"><b>Try the game<i class="ml-3 fa-solid fa-bomb"></i></i></b></a>
        </div>
    </div>
</div>
    `,
}


function set_content_project() {
    for (let i = 0; i < ids.length; i++) {
        let card = $("#" + ids[i])
        if (card.length > 0) {
            let a = $(card[0].firstElementChild.firstElementChild.firstElementChild)
            a.attr("data-desc", content[ids[i]]);
        }
    }
}