// ===========================
// Scene Control
// ===========================
let currentScene = 1;

function showScene(sceneNumber) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => scene.style.display = 'none'); // hide all
    const activeScene = document.getElementById('scene' + sceneNumber);
    if(activeScene) activeScene.style.display = 'flex';
}

// Initially show scene 1
showScene(currentScene);

// ===========================
// Scene 1: Particle Animation
// ===========================

// THREE.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particle-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Particle geometry
const particleCount = 1000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 400;
    positions[i*3+1] = (Math.random() - 0.5) * 400;
    positions[i*3+2] = (Math.random() - 0.5) * 400;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Particle material
const material = new THREE.PointsMaterial({ color: 0xff66aa, size: 2 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    renderer.render(scene, camera);
}
animateParticles();

// ===========================
// Fade-in Text Line by Line
// ===========================
const textElements = document.querySelectorAll('.fade-text');

function wrapLetters(element) {
    const text = element.textContent;
    element.textContent = '';
    Array.from(text).forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'drop-letter';
        span.style.setProperty('--i', index);
        span.textContent = char === ' ' ? '\u00a0' : char;
        element.appendChild(span);
    });
}

textElements.forEach(wrapLetters);

function fadeInTextLine(index) {
    if(index >= textElements.length) return;
    textElements[index].classList.add('drop-active');
    setTimeout(() => fadeInTextLine(index + 1), 2000); // fade next line after 2s
}

// Start fading in text
fadeInTextLine(0);

// ===========================
// Auto-transition to Scene 2 after 15s
// ===========================
setTimeout(() => {
    currentScene = 2;
    showScene(currentScene);
    initScene2(); // auto-start scene 2
}, 15000);

