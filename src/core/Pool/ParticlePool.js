import Particle from '../Particle';
import Pool from './';

/**
 * The particle pool is used for performantly generating particles.
 *
 */
export default class ParticlePool extends Pool {
  constructor() {
    super();

    this.create(() => new Particle());
  }
}
