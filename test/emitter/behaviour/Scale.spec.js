/*global describe, it */

import * as Proton from '../../../src';

import { TIME } from '../../constants';
import chai from 'chai';

const { assert } = chai;

describe('behaviour -> Scale', () => {
  const behaviour = new Proton.Scale(3, 11);
  const particle = new Proton.Particle();

  it('will set the same property to true if second arg is null or undefined', done => {
    const scaleA = new Proton.Scale(1, null);
    const scaleB = new Proton.Scale(1);

    assert.isTrue(scaleA._same);
    assert.isTrue(scaleB._same);

    done();
  });

  it('should instantiate with the correct properties', done => {
    const { life, easing, age, energy, dead, _same, a, b } = behaviour;

    assert.strictEqual(life, Infinity);
    assert.isFunction(easing);
    assert.strictEqual(age, 0);
    assert.strictEqual(energy, 1);
    assert.isFalse(dead);
    assert.isFalse(_same);
    assert.instanceOf(a, Proton.Span);
    assert.instanceOf(b, Proton.Span);
    assert.strictEqual(a.a, 3);
    assert.strictEqual(a.b, 3);
    assert.strictEqual(b.a, 11);
    assert.strictEqual(b.b, 11);

    done();
  });

  it('should initialize the particle with the correct properties', done => {
    behaviour.initialize(particle);

    const {
      transform: { scaleA, oldRadius, scaleB }
    } = particle;

    assert.strictEqual(scaleA, 3);
    assert.strictEqual(oldRadius, 10);
    assert.strictEqual(scaleB, 11);

    done();
  });

  it('should have set the correct properties on the particle after applying the behaviour', done => {
    assert.strictEqual(particle.radius, 10);
    assert.strictEqual(particle.scale, 1);

    behaviour.applyBehaviour(particle, TIME);

    assert.strictEqual(particle.radius, 30);
    assert.strictEqual(particle.scale, 3);
    done();
  });
});
