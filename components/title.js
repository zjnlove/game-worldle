import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function Title(props) {
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

	return (
		<h1 className="text-center text-6xl font-bold flex flex-row justify-center space-x-1 py-6">
			{titleLetter("W", "green", 100)}
			{titleLetter("o", "blue", 200)}
			{titleLetter("r", "brown", 300)}
			{titleLetter("l", "dark", 400)}
			{titleLetter("d", "soft-blue", 500)}
			{titleLetter("l", "soft-green", 600)}
			{titleLetter("e", "green", 700)}
		</h1>
	);
}

Title.propTypes = {};

export default Title;
