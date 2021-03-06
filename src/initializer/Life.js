import Initializer from './Initializer';
import { createSpan } from '../math';

/**
 * Sets the life property on initialized particles.
 *
 */
export default class Life extends Initializer {
  /**
   * Constructs a Life property instance.
   *
   * @param {number} min - The minimum life
   * @param {number} max - The maximum life
   * @param {boolean} [center] - Determines whether to average the life value
   * @return void
   */
  constructor(min, max, center) {
    super();

    /**
     * @desc The life span of the particle.
     * @type {Span}
     */
    this.lifePan = createSpan(min, max, center);
  }

  /**
   * Sets the particle's initial life.
   *
   * @param {Particle} particle - the particle to initialize the property on
   * @return void
   */
  initialize(particle) {
    if (this.lifePan.a == Infinity || this.lifePan.a == 'infi')
      particle.life = Infinity;
    else particle.life = this.lifePan.getValue();
  }
}
