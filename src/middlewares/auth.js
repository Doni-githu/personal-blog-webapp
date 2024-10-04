export default async function(req, res, next) {
    const auth = req.headers
    console.log(auth)
    next()
}