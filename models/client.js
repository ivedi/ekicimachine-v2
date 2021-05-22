class Client {
    constructor(req) {
        this.req = req;
    }

    getLanguage() {
        if (!this.req.cookies || !this.req.cookies['lang']) {
            return 'en';
        }
        return this.req.cookies['lang'];
    }
}

module.exports = Client;