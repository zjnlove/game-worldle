/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { CountryCoords } from "../data/countryCoords";
import AutoCompleteBox from "./autoCompleteBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelection } from "../../store/guessSelectionSlice";
import { useTranslation } from "react-i18next";

function GuessInput(props) {
	const { t } = useTranslation('common');
	const [guess, setGuess] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [itemSelectedState, setItemSelectedState] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const isComplete = useSelector((state) => state.settings.value.complete);
	const guesses = useSelector((state) => state.guesses.value);

	const dispatch = useDispatch();

	// 检测当前主题
	useEffect(() => {
		const checkDarkMode = () => {
			const theme = document.documentElement.getAttribute('data-theme');
			setIsDarkMode(theme === 'dark');
		};
		
		// 初始检测
		checkDarkMode();
		
		// 创建一个观察器监听data-theme属性变化
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					checkDarkMode();
				}
			});
		});
		
		// 开始观察
		observer.observe(document.documentElement, { attributes: true });
		
		// 清理观察器
		return () => observer.disconnect();
	}, []);

	//Search when guess state changes (as user types)
	const onType = (text) => {
		if (text.length > 0) {
			setGuess(text);
			//Set up fuse with countries data
			const fuse = new Fuse(CountryCoords, {
				keys: ["Country", "Alpha2Code"],
			});

			let result = fuse.search(text, { limit: 5 }); //Search for guess in countries data
			setSuggestions(result); //Set recomondations to search
			setShowSuggestions(true);
		} else {
			setGuess(text);

			setShowSuggestions(false);
		}
	};

	// //When item selected set it to current text, redux store and hide selection box
	useEffect(() => {
		dispatch(setSelection(itemSelectedState));
		if (itemSelectedState !== null) {
			setGuess(itemSelectedState.item.Country);
			setShowSuggestions(false);
		}
	}, [itemSelectedState]);

	//Clear input when answer is correct
	useEffect(() => {
		if (isComplete) {
			setGuess("");
		}
	}, [isComplete]);

	//Clear users selection when answer submitted
	useEffect(() => {
		setGuess("");
	}, [guesses]);

	return (
		<div className="flex flex-col w-full guess-input-container">
			<input
				className={`ghibli-input font-medium text-lg ${
					showSuggestions ? "rounded-b-none" : ""
				}`}
				style={{
					borderColor: isDarkMode ? 'var(--ghibli-blue)' : 'var(--ghibli-soft-blue)',
					borderBottomWidth: showSuggestions ? '0' : '2px',
					backgroundColor: isDarkMode ? 'var(--input-background)' : 'white'
				}}
				placeholder={t('guessPlaceholder')}
				onChange={(event) => onType(event.target.value)}
				value={guess}
				disabled={isComplete}
			/>
			<AutoCompleteBox
				suggestions={suggestions}
				show={showSuggestions}
				onItemPress={(item) => setItemSelectedState(item)}
			/>
			
			<style jsx>{`
				.guess-input-container {
					position: relative;
				}
			`}</style>
		</div>
	);
}

GuessInput.propTypes = {};

export default GuessInput;
