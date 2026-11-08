import test from "node:test";
import assert from "node:assert/strict";
import {WorldCatalog} from "../src/game/systems/worlds.js";
class MemoryStorage{data=new Map();getItem(k){return this.data.get(k)??null}setItem(k,v){this.data.set(k,String(v))}}
test("world catalog creates, lists, updates and deletes worlds",()=>{const c=new WorldCatalog(new MemoryStorage()),w=c.create({name:"My first world",seed:12345,radius:32,mode:"survival",difficulty:"hard"});assert.equal(c.get(w.id).seed,12345);assert.equal(c.update(w.id,{name:"Renamed world"}).name,"Renamed world");assert.equal(c.list().length,1);assert.equal(c.delete(w.id),true);assert.equal(c.list().length,0)});
test("world creation validates name, seed and radius",()=>{const c=new WorldCatalog(new MemoryStorage());assert.throws(()=>c.create({name:"",seed:1}),TypeError);assert.throws(()=>c.create({name:"Bad seed",seed:"abc"}),RangeError);assert.throws(()=>c.create({name:"Too large",seed:1,radius:65}),RangeError)});
test("malformed saved metadata is ignored",()=>{const s=new MemoryStorage();s.setItem("sarman-lost-versions-world-catalog",'[{"id":"bad","name":"bad","seed":"x"}]');assert.deepEqual(new WorldCatalog(s).list(),[])});
