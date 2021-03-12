const main = document.getElementsByTagName('main')[0];
const loginForm = document.getElementById('loginForm');

let userLoggedIn = new Event('loggedIn');
let userLoggedOut = new Event('loggedOut');
let rowClickedEvent = new CustomEvent('rowClicked', { id: null});
let artist = new Artist();

document.getElementById('councilButton').addEventListener('click', () => {
    council.getAll().then();
});

document.getElementById('branchMapButton').addEventListener('click', () => {
    science.getAll().then();
});

document.getElementById('loginButton').addEventListener('click', () => {
    auth.login().then();
});

document.getElementById('openLoginFormButton').addEventListener('click', artist.toggleLoginForm);

document.getElementById('closeButton').addEventListener('click', () => {
    artist.closeLoginForm();
});

document.getElementById('createButton').addEventListener('click', () => {
    artist.drawCreateForm();
});

document.getElementById('editButton').addEventListener('click', artist.drawEditForm);

document.getElementById('deleteButton').addEventListener('click', artist.deleteForm);

main.addEventListener('loggedIn', () => {
    artist.drawAdminPanel();
    artist.changeLoginButton();
});

main.addEventListener('loggedOut', () => {
    artist.hideAdminPanel();
    artist.changeLoginButton();
});

main.addEventListener('click', (e) => {
    let currentElement = e.target;
    while (currentElement && currentElement.tagName !== 'TR') {
        if (currentElement.tagName === 'HTML') {
            return null;
        }
        currentElement = currentElement.parentElement;
    }
    currentElement && action.rowClickedFunc(currentElement);
});
