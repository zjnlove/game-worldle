import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useSelector } from "react-redux";
// import Vector from "./all/AU/vector.svg";

function CountrySVG(props) {
	//Get answer country
	const country = useSelector((state) => state.answer.value);
	console.log(country);
	// 如果没有有效的国家代码，显示占位图像
	if (!country?.Alpha2Code) {
		return (
			<div className={props.className}>
				<div className="w-full h-full bg-gray-200 flex items-center justify-center">
					<span className="text-gray-400">不可用</span>
				</div>
			</div>
		);
	}

	return (
		<div
			className={props.className}
			style={{
				filter: "invert(90%)",
				position: "relative",
			}}
		>
			{/* <Vector /> */}
			<Image
				src={`/all/${country.Alpha2Code.toLowerCase()}/vector.svg`}
				alt={"Hidden country image"}
				className={"grayscale"}
				layout={"responsive"}
				height={100}
				width={100}
				priority
				style={{
					filter: "drop-shadow(16px 16px 20px red), invert(75%)",
				}}
			/>
		</div>
	);
}

CountrySVG.propTypes = {
	className: PropTypes.string,
};

CountrySVG.defaultProps = {
	className: "",
};

export default CountrySVG;
