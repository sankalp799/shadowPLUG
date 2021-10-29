module.exports = async (req, res, next) => {
    let newLog = await `[${req.ip}] : ${res.statusCode} - ${req.path} / ${req.protocol}`;
    console.log(newLog);
    next();
}
