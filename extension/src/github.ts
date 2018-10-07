import { GitLocalService } from "./GitLocalService";
import { LocalRepo } from "./interfaces";
import { RpcClient } from "./RpcClient";

let currentRepo: LocalRepo | null = null;
const client = new RpcClient();
client.connect();

const api = new GitLocalService(client);

api.findRepo(window.location.pathname.split("/")[2]).then(repo => {
    currentRepo = repo;
    if (!repo) {
        showCloneButton();
    } else {
        setBar(`Found a local copy of the repository at ${repo.path}`, [
            {
                handler: openFolder,
                icon: '<svg class="octicon" viewBox="4 4 20 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>',
                text: "Open"
            },
            {
                href: "/Peter42/Tutorials/pull/new/master",
                icon: '<svg class="octicon" viewBox="4 4 16 16" version="1.1" width="12" height="16" aria-hidden="true"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>',
                text: "Push"
            },
            {
                href: "/Peter42/Tutorials/compare",
                icon: '<svg class="octicon" viewBox="4 4 16 16" version="1.1" width="13" height="16" aria-hidden="true"><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" /></svg>',
                text: "Pull"
            }
        ]);
    }
})


function showCloneButton() {
    let cloneLocation = "";
    let cloneButton: HTMLElement | null;
    cloneButton = document.querySelector("#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.file-navigation.in-mid-page.d-flex.flex-items-start > details > div > div > div.get-repo-modal-options > div.mt-2 > a.btn.btn-outline.get-repo-btn.tooltipped.tooltipped-s.tooltipped-multiline.js-get-repo");
    if (cloneButton == null) {
        console.error("cloneButton is null");
        return;
    }
    cloneButton.innerText = "Clone";
    cloneButton.removeAttribute("href");
    cloneButton.addEventListener("click", event => {
        event.cancelBubble = true;
        let cloneUrlInput: HTMLInputElement | null;
        cloneUrlInput = document.querySelector("#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.file-navigation.in-mid-page.d-flex.flex-items-start > details > div > div > div.get-repo-modal-options > div.clone-options.https-clone-options > div > input");
        if (cloneUrlInput == null) {
            console.error("cloneUrlInput is null");
            return;
        }
        let cloneUrl = cloneUrlInput.value;
        api.clone(cloneUrl, cloneLocation).then(showCloneOutput);
    });
}

function showCloneOutput(cloneoutput: string) {
    const parent = document.querySelector("#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.file-navigation.in-mid-page.d-flex.flex-items-start > details > div > div > div.get-repo-modal-options > div.mt-2");
    const div = document.createElement("div");
    div.innerText = cloneoutput;
    if (parent == null) {
        console.error("parent is null");
        return;
    }
    parent.appendChild(div);
}


function openFolder() {
    if (!currentRepo) throw new Error("Repo is not cloned");
    api.open(currentRepo);
}

function setBar(text: string, actions: Array<any>) {

    function actionToNode(action: any) {
        let a = document.createElement("a");
        a.className = "muted-link";
        a.innerHTML = `${action.icon} ${action.text}`;
        a.addEventListener("click", action.handler);
        return a;
    }

    let span = document.createElement("span");
    span.className = "float-right";
    actions.map(actionToNode).forEach(span.appendChild.bind(span));

    let div = document.createElement("div");
    div.className = "branch-infobar";
    div.innerText = text;
    div.appendChild(span);

    let sibling = document.querySelector("#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.commit-tease.js-details-container.Details.d-flex");
    if (sibling == null || sibling.parentElement == null) {
        console.error("problem finding sibling");
        return;
    }
    sibling.parentElement.insertBefore(div, sibling);
}