class Artist {
    drawArea = document.getElementsByClassName('main-content')[0];
    adminPanelContainer = document.getElementById('adminPanel');
    request = new Requests();
    oldClickFunction;
    selectedIds = [];

    drawTable(header, rows) {
        if (header.length !== Object.values(rows[0]).length) {
            console.error(`length of table header(${header.length}) is not equal length of table rows(${Object.values(rows[0]).length})`);
            return null;
        }
        let table = document.createElement('table');
        table.classList.add('content-table')
        this.fillHeader(header, table);
        this.fillContent(rows, table);
        this.clearBody();
        this.drawArea.append(table)
    }

    fillHeader(header, table) {
        let tableHead = document.createElement('thead');
        let headRow = document.createElement('tr');
        header.forEach(headerColumnContent => {
            let headerColumn = document.createElement('td');
            headerColumn.innerText = headerColumnContent;
            headRow.append(headerColumn);
        });
        tableHead.append(headRow);
        table.append(tableHead);
    }

    fillContent(rows, table) {
        let tableBody = document.createElement('tbody');
        rows.forEach(row => {
            let contentRow = document.createElement('tr');
            contentRow.classList.add('in-all-content-row');
            Object.values(row).forEach(contentColumnContent => {
                let contentColumn = document.createElement('td');
                if (this.checkDate(contentColumnContent)) {
                    contentColumnContent = this.formatDate(new Date(contentColumnContent));
                }
                contentColumn.innerText = contentColumnContent;
                contentRow.append(contentColumn);
            });
            tableBody.append(contentRow);
        });
        table.append(tableBody);
    }

    clearBody() {
        this.drawArea.innerHTML = '';
    }

    drawInColumn(labels, contentList, header = undefined) {
        if (labels.length !== contentList.length) {
            console.error(`length of labels list(${labels.length}) is not equal length of content(${contentList.length})`);
            return null;
        }
        if (header) {
            let head = document.createElement('h1');
            head.innerText = header;
            this.drawArea.append(head);
        }
        this.clearBody();
        labels.forEach((labelContent, index) => {
            let chunk = document.createElement('div');
            let label = document.createElement('h2');
            label.innerText = labelContent;
            label.classList.add('description-label');
            chunk.classList.add('chunk');
            let description = document.createElement('p');
            description.classList.add('in-one-content-row');
            description.innerText = contentList[index];
            chunk.append(label, description);
            this.drawArea.append(chunk);
        })
    }

