/*global describe, it */

import * as Proton from '../../../src';

import { Sprite, SpriteMaterial, Texture, TextureLoader } from 'three';

import chai from 'chai';
import domino from 'domino';
import sinon from 'sinon';

const { assert } = chai;
const { spy } = sinon;

global.window = domino.createWindow();
global.document = window.document;

// NOTE This spec is a bit challenging because it seems like for some reason when testing with node
// the TextureLoader's callback method never gets entered.

describe('initializer -> BodySprite', () => {
  const texture = '../fixtures/dot.png';

  it('should call the TextureLoader.load method passing the texture on instantiation', done => {
    const textureLoaderSpy = spy(TextureLoader.prototype, 'load');

    new Proton.BodySprite(texture);

    assert(textureLoaderSpy.calledOnceWith(texture));

    textureLoaderSpy.restore();

    done();
  });

  it('should construct the initializer from a JSON object', done => {
    const textureLoaderSpy = spy(TextureLoader.prototype, 'load');
    const instance = Proton.BodySprite.fromJSON({
      texture,
      materialProperties: {
        fog: false,
        color: 0xffffff
      }
    });

    assert.instanceOf(instance, Proton.BodySprite);
    assert(textureLoaderSpy.calledOnceWith(texture));

    textureLoaderSpy.restore();
    done();
  });

  it('should instantiate fully with a preloaded texture', done => {
    const loadedTexture = new TextureLoader().load(texture);
    const bodySprite = new Proton.BodySprite(
      undefined,
      undefined,
      loadedTexture
    );

    assert.instanceOf(bodySprite.texture, Texture);
    assert.instanceOf(bodySprite.material, SpriteMaterial);
    assert.instanceOf(bodySprite.sprite, Sprite);
    assert.deepEqual(bodySprite.material.map, bodySprite.texture);

    done();
  });

  it('should construct the initializer fully from a JSON object containing a preloaded texture', done => {
    const loadedTexture = new TextureLoader().load(texture);
    const instance = Proton.BodySprite.fromJSON({
      texture,
      materialProperties: {
        fog: false,
        color: 0xffffff
      },
      loadedTexture
    });

    assert.instanceOf(instance, Proton.BodySprite);
    assert.instanceOf(instance.texture, Texture);
    assert.instanceOf(instance.material, SpriteMaterial);
    assert.instanceOf(instance.sprite, Sprite);
    assert.deepEqual(instance.material.map, instance.texture);

    done();
  });
});
