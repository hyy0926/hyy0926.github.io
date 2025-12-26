async function loadProjectDetail(projectId) {
    try {
        // 加载项目数据
        const response = await fetch('../data/projects.json');
        const { projects } = await response.json();
        const project = projects.find(p => p.id === projectId);
        
        if (!project) throw new Error('项目不存在');

        // 渲染详情页
        document.getElementById('project-detail').innerHTML = `
            <div class="detail-header">
                <h1>${project.title}</h1>
                <div class="tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="project-detail">
                <div class="project-content">
                    <section>
                        <h2><i class="fas fa-info-circle"></i> 项目描述</h2>
                        <p>${project.description}</p>
                    </section>
                    
                    ${project.thinking ? `
                    <section>
                        <h2><i class="fas fa-lightbulb"></i> 设计思路</h2>
                        <p>${project.thinking.replace(/\n/g, '<br>')}</p>
                    </section>` : ''}
                    
                    ${project.images ? `
                    <section>
                        <h2><i class="fas fa-images"></i> 作品展示</h2>
                        <div class="gallery">
                            ${project.images.map(img => `
                                <img src="../${img}" alt="${project.title}" loading="lazy" class="lightbox-trigger">
                            `).join('')}
                        </div>
                    </section>` : ''}
                </div>
                
                <aside class="project-meta">
                    <div class="meta-item">
                        <h3><i class="fas fa-calendar-alt"></i> 完成时间</h3>
                        <p>${project.date}</p>
                    </div>
                    
                    <div class="meta-item">
                        <h3><i class="fas fa-tools"></i> 使用工具</h3>
                        <p>${project.tools}</p>
                    </div>
                    
                    ${project.awards ? `
                    <div class="meta-item">
                        <h3><i class="fas fa-award"></i> 获奖情况</h3>
                        <p>${project.awards}</p>
                    </div>` : ''}
                    
                    <a href="../index.html" class="view-btn">
                        <i class="fas fa-arrow-left"></i> 返回作品集
                    </a>
                </aside>
            </div>
        `;
        
        // 初始化图片灯箱
        initImageLightbox();
    } catch (error) {
        document.getElementById('project-detail').innerHTML = `
            <div class="error-message">
                <h2>加载失败</h2>
                <p>${error.message}</p>
                <a href="../index.html" class="view-btn">返回首页</a>
            </div>
        `;
    }
}

function initImageLightbox() {
    // 创建灯箱HTML结构
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-toolbar">
                <button class="lightbox-zoom-btn lightbox-zoom-in" title="放大">+</button>
                <button class="lightbox-zoom-btn lightbox-zoom-out" title="缩小">-</button>
                <button class="lightbox-zoom-btn lightbox-zoom-reset" title="重置">↻</button>
            </div>
            <img id="lightbox-img" src="" alt="" class="lightbox-image">
            <span class="lightbox-control lightbox-prev">&#10094;</span>
            <span class="lightbox-control lightbox-next">&#10095;</span>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const zoomInBtn = document.querySelector('.lightbox-zoom-in');
    const zoomOutBtn = document.querySelector('.lightbox-zoom-out');
    const zoomResetBtn = document.querySelector('.lightbox-zoom-reset');
    
    let currentImageIndex = 0;
    let images = [];
    let scale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    let lastX = 0, lastY = 0;
    
    // 获取所有图片
    function updateImages() {
        images = Array.from(document.querySelectorAll('.lightbox-trigger'));
    }
    
    // 打开灯箱
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        lightbox.style.display = 'flex';
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭灯箱
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 显示上一张图片
    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
    
    // 显示下一张图片
    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
    
    // 更新变换
    function updateTransform() {
        lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    // 缩放图片
    function zoomIn() {
        scale += 0.2;
        updateTransform();
    }
    
    function zoomOut() {
        if (scale > 0.3) {
            scale -= 0.2;
            updateTransform();
        }
    }
    
    function zoomReset() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
    
    // 开始拖动
    function startDrag(e) {
        if (scale <= 1) return;
        
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        lightboxImg.style.cursor = 'grabbing';
    }
    
    // 拖动中
    function drag(e) {
        if (!isDragging || scale <= 1) return;
        
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    }
    
    // 结束拖动
    function endDrag() {
        isDragging = false;
        lightboxImg.style.cursor = scale > 1 ? 'grab' : 'default';
    }
    
    // 事件监听
    document.querySelectorAll('.lightbox-trigger').forEach((img, index) => {
        img.addEventListener('click', () => {
            updateImages();
            openLightbox(index);
        });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomResetBtn.addEventListener('click', zoomReset);
    
    // 拖动事件
    lightboxImg.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // 触摸事件支持
    lightboxImg.addEventListener('touchstart', (e) => {
        if (scale <= 1) return;
        
        e.preventDefault();
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging || scale <= 1) return;
        
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform();
    });
    
    document.addEventListener('touchend', endDrag);
    
    // 点击灯箱背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-control')) {
            closeLightbox();
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                    zoomOut();
                    break;
                case '0':
                    zoomReset();
                    break;
            }
        }
    });
}