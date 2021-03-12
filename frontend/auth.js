class Auth {
    isLogin = false;
    request = new Requests();
    form = document.querySelector('#loginForm form');
    notification = new Notification();

    async login() {
        let body = new URLSearchParams();
        let formData = new FormData(this.form);
        if (formData.get('username') !== '' && formData.get('password') !== '') {
            for (const pair of formData) {
                body.append(pair[0], pair[1]);
            }
            let { notification } = await this.request.send(urls.login, 'POST', body);
            this.notification.handle(notification);
            if (!notification.isError) {
                this.isLogin = true;
                main.dispatchEvent(userLoggedIn);
                artist.closeLoginForm();
            }
        }
    }

    async checkStatus() {
        let { notification } = await this.request.send(urls.status, 'POST');
        this.isLogin = !notification.message;
        if (!this.isLogin) {
            main.dispatchEvent(userLoggedOut);
        } else {
            main.dispatchEvent(userLoggedIn);
        }
    }

    async logout() {
        await this.request.send(urls.logout, 'POST');
        await this.checkStatus();
    }
}
