export const notFoundPage = (req, res) => res.status(404).render("404",{
    title:"Not Found",
    username: req.user ? req.user.username : "",
    role:""})