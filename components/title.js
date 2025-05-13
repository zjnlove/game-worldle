import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

function Title(props) {
	const { t } = useTranslation('common');
	const [animationStage, setAnimationStage] = useState(0);
	const isComplete = useSelector((state) => state.settings.value.complete);
	let interval = useRef();
	useEffect(() => {
		if (isComplete) {
			interval.current = setInterval(() => {
				setAnimationStage(animationStage + 1);
			}, 100);
			return () => {
				clearInterval(interval.current);
			};
		} else {
			setAnimationStage(0);
		}
	}, [isComplete, animationStage]);

	useEffect(() => {
		if (animationStage > 9) {
			clearInterval(interval.current);
		}
	}, [animationStage]);

	const titleLetter = (letter, color, delay) => (
		<span 
			className="ghibli-title-letter"
			style={{ 
				color: `var(--ghibli-${color})`,
				animationDelay: `${delay}ms`,
				textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
			}}
		>
			{letter}
		</span>
	);

	// 获取标题文本
	const titleText = t('title');
	
	// 标题颜色数组
	const colors = ['green', 'blue', 'brown', 'dark', 'soft-blue', 'soft-green', 'green'];

	return (
		<div className="relative">
			<div className="theme-container">
				<ThemeToggle />
			</div>
			<div className="language-container">
				<LanguageSwitcher />
			</div>
			<h1 className="text-center text-6xl font-bold flex flex-row justify-center space-x-1 py-6">
				{titleText.split('').map((letter, index) => {
					const colorIndex = index % colors.length;
					return titleLetter(letter, colors[colorIndex], (index + 1) * 100);
				})}
			</h1>
			
			<style jsx>{`
				.theme-container {
					position: absolute;
					right: 50px;
					top: 50%;
					transform: translateY(-50%);
					z-index: 5;
				}
				
				.language-container {
					position: absolute;
					right: -70px;
					top: 50%;
					transform: translateY(-50%);
					z-index: 5;
				}
				
				@media (max-width: 768px) {
					.theme-container {
						right: auto;
						left: 10px;
						top: 50%;
					}
					
					.language-container {
						right: 10px;
						top: 50%;
					}
					
					h1 {
						font-size: 2.5rem;
						padding: 1rem 0;
					}
				}
				
				@media (max-width: 480px) {
					h1 {
						font-size: 2rem;
					}
				}
			`}</style>
		</div>
	);
}

Title.propTypes = {};

export default Title;
