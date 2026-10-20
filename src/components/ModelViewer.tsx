import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MODELS } from '../data/portfolioData';
import { ModelConfig, RenderMode } from '../types';

function makeToonRamp(): THREE.DataTexture {
  const steps = new Uint8Array([70, 150, 220, 255]);
  const t = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
}

function makeMatcap(): THREE.CanvasTexture {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d');
  if (x) {
    x.fillStyle = '#1b1b1f';
    x.fillRect(0, 0, s, s);
    const g = x.createRadialGradient(s * 0.36, s * 0.3, s * 0.04, s * 0.5, s * 0.5, s * 0.62);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.45, '#c8c8d2');
    g.addColorStop(1, '#3f414d');
    x.fillStyle = g;
    x.beginPath();
    x.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
    x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeUVChecker(): THREE.CanvasTexture {
  const n = 8;
  const cell = 64;
  const s = n * cell;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d');
  if (x) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        x.fillStyle = (i + j) % 2 ? '#cfd3da' : '#6f7681';
        x.fillRect(i * cell, j * cell, cell, cell);
      }
    }
    x.strokeStyle = 'rgba(0,0,0,.35)';
    for (let i = 0; i <= n; i++) {
      x.beginPath();
      x.moveTo(i * cell, 0);
      x.lineTo(i * cell, s);
      x.stroke();
      x.beginPath();
      x.moveTo(0, i * cell);
      x.lineTo(s, i * cell);
      x.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

interface ModelStats {
  verts: number;
  tris: number;
  meshes: number;
  materials: number;
}

export const ModelViewer: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);
  const [renderMode, setRenderMode] = useState<RenderMode>('shaded');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>('Loading 3D model…');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelStats, setModelStats] = useState<ModelStats | null>(null);

  // References to Three.js internals
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const homeRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 }>({
    pos: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });
  const rootMeshRef = useRef<THREE.Group | null>(null);
  const setModeFnRef = useRef<((mode: RenderMode) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e10);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    stage.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a3a, 0.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(2, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    fillLight.position.set(-3, 2, -3);
    scene.add(fillLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // Materials
    const ramp = makeToonRamp();
    const uvTex = makeUVChecker();
    const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: makeMatcap(), side: THREE.DoubleSide });
    const normalMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x9fb4c8, wireframe: true });
    const loader = new GLTFLoader();

    function toToon(std: any) {
      const m = new THREE.MeshToonMaterial({
        color: std.color ? std.color.clone() : new THREE.Color(0xffffff),
        map: std.map || null,
        gradientMap: ramp,
        emissive: std.emissive ? std.emissive.clone() : new THREE.Color(0),
        emissiveMap: std.emissiveMap || null,
        transparent: std.transparent,
        opacity: std.opacity,
        alphaTest: std.alphaTest,
        alphaMap: std.alphaMap || null,
        side: std.side,
        depthWrite: std.depthWrite,
      });
      if (std.emissiveMap || (std.emissive && std.emissive.getHex() > 0x050505)) {
        m.emissiveIntensity = Math.max(std.emissiveIntensity || 1, 1.9);
      }
      return m;
    }

    function toBasic(std: any, map?: THREE.Texture) {
      return new THREE.MeshBasicMaterial({
        color: map ? 0xffffff : (std.color ? std.color.clone() : new THREE.Color(0xffffff)),
        map: map || std.map || null,
        transparent: std.transparent,
        opacity: std.opacity,
        alphaTest: std.alphaTest,
        alphaMap: std.alphaMap || null,
        side: std.side,
      });
    }

    function eachMesh(fn: (mesh: THREE.Mesh) => void) {
      if (rootMeshRef.current) {
        rootMeshRef.current.traverse((o: any) => {
          if (o.isMesh) fn(o as THREE.Mesh);
        });
      }
    }

    function applyRenderMode(mode: RenderMode) {
      eachMesh((o: any) => {
        switch (mode) {
          case 'base':
            o.material = o.userData.base;
            break;
          case 'wire':
            o.material = wireMaterial;
            break;
          case 'matcap':
            o.material = matcapMaterial;
            break;
          case 'normals':
            o.material = normalMaterial;
            break;
          case 'uv':
            o.material = o.userData.uv;
            break;
          default:
            o.material = o.userData.toon;
            break;
        }
      });
    }
    setModeFnRef.current = applyRenderMode;

    function disposeRoot() {
      if (!rootMeshRef.current) return;
      rootMeshRef.current.traverse((o: any) => {
        if (!o.isMesh) return;
        o.geometry?.dispose();
        ['std', 'toon', 'base', 'uv'].forEach((k) => {
          const v = o.userData[k];
          (Array.isArray(v) ? v : [v]).forEach((m) => {
            if (!m) return;
            m.map?.dispose();
            m.emissiveMap?.dispose();
            m.alphaMap?.dispose();
            m.dispose();
          });
        });
      });
      scene.remove(rootMeshRef.current);
      rootMeshRef.current = null;
    }

    let isDisposed = false;

    function loadModelUrl(url: string) {
      setIsLoading(true);
      setLoadingText('Loading 3D model…');

      loader.load(
        url,
        (gltf) => {
          if (isDisposed) return;
          disposeRoot();
          const root = gltf.scene;
          rootMeshRef.current = root;

          const box = new THREE.Box3().setFromObject(root);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          root.position.sub(center);
          scene.add(root);

          eachMesh((o: any) => {
            const stds = Array.isArray(o.material) ? o.material : [o.material];
            stds.forEach((m: any) => {
              if (!m) return;
              if ('metalness' in m) m.metalness = 0;
              if ('roughness' in m) m.roughness = 1;
              if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
              if (m.emissiveMap) m.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            });
            const arr = Array.isArray(o.material);
            o.userData.std = o.material;
            o.userData.toon = arr ? stds.map(toToon) : toToon(stds[0]);
            o.userData.base = arr ? stds.map((m: any) => toBasic(m)) : toBasic(stds[0]);
            o.userData.uv = arr ? stds.map((m: any) => toBasic(m, uvTex)) : toBasic(stds[0], uvTex);
          });

          applyRenderMode(renderMode);

          // Calculate stats
          let verts = 0;
          let tris = 0;
          let meshes = 0;
          const matSet = new Set();
          eachMesh((o: any) => {
            meshes++;
            const g = o.geometry;
            if (g && g.attributes.position) {
              verts += g.attributes.position.count;
              tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
            }
            (Array.isArray(o.userData.std) ? o.userData.std : [o.userData.std]).forEach(
              (m: any) => m && matSet.add(m)
            );
          });
          setModelStats({
            verts,
            tris: Math.round(tris),
            meshes,
            materials: matSet.size,
          });

          // Camera setup
          const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
          const dist = radius / Math.sin((camera.fov * Math.PI) / 180 / 2);
          camera.position.set(dist * 0.55, radius * 0.35, dist * 1.05);
          camera.near = dist / 100;
          camera.far = dist * 100;
          camera.updateProjectionMatrix();

          controls.target.set(0, 0, 0);
          controls.update();
          homeRef.current.pos.copy(camera.position);
          homeRef.current.target.copy(controls.target);

          setIsLoading(false);
        },
        (ev) => {
          if (ev.total) {
            setLoadingText(`Loading 3D model… ${Math.round((ev.loaded / ev.total) * 100)}%`);
          }
        },
        (err) => {
          console.warn('Could not load 3D model:', err);
          setLoadingText('Could not load 3D model. Please select another character.');
          setIsLoading(false);
        }
      );
    }

    loadModelUrl(selectedModel.url);

    // Resize
    function resize() {
      if (!stage) return;
      const w = stage.clientWidth || 1;
      const h = stage.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    // Render loop
    let visible = true;
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    }, { threshold: 0.01 });
    io.observe(stage);

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      isDisposed = true;
      ro.disconnect();
      io.disconnect();
      renderer.setAnimationLoop(null);
      disposeRoot();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [selectedModel]);

  // Sync mode changes without full model reload
  const handleModeChange = (mode: RenderMode) => {
    setRenderMode(mode);
    if (setModeFnRef.current) {
      setModeFnRef.current(mode);
    }
  };

  const handleToggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = next;
    }
  };

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(homeRef.current.pos);
      controlsRef.current.target.copy(homeRef.current.target);
      controlsRef.current.update();
    }
  };

  return (
    <section className="section" id="viewer">
      <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 03 · INSPECT THE MODEL">
        <h2 className="section__title">3D Viewer</h2>
        <p className="section__sub">
          Inspect the actual asset / shaded, base color, wireframe, matcap, normals, UV and live model stats.
        </p>
      </div>

      <div className="viewer">
        <div className="viewer__stage" id="viewer-stage" ref={stageRef}>
          {isLoading && (
            <div className="viewer__loading" id="viewer-loading">
              {loadingText}
            </div>
          )}

          {showInfo && modelStats && (
            <div className="viewer__info is-open" id="viewer-info">
              <div className="viewer__info-row">
                <span>Vertices</span>
                <b>{modelStats.verts.toLocaleString()}</b>
              </div>
              <div className="viewer__info-row">
                <span>Triangles</span>
                <b>{modelStats.tris.toLocaleString()}</b>
              </div>
              <div className="viewer__info-row">
                <span>Meshes</span>
                <b>{modelStats.meshes}</b>
              </div>
              <div className="viewer__info-row">
                <span>Materials</span>
                <b>{modelStats.materials}</b>
              </div>
              <div className="viewer__info-row">
                <span>Format</span>
                <b>glTF Binary</b>
              </div>
            </div>
          )}

          <div className="viewer__hint">drag = rotate · scroll = zoom · right-drag = pan</div>

          <div className="viewer__chars" role="group" aria-label="Choose character">
            {MODELS.map((m) => (
              <button
                key={m.name}
                className={`charbtn ${selectedModel.name === m.name ? 'is-active' : ''}`}
                type="button"
                title={m.name}
                onClick={() => {
                  if (selectedModel.name !== m.name) {
                    setSelectedModel(m);
                  }
                }}
              >
                <img src={m.thumb} alt={m.name} loading="lazy" />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="viewer__bar">
          <div className="viewer__group">
            <div className="viewer__modes" role="group" aria-label="Render mode">
              <button
                className={`vbtn ${renderMode === 'shaded' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('shaded')}
              >
                Shaded
              </button>
              <button
                className={`vbtn ${renderMode === 'base' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('base')}
              >
                Base Color
              </button>
              <button
                className={`vbtn ${renderMode === 'wire' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('wire')}
              >
                Wireframe
              </button>
              <button
                className={`vbtn ${renderMode === 'matcap' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('matcap')}
              >
                Matcap
              </button>
              <button
                className={`vbtn ${renderMode === 'normals' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('normals')}
              >
                Normals
              </button>
              <button
                className={`vbtn ${renderMode === 'uv' ? 'is-active' : ''}`}
                type="button"
                onClick={() => handleModeChange('uv')}
              >
                UV
              </button>
            </div>
          </div>

          <div className="viewer__group viewer__group--end">
            <button
              className={`btn ${showInfo ? 'btn--solid' : 'btn--ghost'}`}
              id="viewer-info-btn"
              type="button"
              onClick={() => setShowInfo(!showInfo)}
            >
              Model Info: {showInfo ? 'On' : 'Off'}
            </button>
            <button
              className="btn btn--ghost"
              id="viewer-rotate"
              type="button"
              onClick={handleToggleAutoRotate}
            >
              Auto-rotate: {autoRotate ? 'On' : 'Off'}
            </button>
            <button
              className="btn btn--ghost"
              id="viewer-reset"
              type="button"
              onClick={handleReset}
            >
              Reset view
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
