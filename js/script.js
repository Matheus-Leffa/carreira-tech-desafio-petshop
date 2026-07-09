/**
 * PetVibe Landing Page Scripts
 * Organizado em funções modulares.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initFormValidation();
    initScrollAnimations();
    initPlanToggle(); // Adicional útil para a tabela de planos
    initTestimonialsSlider(); // Adicional útil para o carrossel de depoimentos
});

/**
 * 1. Menu Mobile
 * Gerencia a abertura, fechamento e acessibilidade do menu de navegação.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const iconMenu = document.querySelector('.icon-menu');
    const iconClose = document.querySelector('.icon-close');

    if (!menuToggle || !navMenu) return;

    function toggleMenu() {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Alterna os ícones do menu
        if (iconMenu && iconClose) {
            iconMenu.classList.toggle('hidden', isOpen);
            iconClose.classList.toggle('hidden', !isOpen);
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/**
 * 2. Scroll Suave
 * Efeito de rolagem suave para links internos da página.
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios ou apenas hash
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Calcula offset para desconsiderar a altura do header fixo
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 3. Botão Voltar ao Topo
 * Cria dinamicamente, insere e estiliza o botão para rolar a página de volta ao início.
 */
function initBackToTop() {
    // Cria o botão dinamicamente para não poluir o HTML
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = '<i data-lucide="arrow-up"></i>';
    
    // Estilos dinâmicos do botão (para garantir consistência visual sem depender do CSS original)
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#6c5ce7',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
        cursor: 'pointer',
        display: 'flex',
        align-items: 'center',
        justify-content: 'center',
        transition: 'all 0.3s ease',
        opacity: '0',
        visibility: 'hidden',
        zIndex: '99'
    });

    document.body.appendChild(btn);
    
    // Atualiza os ícones do Lucide no botão recém-criado
    if (window.lucide) {
        window.lucide.createIcons({
            attrs: {
                style: 'width: 24px; height: 24px;'
            }
        });
    }

    // Monitora o scroll para exibir ou ocultar o botão
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
            btn.style.transform = 'translateY(10px)';
        }
    });

    // Hover effects do botão
    btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#5b4bc4';
        btn.style.transform = 'scale(1.08)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#6c5ce7';
        btn.style.transform = 'scale(1)';
    });

    // Ação de clique para voltar ao topo
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 4. Validação do Formulário de Contato e Newsletter
 * Valida e-mails, campos obrigatórios e exibe mensagens de feedback visual.
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Validação do Formulário de Contato
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Remove mensagens de feedback antigas
            removeFeedbackMessages(contactForm);

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            let firstInvalidInput = null;

            // Validações individuais
            if (!validateRequired(nameInput)) {
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = nameInput;
            }

            if (!validateRequired(emailInput) || !validateEmail(emailInput.value)) {
                isValid = false;
                setError(emailInput, 'Por favor, insira um e-mail válido.');
                if (!firstInvalidInput) firstInvalidInput = emailInput;
            } else {
                clearError(emailInput);
            }

            if (!validateRequired(phoneInput)) {
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = phoneInput;
            }

            if (!validateRequired(messageInput)) {
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = messageInput;
            }

            if (isValid) {
                showFeedback(contactForm, 'success', 'Muito obrigado! Sua mensagem foi enviada. Entraremos em contato em breve.');
                contactForm.reset();
            } else {
                showFeedback(contactForm, 'error', 'Por favor, preencha todos os campos obrigatórios corretamente.');
                if (firstInvalidInput) firstInvalidInput.focus();
            }
        });
    }

    // Validação do Formulário de Newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && validateEmail(emailInput.value)) {
                alert('Inscrição realizada com sucesso! Fique atento às nossas novidades.');
                newsletterForm.reset();
            } else {
                alert('Por favor, insira um e-mail válido.');
            }
        });
    }
}

// Auxiliar: Validação se preenchido
function validateRequired(input) {
    if (!input) return false;
    if (input.value.trim() === '') {
        setError(input, 'Este campo é obrigatório.');
        return false;
    }
    clearError(input);
    return true;
}

// Auxiliar: Validação de E-mail
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Auxiliar: Define mensagem de erro individual
function setError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    
    // Verifica se já existe um elemento de erro
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    
    // Estilização rápida de erro
    errorElement.style.color = '#ff7675';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '4px';
    errorElement.style.display = 'block';
    input.style.borderColor = '#ff7675';
}

// Auxiliar: Limpa erro individual
function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    input.style.borderColor = '';
}

// Auxiliar: Mostra alerta geral no formulário
function showFeedback(form, type, message) {
    const feedback = document.createElement('div');
    feedback.className = `form-feedback feedback-${type}`;
    feedback.textContent = message;
    
    // Estilização dinâmica da mensagem
    Object.assign(feedback.style, {
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontWeight: '600',
        fontSize: '0.95rem',
        textAlign: 'center',
        width: '100%',
        animation: 'fadeIn 0.3s ease'
    });

    if (type === 'success') {
        feedback.style.backgroundColor = '#d4edda';
        feedback.style.color = '#155724';
        feedback.style.border = '1px solid #c3e6cb';
    } else {
        feedback.style.backgroundColor = '#f8d7da';
        feedback.style.color = '#721c24';
        feedback.style.border = '1px solid #f5c6cb';
    }

    form.insertBefore(feedback, form.firstChild);
}

// Auxiliar: Remove feedbacks gerais anteriores
function removeFeedbackMessages(form) {
    const existingFeedbacks = form.querySelectorAll('.form-feedback');
    existingFeedbacks.forEach(msg => msg.remove());
}

/**
 * 5. Animações Simples de Scroll (Intersection Observer)
 * Revela elementos suavemente ao rolar a página.
 */
function initScrollAnimations() {
    // Adiciona estilos de transição via CSS diretamente para os elementos observados
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.reveal-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleTag);

    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.service-card, .plan-card, .testimonial-card');
    
    // Configura Intersection Observer
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Deixa de observar após animar
            }
        });
    }, observerOptions);

    // Registra elementos para observação
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    cards.forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });
}

/**
 * 6. Toggle de Planos (Mensal / Anual)
 * Modifica os valores na seção de preços com base na seleção.
 */
function initPlanToggle() {
    const planToggle = document.getElementById('planToggle');
    const priceVals = document.querySelectorAll('.price-val');
    const labels = document.querySelectorAll('.toggle-label');

    if (!planToggle) return;

    planToggle.addEventListener('click', () => {
        const isActive = planToggle.classList.toggle('active');
        
        // Ativa/Desativa labels
        labels.forEach(label => label.classList.toggle('active'));

        // Altera preços
        priceVals.forEach(priceVal => {
            const monthlyVal = priceVal.getAttribute('data-monthly');
            const yearlyVal = priceVal.getAttribute('data-yearly');
            
            if (isActive) {
                // Anual
                priceVal.textContent = yearlyVal;
            } else {
                // Mensal
                priceVal.textContent = monthlyVal;
            }
        });
    });
}

/**
 * 7. Carrossel de Depoimentos
 * Slider interativo com navegação de setas e pontos (dots).
 */
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!slider || cards.length === 0) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        
        // Desloca o slider horizontalmente
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza pontos (dots)
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    // Setas
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Pontos (dots)
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10);
            goToSlide(index);
        });
    });

    // Auto play sutil a cada 7 segundos
    let autoPlayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 7000);

    // Reseta timer ao interagir manual
    const resetInterval = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 7000);
    };

    [prevBtn, nextBtn].forEach(btn => btn?.addEventListener('click', resetInterval));
    dots.forEach(dot => dot.addEventListener('click', resetInterval));
}
