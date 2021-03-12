class Base {
    request = new Requests();
    artist = new Artist();
    notification = new Notification();
    main = document.getElementsByTagName('main')[0];

    fieldsLabels;
    fieldsNames;
    fieldsTypes;

    async getAll() {}

    async getOne() {}

    async addEventListeners() {

    }

    async postToCreate(url) {
        let form = document.getElementsByClassName('create-form')[0];
        let body = this.request.convertDataToBody(form);
        let { notification } = await this.request.send(url, 'POST', body);
        this.notification.handle(notification);
        if (!notification.isError) {
            artist.closeCreateForm();
        }
        return notification;
    }


}

class Council extends Base {
    fieldsLabels = ['Branches', 'Organization', 'Council ID', 'Creation date', 'Expiration date', 'Phone'];
    fieldsNames = ['branch_id', 'org_name', 'council_id', 'creation_date', 'expiration_date', 'phone'];
    fieldsTypes = ['text', 'text', 'text', 'date', 'date', 'text'];
    editAllFieldsTypes = ['text', null, 'text', 'date', 'date', 'text'];
    editFieldsNames = ['council_id', 'org_name', 'creation_date', 'expiration_date', 'phone'];

    async getAll() {
        let data = await this.request.send(urls.councils);
        let tableHeaders = ['Council ID', 'Branches', 'Organization', 'Creation date', 'Expiration date', 'Phone'];
        this.artist.drawTable(tableHeaders, Object.values(data).splice(0, data.length - 2));
        action.add({
            description: 'show all councils',
            context: council,
            func: council.getAll
        });
        action.rowClickedFunc = council.getOne;
    }

    async getOne(councilId) {
        if (typeof councilId !== "string") {
            councilId = councilId.firstChild.textContent;
        }
        let labels = ['Council ID', 'Branches', 'Creating Date', 'Expiration Date', 'Organization', 'Phone'];

        let data = await this.request.send(urls.councils + '/' + councilId);
        artist.drawInColumn(labels, Object.values(data[0]));
        action.add({
            description: 'show one councils',
            context: council,
            func: council.getOne,
            params: councilId
        })
    }

    async create() {
        this.postToCreate(urls.councils);
    }

    async saveChanges(fields, ids) {
        for (let rows = 0; rows < fields.length / 6; rows ++) {
            let body = new URLSearchParams();
            for (let i = rows * 6; i < 6 + rows * 6; i++) {
                if (i !== 1 && i - rows * 6 !== 1) {
                    console.log(i);
                    console.log(i - rows * 6 > 0 ? this.editFieldsNames[i - rows * 6] : this.editFieldsNames[0]);
                    console.log(fields[i].value);
                    body.append(i - rows * 6 > 0 ? this.editFieldsNames[i - rows * 6 - 1] : this.editFieldsNames[i - rows * 6], fields[i].value);
                }
            }
            console.log(body.getAll('org_name'));
            console.log(rows);
            let data = await this.request.send(urls.councils + '/' + ids[rows], "PUT", body);
            if (!data.isError) {
                artist.replaceToColumns();
            }
        }
    }

    async delete(id) {
        let data = await this.request.send(urls.councils + '/' + id, "DELETE");
        if (!data.isError) {
            notification.handle(data.notification);
        }
    }

    toString() {
        return 'Council'
    }
}

class Science extends Base {
    bg = new BranchGroup();
    fieldsLabels = ['Science ID', 'Name'];
    fieldsNames = ['science_id', 'name'];
    fieldsTypes = ['text', 'text'];

    async getAll() {
        let data = await this.request.send(urls.science);
        let tableHeaders = ['Номер научной отрасли', 'Название'];
        this.artist.drawTable(tableHeaders, Object.values(data).splice(0, data.length - 1));
        await this.addEventListeners();
        action.add({
            description: 'show all science',
            context: science,
            func: science.getAll
        });
        action.rowClickedFunc = this.bg.getOne;
    }

    async create() {
        await this.postToCreate(urls.science);
    }

    toString() {
        return 'Science';
    }
}

