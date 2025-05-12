import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useSelector } from "react-redux";
// import Vector from "./all/AU/vector.svg";

function CountrySVG(props) {
	//Get answer country
	const country = useSelector((state) => state.answer.value);
	console.log(country);
	// If there is no valid country code, show placeholder image
	if (!country?.Alpha2Code) {
		return (
			<div className={props.className}>
				<div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center p-6">
					<span className="text-gray-400 text-lg">Country image loading...</span>
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
					className="ghibli-map-image"
					layout={"responsive"}
					height={100}
					width={100}
					priority
					style={{
						filter: "invert(20%) sepia(10%) saturate(150%) hue-rotate(90deg)",
					}}
				/>
			</div>
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
