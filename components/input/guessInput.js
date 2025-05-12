/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { CountryCoords } from "../data/countryCoords";
import AutoCompleteBox from "./autoCompleteBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelection } from "../../store/guessSelectionSlice";

function GuessInput(props) {
	const [guess, setGuess] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [itemSelectedState, setItemSelectedState] = useState(null);

	const isComplete = useSelector((state) => state.settings.value.complete);
	const guesses = useSelector((state) => state.guesses.value);

	const dispatch = useDispatch();

	// //Get answer from the store
	// const answerCountry = useSelector((state) => state.answer.value);

	// //Get itemSelected from the store
	// const itemSelected = useSelector((state) => state.guessSelection.value);

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
		<div className="flex flex-col w-full">
			<input
				className={`ghibli-input font-medium text-lg ${
					showSuggestions ? "rounded-b-none border-b-0" : ""
				}`}
				placeholder="Type a country name..."
				onChange={(event) => onType(event.target.value)}
				value={guess}
				disabled={isComplete}
			/>
			<AutoCompleteBox
				suggestions={suggestions}
				show={showSuggestions}
				onItemPress={(item) => setItemSelectedState(item)}
			/>
		</div>
	);
}

GuessInput.propTypes = {};

export default GuessInput;
