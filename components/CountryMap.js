import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useSelector } from "react-redux";
// import Vector from "./all/AU/vector.svg";

function CountryMap(props) {
	//Get answer country
	const country = useSelector((state) => state.answer.value);
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
	
	// If there is no valid country code, show placeholder image
	if (!country?.Alpha2Code) {
		return (
			<div className={props.className}>
				<div className={`w-full h-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center p-6 transition-colors duration-300`}>
					<span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-400'} text-lg`}>Country image loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className={props.className}>
			<div 
				className="w-full rounded-lg overflow-hidden relative"
				style={{
					filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
				}}
			>
				<Image
					src={`/all/${country.Alpha2Code.toLowerCase()}/vector.svg`}
					alt={"Country outline"}
					className={`ghibli-map-image ${isDarkMode ? 'dark-mode-map' : ''}`}
					layout={"responsive"}
					height={100}
					width={100}
					priority
				/>
			</div>
			
			<style jsx global>{`
				.ghibli-map-image {
					filter: invert(20%) sepia(10%) saturate(150%) hue-rotate(90deg);
					transition: all 0.3s ease;
				}
				.dark-mode-map {
					filter: invert(90%) sepia(10%) saturate(100%) hue-rotate(180deg) brightness(120%) !important;
				}
				
				/* 为地图图像添加微妙的发光效果（在暗色主题下） */
				[data-theme='dark'] .ghibli-map-image {
					box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
				}
			`}</style>
		</div>
	);
}

CountryMap.propTypes = {
	className: PropTypes.string,
};

CountryMap.defaultProps = {
	className: "",
};

export default CountryMap;
