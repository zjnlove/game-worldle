import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./modal";
import CountrySVG from "../countrySVG";
import { useSelector, useDispatch } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { showModal } from "../../store/settingsSlice";
import { useTranslation } from "react-i18next";

function CorrectModal(props) {
	const { t } = useTranslation('common');
	const { t: tCountries } = useTranslation('countries');
	const answer = useSelector((state) => state.answer.value);
	const guesses = useSelector((state) => state.guesses.value);
	const showModalState = useSelector(
		(state) => state.settings.value.showModal
	);

	const dispatch = useDispatch();

	return (
		<Modal show={showModalState}>
			<div className="bg-[--card-background] rounded-2xl border-2 border-[--border-color] shadow-xl overflow-hidden transition-colors duration-300">
				<div className="relative">
					<IoCloseOutline
						className="absolute right-4 top-4 text-2xl text-[--text-secondary] hover:text-[--text-primary] cursor-pointer z-10"
						onClick={() => dispatch(showModal(false))}
					/>
					
					<div className="flex flex-col items-center px-10 py-8 relative">
						{/* 装饰性云朵背景 */}
						<div className="absolute top-0 right-0 opacity-10 w-32 h-32">
							<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
								<path fill="var(--ghibli-green)" d="M39.9,-65.7C52.8,-60.5,65.2,-52.3,72.6,-40.3C80,-28.3,82.4,-12.4,78.9,1.3C75.3,15,65.8,26.4,56.6,36.8C47.4,47.2,38.5,56.5,27.5,62.3C16.4,68.1,3.2,70.5,-9.8,69.4C-22.7,68.3,-35.3,63.6,-44.4,55.1C-53.4,46.6,-58.8,34.2,-61.6,21.6C-64.4,9,-64.5,-3.9,-61.7,-15.8C-58.9,-27.7,-53,-38.6,-44.1,-44.2C-35.2,-49.8,-23.2,-49.9,-10.6,-57.1C2,-64.2,15.2,-78.3,28.4,-77.7C41.7,-77.1,54.9,-61.7,39.9,-65.7Z" transform="translate(100 100)" />
							</svg>
						</div>
						
						<h2 className="text-4xl font-bold mb-4 text-[--ghibli-brown]">{t('congratulations')}</h2>
						<p className="text-lg mb-6 text-[--text-primary]">
							{t('correct')}
						</p>
						<p className="text-2xl font-semibold mb-4 text-[--ghibli-green]">{tCountries(answer.Country, answer.Country)}</p>
						
						<div className="relative w-1/2 mb-6 bg-[--background-secondary] rounded-lg p-2">
							<CountrySVG className={"w-full"} />
						</div>
						
						<p className="text-md mb-8 text-[--ghibli-blue]">
							{t('guessesTitle')}: <span className="font-bold">{guesses.length}</span>
						</p>

						<button
							className="ghibli-btn text-lg py-3 px-6 animate-pulse"
							onClick={() => props.playAgainPress()}
						>
							{t('playAgain')}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

CorrectModal.propTypes = {};

export default CorrectModal;
