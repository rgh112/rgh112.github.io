import * as THREE from 'three';

export function initNetworks() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll<HTMLElement>('[data-network]').forEach(host => {
    const stage = host.querySelector<HTMLElement>('.network-stage')!;
    const button = host.querySelector<HTMLButtonElement>('.motion-button')!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    stage.appendChild(renderer.domElement);
    host.classList.add('webgl-ready');
    button.hidden = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.z = 7.8;
    const group = new THREE.Group();
    scene.add(group);
    const count = 230;
    const positions = new Float32Array(count * 3);
    const base: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      base.push(new THREE.Vector3(Math.cos(theta) * r * 1.5, y * 1.5, Math.sin(theta) * r * 1.5));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sprite = document.createElement('canvas'); sprite.width = sprite.height = 32;
    const ctx = sprite.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(16,16,14,0,Math.PI*2); ctx.fill();
    const texture = new THREE.CanvasTexture(sprite);
    const material = new THREE.PointsMaterial({ color: 0x171717, size: .038, map: texture, transparent: true, opacity: .9, alphaTest: .1 });
    group.add(new THREE.Points(geometry, material));
    const pairs: [number, number][] = [];
    for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) if (base[i].distanceTo(base[j]) < .46) pairs.push([i, j]);
    const linePositions = new Float32Array(pairs.length * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: .21 });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x777777, transparent: true, opacity: .15 });
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({length:129},(_,i)=>new THREE.Vector3(Math.cos(i/128*Math.PI*2)*1.95,Math.sin(i/128*Math.PI*2)*1.95,0)));
    const ring = new THREE.Line(ringGeometry,ringMaterial); ring.rotation.x = 1.1; ring.rotation.y = .2; scene.add(ring);
    let paused = reduced.matches, visible = false, frame = 0, time = 0, last = 0, target = 0, morph = 0;
    let pointerX = 0, pointerY = 0;
    const setButton = () => { button.setAttribute('aria-pressed', String(paused)); button.setAttribute('aria-label', paused ? 'Play network animation' : 'Pause network animation'); button.innerHTML = `<span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span>`; };
    setButton();
    function draw(stamp = 0) {
      if (!paused) time += Math.min((stamp - last) / 1000, .05); last = stamp;
      morph += (target - morph) * .05;
      for (let i = 0; i < count; i++) {
        const p = base[i]; const cluster = i % 3; const shift = (cluster - 1) * .85 * morph;
        positions[i*3] = p.x * (1 - morph * .3) + shift;
        positions[i*3+1] = p.y * (1 - morph * .24) + Math.sin(i*.2 + time*.3)*.025;
        positions[i*3+2] = p.z * (1 - morph * .3);
      }
      geometry.attributes.position.needsUpdate = true;
      pairs.forEach(([a,b],i)=>{for(let j=0;j<3;j++){linePositions[i*6+j]=positions[a*3+j];linePositions[i*6+3+j]=positions[b*3+j];}});
      lineGeometry.attributes.position.needsUpdate = true;
      group.rotation.y = time * .065 + pointerX * .1;
      group.rotation.z = -.22; group.rotation.x = .16 + pointerY * .07;
      renderer.render(scene, camera);
      if (visible && !paused) frame = requestAnimationFrame(draw); else frame = 0;
    }
    function refresh() { if (frame) cancelAnimationFrame(frame); frame = 0; draw(performance.now()); }
    const resize = new ResizeObserver(() => { const {width,height}=stage.getBoundingClientRect(); renderer.setSize(width,height); camera.aspect=width/height; camera.updateProjectionMatrix(); refresh(); }); resize.observe(stage);
    const intersection = new IntersectionObserver(entries=>{ visible=entries[0].isIntersecting && !document.hidden; refresh(); }); intersection.observe(host);
    button.addEventListener('click',()=>{paused=!paused;setButton();refresh();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;setButton();refresh();});
    host.addEventListener('pointermove',e=>{if(paused)return;const r=host.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;});
    document.addEventListener('visibilitychange',()=>{const rect=host.getBoundingClientRect();visible=!document.hidden&&rect.bottom>0&&rect.top<innerHeight;refresh();});
    if(host.dataset.story==='true') {
      const sections=document.querySelectorAll<HTMLElement>('[data-chapter]');
      const chapterObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){target=Number((entry.target as HTMLElement).dataset.chapter)/3;sections.forEach(s=>s.classList.toggle('chapter-active',s===entry.target));if(paused){morph=target;refresh();}}},{rootMargin:'-25% 0px -35% 0px'});
      sections.forEach(section=>chapterObserver.observe(section));
    }
    window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();geometry.dispose();lineGeometry.dispose();ringGeometry.dispose();material.dispose();lineMaterial.dispose();ringMaterial.dispose();texture.dispose();renderer.dispose();},{once:true});
  });
}
