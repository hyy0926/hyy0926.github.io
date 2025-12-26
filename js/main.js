document.addEventListener('DOMContentLoaded', async function() {
    // 加载项目数据
    const response = await fetch('data/projects.json');
    const data = await response.json();
    
    // 渲染项目卡片
    const container = document.getElementById('projects-container');
    container.innerHTML = data.projects.map(project => {
        const thumbnail = project.thumbnail?.length ? 
            encodeURI(project.thumbnail[0]) : 
            encodeURI(project.images[0]);
        
        return `
        <div class="project-card" data-year="${project.year}" data-type="${project.type}" data-content="${project.content}">
            <div class="project-img">
                <img src="${thumbnail}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="project-desc">${project.description.substring(0, 60)}...</p>
                <div class="project-footer">
                    <span class="project-date">${project.date}</span>
                    <a href="${project.content}" class="view-btn">查看详情</a>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // 筛选功能实现
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('searchInput');
    
    // 当前选中的筛选值
    let currentFilter = 'all';
    
    // 统一的过滤函数
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        
        projectCards.forEach(card => {
            const year = card.getAttribute('data-year');
            const type = card.getAttribute('data-type');
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('.project-desc').textContent.toLowerCase();
            const tags = card.querySelector('.project-tags').textContent.toLowerCase();
            
            // 检查筛选条件
            const filterPassed = currentFilter === 'all' || 
                                currentFilter === 'type-all' || 
                                currentFilter === year || 
                                currentFilter === type;
            
            // 检查搜索条件
            const searchPassed = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                desc.includes(searchTerm) || 
                                tags.includes(searchTerm);
            
            // 同时满足筛选和搜索条件才显示
            card.style.display = (filterPassed && searchPassed) ? 'block' : 'none';
        });
    }
    
    // 年级筛选
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            applyFilters();
        });
    });
    
    // 搜索功能
    searchInput.addEventListener('input', applyFilters);
    
    // 项目卡片点击事件 - 点击任何地方跳转到详情页
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免点击按钮时触发两次
            if (e.target.closest('.view-btn')) {
                return; // 如果是点击查看详情按钮，不阻止默认行为
            }
            
            const content = this.getAttribute('data-content');
            if (content) {
                window.location.href = content;
            }
        });
    });
    
    // 查看详情按钮 - 阻止事件冒泡到卡片
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡到卡片
            // 不需要额外处理，链接会自动跳转
        });
    });
    
    // 开发者信息更新
    const developerElement = document.getElementById('developer');
    if (developerElement) {
        developerElement.textContent = "胡颖颖";
    }
});
