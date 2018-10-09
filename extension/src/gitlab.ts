//tslint:disable:max-line-length
import { GitLocalService } from "./GitLocalService";
import { LocalRepo } from "./interfaces";
import { RpcClient } from "./RpcClient";

/**
 * Gitlab entry file
 */

const client = new RpcClient();
const api = new GitLocalService(client);
let currentRepo: LocalRepo | null = null;

client.connect().then(init).catch(() => { /* ignore */ });

async function init() {
    api.findRepo(window.location.pathname.split("/")[2]).then(repo => {
        currentRepo = repo;
        if (!repo) {
            showCloneButton();
        } else {
            setBar(`Found a local copy of the repository at ${repo.path}`, [
                {
                    handler: openFolder,
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
    });
}

function showCloneButton() {
    const cloneLocation = "";
    const cloneButton = document.querySelector("#content-body > div.project-home-panel > div > div.project-repo-buttons.d-inline-flex.flex-wrap > div.project-clone-holder.d-none.d-sm-inline-flex > div > div.input-group-append > button");
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
        if (cloneUrlInput == null) {
            console.error("cloneUrlInput is null");

            return;
        }
        const cloneUrl = cloneUrlInput.value;
        api.clone(cloneUrl, cloneLocation).then(showCloneOutput);
    });
    // historyButton.parentElement.insertBefore(cloneButton, historyButton);
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

const prefix = "soasdfnaslödkrjasdfg";
function getId(id: string) {
    if (!id.startsWith(prefix)) {
        return `${prefix}-${id}`;
    } else {
        return id;
    }
}

function openFolder() {
    if (!currentRepo) {
        throw new Error("Repo is not cloned");
    }
    api.open(currentRepo);
}

interface SetBarAction {
    handler?: EventListenerOrEventListenerObject;
    href?: string;
    icon: string;
    text: string;
}
function setBar(text: string, actions: SetBarAction[]) {

    function actionToNode(action: SetBarAction) {
        const a = document.createElement("button");
        a.setAttribute("class", "btn btn btn-default");
        a.setAttribute("data-toggle", "tooltip");
        a.setAttribute("data-placement", "bottom");
        a.setAttribute("data-container", "body");
        a.setAttribute("data-title", action.text);
        a.setAttribute("data-class", "btn btn-default");
        a.setAttribute("type", "button");
        a.setAttribute("title", "");
        a.setAttribute("aria-label", action.text);
        a.setAttribute("data-original-title", action.text);
        //tslint:disable-next-line:no-inner-html
        a.innerHTML = `${action.icon}`;
        if (action.handler) {
            a.addEventListener("click", action.handler);
        }

        return a;
    }

    const title = "Some Commit Title";
    const details = "Commit Content ...";

    const span = document.createElement("span");
    span.className = "float-right";

    const div = document.createElement("div");
    div.className = "branch-infobar";
    //tslint:disable-next-line:no-inner-html
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

    const sibling = document.querySelector("#tree-holder > div.info-well.d-none.d-sm-block.project-last-commit.append-bottom-default > div");
    if (sibling == null || sibling.parentElement == null) {
        console.error("problem finding sibling");

        return;
    }
    sibling.parentElement.insertBefore(div, sibling);

    const actionsHolder = document.getElementById(getId("actions"));
    if (actionsHolder == null) {
        console.error("actionsHolder is null");

        return;
    }
    actions.map(actionToNode).forEach(actionsHolder.appendChild.bind(actionsHolder));

}
