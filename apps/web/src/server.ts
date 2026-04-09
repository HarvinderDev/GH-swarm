import Fastify from 'fastify';

const app = Fastify();
const apiBase = process.env.API_BASE_URL ?? 'http://localhost:4000';

app.get('/', async () => `<!doctype html>
<html>
  <head><title>Codex GitHub Swarm Dashboard</title></head>
  <body style="font-family: sans-serif; max-width: 960px; margin: 2rem auto;">
    <h1>Codex GitHub Swarm</h1>
    <p>Dashboard + chat operator surface</p>
    <form id="form">
      <input id="prompt" style="width:70%" value="Fix tests and prepare draft PR" />
      <button type="submit">Run intent</button>
    </form>
    <pre id="out"></pre>
    <script>
      const out = document.getElementById('out');
      async function bootstrap(){
        const ws = await fetch('${apiBase}/workspaces', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({name:'Dashboard Workspace'})}).then(r=>r.json());
        const repo = await fetch('${apiBase}/repos', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({workspaceId: ws.id, fullName:'demo/repo'})}).then(r=>r.json());
        window.__ctx = {ws, repo};
        out.textContent = 'Workspace: '+ws.id+'\nRepo: '+repo.id;
      }
      bootstrap();
      document.getElementById('form').addEventListener('submit', async (e)=>{
        e.preventDefault();
        const prompt = document.getElementById('prompt').value;
        const res = await fetch('${apiBase}/chat/intents', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({workspaceId: window.__ctx.ws.id, repoId: window.__ctx.repo.id, prompt})}).then(r=>r.json());
        const pub = await fetch('${apiBase}/approvals/'+res.run.id+'/approve', {method:'POST'}).then(r=>r.json());
        out.textContent = JSON.stringify({res, pub}, null, 2);
      });
    </script>
  </body>
</html>`);

const start = async () => {
  await app.listen({ host: '0.0.0.0', port: Number(process.env.WEB_PORT ?? '3000') });
};

start();
