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
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addGuess, clearGuesses } from "../store/guessesSlice";
import { showModal, setComplete } from "../store/settingsSlice";
import { setSelection } from "../store/guessSelectionSlice";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home() {
	const { t } = useTranslation('common');
	const guesses = useSelector((state) => state.guesses.value);
	const answer = useSelector((state) => state.answer.value);

	const guessSelection = useSelector((state) => state.guessSelection.value);
	const isComplete = useSelector((state) => state.settings.value.complete);
	const showModalState = useSelector((state) => state.settings.value.showModal);
	const [isDarkMode, setIsDarkMode] = useState(false);
	
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
		
		// 添加星星背景点缀（仅在暗色模式）
		if (isDarkMode) {
			addStars();
		}
		
		// 清理观察器和星星
		return () => {
			observer.disconnect();
			removeStars();
		};
	}, [isDarkMode]);
	
	// 添加星星背景
	const addStars = () => {
		removeStars(); // 先清除现有星星
		
		const container = document.querySelector('.min-h-screen');
		if (!container) return;
		
		const starCount = 50;
		for (let i = 0; i < starCount; i++) {
			const star = document.createElement('div');
			star.classList.add('star');
			star.style.left = `${Math.random() * 100}%`;
			star.style.top = `${Math.random() * 100}%`;
			star.style.animationDelay = `${Math.random() * 4}s`;
			star.style.opacity = Math.random() * 0.7 + 0.3;
			
			// 随机大小
			const size = Math.random() * 2 + 1;
			star.style.width = `${size}px`;
			star.style.height = `${size}px`;
			
			container.appendChild(star);
		}
	};
	
	// 移除星星背景
	const removeStars = () => {
		const stars = document.querySelectorAll('.star');
		stars.forEach(star => star.remove());
	};

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
		<div className="min-h-screen flex flex-col bg-[--background-primary] relative pb-20 transition-colors duration-300">
			{/* 吉卜力风格的装饰元素 */}
			<div className={`decorative-element leaf ${isDarkMode ? 'dark' : ''}`}>
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="var(--ghibli-green)" d="M47.1,-57.3C59.8,-47.4,68.9,-32.4,72.1,-16.1C75.3,0.2,72.6,17.8,64.7,31.5C56.7,45.2,43.6,55,29.3,61.9C15,68.9,-0.4,73,-15.6,70.5C-30.7,68,-45.7,58.9,-56.8,45.6C-67.9,32.2,-75.1,14.6,-74.1,-2.5C-73.1,-19.6,-63.8,-36.1,-50.6,-46.5C-37.3,-56.9,-20.2,-61.2,-2.4,-58.4C15.4,-55.7,34.3,-46,47.1,-57.3Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			<div className={`decorative-element cloud ${isDarkMode ? 'dark' : ''}`}>
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<path fill="var(--ghibli-blue)" d="M39.9,-45.7C51.2,-34,59.9,-21,65.4,-5.5C70.9,10,73.2,28,65.7,39.9C58.2,51.8,40.9,57.8,23.8,63C6.7,68.3,-10.1,72.9,-24.9,69C-39.8,65,-52.7,52.6,-59.3,37.7C-65.9,22.8,-66,5.4,-62.3,-10.1C-58.5,-25.7,-50.8,-39.3,-39.5,-51C-28.2,-62.8,-13.3,-72.8,0.1,-72.9C13.6,-73,27.2,-63.2,39.9,-45.7Z" transform="translate(100 100)" />
				</svg>
			</div>
			
			{/* 仅在暗色模式下添加月亮装饰 */}
			{isDarkMode && (
				<div className="moon-decoration">
					<div className="moon"></div>
					<div className="moon-glow"></div>
				</div>
			)}
			
			<div className="flex-1 flex flex-col items-center py-6 px-4 z-10 max-w-2xl mx-auto w-full">
				{modalComponent}
				
				<div className="w-full mb-6 title-container">
					<Title />
				</div>
				
				<div className="w-full flex flex-col items-center">
					<div className="w-full max-w-md">
						{mapComponent && (
							<div className={`w-full map-container ${isDarkMode ? 'dark-map-container' : ''} bg-white rounded-2xl shadow-lg p-4 mb-4 border ${isDarkMode ? 'border-transparent' : 'border-[--border-color]'} transform hover:scale-105 transition-transform duration-300`}>
								<CountrySVG className={"w-full"} />
							</div>
						)}
						
						{isComplete && !showModalState ? (
							<button
								className="ghibli-btn text-lg py-3 px-10 mb-4 w-full"
								onClick={() => newGame()}
							>
								{t('playAgain')}
							</button>
						) : null}
						
						<GuessInput />
						
						{!isComplete && (
							<div className="w-full my-3">
								<CorrectAnswerBtn onSubmit={() => onSubmit()} />
							</div>
						)}
						
						<div className="w-full mt-1">
							<Guesses />
						</div>
					</div>
				</div>
			</div>
			
			{!isComplete && (
				<footer className="py-4 px-6 flex justify-center w-full fixed bottom-0 left-0 bg-[--background-primary] z-20 shadow-inner border-t border-[--border-color] transition-colors duration-300">
					<div className="w-full max-w-md">
						<button
							className="ghibli-btn-secondary w-full text-sm py-2"
							onClick={() => newGame()}
						>
							{t('newCountry')}
						</button>
					</div>
				</footer>
			)}
			
			<style jsx>{`
				.map-container {
					background-color: white !important;
					transition: all 0.3s ease;
				}
				
				.dark-map-container {
					background-color: var(--ghibli-dark-blue) !important;
					border-color: transparent !important;
					box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(101, 165, 209, 0.15);
				}
				
				.decorative-element {
					position: absolute;
					opacity: 0.2;
					transition: all 0.5s ease;
				}
				
				.leaf {
					top: 0;
					left: 0;
					width: 20%;
					max-width: 150px;
					transform: rotate(-12deg);
				}
				
				.cloud {
					bottom: 0;
					right: 0;
					width: 25%;
					max-width: 180px;
				}
				
				/* 暗色模式的装饰元素调整 */
				.decorative-element.dark {
					opacity: 0.1;
				}
				
				/* 月亮装饰 */
				.moon-decoration {
					position: absolute;
					top: 30px;
					right: 10%;
					z-index: 1;
				}
				
				.moon {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					background: #e9e2d5;
					box-shadow: 0 0 20px rgba(233, 226, 213, 0.4);
				}
				
				.moon-glow {
					position: absolute;
					top: -10px;
					left: -10px;
					right: -10px;
					bottom: -10px;
					border-radius: 50%;
					background: radial-gradient(circle, rgba(233, 226, 213, 0.3) 0%, rgba(233, 226, 213, 0) 70%);
				}
				
				/* 暗色主题星星动画 */
				@keyframes twinkle {
					0% {
						opacity: 0.3;
						transform: scale(1);
					}
					50% {
						opacity: 0.8;
						transform: scale(1.2);
					}
					100% {
						opacity: 0.3;
						transform: scale(1);
					}
				}
				
				@media (max-width: 480px) {
					.title-container {
						margin-top: 20px;
						margin-bottom: 30px;
					}
					
					.py-6 {
						padding-top: 1rem;
						padding-bottom: 1rem;
					}
					
					.map-container {
						margin-bottom: 1rem;
						padding: 0.75rem;
					}
				}
			`}</style>
		</div>
	);
}

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'countries'])),
		},
	};
}
