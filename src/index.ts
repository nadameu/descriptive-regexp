import escapeStringRegexp from 'escape-string-regexp';

type Expr = string | RegExp;

export function concat(...exprs: Expr[]) {
  return RegExp(exprs.map(toSource).join(''));
}

export function fromExpr(expr: Expr) {
  return typeof expr === 'string' ? literal(expr) : expr;
}

export function toSource(expr: Expr) {
  return fromExpr(expr).source;
}

export function literal(text: string) {
  return RegExp(escapeStringRegexp(text));
}

export function oneOf(...exprs: Expr[]) {
  return RegExp(`(?:${exprs.map(toSource).join('|')})`);
}

export function optional(expr: Expr) {
  const source = toSource(expr);
  if (source.length === 1) return RegExp(`${source}?`);
  else return RegExp(`(?:${toSource(expr)})?`);
}

export function withFlags(expr: Expr, flags?: string) {
  return RegExp(toSource(expr), flags);
}

export function capture(expr: Expr) {
  return RegExp(`(${toSource(expr)})`);
}