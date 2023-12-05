export function entryParamExports(req, res, next)  {
    req.routeParams = { ...req.params };
    next();
}