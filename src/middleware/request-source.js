module.exports = function requestSource(req, res, next) {

    //source=job_ionic_app&parentSource=google
    let source = req.query.source;
    let parentSource = req.query.parentSource;

    next();
};
