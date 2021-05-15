class Client {
    constructor(req) {
        this.req = req;
    }

    getLanguage() {
        if (!this.req.cookie || !this.req.cookie['lang']) {
            return 'en';
        }
        return this.req.cookie['lang'];
    }
}

module.exports = Client;