/**
 * Unit tests for kanun SEO order — real module, not reimplemented.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CORE_KANUN_ORDER,
  KANUN_SEO_ORDER,
  REST_KANUN_ORDER,
  PRIORITY_MADDE_BY_KANUN,
  representativeMaddeIds,
  assertCoreFirstOrder,
  kanunOrderIndex,
} from '../kanun-seo-order.mjs';

describe('kanun-seo-order', () => {
  it('core-first sequence matches plan', () => {
    assert.deepEqual(CORE_KANUN_ORDER, [
      'tbk',
      'tmk',
      'tck',
      'hmk',
      'iik',
      'ttk',
      'cmk',
      'is-kanunu',
    ]);
    assert.equal(assertCoreFirstOrder(KANUN_SEO_ORDER), true);
    assert.equal(kanunOrderIndex('tbk'), 0);
    assert.equal(kanunOrderIndex('tmk'), 1);
    assert.ok(kanunOrderIndex('yukk') > 7);
  });

  it('full order is core then rest without duplicates', () => {
    assert.equal(
      KANUN_SEO_ORDER.length,
      CORE_KANUN_ORDER.length + REST_KANUN_ORDER.length
    );
    assert.deepEqual(
      KANUN_SEO_ORDER.slice(0, CORE_KANUN_ORDER.length),
      CORE_KANUN_ORDER
    );
    const set = new Set(KANUN_SEO_ORDER);
    assert.equal(set.size, KANUN_SEO_ORDER.length);
  });

  it('TBK priority includes m.13 and representative probes use real ids', () => {
    assert.ok(PRIORITY_MADDE_BY_KANUN.tbk.includes(13));
    const rep = representativeMaddeIds('tbk');
    assert.ok(rep.includes('madde-13') || rep.includes('madde-1'));
    assert.ok(rep.length >= 3);
    assert.ok(rep.every((id) => /^madde-\d+$/.test(id)));
  });

  it('assertCoreFirstOrder throws on wrong sequence', () => {
    assert.throws(() => assertCoreFirstOrder(['tmk', 'tbk']), /Core order broken/);
  });
});
