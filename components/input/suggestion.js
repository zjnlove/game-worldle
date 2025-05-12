import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Suggestion(props) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	
	// 检测当前主题
	useEffect(() => {
		const checkDarkMode = () => {
			const theme = document.documentElement.getAttribute('data-theme');
			setIsDarkMode(theme === 'dark');
		};
		
		// 初始检测
		checkDarkMode();
		
		// 创建一个观察器监听data-theme属性变化
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					checkDarkMode();
				}
			});
		});
		
		// 开始观察
		observer.observe(document.documentElement, { attributes: true });
		
		// 清理观察器
		return () => observer.disconnect();
	}, []);

	return (
		<div
			onClick={() => props.onItemPress(props.item)}
			className={`suggestion-item ${
				props.roundedBottom ? "rounded-b-md border-b-2" : "border-b-[1px]"
			} ${props.focus ? (isDarkMode ? "focus-dark" : "focus-light") : ""}`}
			style={{
				backgroundColor: isDarkMode ? 'var(--ghibli-dark-blue)' : 'white',
				borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--ghibli-soft-blue)',
				color: isDarkMode ? '#ffffff' : 'var(--ghibli-dark)'
			}}
		>
			{props.item.item.Country}
			
			<style jsx>{`
				.suggestion-item {
					padding: 10px 16px;
					border-left: 2px solid;
					border-right: 2px solid;
					cursor: pointer;
					font-size: 14px;
					transition: all 0.2s ease;
					font-weight: ${isDarkMode ? '500' : 'normal'};
				}
				
				.suggestion-item:hover {
					background-color: ${isDarkMode ? 'var(--ghibli-shadow-blue)' : 'var(--ghibli-cream)'};
				}
				
				.focus-light {
					background-color: var(--ghibli-soft-green);
					background-opacity: 0.3;
				}
				
				.focus-dark {
					background-color: var(--ghibli-blue);
					color: #ffffff;
					font-weight: bold;
					box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
				}
			`}</style>
		</div>
	);
}

Suggestion.propTypes = {
	item: PropTypes.object.isRequired,
	onItemPress: PropTypes.func.isRequired,
	roundedBottom: PropTypes.bool,
	focus: PropTypes.bool,
};

Suggestion.defaultProps = {
	roundedBottom: false,
	focus: false,
};

export default Suggestion;
