class Notification {
    notificationContainer = document.getElementById('notificationContainer');

    handle(notificationObject) {
        let background = 'green';
        if (notificationObject.isError) {
            background = 'red';
        }
        let notification = document.createElement('div');
        notification.classList.add('notification', background);
        notification.innerText = notificationObject.message;
        this.notificationContainer.append(notification);
        setTimeout(() => {
            notification.remove()
        }, 3000);
    }
}
