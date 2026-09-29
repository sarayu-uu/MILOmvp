import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run=promisify(execFile);
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'],{stdio:'pipe',windowsHide:true});
try{
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(d.toString().includes('4173'))res()});server.on('error',rej);server.on('exit',c=>rej(new Error('Preview exited '+c)))});
 for(const file of ['smoke.mjs','optional-smoke.mjs','picnic-smoke.mjs','home-visual.mjs']){const result=await run(process.execPath,[file],{windowsHide:true});console.log(file,result.stdout)}
}finally{server.kill()}
