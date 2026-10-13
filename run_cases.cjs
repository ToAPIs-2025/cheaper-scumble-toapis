// Call the real Scumble ToAPIs provider. No Electron UI or image job without --live.
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2);const opt=n=>args.includes(n)?args[args.indexOf(n)+1]:null;
const upstream=opt('--upstream'),out=path.resolve(opt('--output')||'results');
if(!upstream)throw new Error('Use --upstream <pinned Scumble source>');
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'cases','briefs.json'),'utf8'));
const selected=opt('--case')?cases.filter(c=>c.id===opt('--case')):cases;
if(!args.includes('--live')){console.log(JSON.stringify({dryRun:true,cases:selected,generationCalls:0},null,2));process.exit(0)}
const env={...process.env};if(opt('--key-file'))for(const line of fs.readFileSync(opt('--key-file'),'utf8').split(/\r?\n/)){const m=line.trim().match(/^([A-Z_]+)\s*=\s*(.*)$/);if(m)env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'')}
if(!env.TOAPIS_API_KEY)throw new Error('Configure your own key privately');
const provider=require(path.resolve(upstream,'electron/main/providers/toapis.js'));
const recipe=JSON.parse(fs.readFileSync(path.resolve(upstream,'recipes/gpt_image_2.json'),'utf8')).providers.toapis;
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const records=[];
  for(const c of selected){
    const folder=path.join(out,c.id);fs.mkdirSync(folder,{recursive:true});
    if(fs.existsSync(path.join(folder,'evidence.json'))){records.push(JSON.parse(fs.readFileSync(path.join(folder,'evidence.json'),'utf8')));continue}
    const stateFile=path.join(folder,'receipt.json');
    if(fs.existsSync(stateFile))throw new Error('A prior task exists; query it before starting a fresh run');
    let posts=0;const observations=[];const started=Date.now();
    const req={provider:'toapis',model:recipe.model,options:recipe.options,fields:recipe.fields||null,kind:c.input?'fill':'text',prompt:c.prompt,negative:'',seed:42,width:1024,height:1024,references:[],params:{channel:c.route==='standard'?'standard':'vip',quality:c.route==='standard'?'medium':'low',resolution:'1k',background:'opaque'}};
    if(c.input)req.image=fs.readFileSync(path.join(out,c.input));
    const ctx={key:env.TOAPIS_API_KEY,base:(env.TOAPIS_BASE_URL||'https://toapis.cn').replace(/\/v1\/?$/,''),log(){},sleep:ms=>new Promise(r=>setTimeout(r,Math.max(ms,8000))),random:()=>.5,fetch:async(url,init={})=>{
      const u=new URL(url),api=['toapis.cn','toapis.com','api.toapis.cn','api.toapis.com'].includes(u.hostname);
      if(init.headers?.Authorization&&!api)throw new Error('Key must stay on ToAPIs hosts');
      const submit=(init.method||'GET').toUpperCase()==='POST'&&u.pathname==='/v1/images/generations';
      if(submit){if(++posts>1)throw new Error('Submission POST is not retried');fs.writeFileSync(stateFile,JSON.stringify({state:'submitting',task_id:null}));}
      const r=await fetch(url,{...init,redirect:'error'});
      if(submit){let body=await r.clone().json().catch(()=>({}));fs.writeFileSync(stateFile,JSON.stringify({state:r.ok?'submitted':'uncertain',task_id:body.id||body.task_id||null}));}
      if(api&&u.pathname.includes('/images/generations/')&&r.ok){let body=await r.clone().json().catch(()=>({}));observations.push({status:body.status,billing:body.billing||null});}
      return r;
    }};
    const result=await (c.input?provider.edit(req,ctx):provider.generate(req,ctx));
    fs.writeFileSync(path.join(folder,'result.png'),result.bytes);
    const record={project:'DenRakEiw/scumble',upstream_sha:'0d0be6b3e41f00e8621af14fe11597eaf258501f',checkedDate:'2026-10-13',case:c,status:'completed',task_id:result.info.task,info:result.info,elapsed_seconds:Math.round((Date.now()-started)/10)/100,sha256:crypto.createHash('sha256').update(result.bytes).digest('hex'),observations,method:'real upstream ToAPIs provider.generate/edit',scope:'provider module; Electron canvas and layer export not tested',postCount:posts};
    fs.writeFileSync(path.join(folder,'evidence.json'),JSON.stringify(record,null,2));records.push(record);console.log(JSON.stringify({case:c.id,task_id:record.task_id,elapsed:record.elapsed_seconds}));
  }
  fs.writeFileSync(path.join(out,'runs.json'),JSON.stringify(records,null,2));
})().catch(e=>{console.error(String(e.message).replaceAll(env.TOAPIS_API_KEY,'[redacted]'));process.exitCode=1});
