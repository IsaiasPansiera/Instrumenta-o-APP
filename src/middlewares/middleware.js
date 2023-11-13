exports.middlewareGlobal = (req, res, next) => {
  // injetando algo nesse middleware que por ser global, vai para todas
  // as rotas.
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (errors, req, res, next) => {
  if (errors) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}

exports.loginRequired = (req, res, next) => {
  if(!req.session.user) {
    req.flash('errors', "Você precisa fazer login.");
    req.session.save(() => res.redirect("/"));
    return;
  }
  next();
}
