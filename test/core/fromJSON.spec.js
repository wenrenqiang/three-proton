/*global describe, it */

import Particles from '../../src/core/Proton';
import { TextureLoader } from 'three';
import chai from 'chai';
import domino from 'domino';
import noTextures from './fixtures/json/noTextures.json';
import sinon from 'sinon';
import withTextures from './fixtures/json/withTextures.json';

const { spy } = sinon;
const { assert } = chai;

global.window = domino.createWindow();
global.document = window.document;

describe('fromJSON', () => {
  it('should return a proton instance', done => {
    Particles.fromJSON({}).then(proton => {
      assert.instanceOf(proton, Particles);

      done();
    });
  });

  it('should instantiate the noTextures fixture from JSON', done => {
    Particles.fromJSON(noTextures).then(proton => {
      assert.lengthOf(proton.emitters, noTextures.emitters.length);
      assert.lengthOf(
        proton.emitters[0].initializers,
        noTextures.emitters[0].initializers.length
      );
      assert.lengthOf(
        proton.emitters[1].initializers,
        noTextures.emitters[1].initializers.length
      );
      assert.lengthOf(
        proton.emitters[0].behaviours,
        noTextures.emitters[0].behaviours.length
      );
      assert.lengthOf(
        proton.emitters[1].behaviours,
        noTextures.emitters[1].behaviours.length
      );

      assert.equal(proton.emitters[0].p.x, noTextures.emitters[0].position.x);
      assert.equal(proton.emitters[1].p.x, noTextures.emitters[1].position.x);

      done();
    });
  });

  it('should called TextureLoader.load the same number of times textures are found in the initializers', done => {
    const { emitters } = withTextures;
    const textureLoaderSpy = spy(TextureLoader.prototype, 'load');
    let textureCount = 0;

    emitters.forEach(data => {
      const { initializers } = data;
      const haveTextures = initializers.filter(
        ({ properties }) => properties.texture
      );

      textureCount += haveTextures.length;
    });

    Particles.fromJSON(withTextures);

    assert.equal(textureCount, 2);
    assert(textureLoaderSpy.callCount, textureCount);

    textureLoaderSpy.restore();
    done();
  });
});
