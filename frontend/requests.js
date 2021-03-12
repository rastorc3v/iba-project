class Requests {
    async send(url, method, body) {
        let data =  await fetch(url, {
            method: method,
            body: body,
            credentials: "include"
        });
        if (data.ok) {
            data = await data.json();
            if (data.notification?.isError) {
                notification.handle(data.notification);
            }
            return  data
        } else {
            throw Error('response error');
        }
    }

    convertDataToBody(htmlFormElement) {
        let body = new URLSearchParams();
        let formData = new FormData(htmlFormElement);
        for (const pair of formData) {
            body.append(pair[0], pair[1]);
        }
        return body;
    }
}