    formatDate(date) {
        return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1}-${date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate()}`
    }

    checkDate(date) {
        return String(date).match(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/) !== null;
    }

    drawBackButton(backButton) {
        document.getElementById('backButtonContainer').append(backButton);
    }

    hideBackButton(backButton) {
        backButton.remove();
    }

    drawAdminPanel() {
        this.adminPanelContainer.classList.remove('hide');
    }

    hideAdminPanel() {
        this.adminPanelContainer.classList.add('hide');
    }

    changeLoginButton() {
        let loginButton = document.getElementById('openLoginFormButton');
        if (!this.adminPanelContainer.classList.contains('hide')) {
            loginButton.removeEventListener('click', this.toggleLoginForm);
            loginButton.addEventListener('click', this.logoutEvent);
            loginButton.innerText = 'Logout';
        } else {
            loginButton.removeEventListener('click', this.logoutEvent);
            loginButton.addEventListener('click', this.toggleLoginForm);
            loginButton.innerText = 'Sign in'
        }
    }

    toggleLoginForm() {
        if (loginForm.classList.contains('closed') || loginForm.classList.value === '') {
            loginForm.classList.remove('closed');
            loginForm.classList.add('opened');
        } else {
            artist.closeLoginForm();
        }
    }

    closeLoginForm() {
        loginForm.classList.remove('opened');
        loginForm.classList.add('closed');
    }

    logoutEvent() {
        auth.logout().then();
    }

    drawCreateForm(valuesList = undefined) {
        let names = action.last[0].context.fieldsNames;
        let labels = action.last[0].context.fieldsLabels;
        let types = action.last[0].context.fieldsTypes;
        if (names.length !== labels.length || types.length !== names.length) {
            console.error(`Wrong names or labels list in ${action.last[0].context} instance`);
        }
        let form = document.createElement('form');
        form.classList.add('create-form');
        labels.forEach((labelContent, index) => {
            let label = document.createElement('label');
            label.innerText = labelContent;
            let input = document.createElement('input');
            input.type = types[index];
            input.name = names[index];
            form.append(label, input);
        });
        let cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.type = 'submit';
        cancelButton.addEventListener('click', () => {
            this.closeCreateForm();
        });
        form.append(cancelButton);
        let submitButton = document.createElement('button');
        submitButton.innerText = 'Create';
        submitButton.type = 'button';
        submitButton.addEventListener('click', () => {
            action.last[0].context.create(form);
        });
        form.append(submitButton);
        this.drawArea.append(form);
    }

    closeCreateForm() {
        document.getElementsByClassName('create-form')[0].remove();
    }

    replaceToInputs(clickedRow) {
        let types = action.last[0].context.editAllFieldsTypes;
        clickedRow.childNodes.forEach((column, index) => {
            if (index % 6 === 0) {
                artist.selectedIds.push(column.innerText);
            }
            column.innerHTML = `<input value="${column.innerText}" type="${types[index]}" class="edit-field">`
        });
        clickedRow.addEventListener('click', (e) => {e.stopPropagation()})
    }

    drawEditForm() {
        let oldClickFunctionObject = {...action};
        let rows = [...document.getElementsByClassName('in-all-content-row')];
        if (!rows.length) {
            this.drawEditInOnePage();
        } else {
            notification.handle({isError: false, message: 'Select row to edit'});
            rows.forEach(row => row.style.opacity = '0.7');
            action.rowClickedFunc = artist.replaceToInputs;
            let editButton = document.getElementById('editButton');
            editButton.innerText = 'save';
            editButton.addEventListener('click', (e) => {artist.saveChanges(e, oldClickFunctionObject)})
        }
    }

    drawEditInOnePage() {
        let rows = [...document.getElementsByClassName('in-one-content-row')];

    }

    saveChanges(e, oldClickFunctionObject) {
        action.rowClickedFunc = oldClickFunctionObject.rowClickedFunc;
        let editedFields = [...document.getElementsByClassName('edit-field')];
        let rows = [...document.getElementsByClassName('in-all-content-row')];
        rows.forEach(row => row.style.opacity = '1');
        let editButton = document.getElementById('editButton');
        editButton.innerText = 'edit';
        editButton.removeEventListener('click',(e) => {artist.saveChanges(e, oldClickFunctionObject)});
        action.last[0].context.saveChanges(editedFields, artist.selectedIds).then();
    }

    replaceToColumns() {
        let editedFields = [...document.getElementsByClassName('edit-field')];
        editedFields.forEach(col => {
            col.parentElement.innerHTML = col.value;
        })
    }

    deleteForm() {
        document.getElementById('deleteButton').removeEventListener('click', artist.deleteForm);
        let oldClickFunctionObject = {...action};
        let rows = [...document.getElementsByClassName('in-all-content-row')];
        if (!rows.length) {
            this.drawEditInOnePage();
        } else {
            notification.handle({isError: false, message: 'Select row to delete'});
            rows.forEach(row => row.style.opacity = '0.7');
            action.rowClickedFunc = artist.deleteRow;
            let deleteButton = document.getElementById('deleteButton');
            deleteButton.innerText = 'cancel';
            deleteButton.addEventListener('click', (e) => {artist.cancelDelete(oldClickFunctionObject)})
        }
    }

    cancelDelete(oldObj) {
        action.rowClickedFunc = oldObj.rowClickedFunc;
        let deleteButton = document.getElementById('deleteButton');
        let rows = [...document.getElementsByClassName('in-all-content-row')];
        rows.forEach(row => row.style.opacity = '1');
        deleteButton.innerText = 'delete';
        deleteButton.removeEventListener('click', (e) => {artist.cancelDelete(oldClickFunctionObject)});
        deleteButton.addEventListener('click', artist.deleteForm);
    }

    deleteRow(row) {
        action.last[0].context.delete(row.firstElementChild.innerText).then(() => {
            row.remove();
        })
    }
}

