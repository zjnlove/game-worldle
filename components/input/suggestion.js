import React from "react";
import PropTypes from "prop-types";

function Suggestion(props) {
	return (
		<div
			onClick={() => props.onItemPress(props.item)}
			className={`border-l-2 border-r-2 border-[--ghibli-soft-blue] px-4 py-2 bg-white hover:bg-[--ghibli-cream] transition-colors cursor-pointer ${
				props.roundedBottom ? "rounded-b-md border-b-2" : "border-b-[1px]"
			} ${props.focus ? "bg-[--ghibli-soft-green] bg-opacity-30" : ""}`}
		>
			{props.item.item.Country}
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
