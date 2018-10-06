let wsGitlab = new WebSocket("ws://localhost:7365/api/");
wsGitlab.onmessage = (msg) => {

    if(msg.data.startsWith("failed ")) {
        let cloneLocation = msg.data.substr("failed ".length);
        let cloneButton = document.querySelector("#content-body > div.project-home-panel > div > div.project-repo-buttons.d-inline-flex.flex-wrap > div.project-clone-holder.d-none.d-sm-inline-flex > div > div.input-group-append > button");
        if (cloneButton == null) {
            console.error("cloneButton is null");
            return;
        }
        cloneButton.setAttribute("data-title", "Clone");
        cloneButton.setAttribute("aria-label", "Clone");
        cloneButton.setAttribute("data-original-title", "Clone");
        cloneButton.addEventListener("click", event => {
            event.cancelBubble = true;
            let cloneUrlInput: HTMLInputElement | null;
            cloneUrlInput = document.querySelector("#project_clone");
            if(cloneUrlInput == null) {
                console.error("cloneUrlInput is null");
                return;
            }
            let cloneUrl = cloneUrlInput.value;
            wsGitlab.send(`clone ${cloneUrl} ${cloneLocation}`);
        });
       // historyButton.parentElement.insertBefore(cloneButton, historyButton);
    }
    else if(msg.data.startsWith("cloneoutput ")) {
        let cloneoutput = msg.data.substr("cloneoutput ".length);
        let parent = document.querySelector("#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.file-navigation.in-mid-page.d-flex.flex-items-start > details > div > div > div.get-repo-modal-options > div.mt-2");
        let div = document.createElement("div");
        div.innerText = cloneoutput;
        if(parent == null) {
            console.error("parent is null");
            return;
        }
        parent.appendChild(div);
    }
    else {
        setBar2(`Found a local copy of the repository`, `Location: ${msg.data}`, [
            {
                handler: openFolder2,
                icon: '<i aria-hidden="true" data-hidden="true" class="fa fa-folder fa-fw"></i>',
                text: "Open"
            },
            {
                href: "/Peter42/Tutorials/pull/new/master",
                icon: '<svg viewBox="4 4 16 16" version="1.1" width="12" height="16" aria-hidden="true"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" fill="#2e2e2e" /></svg>',
                text: "Push"
            },
            {
                href: "/Peter42/Tutorials/compare",
                icon: '<svg viewBox="4 4 16 16" version="1.1" width="13" height="16" aria-hidden="true"><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="#2e2e2e" /></svg>',
                text: "Pull"
            }
        ]);
    }
    
    console.log(msg);
};
wsGitlab.onopen = () => {
    wsGitlab.send("setrepo " + window.location.pathname.split("/")[2]);
};

const prefix = "soasdfnaslödkrjasdfg";
function getId(id: string) {
    if(!id.startsWith(prefix)) {
        return `${prefix}-${id}`;
    }
    else {
        return id;
    }
}

function openFolder2() {
    wsGitlab.send("open");
}

function setBar2(title: string, details: string, actions: Array<any>) {

    function actionToNode(action: any) {
        let a = document.createElement("button");
        a.setAttribute("class", "btn btn btn-default" );
        a.setAttribute("data-toggle","tooltip");
        a.setAttribute("data-placement","bottom");
        a.setAttribute("data-container","body");
        a.setAttribute("data-title",action.text);
        a.setAttribute("data-class","btn btn-default");
        a.setAttribute("type","button");
        a.setAttribute("title","");
        a.setAttribute("aria-label",action.text);
        a.setAttribute("data-original-title",action.text);
        a.innerHTML = `${action.icon}`;
        a.addEventListener("click", action.handler);
        return a;
    }

    let span = document.createElement("span");
    span.className = "float-right";
    

    let div = document.createElement("div");
    div.className = "branch-infobar";
    div.innerHTML = `<div class="well-segment">
    <ul class="blob-commit-info">
    <li class="commit flex-row js-toggle-container" id="commit-b303de66">
    <div class="commit-detail flex-list">
    <div class="commit-content qa-commit-content">
    <a class="commit-row-message item-title" href="/phil9909/lunch_parser/commit/b303de662b4e6cb3b51d989a900cda1faac17f7e">${title}</a>
    <span class="commit-row-message d-block d-sm-none">
    ·
    b303de66
    </span>
    <div class="commiter">${details}</div></div>
    <div class="commit-actions flex-row d-none d-sm-flex">
    
    <div class="js-commit-pipeline-status" data-endpoint="/phil9909/lunch_parser/commit/b303de662b4e6cb3b51d989a900cda1faac17f7e/pipelines?ref=master"></div>
        <div id="${getId("actions")}" class="commit-sha-group"></div>
    </div>
    </div>
    </li>
    
    </ul>
    </div>`;

    //div.appendChild(span);

    let sibling = document.querySelector("#tree-holder > div.info-well.d-none.d-sm-block.project-last-commit.append-bottom-default > div");
    if(sibling == null || sibling.parentElement == null ) {
        console.error("problem finding sibling");
        return;
    }
    sibling.parentElement.insertBefore(div, sibling);

    let actionsHolder = document.getElementById(getId("actions"));
    if(actionsHolder == null) {
        console.error("actionsHolder is null");
        return;
    }
    actions.map(actionToNode).forEach(actionsHolder.appendChild.bind(actionsHolder));
    
}