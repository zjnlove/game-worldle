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

	return (
		<h1
			className={
				"text-center text-6xl font-semibold flex flex-row items-center uppercase bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text"
			}
		>
			{/* <img 
				src="/favicon-32x32.png" 
				alt="地图图标" 
				className="mr-2 h-8 w-8"
			/> */}
			Country Worldle
		</h1>
	);
}

Title.propTypes = {};

export default Title;
