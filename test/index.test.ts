import * as RE from '../src';
import { expect } from 'chai';

describe('literal', () => {
  it('keeps literal characters', () => {
    expect(RE.literal('abcd')).to.deep.equal(/abcd/);
  });
  it('escapes special characters', () => {
    expect(RE.literal('[')).to.deep.equal(/\[/);
    expect(RE.literal(']')).to.deep.equal(/\]/);
    expect(RE.literal('[abcd]')).to.deep.equal(/\[abcd\]/);
    expect(RE.literal('0..1')).to.deep.equal(/0\.\.1/);
    expect(RE.literal(' ^ ')).to.deep.equal(/ \^ /);
    expect(RE.literal('^ ')).to.deep.equal(/\^ /);
    expect(RE.literal('and/or')).to.deep.equal(/and\/or/);
    expect(RE.literal('?')).to.deep.equal(/\?/);
  });
});

describe('concat', () => {
  it('concatenates expressions', () => {
    expect(RE.concat(/^/, 'a.b/c', /(1|2)/)).to.deep.equal(/^a\.b\/c(1|2)/);
  });
});

describe('oneOf', () => {
  it('allows for multiple matches', () => {
    expect(RE.oneOf(/^a/, 'b', /c/)).to.deep.equal(/(?:^a|b|c)/);
  });
});

describe('optional', () => {
  it('makes single characters optional', () => {
    expect(RE.optional('a')).to.deep.equal(/a?/);
  });
  it('makes expressions optional', () => {
    expect(RE.optional('abc')).to.deep.equal(/(?:abc)?/);
  });
});

describe('capture', () => {
  it('creates capture groups', () => {
    expect(RE.capture(RE.oneOf('a', 'b', 'c'))).to.deep.equal(/(a|b|c)/);
  });
});

describe('withFlags', () => {
  it('adds flags to the original expression', () => {
    expect(RE.withFlags(/abc/, 'i')).to.deep.equal(/abc/i);
  });
  it('removes all flags before adding new ones', () => {
    expect(RE.withFlags(/abc/i, 'g')).to.deep.equal(/abc/g);
  });
});

it('Complex RegExp', () => {
  const re = RE.concat(
    /^/,
    'https://',
    RE.oneOf(
      RE.concat('www', RE.optional('2'), '.example.com/path'),
      'some.other.domain.tld/different-path'
    ),
    '/controller.php?action=',
    RE.oneOf('create', 'update'),
    '&'
  );
  expect(re).to.deep.equal(
    /^https:\/\/(?:www2?\.example\.com\/path|some\.other\.domain\.tld\/different\x2dpath)\/controller\.php\?action=(?:create|update)&/
  );
});

it('match', () => {
  expect(RE.match('abcd', /bc*d/)).to.deep.equal('abcd'.match(/bc*d/));
});

it('test', () => {
  expect(RE.test('abcd', /ghij/)).to.be.false;
  expect(RE.test('abcd', 'c')).to.be.true;
});

it('matchAll', () => {
  expect(RE.matchAll('zoo', /o/g)).to.deep.equal('zoo'.matchAll(/o/g));
});

it('exactly', () => {
  expect(RE.exactly('abcd')).to.deep.equal(/^abcd$/);
});
