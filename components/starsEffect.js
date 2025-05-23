// 添加星星背景
export const addStars = () => {
	removeStars(); // 先清除现有星星
	
	const container = document.querySelector('.min-h-screen');
	if (!container) return;
	
	const starCount = 50;
	for (let i = 0; i < starCount; i++) {
		const star = document.createElement('div');
		star.classList.add('star');
		star.style.left = `${Math.random() * 100}%`;
		star.style.top = `${Math.random() * 100}%`;
		star.style.animationDelay = `${Math.random() * 4}s`;
		star.style.opacity = Math.random() * 0.7 + 0.3;
		
		// 随机大小
		const size = Math.random() * 2 + 1;
		star.style.width = `${size}px`;
		star.style.height = `${size}px`;
		
		container.appendChild(star);
	}
};

// 移除星星背景
export const removeStars = () => {
	const stars = document.querySelectorAll('.star');
	stars.forEach(star => star.remove());
}; 