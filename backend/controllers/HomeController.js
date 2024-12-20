class HomeController {
    static home(req, res) {
        res.send("Backend is running");
    }
}

module.exports = HomeController