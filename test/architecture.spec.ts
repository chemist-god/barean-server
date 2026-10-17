import { readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? sources(resolve(dir, e.name))
      : e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts')
        ? [resolve(dir, e.name)]
        : [],
  );
}
function violations(file: string, content: string): string[] {
  const path = relative(resolve('src'), file).replaceAll('\\', '/');
  const layer = path.includes('/domain/')
    ? 'domain'
    : path.includes('/application/')
      ? 'application'
      : undefined;
  if (!layer) return [];
  const errors: string[] = [];
  function check(target: string): void {
    const resolved = target.startsWith('.')
      ? resolve(file, '..', target).replaceAll('\\', '/')
      : target;
    const targetPath = relative(resolve('src'), resolved).replaceAll('\\', '/');
    const crossRepository =
      target.startsWith('.') &&
      targetPath.split('/')[0] !== path.split('/')[0] &&
      /repository|\/infrastructure\//.test(targetPath);
    if (
      (!target.startsWith('.') && !target.startsWith('node:')) ||
      resolved.includes('/infrastructure/') ||
      (layer === 'domain' && resolved.includes('/application/')) ||
      crossRepository
    )
      errors.push(path + ' -> ' + target);
  }
  const ast = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  function visit(node: ts.Node): void {
    if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    )
      check(node.argument.literal.text);
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      check(node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === 'require'))
    ) {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) check(arg.text);
      else errors.push(path + ' -> nonliteral runtime import');
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return errors;
}
describe('architecture boundaries', () => {
  it('keeps domain and application outside framework and infrastructure adapters', () => {
    const files = sources(resolve('src'));
    expect(files.length).toBeGreaterThan(0);
    expect(
      files.some((p) => p.replaceAll('\\', '/').includes('/domain/')),
    ).toBe(true);
    expect(
      files.flatMap((file) => violations(file, readFileSync(file, 'utf8'))),
    ).toEqual([]);
  });
  it('detects static, dynamic and require framework imports and cross-context repositories', () => {
    const file = resolve('src/people/domain/example.ts');
    for (const code of [
      "import { Module } from '@nestjs/common';",
      "void import('@prisma/client');",
      "type Client = import('@prisma/client').PrismaClient;",
      "require('@nestjs/core');",
      "import x from '../../../units/application/ports/unit-repository.port';",
    ])
      expect(violations(file, code).length).toBeGreaterThan(0);
  });
});