class BranchGroup extends Base {
    branch = new Branch();
    fieldsLabels = ['Branch Group ID', 'Name', 'Science ID'];
    fieldsNames = ['bg_id', 'name', 'science_id'];
    fieldsTypes = ['text', 'text', 'text'];

    async getOne(branchGroupId) {
        if (typeof branchGroupId !== "string") {
            branchGroupId = branchGroupId.firstChild.textContent;
        }
        let data = await this.request.send(urls.branchGroup + '/' + branchGroupId);
        let tableHeaders = ['Номер группы специальностей', 'Название', 'Номер научной отрасли'];
        this.artist.drawTable(tableHeaders, Object.values(data).splice(0, data.length - 1));
        await this.addEventListeners();
        action.add({
            description: 'show all branches',
            context: bg,
            func: bg.getOne,
            params: branchGroupId
        });
        action.rowClickedFunc = branch.getAll;
    }

    async create() {
        await this.postToCreate(urls.branchGroup + '/' + action.last[0].params);
    }

    toString() {
        return 'BranchGroup';
    }
}

class Branch extends Base {
    passport = new Passport();
    fieldsLabels = ['Branch ID', 'Name', 'Branch Group ID'];
    fieldsNames = ['branch_id', 'name', 'bg_id'];
    fieldsTypes = ['text', 'text', 'text'];

    async getAll(branchGroupId) {
        if (typeof branchGroupId !== "string") {
            branchGroupId = branchGroupId.firstChild.textContent;
        }
        let data = await this.request.send(urls.branches + '/' + branchGroupId);
        let tableHeaders = ['Код специальности', 'Название', 'Код группы специальностей'];
        this.artist.drawTable(tableHeaders, Object.values(data).splice(0, data.length - 1));
        await this.addEventListeners();
        action.add({
            context: branch,
            func: branch.getAll,
            params: branchGroupId
        });
        action.rowClickedFunc = passport.getOne;
    }

    async getOne(councilId) {
        let data = await this.request.send(urls.councils + '/' + councilId);
        action.add({
            context: branch,
            func: branch.getOne,
            params: councilId
        })
    }

    async create() {
        await this.postToCreate(urls.branches);
    }

    toString() {
        return 'Branch';
    }
}

class Passport extends Base {
    fieldsLabels = ['Branch ID', 'Definition', 'Likely Branches', 'Research', 'Differentiation'];
    fieldsNames = ['branch_id', 'definition', 'branches', 'research', 'differentiation'];
    fieldsTypes = ['text', 'text', 'text', 'text', 'text'];

    async getOne(branchId) {
        if (typeof branchId !== "string") {
            branchId = branchId.firstChild.textContent;
        }
        let data = await this.request.send(urls.branches + '/' + branchId);
        let header = 'Пасспорт специальности';
        let labels = ['Код специальности', 'Название', 'Определение', 'Схожие специальности', 'Область исследования', 'Расходимость с другими специальностями'];
        this.artist.drawInColumn(labels, Object.values(Object.values(data).splice(0, 1)[0]), header);
        action.add({
            context: passport,
            func: passport.getOne,
            params: branchId
        })
    }

    async create() {
        await this.postToCreate(urls.passport);
    }

    toString() {
        return 'Passport';
    }
}

class Action extends Base {
    last = [];
    backButton;
    rowClickedFunc;

    constructor() {
        super();
        this.backButton = document.createElement('button');
        this.backButton.addEventListener("click", () => {
            this.back();
        });
        this.backButton.innerText = "← Back"
    }

    back() {
        this.last.shift();
        this.last[0].func.call(this.last[0].context, this.last[0].params).then();
        this.last.shift();
        if (this.last.length === 0) {
            this.artist.hideBackButton(this.backButton);
        }
    }

    add(newAction) {
        if (JSON.stringify(newAction) !== JSON.stringify(this.last[0])) {
            this.last.unshift(newAction);
        }
        if (this.last.length === 2) {
            this.artist.drawBackButton(this.backButton);
        }
        if (this.last.length > 10) {
            this.last.splice(0, 7);
        }
    }
}
