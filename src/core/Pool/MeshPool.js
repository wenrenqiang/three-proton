import Pool from './';

/**
 * The particle pool is used for performantly generating particles.
 *
 */
export default class MeshPool extends Pool {
  constructor(mesh) {
    super();

    this.create(() => mesh.clone());
  }
}
