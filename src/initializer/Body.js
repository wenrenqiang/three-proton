import Initializer from './Initializer';
import Util from '../utils/Util';
import { createArraySpan } from '../math';

/**
 * Sets the body property on initialized particles.
 *
 */
export default class Body extends Initializer {
  /**
   * Constructs a Body initalizer instance.
   *
   * @param {string|number} body - The color for the particle body
   * @param {?number} w - The width of the particle body
   * @param {?number} h - The height of the particle body
   * @return void
   */
  constructor(body, w, h) {
    super();

    /**
     * @desc The color for the particle body
     * @type {ArraySpan}
     */
    this.body = createArraySpan(body);

    /**
     * @desc The width of the particle Body
     * @type {number}
     */
    this.w = w;

    /**
     * @desc The height of the particle Body
     * @type {number}
     */
    this.h = Util.initValue(h, this.w);
  }

  /**
   * Sets the particle's initial body.
   *
   * @param {Particle} particle - the particle to initialize the property on
   * @return void
   */
  initialize(particle) {
    var body = this.body.getValue();

    if (this.w) {
      particle.body = {
        width: this.w,
        height: this.h,
        body: body
      };
    } else {
      particle.body = body;
    }
  }
}
