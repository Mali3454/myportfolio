import { Curtains, Plane, RenderTarget, ShaderPass } from 'https://cdn.jsdelivr.net/npm/curtainsjs@8.1.2/src/index.mjs'
import { TextTexture } from 'https://gistcdn.githack.com/martinlaxenaire/549b3b01ff4bd9d29ce957edd8b56f16/raw/2f111abf99c8dc63499e894af080c198755d1b7a/TextTexture.js'

const scrollFs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform sampler2D uRenderTexture;

    // lerped scroll deltas
    // negative when scrolling down, positive when scrolling up
    uniform float uScrollEffect;

    // default to 2.5
    uniform float uScrollStrength;


    void main() {
        vec2 scrollTextCoords = vTextureCoord;
        float horizontalStretch;

        // branching on an uniform is ok
        if(uScrollEffect >= 0.0) {
            scrollTextCoords.y *= 1.0 + -uScrollEffect * 0.00625 * uScrollStrength;
            horizontalStretch = sin(scrollTextCoords.y);
        }
        else if(uScrollEffect < 0.0) {
            scrollTextCoords.y += (scrollTextCoords.y - 1.0) * uScrollEffect * 0.00625 * uScrollStrength;
            horizontalStretch = sin(-1.0 * (1.0 - scrollTextCoords.y));
        }

        scrollTextCoords.x = scrollTextCoords.x * 2.0 - 1.0;
        scrollTextCoords.x *= 1.0 + uScrollEffect * 0.0035 * horizontalStretch * uScrollStrength;
        scrollTextCoords.x = (scrollTextCoords.x + 1.0) * 0.5;

        gl_FragColor = texture2D(uRenderTexture, scrollTextCoords);
    }
`

const vs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    // default mandatory variables
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    // custom variables
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

        // varyings
        vVertexPosition = aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`

const fs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform sampler2D uTexture;

    void main( void ) {
        gl_FragColor = texture2D(uTexture, vTextureCoord);
    }
`

window.addEventListener('load', () => {
	// create curtains instance
	const curtains = new Curtains({
		container: 'canvas',
		pixelRatio: Math.min(1.5, window.devicePixelRatio),
	})

	// track scroll values
	const scroll = {
		value: 0,
		lastValue: 0,
		effect: 0,
	}

	// on success
	curtains.onSuccess(() => {
		const fonts = {
			list: ['normal 400 1em "Archivo Black", sans-serif', 'normal 300 1em "Merriweather Sans", sans-serif'],
			loaded: 0,
		}

		// load the fonts first
		fonts.list.forEach(font => {
			document.fonts.load(font).then(() => {
				fonts.loaded++

				if (fonts.loaded === fonts.list.length) {
					// create our shader pass
					const scrollPass = new ShaderPass(curtains, {
						fragmentShader: scrollFs,
						depth: false,
						uniforms: {
							scrollEffect: {
								name: 'uScrollEffect',
								type: '1f',
								value: scroll.effect,
							},
							scrollStrength: {
								name: 'uScrollStrength',
								type: '1f',
								value: 2.5,
							},
						},
					})

					// calculate the lerped scroll effect
					scrollPass.onRender(() => {
						scroll.lastValue = scroll.value
						scroll.value = curtains.getScrollValues().y

						// clamp delta
						scroll.delta = Math.max(-30, Math.min(30, scroll.lastValue - scroll.value))

						scroll.effect = curtains.lerp(scroll.effect, scroll.delta, 0.05)
						scrollPass.uniforms.scrollEffect.value = scroll.effect
					})

					// create our text planes
					const textEls = document.querySelectorAll('.text-plane')

					textEls.forEach(textEl => {
						const textPlane = new Plane(curtains, textEl, {
							vertexShader: vs,
							fragmentShader: fs,
						})

						// create the text texture and... that's it!
						const textTexture = new TextTexture({
							plane: textPlane,
							textElement: textPlane.htmlElement,
							sampler: 'uTexture',
							resolution: 1.5,
							skipFontLoading: true, // we've already loaded the fonts
						})
					})
				}
			})
		})
	})

	// we will keep track of all our planes in an array
	let scrollEffect = 0

	curtains
		.onRender(() => {
			// update our planes deformation
			// increase/decrease the effect
			scrollEffect = curtains.lerp(scrollEffect, 0, 0.05)
		})
		.onScroll(() => {
			// get scroll deltas to apply the effect on scroll
			const delta = curtains.getScrollDeltas()

			// invert value for the effect
			delta.y = -delta.y

			// threshold
			if (delta.y > 50) {
				delta.y = 50
			} else if (delta.y < -50) {
				delta.y = -50
			}

			if (Math.abs(delta.y) > Math.abs(scrollEffect)) {
				scrollEffect = curtains.lerp(scrollEffect, delta.y, 0.1)
			}
		})
		.onError(() => {
			// we will add a class to the document body to display original images
			document.body.classList.add('no-curtains')
		})
		.onContextLost(() => {
			// on context lost, try to restore the context
			curtains.restoreContext()
		})

	// get our planes elements
	const planeElements = document.getElementsByClassName('plane')

	const distortionTarget = new RenderTarget(curtains)

	const vs1 = `
	precision mediump float;

	// default mandatory variables
	attribute vec3 aVertexPosition;
	attribute vec2 aTextureCoord;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;

	uniform mat4 planeTextureMatrix;

	// custom variables
	varying vec3 vVertexPosition;
	varying vec2 vTextureMatrixCoord;

	void main() {

		vec3 vertexPosition = aVertexPosition;

		gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

		// varyings
		vVertexPosition = vertexPosition;
		vTextureMatrixCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
	}
`

	const fs1 = `
	precision mediump float;

	varying vec3 vVertexPosition;
	varying vec2 vTextureMatrixCoord;

	uniform sampler2D planeTexture;

	void main() {
		// just display our texture
		gl_FragColor = texture2D(planeTexture, vTextureMatrixCoord);
	}
`

	// add our planes and handle them
	for (let i = 0; i < planeElements.length; i++) {
		const plane = new Plane(curtains, planeElements[i], {
			vertexShader: vs1,
			fragmentShader: fs1,
		})

		plane.setRenderTarget(distortionTarget)
	}

	const distortionFs = `
	precision mediump float;

	varying vec3 vVertexPosition;
	varying vec2 vTextureCoord;

	uniform sampler2D uRenderTexture;

	uniform float uScrollEffect;

	void main() {
		vec2 textureCoords = vTextureCoord;
		vec2 texCenter = vec2(0.5, 0.5);

		// distort around scene center
		textureCoords.y += cos((textureCoords.x - texCenter.x) * 3.141592) * uScrollEffect / 500.0;

		gl_FragColor = texture2D(uRenderTexture, textureCoords);
	}
`

	const distortionPass = new ShaderPass(curtains, {
		fragmentShader: distortionFs,
		renderTarget: distortionTarget,
		uniforms: {
			scrollEffect: {
				name: 'uScrollEffect',
				type: '1f',
				value: 0,
			},
		},
	})

	distortionPass.onRender(() => {
		// update the uniform
		distortionPass.uniforms.scrollEffect.value = scrollEffect
	})
})
