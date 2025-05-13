import React from "react";
import PropTypes from "prop-types";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function Guess(props) {
	const { t } = useTranslation('common');
	const { t: tCountries } = useTranslation('countries');
	return (
		<div
			className={`ghibli-card rounded-md flex flex-row items-center justify-between bg-white transition-all h-[46px] ${
				props.topMargin ? "mt-3" : ""
			} ${props.guess.correct ? "border-2 border-[--ghibli-green] bg-[--ghibli-soft-green] bg-opacity-20" : ""}`}
		>
			<div className="text-[--ghibli-dark] font-medium px-3 flex-1">{tCountries(props.guess.item.Country, props.guess.item.Country)}</div>
			<div className="text-[--ghibli-blue] font-medium px-3 w-28 text-center flex flex-col justify-center">
				<div className="text-xs text-gray-500 leading-tight">{t('distance')}</div>
				<div className="leading-tight">{Math.round(props.guess.distance)} KM</div>
			</div>
			<div className="text-[--ghibli-brown] px-3 flex flex-col justify-center items-center">
				<div className="text-xs text-gray-500 text-center leading-tight">{t('direction')}</div>
				<BsFillArrowUpCircleFill
					className="text-lg"
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
