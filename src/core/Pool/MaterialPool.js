import Pool from './';

/**
 * The particle pool is used for performantly generating particles.
 *
 */
export default class MaterialPool extends Pool {
  constructor(material) {
    super();

    this.create(() => material.clone());
  }
}
