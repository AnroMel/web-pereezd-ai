document.addEventListener('DOMContentLoaded', () => {
    // Определяем, на какой странице мы находимся
    const currentPage = window.location.pathname.split("/").pop();
    const isEconomyPage = currentPage === "economy.html";

    // Бургер-меню на мобильных (до 970px)
    const burger = document.getElementById('burger');
    const nav = document.getElementById('main-nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-open');
            nav.classList.toggle('is-open');
        });
    }

    // Плавный скролл по якорям (только для ссылок с #)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return; // если на странице нет такого блока — выходим

            e.preventDefault();

            const headerOffset = 80;
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const offsetTop = rect.top + scrollTop - headerOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // закрытие меню на мобильном
            if (burger && burger.classList.contains('is-open')) {
                burger.classList.remove('is-open');
                nav.classList.remove('is-open');
            }
        });
    });

    // ==========================
    // АКТИВНЫЙ ПУНКТ МЕНЮ
    // ==========================

    if (isEconomyPage) {
        // Если мы на economy.html — включаем только "Экономика"
        const headerLinks = document.querySelectorAll('.header__nav a');
        headerLinks.forEach(link => link.classList.remove('is-active'));

        const economyLink = document.querySelector('.header__nav a[href$="economy.html"]');
        if (economyLink) {
            economyLink.classList.add('is-active');
        }
        // ВАЖНО: дальше ничего не делаем, чтобы логика скролла не перезаписала active
    } else {
        // Логика активного пункта по скроллу — только для лендинга (index.html)
        const sections = ['top', 'about', 'preconditions', 'services', 'contact']
            .map(id => document.getElementById(id))
            .filter(Boolean);

        function updateActiveNav() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            let currentId = 'top';

            sections.forEach(section => {
                const offsetTop = section.offsetTop - 120;
                if (scrollY >= offsetTop) currentId = section.id;
            });

            // Обновляем active только у якорных ссылок (href начинается с #)
            document.querySelectorAll('.header__nav a[href^="#"]').forEach(link => {
                const hrefId = link.getAttribute('href').substring(1);
                link.classList.toggle('is-active', hrefId === currentId);
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('load', updateActiveNav);
        updateActiveNav();
    }

    // Анимация появления элементов при прокрутке
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal_visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Фолбэк: сразу показываем все элементы
        revealElements.forEach(el => el.classList.add('reveal_visible'));
    }
});
