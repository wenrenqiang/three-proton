import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three';
import { MaterialPool, MeshPool } from '../core';

import BaseRenderer from './BaseRenderer';

export default class MeshRenderer extends BaseRenderer {
  constructor(container) {
    super();

    this.container = container;

    this.meshPool = null;
    this.materialPool = null;
    this.defaultParticleBody = new Mesh(
      new BoxGeometry(50, 50, 50),
      new MeshLambertMaterial({ color: '#ff0000' })
    );
  }

  setupMeshPool(mesh) {
    if (this.meshPool) {
      return;
    }

    this.meshPool = new MeshPool(mesh);

    return this;
  }

  setupMaterialPool(material) {
    if (this.materialPool) {
      return;
    }

    this.materialPool = new MaterialPool(material);

    return this;
  }

  onProtonUpdate() {}

  onParticleCreated(particle) {
    if (!particle.target) {
      if (!particle.body) {
        particle.body = this.defaultParticleBody;
      }

      this.setupMeshPool(particle.body);

      //set target
      particle.target = this.meshPool.use();

      //set material
      if (particle.useAlpha || particle.useColor) {
        this.setupMaterialPool(particle.body.material);

        particle.target.material = this.materialPool.use();
      }
    }

    if (particle.target) {
      particle.target.position.copy(particle.p);
      this.container.add(particle.target);
    }
  }

  onParticleUpdate(particle) {
    if (particle.target) {
      particle.target.position.copy(particle.p);
      particle.target.rotation.set(
        particle.rotation.x,
        particle.rotation.y,
        particle.rotation.z
      );
      this.scale(particle);

      if (particle.useAlpha) {
        particle.target.material.opacity = particle.alpha;
        particle.target.material.transparent = true;
      }

      if (particle.useColor) {
        particle.target.material.color.copy(particle.color);
      }
    }
  }

  scale(particle) {
    particle.target.scale.set(particle.scale, particle.scale, particle.scale);
  }

  onParticleDead(particle) {
    if (particle.target) {
      if (particle.useAlpha || particle.useColor)
        this.materialPool.recycle(particle.target.material);

      this.meshPool.recycle(particle.target);
      this.container.remove(particle.target);
      particle.target = null;
    }
  }
}
