import * as RE from '../src';

describe('literal', () => {
  it('keeps literal characters', () => {
    expect(RE.literal('abcd')).toEqual(/abcd/);
  });
  it('escapes special characters', () => {
    expect(RE.literal('[')).toEqual(/\[/);
    expect(RE.literal(']')).toEqual(/\]/);
    expect(RE.literal('[abcd]')).toEqual(/\[abcd\]/);
    expect(RE.literal('0..1')).toEqual(/0\.\.1/);
    expect(RE.literal(' ^ ')).toEqual(/ \^ /);
    expect(RE.literal('^ ')).toEqual(/\^ /);
    expect(RE.literal('and/or')).toEqual(/and\/or/);
    expect(RE.literal('?')).toEqual(/\?/);
  });
});

describe('concat', () => {
  it('concatenates expressions', () => {
    expect(RE.concat(/^/, 'a.b/c', /(1|2)/)).toEqual(/^a\.b\/c(1|2)/);
  });
});

describe('oneOf', () => {
  it('allows for multiple matches', () => {
    expect(RE.oneOf(/^a/, 'b', /c/)).toEqual(/(?:^a|b|c)/);
  });
});

describe('optional', () => {
  it('makes single characters optional', () => {
    expect(RE.optional('a')).toEqual(/a?/);
  });
  it('makes expressions optional', () => {
    expect(RE.optional('abc')).toEqual(/(?:abc)?/);
  });
});

describe('capture', () => {
  it('creates capture groups', () => {
    expect(RE.capture(RE.oneOf('a', 'b', 'c'))).toEqual(/((?:a|b|c))/);
  });
});

describe('withFlags', () => {
  it('adds flags to the original expression', () => {
    expect(RE.withFlags(/abc/, 'i')).toEqual(/abc/i);
  });
  it('removes all flags before adding new ones', () => {
    expect(RE.withFlags(/abc/i, 'g')).toEqual(/abc/g);
  });
});

test('Complex RegExp', () => {
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
  expect(re).toEqual(
    /^https:\/\/(?:www2?\.example\.com\/path|some\.other\.domain\.tld\/different\x2dpath)\/controller\.php\?action=(?:create|update)&/
  );
});

test('match', () => {
  expect(RE.match('abcd', /bc*d/)).toEqual('abcd'.match(/bc*d/));
});

test('test', () => {
  expect(RE.test('abcd', /ghij/)).toBe(false);
  expect(RE.test('abcd', 'c')).toBe(true);
});

test('matchAll', () => {
  expect(RE.matchAll('zoo', /o/g)).toEqual('zoo'.matchAll(/o/g));
});
