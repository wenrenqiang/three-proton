import * as Behaviour from '../behaviour';
import * as Initializer from '../initializer';

import { EULER, POOL_MAX } from '../constants';
import {
  SUPPORTED_JSON_BEHAVIOUR_TYPES,
  SUPPORTED_JSON_INITIALIZER_TYPES
} from './constants';

import { Emitter } from '../emitter';
import { Proton } from '../core';
import Rate from '../initializer/Rate';
import { TextureLoader } from 'three';

/**
 * Makes a rate instance.
 *
 * @param {object} json - The data required to construct a Rate instance
 * @return {Rate}
 */
const makeRate = json => new Rate.fromJSON(json);

/**
 * Makes initializers from json items.
 *
 * @param {array<object>} items - An array of objects which provide initializer constructor params
 * @return {array<Initializer>}
 */
const makeInitializers = items =>
  new Promise((resolve, reject) => {
    const numberOfInitializers = items.length;
    const madeInitializers = [];
    const doNotRequireTextureLoading = items.filter(
      ({ properties }) => !properties.texture
    );
    const doRequireTextureLoading = items.filter(
      ({ properties }) => properties.texture
    );

    doNotRequireTextureLoading.forEach(data => {
      const { type, properties } = data;

      if (!SUPPORTED_JSON_INITIALIZER_TYPES.includes(type)) {
        return reject(
          `The initializer type ${type} is invalid or not yet supported`
        );
      }

      madeInitializers.push(new Initializer[type].fromJSON(properties));

      if (madeInitializers.length === numberOfInitializers) {
        return resolve(madeInitializers);
      }
    });

    doRequireTextureLoading.forEach(data => {
      const {
        type,
        properties,
        properties: { texture }
      } = data;
      const textureLoader = new TextureLoader();

      if (!SUPPORTED_JSON_INITIALIZER_TYPES.includes(type)) {
        return reject(
          `The initializer type ${type} is invalid or not yet supported`
        );
      }

      textureLoader.load(
        texture,
        loadedTexture => {
          madeInitializers.push(
            new Initializer[type].fromJSON({
              ...properties,
              loadedTexture
            })
          );

          if (madeInitializers.length === numberOfInitializers) {
            return resolve(madeInitializers);
          }
        },
        undefined,
        reject
      );
    });
  });

/**
 * Makes behaviours from json items.
 *
 * @param {array<object>} items - An array of objects which provide behaviour constructor params
 * @return {Promise<array>}
 */
const makeBehaviours = items =>
  new Promise((resolve, reject) => {
    const numberOfBehaviours = items.length;
    const madeBehaviours = [];

    items.forEach(data => {
      const { type, properties } = data;

      if (!SUPPORTED_JSON_BEHAVIOUR_TYPES.includes(type)) {
        return reject(
          `The behaviour type ${type} is invalid or not yet supported`
        );
      }

      madeBehaviours.push(new Behaviour[type].fromJSON(properties));

      if (madeBehaviours.length === numberOfBehaviours) {
        return resolve(madeBehaviours);
      }
    });
  });

const makeEmitters = emitters =>
  new Promise((resolve, reject) => {
    const madeEmitters = [];
    const numberOfEmitters = emitters.length;

    if (!numberOfEmitters) {
      return resolve(madeEmitters);
    }

    emitters.forEach(data => {
      const emitter = new Emitter();
      const { rate, initializers, behaviours, position } = data;

      makeInitializers(initializers)
        .then(madeInitializers => {
          emitter.setInitializers(madeInitializers);

          return makeBehaviours(behaviours);
        })
        .then(madeBehaviours => {
          emitter
            .setBehaviours(madeBehaviours)
            .setPosition(position)
            .setRate(makeRate(rate))
            .emit();

          madeEmitters.push(emitter);

          if (madeEmitters.length === numberOfEmitters) {
            return resolve(madeEmitters);
          }
        })
        .catch(reject);
    });
  });

/**
 * Creates a Proton instance from a JSON object.
 *
 * @param {object} json - The JSON to create the Proton instance from
 * @param {number} json.preParticles - The predetermined number of particles
 * @param {string} json.integrationType - The integration algorithm to use
 * @param {array<object>} json.emitters - The emitters for the proton instance
 * @return {Promise<Proton>}
 */
export default json =>
  new Promise((resolve, reject) => {
    const {
      preParticles = POOL_MAX,
      integrationType = EULER,
      emitters = []
    } = json;
    const proton = new Proton(preParticles, integrationType);

    makeEmitters(emitters)
      .then(madeEmitters => {
        const numberOfEmitters = madeEmitters.length;

        if (!numberOfEmitters) {
          return resolve(proton);
        }

        madeEmitters.forEach(madeEmitter => {
          proton.addEmitter(madeEmitter);

          if (proton.emitters.length === numberOfEmitters) {
            resolve(proton);
          }
        });
      })
      .catch(reject);
  });
