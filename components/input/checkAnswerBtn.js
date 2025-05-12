import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import Tooltip from "../tooltip/tooltip";
import { useTranslation } from "react-i18next";

function CheckAnswerBtn(props) {
	const { t } = useTranslation('common');
	const [loading, setLoading] = useState(false);

	const guessSelection = useSelector((state) => state.guessSelection.value);

	//Wait for 1 second before submitting
	const onPress = useCallback(() => {
		if (guessSelection != null) {
			setLoading(true);
			const timer = setTimeout(() => {
				setLoading(false);
				props.onSubmit();
			}, 1000);
		}
	}, [props, guessSelection]);

	useEffect(() => {
		const preventDefault = (e) => {
			if (e.code === "Enter") {
				e.preventDefault();
				onPress();
			}
		};

		window.addEventListener("keydown", preventDefault, false);
		return () => {
			window.removeEventListener("keydown", preventDefault, false);
		};
	}, [onPress]);
	return (
		<div>
			{/* <Tooltip /> */}
			<button
				className="ghibli-btn w-full text-xl px-4 py-3 flex justify-center items-center"
				onClick={onPress}
				disabled={loading}
			>
				{loading ? (
					<div className="flex items-center space-x-2">
						<CgSpinner className="animate-spin mt-1" />
						<div className="">{t('checking')}...</div>
					</div>
				) : (
					<div>
						<div className="">{t('submitGuess')}</div>
					</div>
				)}
			</button>
		</div>
	);
}

CheckAnswerBtn.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};
CheckAnswerBtn.defaultProps = {
	onSubmit: () => {},
};

export default CheckAnswerBtn;
