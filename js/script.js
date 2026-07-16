/**
 * PetVibe Landing Page Scripts
 * Organizado em funções modulares.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initActiveNavigation();
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
    menuToggle.setAttribute('aria-expanded', 'false');

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
 * 2.1. Navegação Ativa
 * Atualiza o link ativo da navbar conforme a seção visível usando Intersection Observer.
 */
function initActiveNavigation() {
    const navLinks = Array.from(document.querySelectorAll('#navMenu .nav-link[href^="#"]'));

    if (navLinks.length === 0) return;

    const sectionLinks = navLinks
        .map(link => {
            const sectionId = link.getAttribute('href')?.slice(1);
            const section = sectionId ? document.getElementById(sectionId) : null;

            return section ? { sectionId, section, link } : null;
        })
        .filter(Boolean);

    if (sectionLinks.length === 0) return;

    const setActiveLink = (sectionId) => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    // Garante destaque correto quando a página carrega ou quando o usuário navega por âncoras.
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href')?.slice(1);
            if (targetId) {
                setActiveLink(targetId);
            }
        });
    });

    const firstSectionId = sectionLinks[0].sectionId;
    const lastSectionId = sectionLinks[sectionLinks.length - 1].sectionId;
    const visibleSections = new Map();

    const updateActiveFromVisibleSections = () => {
        if (visibleSections.size > 0) {
            let bestSectionId = firstSectionId;
            let bestRatio = -1;

            visibleSections.forEach((ratio, sectionId) => {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestSectionId = sectionId;
                }
            });

            setActiveLink(bestSectionId);
            return;
        }

        if (window.scrollY <= 2) {
            setActiveLink(firstSectionId);
            return;
        }

        const scrollBottom = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollBottom >= documentHeight - 2) {
            setActiveLink(lastSectionId);
        }
    };

    if ('IntersectionObserver' in window) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;

                if (entry.isIntersecting) {
                    visibleSections.set(sectionId, entry.intersectionRatio);
                } else {
                    visibleSections.delete(sectionId);
                }
            });

            updateActiveFromVisibleSections();
        }, {
            root: null,
            threshold: [0.2, 0.35, 0.5, 0.65],
            rootMargin: `-${headerHeight + 1}px 0px -45% 0px`
        });

        sectionLinks.forEach(({ section }) => observer.observe(section));
        updateActiveFromVisibleSections();
        return;
    }

    // Fallback enxuto para navegadores sem Intersection Observer.
    const updateByScroll = () => {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        const viewportReference = window.scrollY + headerHeight + (window.innerHeight * 0.35);
        let currentSectionId = firstSectionId;

        sectionLinks.forEach(({ sectionId, section }) => {
            if (viewportReference >= section.offsetTop) {
                currentSectionId = sectionId;
            }
        });

        setActiveLink(currentSectionId);
    };

    window.addEventListener('scroll', updateByScroll, { passive: true });
    updateByScroll();
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
        alignItems: 'center',
        justifyContent: 'center',
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

    if (contactForm) {
        initContactFormSubmission(contactForm);
    }

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

function initContactFormSubmission(contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const controls = Array.from(contactForm.querySelectorAll('.contact-form__control'));

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        clearContactFormFeedback(contactForm, controls);
        clearContactStatusTimer(contactForm);

        const payload = getContactFormPayload(contactForm);
        setContactFormLoadingState(contactForm, submitButton, true);

        try {
            const response = await fetch('http://localhost:3001/api/contato', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                applyContactFormErrors(contactForm, controls, result.errors, result.message || 'Não foi possível enviar o formulário.');
                return;
            }

            showContactFormMessage(contactForm, result.message || 'Mensagem enviada com sucesso.', 'success');
            contactForm.reset();
        } catch (error) {
            showContactFormMessage(contactForm, 'Falha na conexão. Tente novamente em instantes.', 'error');
        } finally {
            setContactFormLoadingState(contactForm, submitButton, false);
        }
    });
}

function getContactFormPayload(contactForm) {
    const formData = new FormData(contactForm);

    return {
        nome: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        telefone: String(formData.get('phone') || '').trim(),
        servico: String(formData.get('serviceType') || '').trim(),
        mensagem: String(formData.get('message') || '').trim()
    };
}

function setContactFormLoadingState(contactForm, submitButton, isLoading) {
    const label = isLoading ? 'Enviando...' : 'Enviar Mensagem';

    contactForm.dataset.loading = isLoading ? 'true' : 'false';

    if (submitButton) {
        submitButton.disabled = isLoading;
        submitButton.textContent = label;
    }
}

function showContactFormMessage(form, message, type = 'success') {
    let messageBox = form.querySelector('.contact-form__message');

    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.className = 'contact-form__message';
        form.insertBefore(messageBox, form.firstChild);
    }

    messageBox.textContent = message;
    messageBox.style.display = 'block';
    messageBox.style.marginBottom = '16px';
    messageBox.style.padding = '12px 16px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.fontWeight = '600';
    messageBox.style.lineHeight = '1.4';
    messageBox.style.border = '1px solid transparent';

    if (type === 'success') {
        messageBox.style.backgroundColor = '#e8f7ed';
        messageBox.style.color = '#146c2e';
        messageBox.style.borderColor = '#b7e4c7';
        clearContactStatusTimer(form);
        form.dataset.statusTimer = String(window.setTimeout(() => {
            if (messageBox.isConnected) {
                messageBox.remove();
            }
            clearContactStatusTimer(form);
        }, 4000));
        return;
    }

    messageBox.style.backgroundColor = '#fdecec';
    messageBox.style.color = '#9b1c1c';
    messageBox.style.borderColor = '#f5b5b5';
    messageBox.removeAttribute('data-auto-hide');
}

function clearContactFormFeedback(contactForm, controls) {
    const messageBox = contactForm.querySelector('.contact-form__message');

    if (messageBox) {
        messageBox.remove();
    }

    controls.forEach(clearContactFieldError);
}

function clearContactStatusTimer(form) {
    const timerId = Number(form.dataset.statusTimer || 0);

    if (timerId) {
        window.clearTimeout(timerId);
    }

    delete form.dataset.statusTimer;
}

function applyContactFormErrors(contactForm, controls, errors, fallbackMessage) {
    if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([fieldName, message]) => {
            setContactFieldError(contactForm, fieldName, message);
        });
    }

    showContactFormMessage(contactForm, fallbackMessage, 'error');
}

function setContactFieldError(contactForm, fieldName, message) {
    const field = contactForm.querySelector(`[name="${fieldName}"]`) || contactForm.querySelector(`#${fieldName}`);

    if (!field) {
        return;
    }

    const fieldWrapper = field.closest('.contact-form__field');
    const errorElement = fieldWrapper?.querySelector('.contact-form__error');

    if (fieldWrapper) {
        fieldWrapper.classList.add('contact-form__field--error');
    }

    field.classList.add('contact-form__control--invalid');
    field.setAttribute('aria-invalid', 'true');

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearContactFieldError(field) {
    const fieldWrapper = field.closest('.contact-form__field');
    const errorElement = fieldWrapper?.querySelector('.contact-form__error');

    field.classList.remove('contact-form__control--invalid');
    field.setAttribute('aria-invalid', 'false');

    if (fieldWrapper) {
        fieldWrapper.classList.remove('contact-form__field--error');
    }

    if (errorElement) {
        errorElement.textContent = '';
    }
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
