import React from "react";
import PropTypes from "prop-types";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function Guess(props) {
	const { t } = useTranslation('common');
	return (
		<div
			className={`ghibli-card flex flex-row items-center justify-between bg-white transition-all ${
				props.topMargin ? "mt-3" : ""
			} ${props.guess.correct ? "border-2 border-[--ghibli-green] bg-[--ghibli-soft-green] bg-opacity-20" : ""}`}
		>
			<div className="text-[--ghibli-dark] font-medium px-3 py-2 flex-1">{props.guess.item.Country}</div>
			<div className="text-[--ghibli-blue] font-medium px-3 py-2 w-28 text-center">
				<div className="text-xs text-gray-500">{t('distance')}</div>
				<div>{Math.round(props.guess.distance)} KM</div>
			</div>
			<div className="text-[--ghibli-brown] px-3 py-2">
				<div className="text-xs text-gray-500 text-center mb-1">{t('direction')}</div>
				<BsFillArrowUpCircleFill
					className="text-xl"
					style={{
						transform: `rotate(${props.guess.bearing}deg)`,
						color: 'var(--ghibli-green)'
					}}
				/>
			</div>
		</div>
	);
}

Guess.propTypes = { guess: PropTypes.object.isRequired };

export default Guess;
