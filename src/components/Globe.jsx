import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function Globe() {
  const mountRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const w = mountRef.current.clientWidth
    const h = mountRef.current.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    mountRef.current.appendChild(renderer.domElement)

    const fov = 75
    const aspect = w / h
    const near = 0.1
    const far = 10
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    const scene = new THREE.Scene()

    const earthGroup = new THREE.Group()
    earthGroup.rotation.z = -23.4 * Math.PI / 180
    scene.add(earthGroup)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.03

    const geo = new THREE.IcosahedronGeometry(1.0, 22)
    const mat = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/threejs/textures/00_earthmap1k.jpg")
    })

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    scene.add(hemiLight)

    // SYSTÈME DE CLIC SUR LA PLANÈTE
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event) {
      // Convertir les coordonnées de la souris en coordonnées normalisées (-1 à +1)
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Mettre à jour le raycaster avec la position de la souris
      raycaster.setFromCamera(mouse, camera)

      // Calculer les objets intersectés par le rayon
      const intersects = raycaster.intersectObject(mesh)

      if (intersects.length > 0) {
        // Si on a cliqué sur la Terre
        console.log("Clic sur la Terre détecté!")

        // Rediriger vers un autre site
        window.location.href = "https://www.nuitdelinfo.com/inscription/defis/499" // Changez l'URL ici

        // OU ouvrir dans un nouvel onglet :
        // window.open("https://www.example.com", "_blank");
      }
    }

    // Ajouter l'écouteur d'événement
    renderer.domElement.addEventListener('click', onMouseClick)

    // Fonction d'animation
    function animate(t = 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
      mesh.rotation.y = t * 0.0001
      renderer.render(scene, camera)
      controls.update()
    }
    animate()

    // Gestion du redimensionnement
    function handleResize() {
      if (!mountRef.current) return
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onMouseClick)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
