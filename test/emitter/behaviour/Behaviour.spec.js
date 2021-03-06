/*global describe, it */

import * as Proton from '../../../src';

import Behaviour from '../../../src/behaviour/Behaviour';
import chai from 'chai';

const { assert } = chai;

describe('behaviour -> Behaviour', () => {
  const behaviour = new Behaviour();

  it('should instantiate with the correct properties and methods', done => {
    const { id, life, easing, age, energy, dead } = behaviour;

    assert.isString(id);
    assert.strictEqual(life, Infinity);
    assert.isFunction(easing);
    assert.strictEqual(age, 0);
    assert.strictEqual(energy, 1);
    assert.isFalse(dead);
    assert.isFunction(behaviour.reset);
    assert.isFunction(behaviour.normalizeForce);
    assert.isFunction(behaviour.normalizeValue);
    assert.isFunction(behaviour.initialize);
    assert.isFunction(behaviour.applyBehaviour);
    assert.isFunction(behaviour.destroy);

    done();
  });

  it('should normalize force correctly', done => {
    const force = behaviour.normalizeForce(new Proton.Vector3D(1, 2.4, 3));

    assert.deepEqual(Object.values(force), [100, 240, 300]);

    done();
  });

  it('should normalize the value correctly', done => {
    assert.strictEqual(behaviour.normalizeValue(1.22), 122);

    done();
  });

  it('should set the particle to dead when age is > life', done => {
    const life = 1;
    const hasLife = new Behaviour(life);
    const particle = new Proton.Particle();

    hasLife.applyBehaviour(particle, life + 1);

    assert.isTrue(hasLife.dead);
    assert.equal(hasLife.energy, 0);

    done();
  });
});
