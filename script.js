document.addEventListener('DOMContentLoaded', function() {
    // 图片数据配置 - 使用您提供的UI截图
    const portfolioItems = [
        {
            id: 1,
            title: "首页设计",
            category: "home",
            imagePath: "images/Home.png",
            description: "新闻应用的主页设计，展示热门新闻和推荐内容"
        },
        {
            id: 2,
            title: "新闻详情页",
            category: "detail",
            imagePath: "images/News Details.png",
            description: "完整的新闻文章阅读页面设计"
        },
        {
            id: 3,
            title: "更多选项",
            category: "interaction",
            imagePath: "images/More Button.png",
            description: "新闻条目的交互选项菜单"
        },
        {
            id: 4,
            title: "发现页面",
            category: "discover",
            imagePath: "images/Discover.png",
            description: "按主题分类的新闻发现页面"
        },
        {
            id: 5,
            title: "新闻收藏",
            category: "collection",
            imagePath: "images/Collection.png",
            description: "按类别组织的新闻收藏"
        },
        {
            id: 6,
            title: "书签页面",
            category: "bookmark",
            imagePath: "images/Bookmark.png",
            description: "用户保存的书签新闻列表"
        },
        {
            id: 7,
            title: "新闻评论",
            category: "social",
            imagePath: "images/Comments.png",
            description: "新闻文章的评论区设计"
        },
        {
            id: 8,
            title: "新闻机构主页",
            category: "profile",
            imagePath: "images/News Profile.png",
            description: "新闻机构(BBC World)的专属页面"
        },
        {
            id: 9,
            title: "新闻报摊",
            category: "newsstand",
            imagePath: "images/Newsstand.png",
            description: "按类别组织的新闻来源展示"
        },
        {
            id: 10,
            title: "喜欢的内容",
            category: "social",
            imagePath: "images/Liked News.png",
            description: "用户点赞过的新闻列表"
        },
        {
            id: 11,
            title: "更多新闻源",
            category: "discover",
            imagePath: "images/News More.png",
            description: "可关注的新闻来源列表"
        },
        {
            id: 12,
            title: "关于应用",
            category: "settings",
            imagePath: "images/About.png",
            description: "应用信息和版本说明"
        },
        {
            id: 13,
            title: "常见问题",
            category: "settings",
            imagePath: "images/FAQ.png",
            description: "应用使用常见问题解答"
        },
        {
            id: 14,
            title: "忘记密码",
            category: "auth",
            imagePath: "images/Forgot Password.png",
            description: "密码重置请求页面"
        },
        {
            id: 15,
            title: "邮箱验证",
            category: "auth",
            imagePath: "images/Email Verification.png",
            description: "OTP验证码输入界面"
        },
        {
            id: 16,
            title: "引导页1-v1",
            category: "onboarding",
            imagePath: "images/Onboarding Screen 1 v1.png",
            description: "应用引导流程第一屏(版本1)"
        },
        {
            id: 17,
            title: "引导页1-v2",
            category: "onboarding",
            imagePath: "images/Onboarding Screen 1 v2.png",
            description: "应用引导流程第一屏(版本2)"
        },
        {
            id: 18,
            title: "引导页2-v1",
            category: "onboarding",
            imagePath: "images/Onboarding Screen 2 v1.png",
            description: "应用引导流程第二屏(版本1)"
        },
        {
            id: 19,
            title: "引导页2-v2",
            category: "onboarding",
            imagePath: "images/Onboarding Screen 2 v2.png",
            description: "应用引导流程第二屏(版本2)"
        },
        {
            id: 20,
            title: "引导页3-v1",
            category: "onboarding",
            imagePath: "images/Onboarding Screen 3 v1.png",
            description: "应用引导流程第三屏(版本1)"
        }
    ];

    // 渲染作品集
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    function renderPortfolio(items) {
        portfolioGrid.innerHTML = '';
        
        items.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item ${item.category}`;
            portfolioItem.dataset.id = item.id;
            
            portfolioItem.innerHTML = `
                <img src="file:///${item.imagePath}" alt="${item.title}" loading="lazy">
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <span class="category-tag">${item.category}</span>
                </div>
            `;
            
            portfolioGrid.appendChild(portfolioItem);
        });
        
        // 添加图片点击事件
        addImageClickEvents();
    }
    
    // 初始渲染
    renderPortfolio(portfolioItems);
    
    // 更新导航筛选选项以匹配您的UI分类
    const filterLinks = document.querySelectorAll('nav a[data-filter]');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新活动链接
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            if (filter === 'all') {
                renderPortfolio(portfolioItems);
            } else {
                const filteredItems = portfolioItems.filter(item => item.category === filter);
                renderPortfolio(filteredItems);
            }
        });
    });
    
    // 灯箱功能
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageInfo = document.getElementById('image-info');
    
    let currentIndex = 0;
    let currentItems = [];
    
    function addImageClickEvents() {
        const images = document.querySelectorAll('.portfolio-item img');
        
        images.forEach((img, index) => {
            img.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.portfolio-item').dataset.id);
                const activeFilter = document.querySelector('nav a.active').dataset.filter;
                
                if (activeFilter === 'all') {
                    currentItems = [...portfolioItems];
                } else {
                    currentItems = portfolioItems.filter(item => item.category === activeFilter);
                }
                
                currentIndex = currentItems.findIndex(item => item.id === itemId);
                openLightbox(currentIndex);
            });
        });
    }
    
    function openLightbox(index) {
        if (currentItems.length === 0) return;
        
        const item = currentItems[index];
        lightboxImg.src = `file:///${item.imagePath}`;
        lightboxImg.alt = item.title;
        imageInfo.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <span class="lightbox-category">分类: ${item.category}</span>
        `;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        openLightbox(currentIndex);
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % currentItems.length;
        openLightbox(currentIndex);
    }
    
    // 事件监听
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'ArrowRight') {
                showNext();
            }
        }
    });
});