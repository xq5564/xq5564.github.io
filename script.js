// 配置区（必须修改！）
const CONFIG = {
    REPO_OWNER: 'xq5564',  // 改为你的GitHub用户名
    REPO_NAME: 'Blob',         // 改为存放issues的仓库名
    ACCESS_TOKEN: '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'    // 创建有issues权限的token
};

// 获取DOM元素
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');

// 初始化加载评论
document.addEventListener('DOMContentLoaded', loadComments);

// 提交评论
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const comment = document.getElementById('comment').value.trim();
    
    if(name && comment) {
        await postComment(name, comment);
        commentForm.reset();
        loadComments(); // 重新加载评论
    }
});

// 通过GitHub Issues发布评论
async function postComment(name, content) {
    const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/issues`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${CONFIG.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `[Comment] From ${name}`,
                body: content,
                labels: ['comment'] // 可选：添加标签方便管理
            })
        });
        
        if(!response.ok) throw new Error('发布失败');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('留言提交失败，请稍后再试');
    }
}

// 从GitHub Issues加载评论
async function loadComments() {
    const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/issues?labels=comment`;
    
    try {
        const response = await fetch(url);
        const issues = await response.json();
        
        commentsList.innerHTML = ''; // 清空现有评论
        
        issues.forEach(issue => {
            const date = new Date(issue.created_at).toLocaleString();
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <p class="comment-text">${issue.body}</p>
                <div class="comment-meta">
                    <span class="comment-author">${issue.title.replace('[Comment] From ', '')}</span>
                    <span class="comment-date">${date}</span>
                </div>
            `;
            commentsList.appendChild(commentDiv);
        });
    } catch (error) {
        console.error('加载评论失败:', error);
    }
}
