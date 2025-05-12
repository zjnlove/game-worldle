import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Guess from "./guess";
function Guesses(props) {
	const guesses = useSelector((state) => state.guesses.value);
	return (
		<div className="w-full">
			{guesses.length > 0 ? (
				<div className="flex flex-col-reverse w-full">
					{guesses.map((guess, index) => (
						<Guess
							guess={guess}
							key={index}
							topMargin={guesses.length - 1 !== index}
						/>
					))}
				</div>
			) : (
				<div className="text-center text-gray-500 italic mt-4">
					Start guessing countries...
				</div>
			)}
		</div>
	);
}

Guesses.propTypes = {};

export default Guesses;
