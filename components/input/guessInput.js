/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { CountryCoords } from "../data/countrycodes";
import AutoCompleteBox from "./autoCompleteBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelection } from "../../store/guessSelectionSlice";
import { useI18n } from "../../i18n/i18n-utils";
import PropTypes from "prop-types";

function GuessInput(props) {
	const { t: tCommon } = useI18n('common');
	const { t: tCountries } = useI18n('countries');
	const [guess, setGuess] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [itemSelectedState, setItemSelectedState] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const isComplete = useSelector((state) => state.settings.value.complete);
	const guesses = useSelector((state) => state.guesses.value);

	const dispatch = useDispatch();

	// 创建一个本地化的国家数据，包含翻译后的国家名称
	const localizedCountryCoords = useMemo(() => {
		return CountryCoords.map(country => ({
			...country,
			// 添加翻译后的国家名称作为新的可搜索字段
			LocalizedName: tCountries(country.Country, country.Country)
		}));
	}, [tCountries]);

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
		// 当用户开始输入新内容时，重置选择状态
		if (itemSelectedState !== null) {
			setItemSelectedState(null);
			dispatch(setSelection(null));
		}
		
		if (text.length > 0) {
			setGuess(text);
			//Set up fuse with localized countries data
			const fuse = new Fuse(localizedCountryCoords, {
				keys: ["Country", "Alpha2Code", "LocalizedName"],
				threshold: 0.3, // 增加匹配容错度
				ignoreLocation: true // 忽略文本位置，更好地支持不同语言
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
			// 显示翻译后的国家名称
			setGuess(tCountries(itemSelectedState.item.Country, itemSelectedState.item.Country));
			setShowSuggestions(false);
		}
	}, [itemSelectedState, tCountries]);

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
				placeholder={tCommon('guessPlaceholder')}
				onChange={(event) => onType(event.target.value)}
				value={guess}
				disabled={props.isDisabled || isComplete}
			/>
			<AutoCompleteBox
				suggestions={suggestions}
				show={showSuggestions && !props.isDisabled}
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

GuessInput.propTypes = {
	isDisabled: PropTypes.bool
};

GuessInput.defaultProps = {
	isDisabled: false
};

export default GuessInput;