// ===========================
// Handle Window Resize
// ===========================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// ===========================
// Scene 2: Video Montage
// ===========================
function initScene2() {
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.muted = false;
    
    // List your videos here (replace with your actual filenames in assets/videos/)
    const videoList = [
        
        
        'assets/videos/video6.mp4'
        
        
    ];

    let currentVideo = 0;

    function playNextVideo() {
        if(currentVideo >= videoList.length) {
            // All videos done, go to Scene 3
            currentScene = 3;
            showScene(currentScene);
            initScene3(); // function we'll define next
            return;
        }
        videoPlayer.src = videoList[currentVideo];
        videoPlayer.play().catch(() => {});
    }

    // When video ends, play next
    videoPlayer.onended = () => {
        currentVideo++;
        playNextVideo();
    };

    // Start the first video
    playNextVideo();
}

 
// ===========================
// Scene 3: Slideshow + Poem + Music
// ===========================
function initScene3() {
    const slideshow = document.getElementById('slideshow');
    const poemContainer = document.getElementById('poem');
    const poemText = document.getElementById('poem-text');
    const bgMusic = document.getElementById('bg-music');

    // ---------------------------
    // Background Music
    // ---------------------------
    bgMusic.src = 'assets/music/background.mp3'; // replace with your file
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {});
    const unlockAudio = () => {
        window.userActivatedAudio = true;
        bgMusic.play().catch(() => {});
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    // ---------------------------
    // Picture Slideshow
    // ---------------------------
    const pictures = [
        'assets/images/pic1.jpg',
        'assets/images/pic2.jpg',
        'assets/images/pic3.jpg',
        'assets/images/pic4.jpg',
        'assets/images/pic5.jpg',
        'assets/images/pic6.jpg',
        'assets/images/pic7.jpg'

    ]; // Add more pictures as needed

    let currentPic = 0;
    poemContainer.style.display = 'none';

    function showNextPicture() {
        if(currentPic >= pictures.length) {
            // Slideshow finished → show poem
            showPoem();
            return;
        }

        // Clear slideshow
        slideshow.innerHTML = '';

        // Create img element
        const img = document.createElement('img');
        img.src = pictures[currentPic];
        img.style.opacity = 0;
        img.style.transition = 'opacity 4s ease-in-out';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '80vh';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';


        slideshow.appendChild(img);

        // Fade in
        setTimeout(() => img.style.opacity = 1, 100);

        currentPic++;

        // Show next picture after 8 seconds
        setTimeout(showNextPicture, 8000);
    }

    showNextPicture();

    // ---------------------------
    // Poem Fade-in
    // ---------------------------
    const poemLines = [
         `I swear the day I met her,
the world tilted a little—
like it suddenly remembered
how to shine in the right direction.

She’s got this laugh
that feels like someone opening a window
in a stuffy room—
fresh, unexpected,
the kind that makes you forget
whatever was heavy a minute ago.

She doesn’t try to be magic,
but somehow she is—
in the way she listens,
in the way she finds the soft spots
in everything I pretend is tough.

When she talks,
I catch myself staring,
not because she’s perfect,
but because she’s real—
the kind of real that makes you
want to be better without anyone asking.

If love had footsteps,
hers would sound like quiet confidence,
like someone walking beside you
without ever trying to outrun you.

And honestly?
The world could lose its map tomorrow,
and I’d still know exactly where home is—
right where she is,
standing bright
in her sunrise-colored way.`
    ]; // Replace with your actual poem lines

    function showPoem(index = 0) {
        if (index === 0) {
            slideshow.style.display = 'none';
            poemContainer.style.display = 'block';
        }
        if(index >= poemLines.length) {
            // Poem done → go to Scene 4 (Questions)
            setTimeout(() => {
                currentScene = 4;
                showScene(currentScene);
                initScene4(); // function we'll define next
            }, 120000);
            return;
        }

        poemText.innerHTML += poemLines[index] + '<br>';
        setTimeout(() => showPoem(index + 1), 2500); // show next line every 2.5s
    }
}
// ===========================
// Scene 4: Questions
// ===========================
function initScene4() {
    const questionsForm = document.getElementById('questions-form');

    // Replace with your own questions
    const questions = [
        "Do you hate me?",
        "do you love me?",
        "What’s something you want us to improve together?",
        "What’s something I do that makes you feel loved?"
    ];

    questions.push(
        "What's your favorite memory of us?",
        "Ever cried for something I did?",
        "What's a small thing you'd love us to do more often?",
        "What's one place you want us to visit together?",
        "What's a song that reminds you of us?",
        "What's one promise you want us to keep?"
    );

    // Create input fields for each question
    questions.forEach((question, index) => {
        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = question;

        const input = document.createElement('textarea');
        input.id = `answer_${index}`;
        input.className = 'question-input';

        questionsForm.appendChild(label);
        questionsForm.appendChild(input);
    });

    // Handle submission
    const submitBtn = document.getElementById('submit-answers');
    submitBtn.onclick = () => {
        const answers = [];

        questions.forEach((q, index) => {
            const input = document.getElementById(`answer_${index}`);
            answers.push({
                question: q,
                answer: input.value.trim()
            });
        });

        // Save answers globally to use in Scene 5
        window.collectedAnswers = answers;

        // Move to Scene 5
        currentScene = 5;
        showScene(currentScene);
        initScene5();
    };
}
// ===========================
// Scene 5: Summary
// ===========================
function initScene5() {
    const summaryDiv = document.getElementById('answers-summary');
    summaryDiv.innerHTML = ""; // clear previous content

    if (!window.collectedAnswers) {
        summaryDiv.innerHTML = "<p>No answers found.</p>";
        return;
    }

    window.collectedAnswers.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.style.margin = "20px 0";
        wrapper.style.textAlign = "left";
        wrapper.style.maxWidth = "700px";

        const q = document.createElement('p');
        q.style.fontWeight = "bold";
        q.textContent = (index + 1) + ". " + item.question;

        const a = document.createElement('p');
        a.textContent = item.answer || "(No answer given)";

        wrapper.appendChild(q);
        wrapper.appendChild(a);
        summaryDiv.appendChild(wrapper);
    });
}
