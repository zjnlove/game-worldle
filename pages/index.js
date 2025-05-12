import CountrySVG from "../components/countrySVG";
import GuessInput from "../components/input/guessInput";
import Guesses from "../components/guesses/guesses";
import CorrectModal from "../components/modal/correctModal";
import CorrectAnswerBtn from "../components/input/checkAnswerBtn";
import Title from "../components/title";
import {
	NewCountry,
	checkGuess,
	getDistanceAndBearing,
} from "../components/util";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addGuess, clearGuesses } from "../store/guessesSlice";
import { showModal, setComplete } from "../store/settingsSlice";
import { setSelection } from "../store/guessSelectionSlice";

export default function Home() {
	const guesses = useSelector((state) => state.guesses.value);
	const answer = useSelector((state) => state.answer.value);

	const guessSelection = useSelector((state) => state.guessSelection.value);
	const isComplete = useSelector((state) => state.settings.value.complete);
	const showModalState = useSelector((state) => state.settings.value.showModal);

	const dispatch = useDispatch();

	useEffect(() => {
		if (
			answer &&
			Object.keys(answer).length === 0 &&
			Object.getPrototypeOf(answer) === Object.prototype
		) {
			NewCountry();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (guesses.length > 0) {
			// checkGuess(guesses[guesses.length - 1], answer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [guesses]);

	//Start new game, cleans up guesses and answer
	const newGame = () => {
		dispatch(setComplete(false));
		dispatch(showModal(false));
		dispatch(clearGuesses());
		NewCountry();
	};

	//Clear input and add guess to redux store
	const onSubmit = () => {
		if (guessSelection !== null) {
			let result = checkGuess(guessSelection, answer);

			//Answer correct
			if (result) {
				dispatch(
					addGuess({
						...guessSelection,
						distance: 0,
						bearing: 0,
						correct: result,
					})
				);
				dispatch(setComplete(true));
				dispatch(showModal(true));
			} else {
				const { distance, bearing } = getDistanceAndBearing(
					guessSelection,
					answer
				);
				dispatch(
					addGuess({
						...guessSelection,
						distance: distance,
						bearing: bearing,
						correct: result,
					})
				);
			}
			//Clear selection on submit
			dispatch(setSelection(null));
		}
	};

	// Make sure the success modal is displayed correctly
	const modalComponent = <CorrectModal playAgainPress={() => newGame()} />;

	// Ensure the map is only shown during the game or in the modal, avoiding multiple maps at the same time
	const mapComponent = !showModalState && !isComplete;

	return (
		<div className="min-h-screen flex flex-col bg-[--ghibli-cream] relative pb-20">
			{/* Decorative element - leaf in the top left corner */}
			<div className="absolute top-0 left-0 w-20 h-20 opacity-20 -rotate-12">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="#8cb37e" d="M47.1,-57.3C59.8,-47.4,68.9,-32.4,72.1,-16.1C75.3,0.2,72.6,17.8,64.7,31.5C56.7,45.2,43.6,55,29.3,61.9C15,68.9,-0.4,73,-15.6,70.5C-30.7,68,-45.7,58.9,-56.8,45.6C-67.9,32.2,-75.1,14.6,-74.1,-2.5C-73.1,-19.6,-63.8,-36.1,-50.6,-46.5C-37.3,-56.9,-20.2,-61.2,-2.4,-58.4C15.4,-55.7,34.3,-46,47.1,-57.3Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			{/* Decorative element - cloud in the bottom right corner */}
			<div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="#65a5d1" d="M39.9,-45.7C51.2,-34,59.9,-21,65.4,-5.5C70.9,10,73.2,28,65.7,39.9C58.2,51.8,40.9,57.8,23.8,63C6.7,68.3,-10.1,72.9,-24.9,69C-39.8,65,-52.7,52.6,-59.3,37.7C-65.9,22.8,-66,5.4,-62.3,-10.1C-58.5,-25.7,-50.8,-39.3,-39.5,-51C-28.2,-62.8,-13.3,-72.8,0.1,-72.9C13.6,-73,27.2,-63.2,39.9,-45.7Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			<div className="flex-1 flex flex-col items-center py-6 px-4 z-10 max-w-2xl mx-auto w-full">
				{modalComponent}
				
				<div className="w-full mb-6">
					<Title />
				</div>
				
				<div className="w-full flex flex-col items-center">
					<div className="w-full max-w-md">
						{mapComponent && (
							<div className="w-full bg-white rounded-2xl shadow-lg p-4 mb-8 border border-[--ghibli-soft-green] transform hover:scale-105 transition-transform duration-300">
								<CountrySVG className={"w-full"} />
							</div>
						)}
						
						{isComplete && !showModalState ? (
							<button
								className="ghibli-btn text-lg py-3 px-10 mb-8 w-full"
								onClick={() => newGame()}
							>
								Play Again
							</button>
						) : null}
						
						<GuessInput />
						
						{!isComplete && (
							<div className="w-full my-6">
								<CorrectAnswerBtn onSubmit={() => onSubmit()} />
							</div>
						)}
						
						<div className="w-full mt-2">
							<Guesses />
						</div>
					</div>
				</div>
			</div>
			
			{!isComplete && (
				<footer className="py-4 px-6 flex justify-center w-full fixed bottom-0 left-0 bg-[--ghibli-cream] z-20 shadow-inner">
					<div className="w-full max-w-md">
						<button
							className="ghibli-btn-secondary w-full text-sm py-2"
							onClick={() => newGame()}
						>
							New Country
						</button>
					</div>
				</footer>
			)}
		</div>
	);
}
export async function getServerSideProps(context) {
	return { props: {} };
}
