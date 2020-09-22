# descriptive-regexp

Makes it easier to work with regular expressions.

From `test/index.test.ts`:

```typescript
import { concat, literal, oneOf, optional, withFlags, capture } from '../src';

describe('literal', () => {
  it('keeps literal characters', () => {
    expect(literal('abcd')).toEqual(/abcd/);
  });
  it('escapes special characters', () => {
    expect(literal('[')).toEqual(/\[/);
    expect(literal(']')).toEqual(/\]/);
    expect(literal('[abcd]')).toEqual(/\[abcd\]/);
    expect(literal('0..1')).toEqual(/0\.\.1/);
    expect(literal(' ^ ')).toEqual(/ \^ /);
    expect(literal('^ ')).toEqual(/\^ /);
    expect(literal('and/or')).toEqual(/and\/or/);
    expect(literal('?')).toEqual(/\?/);
  });
});

describe('concat', () => {
  it('concatenates expressions', () => {
    expect(concat(/^/, 'a.b/c', /(1|2)/)).toEqual(/^a\.b\/c(1|2)/);
  });
});

describe('oneOf', () => {
  it('allows for multiple matches', () => {
    expect(oneOf(/^a/, 'b', /c/)).toEqual(/(?:^a|b|c)/);
  });
});

describe('optional', () => {
  it('makes single characters optional', () => {
    expect(optional('a')).toEqual(/a?/);
  });
  it('makes expressions optional', () => {
    expect(optional('abc')).toEqual(/(?:abc)?/);
  });
});

describe('capture', () => {
  it('creates capture groups', () => {
    expect(capture(oneOf('a', 'b', 'c'))).toEqual(/((?:a|b|c))/);
  });
});

describe('withFlags', () => {
  it('adds flags to the original expression', () => {
    expect(withFlags(/abc/, 'i')).toEqual(/abc/i);
  });
  it('removes all flags before adding new ones', () => {
    expect(withFlags(/abc/i, 'g')).toEqual(/abc/g);
  });
});

test('Complex RegExp', () => {
  const re = concat(
    /^/,
    'https://',
    oneOf(
      concat('www', optional('2'), '.example.com/path'),
      'some.other.domain.tld/different-path'
    ),
    '/controller.php?action=',
    oneOf('create', 'update'),
    '&'
  );
  expect(re).toEqual(
    /^https:\/\/(?:www2?\.example\.com\/path|some\.other\.domain\.tld\/different\x2dpath)\/controller\.php\?action=(?:create|update)&/
  );
});
```
