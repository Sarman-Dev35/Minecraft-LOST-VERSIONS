/**
 * Three.js chunk renderer. Each chunk owns its own instanced meshes so unloading
 * a chunk releases its GPU objects without rebuilding every other chunk.
 */
export class ChunkRenderer {
  constructor({ THREE, scene, geometry, materials }) {
    if (!THREE || !scene || !geometry || !materials) throw new TypeError("THREE, scene, geometry and materials are required");
    this.THREE=THREE; this.scene=scene; this.geometry=geometry; this.materials=materials;
    this.rendered=new Map();
  }

  build(chunk) {
    this.unload(chunk.key);
    const groups=new Map();
    for (const block of chunk.blocks) {
      if (!groups.has(block.t)) groups.set(block.t,[]);
      groups.get(block.t).push(block);
    }
    const meshes=[];
    for (const [type,blocks] of groups) {
      const material=this.materials[type];
      if (!material || !blocks.length) continue;
      const mesh=new this.THREE.InstancedMesh(this.geometry,material,blocks.length);
      const object=new this.THREE.Object3D();
      blocks.forEach((block,index)=>{
        object.position.set(block.x,block.y,block.z);
        object.updateMatrix();
        mesh.setMatrixAt(index,object.matrix);
      });
      mesh.instanceMatrix.needsUpdate=true;
      mesh.userData.blocks=blocks;
      mesh.userData.type=type;
      mesh.userData.chunkKey=chunk.key;
      this.scene.add(mesh);
      meshes.push(mesh);
    }
    this.rendered.set(chunk.key,meshes);
    chunk.dirty=false;
    return meshes;
  }

  sync(chunks) {
    const wanted=new Set(chunks.map(chunk=>chunk.key));
    for(const key of this.rendered.keys()) if(!wanted.has(key)) this.unload(key);
    for(const chunk of chunks) if(chunk.dirty || !this.rendered.has(chunk.key)) this.build(chunk);
  }

  unload(key) {
    const meshes=this.rendered.get(key);
    if(!meshes)return;
    for(const mesh of meshes)this.scene.remove(mesh);
    this.rendered.delete(key);
  }

  clear() {
    for(const key of [...this.rendered.keys()])this.unload(key);
  }
}
