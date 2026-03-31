// Terminal Typing Effect
document.addEventListener('DOMContentLoaded', () => {
    const textLines = [
        "git pull origin main",
        "Already up to date.",
        "Executing reconcile.sh...",
        "docker compose pull",
        "docker compose up -d --remove-orphans",
        "Network proxy_net is up",
        "Container cloudflared  Started",
        "Container vaultwarden  Started",
        "SYSTEM: State successfully reconciled."
    ];

    const typeArea = document.getElementById('typewriter');
    if(typeArea) {
        let lineIndex = 0;
        let charIndex = 0;

        function typeWriter() {
            if (lineIndex < textLines.length) {
                if (charIndex === 0) {
                    typeArea.innerHTML += `<div><span class="text-line"></span><span class="cursor"></span></div>`;
                }

                const currentLineElement = typeArea.lastElementChild.querySelector('.text-line');
                const cursor = typeArea.lastElementChild.querySelector('.cursor');

                if (charIndex < textLines[lineIndex].length) {
                    currentLineElement.textContent += textLines[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, Math.random() * 40 + 20); // typing speed
                } else {
                    cursor.style.display = 'none'; // hide old cursor
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeWriter, 400); // pause between lines
                }
            } else {
                // Done writing. Add a blinking cursor at the very end
                typeArea.innerHTML += `<div><span class="text-line">root@pibuster4:~# </span><span class="cursor"></span></div>`;
            }
        }
        
        setTimeout(typeWriter, 1000); // delay start
    }

    // Intersection Observers for fade-ins
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: "-20px" });

    document.querySelectorAll('.dash-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`;
        observer.observe(card);
    });
});
