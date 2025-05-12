import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Suggestion from "./suggestion";

function AutoCompleteBox(props) {
	const [show, setShow] = useState(false);
	const [suggestionsLength, setSuggestionsLength] = useState(0);
	const [focusIndex, setFocusIndex] = useState(0);
	const [index, setIndex] = useState(0);
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

	//Check if any suggestions are passed
	useEffect(() => {
		if (props.suggestions.length > 0 && props.show) {
			setShow(true);
		} else {
			setShow(false);
			setFocusIndex(0);
		}
	}, [props.suggestions, props.show]);

	useEffect(() => {
		setSuggestionsLength(props.suggestions.length);
		setIndex(0);
		setFocusIndex(0);
	}, [props.suggestions]);
	
	useEffect(() => {}, [suggestionsLength]);

	useEffect(() => {
		const preventDefault = (e) => {
			let add = 0;
			if (e.code === "ArrowDown") {
				e.preventDefault();
				add = 1;
			} else if (e.code === "ArrowUp") {
				e.preventDefault();
				add = -1;
			} else if (e.code === "Enter") {
				if (index > 0 && index < props.suggestions.length) {
					e.preventDefault();
					props.onItemPress(props.suggestions[index - 1]);
				}
			}

			// 使用函数式更新，而不是修改 index
			setIndex(prevIndex => prevIndex + add);
		};

		window.addEventListener("keydown", preventDefault, false);
		return () => {
			window.removeEventListener("keydown", preventDefault, false);
		};
	}, [index, props.suggestions, props.onItemPress]);

	useEffect(() => {
		setFocusIndex(index);
	}, [index]);

	useEffect(() => {
		if (index > suggestionsLength) {
			setIndex(1);
		} else if (index < 0) {
			setIndex(suggestionsLength);
		}
	}, [suggestionsLength, index]);

	return (
		<div className="w-full relative">
			<div 
				className={`${show ? "suggestions-container" : "hidden"}`}
				style={{
					boxShadow: isDarkMode ? '0 6px 16px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
				}}
			>
				{props.suggestions.map((item, idx) => {
					return (
						<Suggestion
							key={idx}
							onItemPress={(item) => props.onItemPress(item)}
							item={item}
							roundedBottom={
								props.suggestions.length - 1 === idx
							}
							focus={focusIndex - 1 === idx}
						/>
					);
				})}
			</div>
			
			<style jsx>{`
				.suggestions-container {
					position: absolute;
					width: 100%;
					z-index: 20;
					border-radius: 0 0 0.375rem 0.375rem;
					overflow: hidden;
					animation: dropdownFadeIn 0.2s ease;
				}
				
				@keyframes dropdownFadeIn {
					from { opacity: 0; transform: translateY(-5px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
		</div>
	);
}

AutoCompleteBox.propTypes = {
	suggestions: PropTypes.array.isRequired,
	onItemPress: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
};

AutoCompleteBox.defaultProps = {
	suggestions: [],
	onItemPress: () => {},
	show: false,
};

export default AutoCompleteBox;
